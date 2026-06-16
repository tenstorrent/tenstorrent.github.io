import json
import os
import subprocess
import yaml
import glob
import shutil


def build_doc(project, version="latest"):
    print(f"Building {project} @ {version}.")
    os.environ["current_version"] = version
    command = f"cd {project} && make html\n"
    print("Full command to execute", command)
    subprocess.run(command, shell=True)


def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv " + src + "* " + dst, shell=True)


SITEMAP_BASE = "https://firdovsimammedovk.github.io/tenstorrent-sandbox"
BASE_URL = "https://firdovsimammedovk.github.io/tenstorrent-sandbox"


def write_sitemap_index(output_dir, projects):
    """Write a sitemap index at output/sitemap.xml linking all project sitemaps."""
    sitemaps = []
    for project in projects:
        if project == "core":
            path = os.path.join(output_dir, "latest", "sitemap.xml")
            loc = f"{SITEMAP_BASE}/latest/sitemap.xml"
        else:
            path = os.path.join(output_dir, project, "latest", "sitemap.xml")
            loc = f"{SITEMAP_BASE}/{project}/latest/sitemap.xml"
        if os.path.isfile(path):
            sitemaps.append(loc)
    if not sitemaps:
        return
    index_path = os.path.join(output_dir, "sitemap.xml")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for loc in sitemaps:
            f.write(f"  <sitemap>\n    <loc>{loc}</loc>\n  </sitemap>\n")
        f.write("</sitemapindex>\n")
    print(f"Wrote sitemap index to {index_path} with {len(sitemaps)} sitemap(s).")


def copy_pdfs(project, output_dir):
    """Copy PDF files from source project directory to output directory."""
    print(f"Copying PDFs for {project}...")
    pdf_files = glob.glob(f"{project}/**/*.pdf", recursive=True)
    if not pdf_files:
        print(f"No PDF files found in {project}")
        return
    for pdf_file in pdf_files:
        rel_path = os.path.relpath(pdf_file, project)
        dst_file = os.path.join(output_dir, rel_path)
        dst_dir = os.path.dirname(dst_file)
        os.makedirs(dst_dir, exist_ok=True)
        try:
            shutil.copy2(pdf_file, dst_file)
            print(f"  Copied: {pdf_file} -> {dst_file}")
        except Exception as e:
            print(f"  Error copying {pdf_file}: {e}")


def generate_versions_json(docs, output_dir):
    """Generate versions.json consumed by the JS version switcher."""
    result = {}
    for project, config in docs.items():
        if isinstance(config, dict) and "versions" in config:
            ver_list = list(config["versions"].keys())
        else:
            ver_list = ["latest"]

        if project == "core":
            versions_with_urls = [
                {"name": v, "url": f"{BASE_URL}/{v}/"}
                for v in ver_list
            ]
        else:
            versions_with_urls = [
                {"name": v, "url": f"{BASE_URL}/{project}/{v}/"}
                for v in ver_list
            ]
        result[project] = versions_with_urls

    json_path = os.path.join(output_dir, "versions.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)
    print(f"Wrote {json_path}")


os.environ["homepage"] = "https://firdovsimammedovk.github.io/tenstorrent-sandbox/latest/"

with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)

    for project, config in docs.items():
        if isinstance(config, dict) and "versions" in config:
            ver_list = list(config["versions"].keys())
        else:
            ver_list = ["latest"]

        for version in ver_list:
            build_doc(project, version)
            if project == "core":
                move_dir(f"{project}/_build/html/", f"output/{version}/")
            else:
                move_dir(f"{project}/_build/html/", f"output/{project}/{version}/")

        if project == "core":
            copy_pdfs(project, "output/latest")
        else:
            copy_pdfs(project, f"output/{project}/latest")
        print(f"Built {project}.")

    # Root index.html redirects to latest/
    with open("output/index.html", "w", encoding="utf-8") as _f:
        _f.write(
            '<!DOCTYPE html><html><head>'
            '<meta http-equiv="refresh" content="0; url=latest/" />'
            '</head><body><a href="latest/">latest</a></body></html>\n'
        )

    generate_versions_json(docs, "output")
    write_sitemap_index("output", list(docs.keys()))
