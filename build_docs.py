import os
import subprocess
import yaml
import glob
import shutil


def build_doc(project):
    print(f"Building {project}.")
    # Kept for templates/conf that still read it; the site is single-version now.
    os.environ["current_version"] = "latest"
    command = f"cd {project} && make html\n"
    print("Full command to execute", command)
    subprocess.run(command, shell=True)


def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv " + src + "* " + dst, shell=True)


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


os.environ["homepage"] = "https://docs.tenstorrent.com/"

# Single-version site: versions.yml is just the list of projects to build. Each
# project is built once and published at a flat path — `core` at the site root,
# every other project under output/<project>/ (no /latest/, no version dirs).
with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)

    for project in docs.keys():
        build_doc(project)
        if project == "core":
            move_dir(f"{project}/_build/html/", "output/")
            copy_pdfs(project, "output")
        else:
            move_dir(f"{project}/_build/html/", f"output/{project}/")
            copy_pdfs(project, f"output/{project}")
        print(f"Built {project}.")

    # Publish the master theme assets at a stable, version-independent CDN path
    # (output/_static/) so other repos can reference
    # https://.../tenstorrent-sandbox/_static/tt_theme.css.
    shutil.copytree("shared/_static", "output/_static", dirs_exist_ok=True)
    print("Copied shared/_static to output/_static (global CDN assets).")
