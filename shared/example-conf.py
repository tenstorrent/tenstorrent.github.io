# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Tenstorrent'
copyright = '2024, Tenstorrent'
author = 'Tenstorrent'

templates_path = ['shared/_templates']
exclude_patterns = []
extensions = ['myst_parser']

html_theme = "sphinx_rtd_theme"
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/cropped-favicon-32x32.png"
html_static_path = ['../shared/_static']

def setup(app):
    app.add_css_file("tt_theme.css")
