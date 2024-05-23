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

## Repo Structure

The repo is structured with a folder for each documentation project. the `Core` folder contains the core documentation, and links to the other projects. All other projects link back to Core.

The repo also contains scripts for building and versioning documentation.
The `build_docs.py` script builds the documentation of all project folders for all versions specified in `versions.yml`
The `update_tags.py` script updates the tracked version tags for each project.

## Versioning Documentation

Documentation versions are tracked with git tags and the `versions.yml` file. When a new documentation version is commited, the commit should be tagged with the version and the version should be added to `versions.yml`. This file is used by `build_docs.py` to determine which versions to build.

Using pybuda as an example, releasing a new version of the documentation might look something like this:

1. Build documentation in the pybuda repo
2. Copy the built documentation to the `pybuda` folder in this repo
3. Run `update_tags.py` to add the new version to versions.yml: `python update_tags.py pybuda <version_number>`
4. Commit and tag the changes: `git commit -m 'update pybuda docs to version <version_number>' && git tag <version_number>`
5. Push the changes and tags `git push && git push --tags`

These steps can be run in CI to automate the process of releasing documentation

## Deployments

The docs site is hosted on github pages. When pushing new changes to main github actions will build the documentation with `build_docs.py` and deploy the `output` directory to github pages.

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
3. Add your project to the versions.yml file with `latest` as the existing tag
4. You're all set to add markdown or rst files containing documentation to the project!
5. For versioning and updating the docs, see Versioning Documentation above
