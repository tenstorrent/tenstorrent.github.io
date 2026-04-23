# Minimal makefile for Sphinx documentation
#

# You can set these variables from the command line, and also
# from the environment for the first two.
# Prefer the repo venv (../.venv) when it exists so `make html` / `make watch` work
# without a global `sphinx-build` on PATH. One-time setup from repo root:
#   make -C core venv
REPO_ROOT   := $(abspath $(CURDIR)/..)
VENV_PY     := $(REPO_ROOT)/.venv/bin/python3
PY          := $(if $(wildcard $(VENV_PY)),$(VENV_PY),python3)
SPHINXOPTS  ?=
SPHINXBUILD ?= $(PY) -m sphinx
SPHINXWATCH ?= $(PY) -m sphinx_autobuild
SOURCEDIR  = .
BUILDDIR    = _build

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

# Development (watch): build the documentation and watch for changes.
# Served on port 3000 (http://localhost:3000)
# -a is passed to Sphinx: disable incremental / stale cached builds (recommended for autobuild).
watch:
	@$(SPHINXWATCH) -a "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O) --port 3000 --host 127.0.0.1 --watch '../shared' --open-browser

# Create .venv at repo root and install requirements (run once, or when deps change).
venv:
	@test -d "$(REPO_ROOT)/.venv" || python3 -m venv "$(REPO_ROOT)/.venv"
	@"$(REPO_ROOT)/.venv/bin/pip" install -U pip
	@"$(REPO_ROOT)/.venv/bin/pip" install -r "$(REPO_ROOT)/requirements.txt"
	@echo "Done. From this directory: export homepage=index.html && make watch"

.PHONY: help Makefile venv watch

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)