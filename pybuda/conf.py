import yaml
import os
# from ..conf import *

project = 'TT Buda'
copyright = '2025, Tenstorrent'
author = 'Tenstorrent'
root_doc = "toc"
templates_path = ['../shared/_templates']
exclude_patterns = []
extensions = ['myst_parser']

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_theme_options = {
    'display_version': True,
    'style_external_links': True,
    # Toc options
    'collapse_navigation': True,
    'sticky_navigation': True,
    'navigation_depth': 4,
    'includehidden': True,
    'titles_only': False
}

html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static']
html_last_updated_fmt = "%b %d, %Y"

with open("../versions.yml", "r") as yaml_file:
    versions = yaml.safe_load(yaml_file)["pybuda"]

html_context = {
    "versions": versions,
    "project_code": "pybuda",
    "current_version": os.environ.get("current_version"),
    "logo_link_url": os.environ.get("homepage")
}

version = os.environ.get("current_version")

def setup(app):
    app.add_css_file("tt_theme.css")
