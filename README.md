# Marquis

This tool is an opinionated web static site generator.

I just wanted something tailored for my needs so I know that it can't be suited for everyone (and it is not planned to do so).

> Warning: this project can break or change without any notice.

# Prerequisites

- PHP : smarty installed with composer
- tsconfig.json

# Quick steps

- `npm install -D marquis`
- create `.env` file at your project's root with the following content:
  - `DOCKER_APP_NAME`
  - `DOCKER_PHP_IMAGE_TAG` (for example "8.2-apache")
  - `DOCKER_PORT_FRONT`: the exposed port for the frontend part
  - `DOCKER_PORT_API`: the exposed port for the API part
  - `DOCKER_PORT_SMTP`: the exposed port for the SMTP server
  - `DOCKER_DIST`
- run `npx marquis build` to generate web site distribution (add `--prod` for a production build)
- run `npx marquis serve up` to run a Docker container to display the web site (Docker needs to be installed)
- run `npx marquis serve down` to stop previously created container (and remove it)

Once the Docker container is running, only the build step is needed to refresh web site, so a typical workflow would be:

- `npx marquis serve up`
- repeat
  - do some coding
  - `npx marquis build`
  - refresh browser window
- `npx marquis serve down`

# src

## assets

all the assets that is to be required/imported from other files

folders can be (all folders are optional):

- `js`: the Javascript scripts that can be used by any view
- `ts`: the TypeScript scripts that can be imported by any view/template (this folder is not included in build)
- `php`: the PHP scripts that can be required be any view (folder copied as-is in build)
- `images`: image files that can be imported by any view (files copied as-is)
- `styles`: SCSS files that can be imported by any view
  - `.scss` files here that are not imported will not be included in build (files must be @import'ed in other .scss files)
  - `.css` files here are copied as-is in the build
  - `.woff`, `.ttf` files here are copied as-is in the build

> in `js` and `styles` folders, sub-folders are not handled

`.css` styles can be reference with absolute URL, for example `<link href="/assets/styles/mystyle.css" rel="stylesheet" type="text/css"/>`

to handle deployment in domain subfolder, the placeholder `APP_BASE_URL` mut be used, so the previous example becomes `<link href="APP_BASE_URL/assets/styles/mystyle.css" rel="stylesheet" type="text/css"/>`

## i18n

one `.yaml` file per supported language, for example to support french and english: `fr.yaml` and `en.yaml`

## layouts

Smarty templates that can be extended/included by any view (folder similar to views in build)

## views

one folder for each view (a view is a page with a particular URL)

two views are mandatory:

- `_404` when a page is not found
- `_index` when no page is provided

a view folder contains:

- `<view>.view.php`: the PHP script that renders the view
- `<view>.view.tpl`: the Smarty template to render
- `<view>.view.scss` (optional): the syles to apply to the view
- `<view>.view.ts` (optional): the Javascript script to inject into the view

authorized view name characters `[a-z-]+`

a view can have sub-folders to split big views into components (only one level deep). in this case, it is the view's responsability to import/require components. however, scss and mts are not handled for now for sub-views, they must be handled into the view scss or mts

any number of `.scss` file can be added in to a view folder, they will be bundled if imported by the `<view>.scss` file

when referencing a view css or js use the `APP_BASE_URL` placeholder (same as assets)

only the `<view>.view.ts` is begin compiled to .js. the file is bundled (all imported files are statically included in the resulting `<view>.view.js`) file. thus, it is better to not import other .ts files from other views or from templates dir. the special `assets/ts` can include some .ts that can be imported in the bundle, but be aware that the code will then be duplicated in each view or each template that uses the .ts.

## index.php
