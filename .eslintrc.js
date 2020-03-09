// Turns off accessibility warnings during initial building phase
// via: https://github.com/airbnb/javascript/issues/2032#issuecomment-568934232
// const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules)
//   .reduce((acc, rule) => { acc[`jsx-a11y/${rule}`] = 'off'; return acc }, {})

module.exports = {
  "extends": [
    "hughx/react",
  ],
  // "rules": {
  //   ...a11yOff,
  // },
};