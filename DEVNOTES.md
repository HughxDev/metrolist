# Development Notes

## Metrolist React Buildout (Exploratory)

- Was hotlinking to `patterns.boston.gov/public.css` (see below). But Storybook can’t (AFAIK) bring in remote CSS files, so the components appeared unstyled.
  ```html
  <!--[if !IE]><!-->
  <link rel="stylesheet" type="text/css" href="https://patterns.boston.gov/css/public.css" />
  <!--<![endif]-->
  <!--[if lt IE 10]>
    <link media="all" rel="stylesheet" href="https://patterns.boston.gov/css/ie.css">
  <![endif]-->
  ```
- Attempted solution: bring in `CityOfBoston/patterns` as a Git submodule and compile it inside of React and Storybook.
- Unfortunately, Create React App (CRA) does not allow configuration of Webpack, which means we can’t easily add Stylus compilation.
- Workaround: render Stylus files using `create-react-app-stylus`, which generates a single master Stylus file into a CSS file that can be imported into React.
- Had Patterns submodule at `patterns/`. But CRA requires all imports to be under `src/`. So, moved `patterns/` to `src/patterns/`.
- Unfortunately this also brings in all the TypeScript files, which causes CRA to type-check these files which are ultimately irrelevant to this project. So had to add `typescript`, `@types/lodash`, `testcafe`, `@stencil/core`, `vega-lib`, `vega-lite`, `vega-tooltip`.
- So many compilation errors due to type-checking. So copy-and-pasted `tsconfig.json` from Patterns to Metrolist root directory to hopefully alleviate.
- Too many errors. Getting out of hand. Maybe there’s a way to convert Stylus into SCSS (Sass).
  - [stylus-converter](https://github.com/txs1992/stylus-converter)
    - Mostly works?
      ```shell
      Failed to convert patterns/stylesheets/grid/modern/_grid.styl
      Failed to convert patterns/stylesheets/shame/grid/_grid.styl
      ```
- Maybe we eject from CRA since the final project probably has already?
  - React imports example: `boston.gov-d8/docroot/modules/custom/bos_components/modules/bos_web_app/bos_web_app.libraries.yml`.
    - No signs of CRA.
  - Ejecting…
- The Drupal site only uses Babel, not Webpack. Would have to add for Drupal integration.
  - Looks like the relevant package.json: `boston.gov-d8/docroot/core/package.json`.
- Ejecting was also a disaster because it gives you an insane Webpack config. Manually uninstalling react-scripts and setting up Webpack/Babel: `yarn add @babel/core @babel/preset-env @babel/preset-react webpack webpack-cli webpack-dev-server babel-loader css-loader style-loader html-webpack-plugin`. (via [tutorial](https://dev.to/vish448/create-react-project-without-create-react-app-3goh))
- Create React App had its own way of resolving `%PUBLIC_URL%` in `public/index.html`. Adding to dotenv and calling from `htmlWebpackPlugin.options.PUBLIC_URL`.
- Trying to compile `patterns/stylesheets/public.styl` using stylus-loader hangs Webpack. The process runs out of memory!
  - Looks like the culprits are:
    - `@require 'base/**/**/base.styl'`, which has `@require('*.styl')`.
    - `@require 'grid/modern/base.styl';`, which has `@require('*.styl')`.
    - …basically, anything with excessive globbing?
      - Tried to switch from `**/**` (why double?) to just `**` but it didn’t help. This is too much work; abandoning.
- New approach: download [precompiled stylesheet](https://patterns.boston.gov/css/public.css) for existing components.
  - public.css has unresolved variables in it??
  - Relative file URLs get messed up if `public.css` is outside of the patterns directory structure.
    - Couldn’t find an obvious way to map URLs to outside the folder via Webpack.
    - Workaround: download `public.css` to same directory as `public.styl`. In `.gitmodules`, set `ignore = dirty`. Now the addition of `public.css` won’t affect commits.
- Replacing hard-coded image paths in `src/components/Layout/index.js` with React imports to include in Webpack build process. Otherwise, images are broken.
- SVGs referenced in `public.css` need a Webpack loader to resolve. Using `file-loader`.
- Aliasing `patterns/` to `@patterns/` in imports to avoid doing `../../..` since it sits outside of the `src` directory.
  - This is done in `webpack.config.js` but has to be mirrored in `.eslintrc.js` in order to silence ESLint errors.
- Icons are on S3 at `https://assets.boston.gov/icons/accessboston/` which is the single source of truth. So probably shouldn’t bring in to local Webpack pipeline.
  - SVG assets only, no PNGs.
    - Fallbacks necessary?
  - Setting up an icon syncing script: S3 → icons_manifest.json.
    - Can check if an icon is valid via PropTypes, but don’t want to pull in such a large JSON object (319 KB file w/o minifying) in production. Using Webpack will conditionally load the object into an `__ICONS_MANIFEST__` global.
      - This proved very difficult! For some reason, `process.env.NODE_ENV` is not set at the time that `webpack.config.js` is read. Have to do ALL of the following:
        - Call `webpack-dev-server --open --env`. `--env` allows you to export an environment variable to your `webpack.config.js` using a function expression: `module.exports = ( env ) => {}`. If your `module.exports` is just a JSON structure, it can’t be fully dynamic. Normally you would do `--env.FOO_BAR=baz` but hanging conditions on an argument defeats the point of using a `.env` file.
        - `require( 'dotenv' ).config();`. This SHOULD pull in everything from `.env`, but for some reason some key(s) were missing.
        - `const Dotenv = require( 'dotenv-webpack' );` + `plugins: [ new Dotenv(), ]`. This filled in the gaps in the `.env` import.
        - After toggling a bunch/researching:
          - `process.env.NODE_ENV` would be replaced globally regardless of whether dotenv or dotenv-webpack were loaded. That’s because Webpack is setting it independently, which can be turned off via `optimization.nodeEnv = false`.
          - Loading `require( 'dotenv' ).config()` sets `process.env.*` in the Webpack config context *only*. Not passed onto React!
          - Loading `const Dotenv = require( 'dotenv-webpack' );` + `plugins: [ new Dotenv(), ]` sets `process.env.*` in the React context *only*! Not available in Webpack config!
          - Thus, using both allows `process.env.*` (as defined in .env) to be global!
          - We actually don’t need `--env` passed to `webpack-dev-server` as that simply sets a variable called `env` to `true`. And thus, we don’t need `module.exports` to be a function. …what a journey.
    