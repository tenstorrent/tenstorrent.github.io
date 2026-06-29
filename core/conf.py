# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import os
from pathlib import Path

project = 'Home'
copyright = '2025, Tenstorrent'
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

# Redirects for pages that were consolidated — preserves incoming links.
redirects = {
    "systems/quietbox/quietbox-bh/setup": "index.html#receiving-unboxing-and-setup",
    "systems/quietbox/quietbox-bh/specifications": "index.html#specifications-and-requirements",
    "systems/quietbox/quietbox-wh/setup": "index.html#receiving-unboxing-and-setup",
    "systems/quietbox/quietbox-wh/specifications": "index.html#specifications-and-requirements",
    "systems/t3000/specifications": "index.html#specifications-requirements-and-setup",
    "systems/t3000/support": "index.html#support",
    "aibs/blackhole/installation": "index.html#hardware-installation",
    "aibs/blackhole/specifications": "index.html#specifications-and-requirements",
    "aibs/blackhole/support": "index.html#troubleshooting-common-hardware-issues",
    "aibs/wormhole/installation": "index.html#hardware-installation",
    "aibs/wormhole/specifications": "index.html#specifications-requirements",
}

html_baseurl = "https://docs.tenstorrent.com/"
sitemap_filename = "sitemap_core.xml"
sitemap_locales = [None]
sitemap_url_scheme = "{link}"

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
    "collapse_navigation": False,
    "titles_only": True,
    "navigation_depth": 2,
}
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static', '_static/assets', '_static/js']
# Files copied verbatim to the build output root (no Sphinx processing).
# `_extra/` holds llms.txt and AGENTS.md so they serve at docs.tenstorrent.com/llms.txt
# and /AGENTS.md. See core/_extra/AGENTS.md "Maintenance" for how to regenerate them.
html_extra_path = ['_extra']
html_js_files = ['custom.js']  # posthog.js loaded site-wide via shared/_templates/layout.html extrahead
html_last_updated_fmt = "%b %d, %Y"

html_context = {
    "versions": None,
    "logo_link_url": os.environ.get("homepage") or "https://docs.tenstorrent.com/",
    "search_site_base_url": "https://docs.tenstorrent.com/",
}

def setup(app):
    app.add_css_file("tt_theme.css")
    app.add_css_file("home.css")