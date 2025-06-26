# Tenstorrent Docsite

## Description

This repo is a central location for tenstorrent sphinx documentation


## Building the Documentation

To build the Sphinx documentation, follow these steps:

1. Install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

2. Generate the HTML documentation:

    ```bash
    python build_docs.py
    ```

    This will create the HTML documentation in the `output` directory.

3. To view the generated documentation locally, open `output/core/latest/index.html` in your browser.

### Local Dev

When making changes locally, you can run `make watch` in the directory of the project you are working on, rather than building the whole doc site. This will build the project's html and serve it on [port 3000](http://127.0.0.1:3000), watching for changes and rebuilding as needed.

> ⚠️
> Make sure to delete the `_build` directory between builds, as this can sometimes cause issues with updates not getting built.

## Repo Structure

The repo is structured with a folder for each documentation project. the `Core` folder contains the core documentation, and links to the other projects. All other projects link back to Core.

The repo also contains scripts for building documentation.
The `build_docs.py` script builds the documentation for core documentation folder.

The documentation for the other projects in Tenstorrent ecosystem are linked in `index.rst` (see TT-NN, TT-Metalium, or TT-Forge). These projects build their own documentation 
in their own repos through Github Pages. Github's organization account is then used to link these together under the same domain as follows:
Domain: docs.tenstorrent.com is pointing to the pages local to this repo
`docs.tenstorrent.com/{github repo name}` points project-specific documentation. For example: [docs.tenstorrent.com/tt-blacksmith ](https://docs.tenstorrent.com/tt-blacksmith/)
is build in repo [tt-blacksmith](https://github.com/tenstorrent/tt-blacksmith)

## Deployments

The docs site is hosted on github pages. When pushing new changes to main github actions will build the documentation with `build_docs.py` and deploy the `output` directory to github pages.

The URL location will be `docs.tenstorrent.com/`

## Style and Structure

The shared folder contains shared items such as css, html templates, and images. It also contains an example-conf.py file that can be used as a base when adding new projects to the repo. It is pre populated with the common extensions and css config for the doc site.

### TOCs and Index files

By default, Sphinx looks for an index file in the directory it is building to use when populating the TOC and sidebar. If an external project needs to have their index/TOC overridden we can add our own file and add the `root_doc` variable to the project's conf.py with the name of our override file. This lets us make structural changes to documentation without changing the upstream repo. However, in most cases the default should be enough.

### CSS and Templates

The shared tt_theme.css file is kept in `shared/_static` and imported in each project's conf.py

We also have versions.html in `shared/_templates` This is used for dosplaying the versions widget in versioned projects, and is imported in the project's conf.py

## Adding New Projects to the Repo

To add a new project to the repo:

1. Create a folder with the project name eg `pybuda`
2. Create a conf.py file in that folder (you can use the example-conf.py in shared as a starting point)
3. Add your project to the versions.yml file
4. You're all set to add markdown or rst files containing documentation to the project!

## Useful Links

Sphinx Documentation: https://www.sphinx-doc.org/en/master/
Sphinx Directives (Toc Tree especially useful for customizing the sidebar): https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html
Custom sphinx themes: https://www.sphinx-doc.org/en/master/development/theming.html
sphinx-rtd-theme configuration: https://sphinx-rtd-theme.readthedocs.io/en/stable/configuring.html
