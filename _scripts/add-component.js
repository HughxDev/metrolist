const fs = require( 'fs' );
const { ncp } = require( 'ncp' );
const replace = require( 'replace-in-file' );
const path = require( 'path' );
const rimraf = require( 'rimraf' );
const { snakeCase } = require( 'change-case' );

ncp.limit = 16;

const templateDirectory = '_templates/components';
const componentDirectory = 'src/components';
let componentName = process.argv.slice( 2 )[0];
componentName = componentName.charAt( 0 ).toUpperCase() + componentName.slice( 1 ); // first letter uppercase
const targetDirectory = `${componentDirectory}/${componentName}`;
const replaceOptions = {
  "files": [
    `${targetDirectory}/**.js`,
    `${targetDirectory}/**.scss`,
  ],
  "from": [/\bComponent\b/g, /\bcomponent\b/g],
  "to": [componentName, `${snakeCase( componentName ).replace( /_/g, '-' )}`],
};

if ( fs.existsSync( targetDirectory ) ) {
  console.error( `Component already exists: ${componentName} @ ${targetDirectory}/index.js` );
  process.exit( 1 );
}

ncp( `${templateDirectory}/Component`, targetDirectory, {
  "rename": function rename( target ) {
    const pathInfo = path.parse( target );
    const filename = pathInfo.base.replace( replaceOptions.from[0], replaceOptions.to[0] );
    const resolution = path.resolve( targetDirectory, filename );

    return resolution;
  },
}, async ( error ) => {
  if ( error ) {
    rimraf.sync( targetDirectory );
    console.error( error );
    process.exit( 1 );
  }

  try {
    await replace( replaceOptions );
  } catch ( replacementError ) {
    rimraf.sync( targetDirectory );
    console.error( 'Error occurred:', replacementError );
  }

  console.log( `Component created: ${componentName} @ ${targetDirectory}/index.js` );
} );

// console.log(  );
