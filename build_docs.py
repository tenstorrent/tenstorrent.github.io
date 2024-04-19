import subprocess

def build_docs():
    subprocess.run(["cd","core", "&&", "sphinx-build", "-b", "html", "docs", "docs/_build"])
    print("Docs built successfully")

build_docs()