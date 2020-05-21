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

export function generateRandomDomId() {
  return Math.ceil( Math.random() * 1000000 ).toString();
}

// Examples:
// sectionTitle = AMI Estimator|Search
// pageTitle = Household Income
export function formatPageTitle( pageTitle, sectionTitle ) {
  let sectionPageTitle = '';

  if ( pageTitle && sectionTitle ) {
    sectionPageTitle = ` - ${sectionTitle}: ${pageTitle}`;
  } else if ( pageTitle && !sectionTitle ) {
    sectionPageTitle = ` - ${pageTitle}`;
  } else if ( sectionTitle && !pageTitle ) {
    sectionPageTitle = ` - ${sectionTitle}`;
  }

  return `${process.env.SITE_TITLE}${sectionPageTitle} | ${process.env.DOMAIN_TITLE}`;
}
