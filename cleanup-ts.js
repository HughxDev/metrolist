const fs = require( 'fs' );
const glob = require( 'glob' );

const deleteFiles = ( error, files ) => {
  if ( error ) {
    throw error;
  }

  files.forEach( ( file ) => {
    console.log( `Deleting ${file}…` );

    fs.unlink( file, ( deleteError ) => {
      if ( deleteError ) {
        throw deleteError;
      }
    } );
  } );
};

// options is optional
glob( './src/patterns/**/*.ts', deleteFiles );
glob( './src/patterns/**/*.tsx', deleteFiles );

console.log( `Deleting ./tsconfig.json…` );

fs.unlink( './tsconfig.json', ( deleteTsConfigError ) => {
  if ( deleteTsConfigError ) {
    throw deleteTsConfigError;
  }
} );
