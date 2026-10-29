import json, subprocess, html, pathlib, sys, datetime
S = pathlib.Path(sys.argv[1]); OUT = S / "out"; OUT.mkdir(exist_ok=True)
ROOT = pathlib.Path("/Users/ndaly/docpr213stack")
CFG = json.loads(pathlib.Path(sys.argv[2]).read_text())
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
REPO = "tenstorrent/tenstorrent.github.io"
PRS = {int(k): v for k, v in CFG.items()}
PRINT_CSS = """<style id="pr-print">
@page { size: Letter; margin: 14mm 13mm; }
.wy-nav-side, .wy-nav-top, .tt-top-nav, .tt-search-modal, .tt-search-backdrop, .tt-search-panel,
.rst-footer-buttons, [id^=ttfb], .ttfb-card, .site-footer, .copybtn, .wy-breadcrumbs-aside, .headerlink,
.rst-versions, .tt-ai-intro { display: none !important; }
html, body { background: #fff !important; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
.hero-search, .hero .tt-search-box { display: none !important; }
.hero { background: #092221 !important; padding: 24pt !important; }
.hero-title, .hero-subtitle { color: #fff !important; }
.wy-grid-for-nav { position: static !important; }
.wy-nav-content-wrap { margin-left: 0 !important; background: #fff !important; }
.wy-nav-content { max-width: none !important; padding: 0 !important; margin: 0 !important; }
.wy-nav-content-wrap .wy-nav-content, .rst-content { padding-top: 0 !important; }
.hero, .section, .cards-grid { max-width: none !important; }
pre, .highlight pre { white-space: pre-wrap !important; word-break: break-word !important; overflow: visible !important; }
img, svg { max-width: 100% !important; height: auto; }
h1, h2, h3, h4 { break-after: avoid; }
.admonition, table, figure, img, tr, li > p { break-inside: avoid; }
a { color: #0b4f8a; text-decoration: none; }
</style>
"""
def gh(args):
    return json.loads(subprocess.check_output(["gh"] + args, text=True))
def chrome_pdf(url, pdf):
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                    "--virtual-time-budget=10000", "--run-all-compositor-stages-before-draw",
                    f"--user-data-dir={S/'chrome-profile'}", f"--print-to-pdf={pdf}", url],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
def cover(num, meta, pages, rendered_sha):
    e = html.escape
    commits = "".join(
        f"<tr><td><code>{c['oid'][:8]}</code></td><td>{e(c['committedDate'][:10])}</td><td>{e(c['messageHeadline'])}</td></tr>"
        for c in meta["commits"])
    files = "".join(f"<tr><td><code>{e(f['path'])}</code></td><td>+{f['additions']}</td><td>-{f['deletions']}</td></tr>" for f in meta["files"])
    contents = "".join(f"<li><code>{e(p)}</code></li>" for p in pages)
    return f"""<!doctype html><html><head><meta charset="utf-8"><title>PR {num}</title><style>
@page {{ size: Letter; margin: 18mm 16mm; }}
body {{ font: 11pt/1.45 -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; color:#1a1a1a; }}
h1 {{ font-size: 20pt; margin: 0 0 4pt; }} h2 {{ font-size: 13pt; margin: 18pt 0 6pt; border-bottom: 1px solid #ccc; }}
.meta {{ color:#555; margin: 0 0 12pt; }} code {{ font: 9.5pt Menlo, monospace; }}
table {{ border-collapse: collapse; width: 100%; }} td {{ padding: 3pt 6pt; border-bottom: 1px solid #e5e5e5; vertical-align: top; }}
td:first-child {{ white-space: nowrap; }} p.note {{ color:#555; font-size: 10pt; }}
</style></head><body>
<h1>PR #{num}: {e(meta['title'])}</h1>
<p class="meta">{e(meta['url'])}<br>Branch <code>{e(meta['headRefName'])}</code> → <code>{e(meta['baseRefName'])}</code> · author {e(meta['author']['login'])} · head <code>{e(meta['headRefOid'][:8])}</code></p>
<p class="note">Rendered review copy of the pages this PR changes, built with Sphinx from the PR head (commit <code>{rendered_sha}</code>; a stacked PR already contains its base branch), generated {datetime.date.today().isoformat()}. Pages render in the site theme with the navigation removed; code blocks wrap instead of scrolling.</p>
<h2>Commits ({len(meta['commits'])})</h2><table>{commits}</table>
<h2>Files changed ({len(meta['files'])})</h2><table>{files}</table>
<h2>Pages in this PDF</h2><ol>{contents}</ol>
</body></html>"""
from pypdf import PdfWriter, PdfReader
for num, cfg in PRS.items():
    meta = gh(["pr","view",str(num),"--repo",REPO,"--json","title,url,headRefName,baseRefName,headRefOid,author,commits,files"])
    build = pathlib.Path(cfg["build"])
    sha = subprocess.check_output(["git","-C",cfg["worktree"],"rev-parse","--short","HEAD"],text=True).strip()
    parts = []
    cov = OUT / f"pr{num}-cover.html"; cov.write_text(cover(num, meta, cfg["pages"], sha))
    cpdf = OUT / f"pr{num}-cover.pdf"; chrome_pdf(cov.as_uri(), cpdf); parts.append(cpdf)
    for i, page in enumerate(cfg["pages"]):
        src = build / page
        txt = src.read_text()
        assert "</head>" in txt
        printable = src.with_name(src.stem + ".print.html")
        printable.write_text(txt.replace("</head>", PRINT_CSS + "</head>", 1))
        pdf = OUT / f"pr{num}-{i}-{src.stem}.pdf"
        chrome_pdf(f"http://127.0.0.1:{cfg['port']}/{printable.relative_to(build).as_posix()}", pdf)
        printable.unlink(); parts.append(pdf)
    w = PdfWriter()
    for p in parts:
        r = PdfReader(p); n0 = len(w.pages)
        for pg in r.pages: w.add_page(pg)
        w.add_outline_item(p.stem.split("-",2)[-1] if p != parts[0] else f"PR #{num} overview", n0)
    w.add_metadata({"/Title": f"PR #{num}: {meta['title']}", "/Author": meta['author']['login']})
    final = OUT / f"pr{num}-{cfg['slug']}.pdf"
    with open(final, "wb") as f: w.write(f)
    print(final.name, len(w.pages), "pages;", [ (p.name, len(PdfReader(p).pages)) for p in parts ])
