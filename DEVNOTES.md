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
