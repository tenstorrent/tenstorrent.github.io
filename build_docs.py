import os
import subprocess
import yaml


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

os.environ["homepage"] = "https://tenstorrent.github.io/"

with open("versions.yml", "r") as yaml_file:
    subprocess.run("rm -rf output", shell=True)
    docs = yaml.safe_load(yaml_file)

    for project in docs.keys():
        build_doc(project)
        if project == "core":
            # This is a special case to populate the root folder and home page
            move_dir(f"{project}/_build/html/", f"output/")
        else:    
            move_dir(f"{project}/_build/html/", f"output/{project}/latest/")
        print(f"Built {project}.")
