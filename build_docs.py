import os
import subprocess
import yaml


def build_doc(project, version):
    print(f"Building {project} {version}")
    os.environ[f"current_version"] = version
    if version == "latest":
        subprocess.run(f"cd {project} && make html", shell=True)
        return
    
    subprocess.run(f"git checkout {project}_{version}", shell=True)

    version_no_v = version.replace("v", "")

    command = f"python3 -m venv .{version} && source .{version}/bin/activate\n"
    command += f"wget https://github.com/tenstorrent/tt-metal/releases/download/{version}/metal_libs-{version_no_v}+wormhole.b0-cp38-cp38-linux_x86_64.whl\n"
    command += f"pip install --extra-index-url https://download.pytorch.org/whl/cpu metal_libs-{version_no_v}+wormhole.b0-cp38-cp38-linux_x86_64.whl\n"
    command += f"cd {project} && make html"
    print("Full command to execute", command)
    subprocess.run(command, shell=True)

def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv " + src + "* " + dst, shell=True)

os.environ["homepage"] = "https://tenstorrent.github.io/"

with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)
    for project, versions in docs.items():
        for version in versions:
            build_doc(project, version)
            if project == "core" and version == "latest":
                # This is a special case to populate the root folder and home page
                move_dir(f"{project}/_build/html/", f"output/")
            else:    
                move_dir(f"{project}/_build/html/", f"output/{project}/{version}/")
            print(f"Built {project} {version}")
