import { formatPageTitle } from '@util/strings';
import OnDemandLiveRegion from 'on-demand-live-region';

// Accessibility and Search Engine Optimization
export function updatePageTitle( pageTitle, sectionTitle ) { // eslint-disable-line import/prefer-default-export
  const formattedPageTitle = formatPageTitle( pageTitle, sectionTitle );
  const liveRegion = new OnDemandLiveRegion( {
    "level": 'assertive',
  } );

  document.title = formattedPageTitle;
  liveRegion.say( formattedPageTitle );
}
