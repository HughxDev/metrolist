import React from 'react';
import PropTypes from 'prop-types';

import Home from '@components/Home';
import Stack from '@components/Stack';
import Inset from '@components/Inset';

import { homeObject } from '@util/validation';

import './ResultsPanel.scss';

/*
  {
    "development": "2424 Boylston st Boston - Fenway",
    "developmentID": "11566036",
    "developmentURI": "\/2424-boylston-st-boston-fenway",
    "developmentURL": "https:\/\/d8-dev2.boston.gov\/2424-boylston-st-boston-fenway",
    "region": "Boston",
    "city": "Boston",
    "neighborhood": "Fenway",
    "type": "Rent",
    "unitType": "",
    "beds": "4",
    "ami": "80",
    "price": "2400",
    "incomeRestricted": "true",
    "userGuidType": "Waitlist",
    "openWaitlist": "true",
    "posted": "2020-04-22T14:38:55-0400",
    "postedTimeAgo": "1 day ago",
    "appDueDate": "",
    "appDueDateTimeAgo": ""
  },
*/

function ResultsPanel( props ) {
  const {
    homes, className, columnWidth, filters, handleHomesLoaded,
  } = props;
  const attributes = { ...props };

  if ( homes && ( homes.length > 0 ) ) {
    delete attributes.homes;
  }

  if ( columnWidth ) {
    delete attributes.columnWidth;
    attributes['data-column-width'] = columnWidth;
  }

  if ( filters ) {
    delete attributes.filters;
  }

  if ( handleHomesLoaded ) {
    delete attributes.handleHomesLoaded;
  }

  return (
    <article
      data-testid="ml-results-panel"
      className={ `ml-results-panel${className ? ` ${className}` : ''}` }
      { ...attributes }
    >
      <h3 className="sr-only">Results</h3>
      <Inset until="large">
        <Stack space="panel">
        {
          homes && ( homes.length )
            ? homes.map( ( home ) => <Home key={ home.id } home={ home } filters={ filters } /> )
            : <p>No homes match the selected filters.</p>
        }
        </Stack>
      </Inset>
    </article>
  );
}

ResultsPanel.propTypes = {
  "homes": PropTypes.arrayOf( homeObject ),
  "columnWidth": PropTypes.string,
  "className": PropTypes.string,
  "filters": PropTypes.object,
  "handleHomesLoaded": PropTypes.func,
};

export default ResultsPanel;
