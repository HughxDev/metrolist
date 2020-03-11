const fetch = require( 'node-fetch' );
const fs = require( 'fs' );

const endpoint = 'https://patterns.boston.gov/assets/manifest/icons_manifest.json';

console.log( 'Fetching icons manifest from patterns.boston.gov…' );

fetch( endpoint )
  .then( ( response ) => response.json() )
  .then( ( json ) => {
    json = JSON.stringify( json, null, 2 );
    fs.writeFile(
      'src/components/Icon/icons_manifest.json',
      json,
      'utf8',
      ( writeFileError ) => {
        if ( !writeFileError ) {
          console.log( 'Updated icons manifest.' );
          process.exit( 0 );
        } else {
          console.error( writeFileError );
          process.exit( 1 );
        }
      },
    );
  } )
  .catch( ( error ) => {
    console.error( error );
    process.exit( 1 );
  } );
