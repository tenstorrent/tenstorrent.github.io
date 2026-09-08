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
# Same layout as `make html` (sphinx -M html writes HTML under $(BUILDDIR)/html/).
WEBROOT       = $(BUILDDIR)/html

HOST          ?= 127.0.0.1
PORT          ?= 3000
SERVE_PORT    ?= 8766
# Base URL the top-nav links are built from (conf.py reads the `homepage` env
# var). CI sets this to the public base URL; locally the core build is served
# at the server root, so default to "/". Without it the nav renders "None…"
# links that 404.
HOMEPAGE      ?= /

# Put it first so that "make" without argument is like "make help".
help:
	@$(SPHINXBUILD) -M help "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)

# Development (watch): sphinx-autobuild. Run from core/: cd core && make watch
watch:
	@test -x "$(VENV_PY)" || (echo "Missing $(VENV_PY) — run: cd \"$(REPO_ROOT)\" && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt" >&2; exit 1)
	@echo ""
	@echo "Preview: http://$(HOST):$(PORT)/forge/index.html"
	@echo ""
	@homepage="$(HOMEPAGE)" "$(VENV_PY)" -m sphinx_autobuild "$(SOURCEDIR)" "$(WEBROOT)" $(SPHINXOPTS) $(O) \
		--port $(PORT) --host $(HOST) \
		--watch "$(REPO_ROOT)/shared" \
		--watch "$(REPO_ROOT)/syseng"

# One-shot HTML build + stdlib HTTP server (no live reload).
serve:
	@test -x "$(VENV_PY)" || (echo "Missing $(VENV_PY) — run: cd \"$(REPO_ROOT)\" && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt" >&2; exit 1)
	@homepage="$(HOMEPAGE)" "$(VENV_PY)" -m sphinx -M html "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
	@echo ""
	@echo "Serving: http://$(HOST):$(SERVE_PORT)/forge/index.html"
	@echo ""
	@cd "$(WEBROOT)" && "$(VENV_PY)" -m http.server $(SERVE_PORT) --bind $(HOST)

.PHONY: help Makefile watch serve

# Catch-all target: route all unknown targets to Sphinx using the new
# `make mode` option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	@$(SPHINXBUILD) -M $@ "$(SOURCEDIR)" "$(BUILDDIR)" $(SPHINXOPTS) $(O)
