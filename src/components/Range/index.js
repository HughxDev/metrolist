import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@components/Stack';

import './Range.scss';

function Range( props ) {
  const min = '0';
  const max = '100';
  const [value1, setValue1] = useState( '40' );
  const [value2, setValue2] = useState( '60' );
  const handleInput = ( ( event ) => {
    const $input = event.target;

    switch ( $input.id ) { // eslint-disable-line default-case
      case 'value-1':
        setValue1( $input.value );
        break;

      case 'value-2':
        setValue2( $input.value );
        break;
    }

    $input.parentNode.style.setProperty( `--${$input.id}`, +$input.value );
  } );

  return (
    <div
      className="ml-range"
      style={ {
        "--value-1": value1,
        "--value-2": value2,
        "--min": min,
        "--max": max,
      } }
    >
      <Stack space="1">
        <p><output className="ml-range__output" htmlFor="value-1">{ `${value1}%` }</output> – <output className="ml-range__output" htmlFor="value-2">{ `${value2}%` }</output> <abbr>AMI</abbr></p>
        <div role="group">
          <label className="sr-only" htmlFor="value-1">Minimum</label>
          <input className="ml-range__input" type="range" id="value-1" min={ min } value={ value1 } max={ max } onChange={ handleInput } />

          <label className="sr-only" htmlFor="value-2">Maximum</label>
          <input className="ml-range__input" type="range" id="value-2" min={ min } value={ value2 } max={ max } onChange={ handleInput } />
        </div>
      </Stack>
    </div>
  );
}

Range.displayName = 'Range';

Range.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Range;
