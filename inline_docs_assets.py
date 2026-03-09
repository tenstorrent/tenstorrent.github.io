#!/usr/bin/env python3
"""
Inline all CSS and JavaScript into the built HTML files under output/
so the docs render correctly when opened directly from the filesystem (e.g. from a zip)
without needing a local web server.

Run after build_docs.py. Modifies output/ in place.
"""
import re
import os
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent / "output"


def resolve_path(html_file: Path, ref: str) -> Path:
    """Resolve a reference from an HTML file to an absolute path."""
    ref_clean = ref.split("?")[0].strip()
    if not ref_clean:
        return None
    html_dir = html_file.parent
    resolved = (html_dir / ref_clean).resolve()
    try:
        resolved.relative_to(OUTPUT_DIR.resolve())
    except ValueError:
        return None
    return resolved if resolved.exists() else None


def relative_path_from_html_to_css(html_file: Path, css_file: Path) -> str:
    """Path from HTML dir to CSS file dir, for rewriting url() in CSS. Use / for URLs."""
    try:
        rel = os.path.relpath(css_file.parent, html_file.parent)
    except ValueError:
        rel = "."
    rel = rel.replace("\\", "/")
    return rel + "/" if not rel.endswith("/") else rel


def rewrite_css_urls(css_content: str, prefix: str) -> str:
    """Rewrite url(...) in CSS so they resolve from the HTML file's directory."""
    def repl(m):
        raw = m.group(1).strip()
        # Strip optional quotes so we don't duplicate them in the path
        path = raw.strip('"').strip("'")
        if path.startswith("data:") or path.startswith("http") or path.startswith("//"):
            return m.group(0)
        # Normalize: remove leading ./, collapse duplicate slashes, /./ -> /
        if path.startswith("./"):
            path = path[2:]
        new_path = (prefix + path).replace("//", "/").replace("/./", "/")
        return f'url("{new_path}")'

    return re.sub(
        r"url\s*\(\s*([^)]+)\s*\)",
        repl,
        css_content,
        flags=re.IGNORECASE,
    )


def inline_css(html_content: str, html_file: Path) -> str:
    """Replace link rel=stylesheet with inline <style>."""
    def repl(m):
        full = m.group(0)
        href_m = re.search(r'href\s*=\s*["\']([^"\']+)["\']', full, re.I)
        if not href_m:
            return full
        ref = href_m.group(1).strip()
        if ref.startswith("http") or ref.startswith("//"):
            return full
        path = resolve_path(html_file, ref)
        if not path:
            return full
        try:
            css = path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return full
        prefix = relative_path_from_html_to_css(html_file, path)
        css = rewrite_css_urls(css, prefix)
        return f'<style type="text/css">\n{css}\n</style>'

    return re.sub(
        r'<link\s+[^>]*rel\s*=\s*["\']stylesheet["\'][^>]*href\s*=\s*["\'][^"\']+["\'][^>]*/?\s*>',
        repl,
        html_content,
        flags=re.IGNORECASE,
    )


def inline_scripts(html_content: str, html_file: Path) -> str:
    """Replace script src= with inline <script>."""
    def repl(m):
        full = m.group(0)
        src_m = re.search(r'src\s*=\s*["\']([^"\']+)["\']', full, re.I)
        if not src_m:
            return full
        ref = src_m.group(1).strip()
        if ref.startswith("http") or ref.startswith("//"):
            return full
        path = resolve_path(html_file, ref)
        if not path:
            return full
        try:
            js = path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            return full
        return f'<script>\n{js}\n</script>'

    return re.sub(
        r'<script\s+[^>]*src\s*=\s*["\'][^"\']+["\'][^>]*>\s*</script>',
        repl,
        html_content,
        flags=re.IGNORECASE | re.DOTALL,
    )


def process_file(html_file: Path) -> None:
    content = html_file.read_text(encoding="utf-8", errors="replace")
    content = inline_css(content, html_file)
    content = inline_scripts(content, html_file)
    html_file.write_text(content, encoding="utf-8")


def main():
    if not OUTPUT_DIR.is_dir():
        print(f"Output dir not found: {OUTPUT_DIR}")
        return
    count = 0
    for path in OUTPUT_DIR.rglob("*.html"):
        process_file(path)
        count += 1
    print(f"Inlined assets into {count} HTML files under {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
