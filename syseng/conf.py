import yaml
import os
# from ..conf import *

project = 'Software and Utilities'
copyright = '2025, Tenstorrent'
author = 'Tenstorrent'
root_doc = "index"
templates_path = ['../shared/_templates']
exclude_patterns = []
extensions = ['myst_parser', 'sphinx_sitemap']

html_baseurl = "https://firdovsimammedovk.github.io/tenstorrent-sandbox/syseng/"
sitemap_locales = [None]
sitemap_url_scheme = "{link}"

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    'display_version': True,
    'style_external_links': True,
    # Toc options
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 4,
    'includehidden': True,
    'titles_only': False
}

html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static']

_BASE_SYSENG = "https://firdovsimammedovk.github.io/tenstorrent-sandbox/syseng/"

# Single-version site: published at a flat path, no version switcher.
html_context = {
    "project_code": "syseng",
    "logo_link_url": os.environ.get("homepage")
}

def setup(app):
    app.add_css_file("tt_theme.css")
