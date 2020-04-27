# Boston.gov Metrolist v2

## General Naming Conventions

### DAMP (Descriptive And Meaningful Phrases).

Prefer readability for other developers over less typing for yourself.

#### Examples

##### HTML/CSS:
```html
<h2 class="sh">Section Header</h2><!-- Bad -->
<h2 class="section-header">Section Header</h2><!-- Good -->
```

##### JavaScript:
```js
const newElCmpShrtNm = 'Header'; // Bad
const newElementComponentShortName = 'Header'; // Good
```

## CSS Conventions

### Namespacing

All classes namespaced as `ml-` for Metrolist to avoid collisions with main site and/or third-party libraries.

### BEM Methodology

Vanilla BEM (Block-Element-Modifier):
- Blocks: Lowercase name (`block`)
- Elements: two underscores appended to block (`block__element`)
- Modifiers: two dashes appended to block or element (`block--modifier`, `block__element--modifier`).

When writing modifiers, ensure the base class is also present; modifiers should not mean anything on their own. This also gives modifiers higher specificity than regular classes, which helps ensure that they actually get applied.
```scss
.block--modifier {} // Bad
.block.block--modifier {} // Good
```

An exception to this would be for mixin classes that are intended to be used broadly. In that case, start the class name with two dashes to indicate detactedness:
```scss
.--hide-until-large {
  display: none;
}
@media screen and (min-width: $large) {
  .--hide-until-large {
    display: unset;
  }
}
```

Don’t reflect the expected DOM structure in class names, as this expectation is likely to break as projects evolve. Only indicate which block owns the element. This allows components to be transposable and avoids extremely long class names.
```scss
.ml-block__element__subelement {} // Bad
.ml-block__subelement {} // Good
```

#### BEM within Sass

Avoid parent selectors when constructing BEM classes. This allows the full selector to be searchable in IDEs. (Though there is a VS Code extension, [CSS Navigation](https://marketplace.visualstudio.com/items?itemName=pucelle.vscode-css-navigation), that solves this problem, we can’t assume everyone will have it or VS Code installed.)
```scss
.ml-block {
  &__element {} // Bad
}
.ml__block {}
.ml-block__element {} // Good
```

### Sass

Always include parentheses when calling mixins, even if they have no arguments.

```scss
@mixin mixin() {
  // …
}
@include mixin; // Bad
@include mixin(); // Good
```

### Spacing

Don’t declare margins directly on components, only in wrappers.

#### Resources
- [Margin considered harmful](https://mxstbr.com/thoughts/margin)
- [The Stack](https://absolutely.every-layout.dev/layouts/stack/)
- [Braid Design System](https://seek-oss.github.io/braid-design-system/foundations/layout)

### Postprocessing

https://www.rucksackcss.org/

## Build Process

### Module Resolution

Aliases exist to avoid long pathnames, e.g. `import '@components/Foo'` instead of `import '../../../components/Foo'`. Any time an alias is added or removed, three configuration files have to be updated: `webpack.config.js` for compilation, `jest.config.js` for testing, and `.eslintrc.js` for linting. Each one has a slightly different syntax but they all boil down to JSON key-value pairs of the form [alias] → [full path]. Here are the same aliases defined across all three configs:

`webpack.config.js`:
```js
module.exports = {
  "resolve": {
    "alias": {
      "@patterns": path.resolve( __dirname, 'patterns' ),
      "@util": path.resolve( __dirname, 'src/util' ),
      "@globals": path.resolve( __dirname, 'src/globals' ),
      "@components": path.resolve( __dirname, 'src/components' ),
      "__mocks__": path.resolve( __dirname, '__mocks__' ),
    },
  }
};
```

`jest.config.js`:
```js
module.exports = {
  "moduleNameMapper": {
    "^@patterns/(.*)": "<rootDir>/patterns/$1",
    "^@util/(.*)": "<rootDir>/src/util/$1",
    "^@globals/(.*)$": "<rootDir>/src/globals/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^__mocks__/(.*)$": "<rootDir>/__mocks__/$1",
    "\\.(css|s[ca]ss|less|styl)$": "<rootDir>/__mocks__/styleMock.js",
  },
};
```

`.eslintrc.js`:
```js
module.exports = {
  "settings": {
    "import/resolver": {
      "alias": {
        "map": [
          ["@patterns", "./patterns"],
          ["@util", "./src/util"],
          ["@globals", "./src/globals"],
          ["@components", "./src/components"],
          ["__mocks__", "./__mocks__"]
        ],
        "extensions": [".js", ".scss"],
      },
    },
  },
};
```