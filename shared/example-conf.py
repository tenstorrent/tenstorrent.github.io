# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information
import os

project = 'Tenstorrent'
copyright = '2025, Tenstorrent'
author = 'Tenstorrent'

templates_path = ['shared/_templates']
exclude_patterns = []
extensions = ['myst_parser']
# Custom theme docs 
html_theme = "sphinx_rtd_theme" 
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static']
html_last_updated_fmt = "%b %d, %Y"

html_context = {
    "logo_link_url": os.environ.get("homepage")
}

def setup(app):
    app.add_css_file("tt_theme.css")
