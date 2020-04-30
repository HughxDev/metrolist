import React from 'react';
import PropTypes from 'prop-types';

import Unit from '@components/Unit';

import { unitObjectDefinition } from '@util/validation';

import './UnitGroup.scss';

function UnitGroup( { units } ) {
  return (
    <table className="ml-unit-group">
      <thead>
        <tr>
          <th className="ml-unit-group__cell sr-only" scope="col">Size</th>
          <th className="ml-unit-group__cell sr-only" scope="col">Qualification</th>
          <th className="ml-unit-group__cell sr-only" scope="col">Price</th>
        </tr>
      </thead>
      <tbody>
        {
          units.map( ( unit ) => <Unit key={ unit.id } unit={ unit } /> )
        }
      </tbody>
    </table>
  );
}

UnitGroup.propTypes = {
  "units": PropTypes.arrayOf( unitObjectDefinition ),
};

export default UnitGroup;
