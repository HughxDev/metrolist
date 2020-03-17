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
    - Hot reloading breaks; possible that `__ICONS_MANIFEST__` is too large.
      - Maybe we skip the local sync and just do a `fetch` with caching if on dev.
        - Hybrid approach: Still use the sync script, but par down redundant keys and minify. Use a dynamic `import()` for the generated JSON in the [class-ified] React component that calls setState on Promise resolution and re-renders the icon component which now has a `src`.
          - There is a visible lag as the images are lazy-loaded. Does this matter? For production, perhaps static analysis could slot in the appropriate URLs? Might be getting too complex though…

## Fix Storybook

- Since getting out of Create React App, Storybook broke.
- Disabled CRA plugin.
- Storybook can’t parse special paths such as the aliased `@patterns/`.
- Storybook has its own Webpack config (`./.storybook/webpack.config.js`) and doesn’t read from the root config (`./webpack.config.js`) by default.
- Attempting to extend the exist Webpack also failed.
  - Actually it was just irrelevant config keys screwing it up. Imported the root config and then deleted everything except "resolve" and "module".
  - Still getting this but it’s non-blocking:
  ```
  DeprecationWarning: Extend-mode configuration is deprecated, please use full-control mode instead.
  ```

## Outline Drupal vs React portions

From Jim:
> Subscription,
> Feedback,
> Metrolist home (add custom header work),
> Affordable Housing page,
> Income Restricted guide page,
> and the lower components on the React pages.

## Find and copy existing Drupal components

