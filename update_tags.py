import yaml
import sys

project = sys.argv[1]
version = sys.argv[2]

with open("versions.yml", "r") as yaml_file:
    versions = yaml.safe_load(yaml_file)

version_structure = {version}

if project in ["ttnn", "tt-metalium"]:
    version_no_v = version.replace("v", "")
    #
    # From version 0.54 forward, the wheel files were renamed to ttnn from metal_libs.
    #
    additional_cmd = \
        f"wget https://github.com/tenstorrent/tt-metal/releases/download/{version}/ttnn-{version_no_v}+wormhole.b0-cp38-cp38-linux_x86_64.whl\n"
    additional_cmd += \
        f"pip install --extra-index-url https://download.pytorch.org/whl/cpu ttnn-{version_no_v}+wormhole.b0-cp38-cp38-linux_x86_64.whl --force-reinstall"
    version_structure = {version: {"additional_cmd": additional_cmd}}

versions[project]["versions"].update(version_structure)

with open("versions.yml", "w") as yaml_file:
    yaml.dump(versions, yaml_file)

print(f"Added {project} {version} to versions.yml")
