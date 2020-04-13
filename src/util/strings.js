import { snakeCase, pascalCase } from 'change-case';

export function capitalize( text ) {
  return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
}

export function uncapitalize( text ) {
  return text.charAt( 0 ).toLowerCase() + text.slice( 1 );
}

export function slugify( text ) {
  return snakeCase( text ).replace( /_/g, '-' );
}

export function componentCase( text ) {
  return capitalize( pascalCase( text ) );
}
