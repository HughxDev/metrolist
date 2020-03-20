import React from 'react';
import PropTypes from 'prop-types';

import Home from '@components/Home';

import './ResultsPanel.scss';

function ResultsPanel( { homes, className } ) {
  return (
    <article className={ `ml-results-panel${className ? ` ${className}` : ''}` }>
      <h3 className="sr-only">Results</h3>
      {
        homes.length
          ? homes.map( ( home, index ) => <Home key={ index } home={ home } /> )
          : <p>No homes match the selected filters.</p>
      }
    </article>
  );
}

ResultsPanel.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

export default ResultsPanel;
