import os
import subprocess
import yaml
import glob
import shutil


def build_doc(project):
    print(f"Building {project}.")
    os.environ[f"current_version"] = "latest"
    command = ""
    command += f"cd {project} && make html\n"
    print("Full command to execute", command)
    subprocess.run(command, shell=True)


def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv " + src + "* " + dst, shell=True)


def copy_pdfs(project, output_dir):
    """Copy PDF files from source project directory to output directory."""
    print(f"Copying PDFs for {project}...")

    # Find all PDF files in the project directory
    pdf_files = glob.glob(f"{project}/**/*.pdf", recursive=True)

    if not pdf_files:
        print(f"No PDF files found in {project}")
        return

    for pdf_file in pdf_files:
        # Calculate relative path from project root
        rel_path = os.path.relpath(pdf_file, project)

        # Create destination path in output directory
        dst_file = os.path.join(output_dir, rel_path)
        dst_dir = os.path.dirname(dst_file)

        # Create destination directory if it doesn't exist
        os.makedirs(dst_dir, exist_ok=True)

        # Copy the PDF file
        try:
            shutil.copy2(pdf_file, dst_file)
            print(f"  Copied: {pdf_file} -> {dst_file}")
        except Exception as e:
            print(f"  Error copying {pdf_file}: {e}")

os.environ["homepage"] = "https://tenstorrent.github.io/"

with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)

    for project in docs.keys():
        build_doc(project)
        if project == "core":
            # This is a special case to populate the root folder and home page
            move_dir(f"{project}/_build/html/", f"output/")
            # Copy PDFs for core project to output root
            copy_pdfs(project, "output")
        else:
            move_dir(f"{project}/_build/html/", f"output/{project}/latest/")
            # Copy PDFs for other projects to their respective output directories
            copy_pdfs(project, f"output/{project}/latest")
        print(f"Built {project}.")
