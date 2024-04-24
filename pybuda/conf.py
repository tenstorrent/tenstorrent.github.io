# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

# import collections

# MetalSphinxConfig = collections.namedtuple("MetalSphinxConfig", ["fullname", "shortname"])

project = 'TT Buda'
copyright = '2024, Tenstorrent'
author = 'Tenstorrent'
release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

root_doc = "toc"

# config_lookup = {
#     "tt-metalium": MetalSphinxConfig(fullname="TT-Metalium", shortname="tt-metalium"),
#     "ttnn": MetalSphinxConfig(fullname="TT-NN", shortname="ttnn"),
# }

templates_path = ['_templates']
exclude_patterns = []
extensions = ['myst_parser']


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_logo = "images/tt_logo.svg"
html_favicon = "images/cropped-favicon-32x32.png"
html_static_path = ['_static']

def setup(app):
    app.add_css_file("tt_theme.css")

