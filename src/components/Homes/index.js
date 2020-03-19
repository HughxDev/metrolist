import React from 'react';
import PropTypes from 'prop-types';

import Home from '@components/Home';

import './Homes.scss';

function Homes( { homes, className } ) {
  return (
    <article className={ `ml-homes${className ? ` ${className}` : ''}` }>
      <h3 className="sr-only">Results</h3>
      {
        homes.length
          ? homes.map( ( home, index ) => <Home key={ index } home={ home } /> )
          : <p>No homes match the selected filters.</p>
      }
    </article>
  );
}

Homes.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

export default Homes;
