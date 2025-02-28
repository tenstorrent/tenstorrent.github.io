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
              'sphinx_substitution_extensions',]

myst_enable_extensions = [
    'substitution'
]

ver_kmd        = Path('../syseng/kmd.version').read_text().rstrip()
ver_fw         = Path('../syseng/firmware.version').read_text().rstrip()
ver_sys_tools  = Path('../syseng/sys_tools.version').read_text().rstrip()

myst_substitutions = {
    'ver_fw': ver_fw,
    'ver_kmd': ver_kmd,
    'ver_sys_tools': ver_sys_tools,
}


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_logo = "../shared/images/tt_logo.svg"
html_favicon = "../shared/images/favicon.png"
html_static_path = ['../shared/_static', '_static/assets']
html_last_updated_fmt = "%b %d, %Y"

html_context = {
    "versions": None, # Do not render versions
    "logo_link_url": os.environ.get("homepage")
}

def setup(app):
    app.add_css_file("tt_theme.css")
    app.add_css_file("home.css")