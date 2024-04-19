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
