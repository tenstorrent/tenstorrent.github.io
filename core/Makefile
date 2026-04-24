# Minimal makefile for Sphinx documentation
#

# Repo root (parent of this core/ directory) — for venv + shared theme watch
THIS_MAKEFILE := $(lastword $(MAKEFILE_LIST))
REPO_ROOT     := $(abspath $(dir $(THIS_MAKEFILE))..)
VENV_PY       := $(REPO_ROOT)/.venv/bin/python

# You can set these variables from the command line, and also
# from the environment for the first two.
SPHINXOPTS    ?=
SPHINXBUILD   ?= sphinx-build
SOURCEDIR     = .
BUILDDIR      = _build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

# Development (watch): build the documentation and watch for changes.
# Uses repo-root .venv so `sphinx-autobuild` does not need to be on PATH.
# Served on port 3000 — http://127.0.0.1:3000/
watch:
	@test -x "$(VENV_PY)" || (echo "Missing $(VENV_PY) — run: cd \"$(REPO_ROOT)\" && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt" >&2; exit 1)
	@"$(VENV_PY)" -m sphinx_autobuild "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O) --port 3000 --host 127.0.0.1 --watch "$(REPO_ROOT)/shared" --open-browser

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)