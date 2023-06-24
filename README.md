# Marquis

This tool is a web static site generator.

I just wanted something tailored for my needs so I know that it can't be suited for everyone (and it is not planned to do so) - and I didn't want to use [Webpack](https://webpack.js.org) (but Webpack is awesome!)

> Warning: this project is in an early stage, so it can break or change without any notice

## Quick steps

- `npm install -D marquis`
- create a `.marquis.yml` at your project's root
- `npx marquis build` to generate web site distribution
- `npx marquis serve` to run a Docker container to display the web site ([Docker](https://www.docker.com/products/docker-desktop) needs to be installed)

## Config file structure

> Warning: this config file structure can change without any notice

```yml
i18n:
  availableLanguages:
    - fr
    - en
  defaultLang: fr
pages:
  defaultPage: index
```
