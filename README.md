# Marquis

Source code in https://github.com/jeanffy/marquis

This tool is a web site generator (can be considered similar to [Gatsby](https://www.gatsbyjs.com) for example - but Gatsby is more powerful obviously!).

I just wanted something tailored for my needs so I know that it can't be suited for everyone (and it is not planned to do so) - and I didn't want to use [Webpack](https://webpack.js.org) (but Webpack is awesome and used internally!)

> Warning: this project is in an early stage, so it can break or change without any notice

## Quick steps

- `npm install -D marquis`
- create a `marquis.config.js` at your project's root
- `npx marquis build` to generate web site distribution
- `npx marquis serve` to run a Docker container to display the web site ([Docker](https://www.docker.com/products/docker-desktop) needs to be installed)

## Config file structure

> Warning: this config file structure can change without any notice

```js
const marquis = {
  // see src/config.ts file for object interface
  // and demo/marquis.config.js for an example of use
};

module.exports = marquis;
```