- For some reason my boston.gov-d8 repo did not have Drupal fully installed. Did `lando drupal-sync-db` and got:
  ```
  $ lando drupal-sync-db
  /app/scripts/local/sync.sh: line 9: printout: command not found
  You will destroy data in drupal and replace with data from bostond8dev.ssh.prod.acquia-sites.com/bostond8dev.

  // Do you really want to continue?: yes.

  [notice] Starting to dump database on source.
  [notice] Starting to discover temporary files directory on target.
  [notice] Copying dump file from source to target.
  [notice] Starting to import dump file onto target database.
  /app/hooks/common/cob_utilities.sh: line 99: @self: command not found
  [action] Update database (drupal) on local with configuration from updated code in current branch.
  /app/hooks/common/cob_utilities.sh: line 104: @self: command not found
  /app/hooks/common/cob_utilities.sh: line 109: @self: command not found
  /app/hooks/common/cob_utilities.sh: line 134: @self: command not found
  [action] Enable DEVELOPMENT-ONLY modules.
  /app/hooks/common/cob_utilities.sh: line 319: cdel: command not found
  /app/hooks/common/cob_utilities.sh: line 320: cdel: command not found
  /app/hooks/common/cob_utilities.sh: line 321: en: command not found
  [action] Enable and set stage_file_proxy.
  /app/hooks/common/cob_utilities.sh: line 327: en: command not found
  [action] Disable Acquia connector and purge.
  /app/hooks/common/cob_utilities.sh: line 361: pmu: command not found
  [action] Disable prod-only and unwanted modules.
  /app/hooks/common/cob_utilities.sh: line 366: pmu: command not found
  /app/hooks/common/cob_utilities.sh: line 374: pmu: command not found
  [notice] simplesamlphp_auth module is disabled for local builds.
            If you need to configure this module you will first need to enable it and then
            run 'lando drush cim' to import its configurations.
  /app/hooks/common/cob_utilities.sh: line 270: cset: command not found
  /app/hooks/common/cob_utilities.sh: line 271: cset: command not found
  /app/hooks/common/cob_utilities.sh: line 272: cset: command not found
  [success] Changed password for admin.
  INFOSUCCESS
  ```
  Running `lando start` booted up to an unusable state:
  ```
  The website encountered an unexpected error. Please try again later.

  Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException: The "menu" entity type did not specify a storage handler. in Drupal\Core\Entity\EntityTypeManager->getHandler() (line 272 of core/lib/Drupal/Core/Entity/EntityTypeManager.php).
  Drupal\Core\Entity\EntityTypeManager->getStorage('menu') (Line: 541)
  Drupal\Core\Entity\EntityBase::loadMultiple() (Line: 443)
  menu_ui_get_menus() (Line: 341)
  bos_theme_preprocess_page(Array, 'page', Array) (Line: 287)
  Drupal\Core\Theme\ThemeManager->render('page', Array) (Line: 431)
  Drupal\Core\Render\Renderer->doRender(Array, ) (Line: 200)
  Drupal\Core\Render\Renderer->render(Array) (Line: 501)
  Drupal\Core\Template\TwigExtension->escapeFilter(Object, Array, 'html', NULL, 1) (Line: 104)
  __TwigTemplate_1481512973d57358bf6a7e3ee1621dfaf106e5042378e7bb403d8a3fbe8de610->doDisplay(Array, Array) (Line: 455)
  Twig\Template->displayWithErrorHandling(Array, Array) (Line: 422)
  Twig\Template->display(Array) (Line: 434)
  Twig\Template->render(Array) (Line: 64)
  twig_render_template('themes/custom/bos_theme/templates/layout/html.html.twig', Array) (Line: 384)
  Drupal\Core\Theme\ThemeManager->render('html', Array) (Line: 431)
  Drupal\Core\Render\Renderer->doRender(Array, ) (Line: 200)
  Drupal\Core\Render\Renderer->render(Array) (Line: 147)
  Drupal\Core\Render\MainContent\HtmlRenderer->Drupal\Core\Render\MainContent\{closure}() (Line: 573)
  Drupal\Core\Render\Renderer->executeInRenderContext(Object, Object) (Line: 148)
  Drupal\Core\Render\MainContent\HtmlRenderer->renderResponse(Array, Object, Object) (Line: 90)
  Drupal\Core\EventSubscriber\MainContentViewSubscriber->onViewRenderArray(Object, 'kernel.view', Object)
  call_user_func(Array, Object, 'kernel.view', Object) (Line: 111)
  Drupal\Component\EventDispatcher\ContainerAwareEventDispatcher->dispatch('kernel.view', Object) (Line: 156)
  Symfony\Component\HttpKernel\HttpKernel->handleRaw(Object, 1) (Line: 68)
  Symfony\Component\HttpKernel\HttpKernel->handle(Object, 1, 1) (Line: 57)
  Drupal\Core\StackMiddleware\Session->handle(Object, 1, 1) (Line: 47)
  Drupal\Core\StackMiddleware\KernelPreHandle->handle(Object, 1, 1) (Line: 106)
  Drupal\page_cache\StackMiddleware\PageCache->pass(Object, 1, 1) (Line: 85)
  Drupal\page_cache\StackMiddleware\PageCache->handle(Object, 1, 1) (Line: 49)
  Asm89\Stack\Cors->handle(Object, 1, 1) (Line: 50)
  Drupal\ban\BanMiddleware->handle(Object, 1, 1) (Line: 47)
  Drupal\Core\StackMiddleware\ReverseProxyMiddleware->handle(Object, 1, 1) (Line: 52)
  Drupal\Core\StackMiddleware\NegotiationMiddleware->handle(Object, 1, 1) (Line: 23)
  Stack\StackedHttpKernel->handle(Object, 1, 1) (Line: 694)
  Drupal\Core\DrupalKernel->handle(Object) (Line: 19)
  ```
  Probably due to missing commands?.
  - [Completely starting over](https://docs.boston.gov/digital/guides/drupal-8/installation-instructions/lando-101#lando-workflows): `lando destroy`, `rm -rf`, `git clone`, `lando start`. This produced the following:
  ```
  Fatal error: Maximum execution time of 90 seconds exceeded in /app/vendor/symfony/yaml/Inline.php on line 631 Call Stack: 0.0032 412032 1. {main}() /app/docroot/index.php:0 0.0578 579720 2. Drupal\Core\DrupalKernel->handle() /app/docroot/index.php:19 0.1408 2298752 3. Stack\StackedHttpKernel->handle() /app/docroot/core/lib/Drupal/Core/DrupalKernel.php:694 0.1408 2298752 4. Drupal\Core\StackMiddleware\NegotiationMiddleware->handle() /app/vendor/stack/builder/src/Stack/StackedHttpKernel.php:23 0.1409 2299448 5. Drupal\Core\StackMiddleware\ReverseProxyMiddleware->handle() /app/docroot/core/lib/Drupal/Core/StackMiddleware/NegotiationMiddleware.php:52 0.1409 2299448 6. Drupal\ban\BanMiddleware->handle() /app/docroot/core/lib/Drupal/Core/StackMiddleware/ReverseProxyMiddleware.php:47 0.1420 2299448 7. Asm89\Stack\Cors->handle() /app/docroot/core/modules/ban/src/BanMiddleware.php:50 0.1421 2299448 8. Drupal\page_cache\StackMiddleware\PageCache->handle() /app/vendor/asm89/stack-cors/src/Asm89/Stack/Cors.php:49 0.1430 2302064 9. Drupal\page_cache\StackMiddleware\PageCache->lookup() /app/docroot/core/modules/page_cache/src/StackMiddleware/PageCache.php:82 0.1442 2302128 10. Drupal\page_cache\StackMiddleware\PageCache->fetch() /app/docroot/core/modules/page_cache/src/StackMiddleware/PageCache.php:128 0.1442 2302128 11. Drupal\Core\StackMiddleware\KernelPreHandle->handle() /app/docroot/core/modules/page_cache/src/StackMiddleware/PageCache.php:191 0.3518 2592808 12. Drupal\Core\StackMiddleware\Session->handle() /app/docroot/core/lib/Drupal/Core/StackMiddleware/KernelPreHandle.php:47 0.3567 2690728 13. Symfony\Component\HttpKernel\HttpKernel->handle() /app/docroot/core/lib/Drupal/Core/StackMiddleware/Session.php:57 0.3568 2691144 14. Symfony\Component\HttpKernel\HttpKernel->handleRaw() /app/vendor/symfony/http-kernel/HttpKernel.php:68 33.8159 57694824 15. Drupal\Component\EventDispatcher\ContainerAwareEventDispatcher->dispatch() /app/vendor/symfony/http-kernel/HttpKernel.php:156 33.8641 57774304 16. call_user_func:{/app/docroot/core/lib/Drupal/Component/EventDispatcher/ContainerAwareEventDispatcher.php:111}() /app/docroot/core/lib/Drupal/Component/EventDispatcher/ContainerAwareEventDispatcher.php:111 33.8642 57774304 17. Drupal\Core\EventSubscriber\MainContentViewSubscriber->onViewRenderArray() /app/docroot/core/lib/Drupal/Component/EventDispatcher/ContainerAwareEventDispatcher.php:111 33.8817 57831144 18. Drupal\Core\Render\MainContent\HtmlRenderer->renderResponse() /app/docroot/core/lib/Drupal/Core/EventSubscriber/MainContentViewSubscriber.php:90 33.8818 57831144 19. Drupal\Core\Render\MainContent\HtmlRenderer->prepare() /app/docroot/core/lib/Drupal/Core/Render/MainContent/HtmlRenderer.php:117 113.2583 95282376 20. Drupal\block\Plugin\DisplayVariant\BlockPageVariant->build() /app/docroot/core/lib/Drupal/Core/Render/MainContent/HtmlRenderer.php:259 113.2583 95283152 21. Drupal\block\BlockRepository->getVisibleBlocksPerRegion() /app/docroot/core/modules/block/src/Plugin/DisplayVariant/BlockPageVariant.php:137 113.3294 95302296 22. Drupal\block\Entity\Block->access() /app/docroot/core/modules/block/src/BlockRepository.php:56 113.3421 95305056 23. Drupal\block\BlockAccessControlHandler->access() /app/docroot/core/lib/Drupal/Core/Entity/EntityBase.php:370 113.3487 95307480 24. Drupal\block\BlockAccessControlHandler->checkAccess() /app/docroot/core/lib/Drupal/Core/Entity/EntityAccessControlHandler.php:105 113.3733 95316496 25. Drupal\block\Entity\Block->getPlugin() /app/docroot/core/modules/block/src/BlockAccessControlHandler.php:118 113.3733 95316496 26. Drupal\block\Entity\Block->getPluginCollection() /app/docroot/core/modules/block/src/Entity/Block.php:145 113.3771 95318536 27. Drupal\block\BlockPluginCollection->__construct() /app/docroot/core/modules/block/src/Entity/Block.php:156 113.3771 95318536 28. Drupal\block\BlockPluginCollection->__construct() /app/docroot/core/modules/block/src/BlockPluginCollection.php:34 113.3771 95318536 29. Drupal\block\BlockPluginCollection->addInstanceId() /app/docroot/core/lib/Drupal/Core/Plugin/DefaultSingleLazyPluginCollection.php:55 113.3771 95318912 30. Drupal\block\BlockPluginCollection->setConfiguration() /app/docroot/core/lib/Drupal/Core/Plugin/DefaultSingleLazyPluginCollection.php:99 113.3771 95318912 31. Drupal\block\BlockPluginCollection->get() /app/docroot/core/lib/Drupal/Core/Plugin/DefaultSingleLazyPluginCollection.php:83 113.3772 95318912 32. Drupal\block\BlockPluginCollection->get() /app/docroot/core/modules/block/src/BlockPluginCollection.php:45 113.3772 95318912 33. Drupal\block\BlockPluginCollection->initializePlugin() /app/docroot/core/lib/Drupal/Component/Plugin/LazyPluginCollection.php:80 113.3772 95318912 34. Drupal\block\BlockPluginCollection->initializePlugin() /app/docroot/core/modules/block/src/BlockPluginCollection.php:57 113.3772 95318912 35. Drupal\Core\Block\BlockManager->createInstance() /app/docroot/core/lib/Drupal/Core/Plugin/DefaultSingleLazyPluginCollection.php:62 113.3773 95318992 36. Drupal\Core\Plugin\Factory\ContainerFactory->createInstance() /app/docroot/core/lib/Drupal/Component/Plugin/PluginManagerBase.php:76 113.3773 95318992 37. Drupal\Core\Block\BlockManager->getDefinition() /app/docroot/core/lib/Drupal/Core/Plugin/Factory/ContainerFactory.php:16 113.3773 95318992 38. Drupal\Core\Block\BlockManager->getDefinitions() /app/docroot/core/lib/Drupal/Component/Plugin/Discovery/DiscoveryCachedTrait.php:22 113.3786 95318992 39. Drupal\Core\Block\BlockManager->findDefinitions() /app/docroot/core/lib/Drupal/Core/Plugin/DefaultPluginManager.php:175 116.2997 104449608 40. Drupal\Core\Block\BlockManager->processDefinition() /app/docroot/core/lib/Drupal/Core/Plugin/DefaultPluginManager.php:286 116.2998 104449984 41. Drupal\Core\Block\BlockManager->processDefinitionCategory() /app/docroot/core/lib/Drupal/Core/Block/BlockManager.php:67 116.2998 104449984 42. Drupal\Core\Block\BlockManager->getProviderName() /app/docroot/core/lib/Drupal/Core/Plugin/CategorizingPluginManagerTrait.php:34 116.2998 104449984 43. Drupal\Core\Extension\ModuleHandler->getName() /app/docroot/core/lib/Drupal/Core/Plugin/CategorizingPluginManagerTrait.php:52 116.2999 104449984 44. Drupal\Core\Extension\ModuleExtensionList->getName() /app/docroot/core/lib/Drupal/Core/Extension/ModuleHandler.php:751 116.2999 104449984 45. Drupal\Core\Extension\ModuleExtensionList->get() /app/docroot/core/lib/Drupal/Core/Extension/ExtensionList.php:243 116.2999 104449984 46. Drupal\Core\Extension\ModuleExtensionList->getList() /app/docroot/core/lib/Drupal/Core/Extension/ExtensionList.php:260 116.3013 104449984 47. Drupal\Core\Extension\ModuleExtensionList->doList() /app/docroot/core/lib/Drupal/Core/Extension/ExtensionList.php:282 116.3013 104449984 48. Drupal\Core\Extension\ModuleExtensionList->doList() /app/docroot/core/lib/Drupal/Core/Extension/ModuleExtensionList.php:148 148.0860 109469776 49. Drupal\Core\Extension\ModuleExtensionList->createExtensionInfo() /app/docroot/core/lib/Drupal/Core/Extension/ExtensionList.php:316 148.0860 109469776 50. Drupal\Core\Extension\InfoParser->parse() /app/docroot/core/lib/Drupal/Core/Extension/ExtensionList.php:554 148.0860 109469776 51. Drupal\Core\Extension\InfoParser->parse() /app/docroot/core/lib/Drupal/Core/Extension/InfoParser.php:22 148.0906 109471056 52. Drupal\Component\Serialization\Yaml::decode() /app/docroot/core/lib/Drupal/Core/Extension/InfoParserDynamic.php:50 148.0908 109471056 53. Drupal\Component\Serialization\YamlSymfony::decode() /app/docroot/core/lib/Drupal/Component/Serialization/Yaml.php:35 148.0909 109471280 54. Symfony\Component\Yaml\Parser->parse() /app/docroot/core/lib/Drupal/Component/Serialization/YamlSymfony.php:37 148.0909 109471280 55. Symfony\Component\Yaml\Parser->doParse() /app/vendor/symfony/yaml/Parser.php:142 148.1227 109477864 56. Symfony\Component\Yaml\Parser->parseBlock() /app/vendor/symfony/yaml/Parser.php:373 148.1228 109478088 57. Symfony\Component\Yaml\Parser->doParse() /app/vendor/symfony/yaml/Parser.php:517 148.1473 109483872 58. Symfony\Component\Yaml\Parser->parseValue() /app/vendor/symfony/yaml/Parser.php:244 148.1475 109483952 59. Symfony\Component\Yaml\Inline::parse() /app/vendor/symfony/yaml/Parser.php:774 148.1475 109483976 60. Symfony\Component\Yaml\Inline::parseScalar() /app/vendor/symfony/yaml/Inline.php:126 148.1476 109484056 61. Symfony\Component\Yaml\Inline::evaluateScalar() /app/vendor/symfony/yaml/Inline.php:363
  ```