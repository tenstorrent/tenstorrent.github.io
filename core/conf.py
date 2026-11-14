# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import os
from pathlib import Path

project = 'Home'
copyright = '2026, Tenstorrent Holdings Inc.'
author = 'Tenstorrent'
release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

templates_path = ['../shared/_templates']
exclude_patterns = []
extensions = ['myst_parser',
              'sphinx_substitution_extensions',
              'sphinx_copybutton',
              'sphinx_togglebutton',
              'sphinx_sitemap',
              'sphinx_reredirects',
              ]

# Preserve old URLs for pages that were merged into a combined product page.
redirects = {
    "systems/quietbox/quietbox-bh/setup": "index.html#receiving-unboxing-and-setup",
    "systems/quietbox/quietbox-bh/specifications": "index.html#specifications-and-requirements",
    "systems/quietbox/quietbox-wh/setup": "index.html#receiving-unboxing-and-setup",
    "systems/quietbox/quietbox-wh/specifications": "index.html#specifications-and-requirements",
    "systems/t3000/specifications": "index.html#specifications-requirements-and-setup",
    "systems/t3000/support": "index.html#support",
    "aibs/blackhole/installation": "index.html#hardware-installation",
    "aibs/blackhole/specifications": "index.html#specifications-and-requirements",
    "aibs/blackhole/support": "index.html#faq-and-troubleshooting",
    "aibs/wormhole/installation": "index.html#hardware-installation",
    "aibs/wormhole/specifications": "index.html#specificationsrequirements",
    # Deploy LLMs moved out of Get Started (now documented under /tt-cli/).
    "getting-started/vLLM-servers": "serve-models.html",
}

html_baseurl = "https://docs.tenstorrent.com/"
sitemap_filename = "sitemap_core.xml"
sitemap_locales = [None]
sitemap_url_scheme = "{link}"
# Public FRU procedures are reached by direct URL only.
sitemap_excludes = [
    "systems/quietbox/quietbox-bh-2/fru/*",
]

copybutton_selector = 'div.highlight-bash pre'

myst_enable_extensions = [
    'substitution',
    'colon_fence',
]

ver_kmd        = Path('../syseng/kmd.version').read_text().rstrip()
ver_fw         = Path('../syseng/firmware.version').read_text().rstrip()
ver_sys_tools  = Path('../syseng/sys_tools.version').read_text().rstrip()

myst_substitutions = {
    'ver_fw': ver_fw,
    'ver_kmd': ver_kmd,
    'ver_sys_tools': ver_sys_tools,
}

myst_heading_anchors = 3  # or 2, depending on how deep you want anchor links

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    "collapse_navigation": False,  # render every subtree so items with children show a caret
    "titles_only": True,          # drop in-page H2/H3 headings from the sidebar
    "navigation_depth": 2,        # Home -> section -> product; leaf pages reached via page body
}
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static', '_static/assets', '_static/js']
# Files copied verbatim to the build output root (no Sphinx processing).
# `_extra/` holds llms.txt and AGENTS.md so they serve at docs.tenstorrent.com/llms.txt
# and /AGENTS.md. See core/_extra/AGENTS.md "Maintenance" for how to regenerate them.
html_extra_path = ['_extra']
html_js_files = ['custom.js']  # posthog.js now loaded site-wide via shared/_templates/layout.html
html_last_updated_fmt = "%b %d, %Y"

_BASE = "https://docs.tenstorrent.com/"

html_context = {
    # Respect the `homepage` env var (Makefile sets "/" locally; build_docs.py
    # sets the public URL in CI). Single-version site — no version switcher.
    "logo_link_url": os.environ.get("homepage") or _BASE,
    # Base URL passed to the search modal for resolving relative hit URLs and
    # displaying clean path labels.
    "search_site_base_url": _BASE,
}

# Direct-link sections: built and public, omitted from nav, search, and indexing.
_UNLISTED_DOC_PREFIX = "systems/quietbox/quietbox-bh-2/fru"


def _mark_unlisted_docs(app, doctree):
    docname = app.env.docname
    if docname == _UNLISTED_DOC_PREFIX or docname.startswith(_UNLISTED_DOC_PREFIX + "/"):
        meta = app.env.metadata.setdefault(docname, {})
        meta["orphan"] = True
        meta["nosearch"] = True


def _noindex_unlisted_pages(app, pagename, templatename, context, doctree):
    if pagename == _UNLISTED_DOC_PREFIX or pagename.startswith(_UNLISTED_DOC_PREFIX + "/"):
        metatags = context.get("metatags") or ""
        if "noindex" not in metatags:
            context["metatags"] = metatags + '<meta name="robots" content="noindex, nofollow" />\n'


def setup(app):
    app.add_css_file("tt_theme.css")
    app.add_css_file("home.css")
    app.connect("doctree-read", _mark_unlisted_docs)
    app.connect("html-page-context", _noindex_unlisted_pages)