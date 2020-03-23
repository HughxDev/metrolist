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
    if ( hasSubcomponent ) {
      return addComponent( componentName, subcomponentName, 2 );
    }

    reject( `Component already exists: ${componentName} @ ${targetDirectory}/index.js` );
  }

  return new Promise( ( resolve, reject ) => {
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
          reject( `ncp failed:\n  ${error.toString()}` );
        }

        try {
          await replace( replaceOptions );

          if ( hasSubcomponent ) {
            addComponent( componentName, subcomponentName, 2 )
              .then( ( successMessage ) => {
                resolve( successMessage );
              } )
              .catch( ( errorMessage ) => {
                reject( errorMessage );
              } );
          }
        } catch ( replacementError ) {
          rimraf.sync( targetDirectory );
          reject( `replace-in-file failed:\n  ${replacementError.toString()}` );
        }

        resolve( `Component created: ${isSubcomponent ? subcomponentFullName : componentName} @ ${targetDirectory}/` );
      },
    );
  } );
}

async function renameComponent() {
  const existingComponentId = process.argv.slice( 3 )[0];
  const newComponentId = process.argv.slice( 4 )[0];

  let existingBlockComponentName;
  let existingElementComponentShortName;
  let existingElementComponentName;

  let existingBlockComponentNameRegex;
  let existingClassNameRegex;

  let newBlockComponentName;
  let newElementComponentShortName;
  let newElementComponentName;

  let newComponentClassName;

  let sourceDirectory;
  let targetDirectoryBase;
  let targetDirectory;

  // Existing component is block-level:
  if ( existingComponentId.indexOf( '/' ) === -1 ) {
    // Naming:
    existingBlockComponentName = componentCase( existingComponentId );

    // Find/Replace:
    sourceDirectory = `${componentDirectory}/${existingBlockComponentName}`;
    existingBlockComponentNameRegex = new RegExp( `\\b${existingBlockComponentName}\\b`, 'g' );
    existingClassNameRegex = new RegExp( `\\b${slugify( existingBlockComponentName )}\\b`, 'g' );

  // Existing component is element-level (subcomponent):
  } else {
    // Naming:
    const existingComponentIdParts = existingComponentId.split( '/' );
    existingBlockComponentName = componentCase( existingComponentIdParts[0] );
    existingElementComponentShortName = componentCase( existingComponentIdParts[1] );
    existingElementComponentName = `${existingBlockComponentName}${existingElementComponentShortName}`;

    // Find/Replace:
    sourceDirectory = `${componentDirectory}/${existingBlockComponentName}/_${existingElementComponentName}`;
    existingBlockComponentNameRegex = new RegExp( `\\b${existingElementComponentName}\\b`, 'g' );
    existingClassNameRegex = new RegExp( `\\b${slugify( existingBlockComponentName )}__${slugify( existingElementComponentShortName )}\\b`, 'g' );
  }

  const existingComponentName = ( existingElementComponentName || existingBlockComponentName );

  // New component name is block-level:
  if ( newComponentId.indexOf( '/' ) === -1 ) {
    // Naming:
    newBlockComponentName = componentCase( newComponentId );

    // Find/Replace:
    targetDirectoryBase = `${componentDirectory}/${newBlockComponentName}`;
    targetDirectory = targetDirectoryBase;
    newComponentClassName = slugify( newBlockComponentName );

  // New component name is element-level (subcomponent):
  } else {
    // Naming:
    const newComponentIdParts = newComponentId.split( '/' );
    newBlockComponentName = componentCase( newComponentIdParts[0] );
    newElementComponentShortName = componentCase( newComponentIdParts[1] );
    newElementComponentName = `${newBlockComponentName}${newElementComponentShortName}`;

    // Find/Replace:
    targetDirectoryBase = `${componentDirectory}/${newBlockComponentName}`;
    targetDirectory = `${targetDirectoryBase}/_${newElementComponentName}`;
    newComponentClassName = `${slugify( newBlockComponentName )}__${slugify( newElementComponentShortName )}`;
  }

  const newComponentName = ( newElementComponentName || newBlockComponentName );

  const replaceOptions = {
    "files": [
      `${sourceDirectory}/**.js`,
      `${sourceDirectory}/**.scss`,
    ],
    "from": [existingBlockComponentNameRegex, existingClassNameRegex],
    "to": [newComponentName, newComponentClassName],
  };

  try {
    await replace( replaceOptions );
  } catch ( replacementError ) {
    console.error( `replace-in-file failed:\n  ${replacementError.toString()}` );
    process.exit( 1 );
  }

  if ( !fs.existsSync( targetDirectoryBase ) ) {
    await addComponent( newBlockComponentName );
  }

  fs.rename( sourceDirectory, targetDirectory, ( renameDirError ) => {
    if ( renameDirError ) {
      console.error( `fs.rename failed:\n  ${renameDirError.toString()}` );
      process.exit( 1 );
    }

    fs.readdir( targetDirectory, ( dirError, files ) => {
      if ( dirError ) {
        console.error( `fs.readdir failed:\n  ${dirError.toString()}` );
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
      } ); // files.forEach

      console.log( `Component renamed: ${existingComponentId} → ${newComponentId} @ ${targetDirectory}/` );
      console.warn( `References to ${existingBlockComponentName} in other files must be replaced manually.` );
    } ); // fs.readdir
  } ); // fs.rename
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
    addComponent()
      .then( ( successMessage ) => {
        console.log( successMessage );
      } )
      .catch( ( errorMessage ) => {
        console.error( errorMessage );
        process.exit( 1 );
      } );
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
