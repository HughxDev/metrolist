import React from 'react';
import PropTypes from 'prop-types';

import Home from '@components/Home';
import Stack from '@components/Stack';

import './ResultsPanel.scss';

function ResultsPanel( props ) {
  const { homes, className, columnWidth } = props;
  const attributes = { ...props };

  if ( homes.length > 0 ) {
    delete attributes.homes;
  }

  if ( columnWidth ) {
    delete attributes.columnWidth;
    attributes['data-column-width'] = columnWidth;
  }

  return (
    <article className={ `ml-results-panel${className ? ` ${className}` : ''}` }{ ...attributes }>
      <h3 className="sr-only">Results</h3>
      <Stack space="panel">
      {
        homes.length
          ? homes.map( ( home, index ) => <Home key={ index } home={ home } /> )
          : <p>No homes match the selected filters.</p>
      }
      </Stack>
    </article>
  );
}

ResultsPanel.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "columnWidth": PropTypes.string,
  "className": PropTypes.string,

};

export default ResultsPanel;
