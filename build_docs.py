# build all versions of the documentation

import os
import subprocess
import yaml

def build_doc(project, version):
    print(f"Building {project} {version}")
    os.environ[f"{project}_version"] = version
    subprocess.run(f"cd {project}/{version} && make html", shell=True)

def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv "+src+'* ' + dst, shell=True)

os.environ["pages_root"] = "https://tenstorrent.github.io/docs-test/"

with open("versions.yml", "r") as yaml_file:
    docs = yaml.safe_load(yaml_file)
    for project, versions in docs.items():
        for version in versions:
            print(f"Building {project} {type(versions)}")
            build_doc(project, version)
            move_dir(f"{project}/{version}/_build/html/", f"docs/{project}/{version}/")
