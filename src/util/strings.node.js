const { snakeCase, pascalCase } = require( 'change-case' );

function capitalize( text ) {
  return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
}

function slugify( text ) {
  return snakeCase( text ).replace( /_/g, '-' );
}

function componentCase( text ) {
  return capitalize( pascalCase( text ) );
}

module.exports = {
  capitalize,
  slugify,
  componentCase,
};
