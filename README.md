# Boston.gov Metrolist v2

## General Naming Conventions

### DAMP (Descriptive And Meaningful Phrases).

Prefer readability for other developers over less typing for yourself.

#### Examples

##### HTML/CSS:
```html
<h2 class="sh">Section Header</h2><!-- Bad -->
Good: <h2 class="section-header">Section Header</h2><!-- Good -->
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

When writing modifiers, ensure that the base class is also present; should not mean anything on its own.
```scss
.block--modifier {} // Bad
.block.block--modifier {} // Good
```

An exception to this would be for mixin classes that are intended to be used broadly. In that case, start the class name with two dashes to indicate detactedness:
```scss
.--inline-block {
  display: inline-block;
}
```

Don’t reflect the expected DOM structure in class names, as this is this expectation is likely to break as projects evolve. Only indicate which block owns the element. This allows components to be transposable and avoids extremely long class names.
```scss
.ml-block__element__subelement {} // Bad
.ml-block__subelement {} // Good
```

#### BEM within Sass

Don’t use parent selectors to construct BEM classes. This allows the full selector to be searchable in IDEs.
```scss
.ml-block {
  &__element {} // Bad
}
.ml__block {}
.ml-block__element {} // Good
```

### Spacing

Don’t declare margins directly on components, only in wrappers.

#### Resources
- [Margin considered harmful](https://mxstbr.com/thoughts/margin)
- [The Stack](https://absolutely.every-layout.dev/layouts/stack/)
- [Braid Design System](https://seek-oss.github.io/braid-design-system/foundations/layout)