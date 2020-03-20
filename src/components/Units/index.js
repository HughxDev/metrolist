import React from 'react';
import PropTypes from 'prop-types';

import Unit from '@components/Unit';

import './Units.scss';

function Units( { units } ) {
  return (
    <table className="ml-units">
      <thead>
        <tr>
          <th className="ml-units__size" scope="col">Size</th>
          <th className="ml-units__ami-qualification" scope="col">Qualification</th>
          <th className="ml-units__price" scope="col">Price</th>
        </tr>
      </thead>
      <tbody>
        { units.map( ( unit, index ) => <Unit key={ index } unit={ unit } /> ) }
      </tbody>
    </table>
  );
}

Units.propTypes = {
  "units": PropTypes.arrayOf( PropTypes.object ),
};

export default Units;