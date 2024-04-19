# build all versions of the documentation

import os
import subprocess
import yaml

def build_doc(project, version):
    print(f"Building {project} {version}")
    os.environ[f"current_version"] = version
    if version == "latest":
        subprocess.run(f"cd {project} && make html", shell=True)
        return
    
    subprocess.run("git checkout " + version, shell=True)
    subprocess.run("git checkout main -- conf.py", shell=True)
    subprocess.run("git checkout main -- versions.yaml", shell=True)

    subprocess.run(f"cd {project} && make html", shell=True)

def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv "+src+'* ' + dst, shell=True)

os.environ["pages_root"] = "https://tenstorrent.github.io/docs-test/"

with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)
    for project, versions in docs.items():
        for version in versions:
            build_doc(project, version)
            move_dir(f"{project}/_build/html/", f"output/{project}/{version}/")
            print(f"Built {project} {version}")
    
    subprocess.run("git checkout main", shell=True)
