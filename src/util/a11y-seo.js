import { useLocation } from 'react-router-dom';
import { formatPageTitle } from '@util/strings';
import OnDemandLiveRegion from 'on-demand-live-region';

// Accessibility and Search Engine Optimization
export function updatePageTitle( pageTitle, sectionTitle ) {
  const formattedPageTitle = formatPageTitle( pageTitle, sectionTitle );
  const liveRegion = new OnDemandLiveRegion( {
    "level": 'assertive',
  } );

  document.title = formattedPageTitle;
  liveRegion.say( formattedPageTitle );
}

export function handlePseudoButtonKeyDown( event, triggerClick = false ) {
  if ( event.key === " " || event.key === "Enter" || event.key === "Spacebar" ) { // "Spacebar" for IE11 support
    // Prevent the default action to stop scrolling when space is pressed
    event.preventDefault();

    if ( triggerClick ) {
      event.target.click();
    }
  }
}

// Fix for Google Translate iframe shenanigans
// @location - React Router useLocation instance
export function resolveLocationConsideringGoogleTranslate() {
  const location = useLocation();
  let resolvedUrlPath = location.pathname;

  if ( ( location.pathname === '/translate_c' ) && location.search.length ) {
    // isBeingTranslated = true;
    const filteredQueryParameters = location.search.split( '&' ).filter( ( item ) => item.indexOf( '/metrolist/' ) !== -1 );

    if ( filteredQueryParameters.length ) {
      const metrolistUrlBeingTranslated = filteredQueryParameters[0].replace( /[a-z]+=https?:\/\/[^/]+(\/metrolist\/.*)/i, '$1' );

      resolvedUrlPath = metrolistUrlBeingTranslated;
    }
  }

  return {
    ...location,
    "pathname": resolvedUrlPath,
  };
}
