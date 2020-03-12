const fs = require( 'fs' );
const { ncp } = require( 'ncp' );
const replace = require( 'replace-in-file' );
const path = require( 'path' );
const rimraf = require( 'rimraf' );
const { snakeCase, pascalCase } = require( 'change-case' );

ncp.limit = 16;

const templateDirectory = '_templates/components';
const componentDirectory = 'src/components';

function slugify( text ) {
  return snakeCase( text ).replace( /_/g, '-' );
}

function capitalize( text ) {
  return text.charAt( 0 ).toUpperCase() + text.slice( 1 );
}

function componentCase( text ) {
  return capitalize( pascalCase( text ) );
}

function addComponent() {
  const componentName = componentCase( process.argv.slice( 3 )[0] );
  const targetDirectory = `${componentDirectory}/${componentName}`;
  const replaceOptions = {
    "files": [
      `${targetDirectory}/**.js`,
      `${targetDirectory}/**.scss`,
    ],
    "from": [/\bComponent\b/g, /\bcomponent\b/g],
    "to": [componentName, `${slugify( componentName )}`],
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
      process.exit( 1 );
    }

    console.log( `Component created: ${componentName} @ ${targetDirectory}/index.js` );
  } );
}

async function renameComponent() {
  const existingComponentName = componentCase( process.argv.slice( 3 )[0] );
  const newComponentName = componentCase( process.argv.slice( 4 )[0] );
  const sourceDirectory = `${componentDirectory}/${existingComponentName}`;
  const targetDirectory = `${componentDirectory}/${newComponentName}`;

  const existingComponentNameRegex = new RegExp( `\\b${existingComponentName}\\b`, 'g' );
  const existingComponentClassNameRegex = new RegExp( `\\b${slugify( existingComponentName )}\\b`, 'g' );

  const replaceOptions = {
    "files": [
      `${sourceDirectory}/**.js`,
      `${sourceDirectory}/**.scss`,
    ],
    "from": [existingComponentNameRegex, existingComponentClassNameRegex],
    "to": [newComponentName, `${slugify( newComponentName )}`],
  };

  try {
    await replace( replaceOptions );
  } catch ( replacementError ) {
    console.error( 'Error occurred:', replacementError );
    process.exit( 1 );
  }

  fs.rename( sourceDirectory, targetDirectory, ( renameDirError ) => {
    if ( renameDirError ) {
      console.error( 'Error occurred:', renameDirError );
      process.exit( 1 );
    }

    fs.readdir( targetDirectory, ( dirError, files ) => {
      if ( dirError ) {
        console.error( 'Error occurred:', dirError );
        process.exit( 1 );
      }

      files.forEach( ( file ) => {
        const existingFilePath = path.join( targetDirectory, file );
        const newFilePath = path.join( targetDirectory, file.replace( existingComponentName, newComponentName ) );

        fs.rename( existingFilePath, newFilePath, ( renameError ) => {
          if ( renameError ) {
            console.error( 'Error occurred:', renameError );
            process.exit( 1 );
          }
        } );
      } );
    } );
  } );

  console.log( `Component renamed: ${existingComponentName} → ${newComponentName} @ ${targetDirectory}/index.js` );
}

function removeComponent() {
  const componentName = componentCase( process.argv.slice( 3 )[0] );
  const targetDirectory = `${componentDirectory}/${componentName}`;

  rimraf.sync( targetDirectory );
}

const action = process.argv.slice( 2 )[0];

switch ( action ) {
  case 'add':
    addComponent();
    break;

  case 'rename':
  case 'rn':
  case 'mv':
  case 'move':
    renameComponent();
    break;

  case 'delete':
  case 'del':
  case 'remove':
  case 'rm':
    removeComponent();
    break;

  default:
    console.error( `Unrecognized action: ${action}` );
}
