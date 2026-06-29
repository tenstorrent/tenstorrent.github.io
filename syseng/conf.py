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

html_baseurl = "https://docs.tenstorrent.com/syseng/latest/"
sitemap_locales = [None]
sitemap_url_scheme = "{link}"

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    'display_version': True,
    'style_external_links': True,
    'collapse_navigation': False,
    'sticky_navigation': True,
    'navigation_depth': 2,
    'includehidden': True,
    'titles_only': True,
}

html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static']

with open("../versions.yml", "r") as yaml_file:
    versions = yaml.safe_load(yaml_file)["syseng"]

html_context = {
    "versions": versions,
    "project_code": "syseng",
    "current_version": os.environ.get("current_version"),
    "logo_link_url": os.environ.get("homepage") or "https://docs.tenstorrent.com/",
    "search_site_base_url": "https://docs.tenstorrent.com/",
}

version = os.environ.get("current_version")

def setup(app):
    app.add_css_file("tt_theme.css")
