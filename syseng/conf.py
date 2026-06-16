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

html_baseurl = "https://firdovsimammedovk.github.io/tenstorrent-sandbox/syseng/latest/"
sitemap_locales = [None]
sitemap_url_scheme = "{link}"

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

with open("../versions.yml", "r") as yaml_file:
    _syseng_data = yaml.safe_load(yaml_file)["syseng"]

_BASE_SYSENG = "https://firdovsimammedovk.github.io/tenstorrent-sandbox/syseng/"
_current_version = os.environ.get("current_version", "latest")

if isinstance(_syseng_data, dict) and "versions" in _syseng_data:
    _syseng_versions = list(_syseng_data["versions"].keys())
elif isinstance(_syseng_data, list):
    _syseng_versions = _syseng_data
else:
    _syseng_versions = ["latest"]

html_context = {
    "versions": [(v, f"{_BASE_SYSENG}{v}/") for v in _syseng_versions],
    "project_code": "syseng",
    "current_version": _current_version,
    "logo_link_url": os.environ.get("homepage")
}

version = _current_version

def setup(app):
    app.add_css_file("tt_theme.css")
