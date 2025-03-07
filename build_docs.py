import os
import subprocess
import yaml


def build_doc(project, version, additional_cmd):
    print(f"Building {project} {version} with {additional_cmd}")
    os.environ[f"current_version"] = version
    if version != "latest":
        subprocess.run(f"git checkout {project}_{version} -- {project} ", shell=True)
        subprocess.run("git checkout main -- */conf.py", shell=True)

    command = f"python3 -m venv .env_{version}_{project} && . .env_{version}_{project}/bin/activate\n"
    command = ""
    if additional_cmd:
        command += additional_cmd + "\n"

    command += f"cd {project} && make html\n"
    command += "deactivate\n"
    print("Full command to execute", command)
    subprocess.run(command, shell=True)


def move_dir(src, dst):
    subprocess.run(["mkdir", "-p", dst])
    subprocess.run("mv " + src + "* " + dst, shell=True)

os.environ["homepage"] = "https://tenstorrent.github.io/"

with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)

    for project in docs.keys():
        for version_desc in docs[project]["versions"].items():
            version = version_desc[0]
            additional_cmd = ""
            if version_desc[1] and "additional_cmd" in version_desc[1]:
                additional_cmd = version_desc[1]["additional_cmd"]
            build_doc(project, version, additional_cmd)
            if project == "core" and version == "latest":
                # This is a special case to populate the root folder and home page
                move_dir(f"{project}/_build/html/", f"output/")
            else:    
                move_dir(f"{project}/_build/html/", f"output/{project}/{version}/")
            print(f"Built {project} {version}")
