import { useLocation } from 'react-router-dom';

export function isOnGoogleTranslate() {
  return (
    ( globalThis.location.hostname === 'translate.googleusercontent.com' )
    || ( globalThis.location.hostname === 'translate.google.com' )
    || ( globalThis.location.pathname === '/translate_c' )
  );
}

export function copyGoogleTranslateParametersToNewUrl( url ) {
  let newUrl = '';
  const isBeingTranslated = isOnGoogleTranslate();

  if ( isBeingTranslated ) {
    const metrolistGoogleTranslateUrl = localStorage.getItem( 'metrolistGoogleTranslateUrl' );

    if ( metrolistGoogleTranslateUrl ) {
      newUrl = metrolistGoogleTranslateUrl.replace(
        /([a-z]+=)(https?:\/\/[^/]+\/metrolist\/.*)/i,
        `$1${url}`,
      );
    } else {
      console.error( 'Could not find `metrolistGoogleTranslateUrl` in localStorage' );
    }
  } else {
    console.error( 'Google Translate URL not detected (checked for translate.googleusercontent.com, translate.google.com, and /translate_c). Can not copy query parameters to new Google Translate URL.' );
  }

  return newUrl;
}

// Fix for Google Translate iframe shenanigans
// @location - React Router useLocation instance
export function resolveLocationConsideringGoogleTranslate() {
  const location = useLocation();
  const isBeingTranslated = isOnGoogleTranslate();
  let resolvedUrlPath = location.pathname;

  if ( isBeingTranslated && location.search.length ) {
    const filteredQueryParameters = location.search.split( '&' ).filter( ( urlParameter ) => urlParameter.indexOf( '/metrolist/' ) !== -1 );

    if ( filteredQueryParameters.length ) {
      const metrolistUrlBeingTranslated = filteredQueryParameters[0].replace( /[a-z]+=https?:\/\/[^/]+(\/metrolist\/.*)/i, '$1' );

      resolvedUrlPath = metrolistUrlBeingTranslated;

      localStorage.setItem( 'metrolistGoogleTranslateUrl', globalThis.location.href );
      localStorage.setItem( 'metrolistGoogleTranslateIframeUrl', document.location.href );
    }
  }

  return {
    ...location,
    "pathname": resolvedUrlPath,
  };
}

export function switchToGoogleTranslateBaseIfNeeded( $base ) {
  console.log( "switchToGoogleTranslateBaseIfNeeded" );
  $base = ( $base || document.querySelector( 'base[href]' ) );
  const googleTranslateBaseUrl = ( ( $base && isOnGoogleTranslate() && $base ) ? globalThis.location.origin : null );

  // Fix CORS issue with history.push routing inside of Google Translate
  if ( googleTranslateBaseUrl ) {
    console.log( "switched base to google" );
    $base.href = googleTranslateBaseUrl;
  }
}

export function switchBackToMetrolistBaseIfNeeded( $base ) {
  console.log( "switchBackToMetrolistBaseIfNeeded" );
  $base = ( $base || document.querySelector( 'base[href]' ) );
  const metrolistBaseUrl = ( ( $base && isOnGoogleTranslate() ) ? $base.href : null ); // Added by Google to correct links, but breaks React Router

  // Fix CORS issue with history.push routing inside of Google Translate
  if ( metrolistBaseUrl ) {
    console.log( "switched base back to metrolist" );
    $base.href = metrolistBaseUrl;
  }
}
