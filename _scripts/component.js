const fs = require( 'fs' );
const { ncp } = require( 'ncp' );
const replace = require( 'replace-in-file' );
const path = require( 'path' );
const rimraf = require( 'rimraf' );
const { slugify, componentCase } = require( '../src/util/strings.node.js' );

ncp.limit = 16;

const templateDirectory = '_templates/components';
const componentDirectory = 'src/components';

function addComponent( componentName, subcomponentName, recursionLevel = 1 ) {
  componentName = ( componentName || process.argv.slice( 3 )[0] );
  subcomponentName = ( subcomponentName || '' );

  let subcomponentFullName;

  // If we have an element-level component i.e. `Component/Subcomponent`:
  if ( subcomponentName ) {
    subcomponentFullName = `${componentName}${subcomponentName}`;
  } else {
    if ( componentName.indexOf( '/' ) !== -1 ) {
      const componentNameParts = componentName.split( '/' );
      componentName = componentCase( componentNameParts[0] );
      subcomponentName = componentCase( componentNameParts[1] );
      subcomponentFullName = `${componentName}${subcomponentName}`;
    } else {
      componentName = componentCase( componentName );
      subcomponentFullName = subcomponentName;
    }
  }

  const hasSubcomponent = ( ( recursionLevel === 1 ) && subcomponentName );
  const isSubcomponent = ( ( recursionLevel > 1 ) && subcomponentName );

  let targetDirectory = `${componentDirectory}/${componentName}`;
  if ( isSubcomponent ) {
    targetDirectory += `/_${subcomponentFullName}`;
  }

  const replaceOptions = {
    "files": [
      `${targetDirectory}/**.js`,
      `${targetDirectory}/**.scss`,
    ],
    "from": [/\bComponent\b/g, /(?<!["'`])\bcomponent(?<!["'`])\b(?!:)/g],
  };
  if ( isSubcomponent ) {
    replaceOptions.to = [subcomponentFullName, `${slugify( componentName )}__${slugify( subcomponentName )}`];
  } else {
    replaceOptions.to = [componentName, `${slugify( componentName )}`];
  }

  if ( fs.existsSync( targetDirectory ) ) {
    console.error( `Component already exists: ${componentName} @ ${targetDirectory}/index.js` );
    process.exit( 1 );
  }

  ncp(
    // Source
    `${templateDirectory}/Component`,
    // Destination
    targetDirectory,
    // Options
    {
      "rename": function rename( target ) {
        const pathInfo = path.parse( target );
        const filename = pathInfo.base.replace( replaceOptions.from[0], replaceOptions.to[0] );
        const resolution = path.resolve( targetDirectory, filename );

        return resolution;
      },
    },
    // Callback
    async ( error ) => {
      if ( error ) {
        rimraf.sync( targetDirectory );
        console.error( `ncp failed:\n  ${error.toString()}` );
        process.exit( 1 );
      }

      try {
        await replace( replaceOptions );

        if ( hasSubcomponent ) {
          addComponent( componentName, subcomponentName, 2 );
        }
      } catch ( replacementError ) {
        rimraf.sync( targetDirectory );
        console.error( '`replace-in-file` error:', replacementError );
        process.exit( 1 );
      }

      console.log( `Component created: ${isSubcomponent ? subcomponentFullName : componentName} @ ${targetDirectory}/index.js` );
    },
  );
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
  console.warn( `References to ${existingComponentName} in other files must be replaced manually.` );
}

function removeComponent() {
  const componentId = process.argv.slice( 3 )[0];
  let componentName;
  let subcomponentFullName;
  let targetDirectory;
  let isSubcomponent = false;

  // Block-level component:
  if ( componentId.indexOf( '/' ) === -1 ) {
    componentName = componentCase( componentId );
    targetDirectory = `${componentDirectory}/${componentName}`;
  // Element-level component:
  } else {
    isSubcomponent = true;
    const componentIdParts = componentId.split( '/' );
    componentName = componentCase( componentIdParts[0] );
    const subcomponentName = componentCase( componentIdParts[1] );
    subcomponentFullName = `${componentName}${subcomponentName}`;
    targetDirectory = `${componentDirectory}/${componentName}/_${subcomponentFullName}`;
  }

  const componentOrSubcomponentFullName = ( isSubcomponent ? subcomponentFullName : componentName );

  rimraf.sync( targetDirectory );
  console.log( `Component deleted: ${componentOrSubcomponentFullName}` );
  console.warn( `References to ${componentOrSubcomponentFullName} in other files must be removed manually.` );
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
