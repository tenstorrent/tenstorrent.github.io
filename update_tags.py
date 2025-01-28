import yaml
import sys

project = sys.argv[1]
version = sys.argv[2]

with open("versions.yml", "r") as yaml_file:
    versions = yaml.safe_load(yaml_file)

version_structure = {version}
versions[project]["versions"].update(version_structure)

with open("versions.yml", "w") as yaml_file:
    yaml.dump(versions, yaml_file)

print(f"Added {project} {version} to versions.yml")
