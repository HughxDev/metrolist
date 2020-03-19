import React from 'react';
import PropTypes from 'prop-types';

import Home from '@components/Home';

import './Homes.scss';

function Homes( { homes, className } ) {
  return (
    <div className={ `ml-homes${className ? ` ${className}` : ''}` }>{
      homes.length
        ? homes.map( ( home, index ) => <Home key={ index } home={ home } /> )
        : <p>No homes match the selected filters.</p>
    }</div> );
}

Homes.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

export default Homes;
