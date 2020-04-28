import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@components/Stack';

import './Range.scss';

function Range( props ) {
  const min = ( props.min || 0 );
  const max = ( props.max || 100 );
  const [lowerBound, setLowerBound] = useState( props.lowerBound || props.min || ( max / 2 ) );
  const [upperBound, setUpperBound] = useState( props.upperBound || max );
  const [outOfBounds, setOutOfBounds] = useState( false );
  const handleInput = ( ( event ) => {
    const $input = event.target;

    switch ( $input.id ) { // eslint-disable-line default-case
      case 'lower-bound':
        setLowerBound( parseInt( $input.value, 10 ) );
        $input.parentNode.style.setProperty( `--${$input.id}`, +$input.value );
        break;

      case 'upper-bound':
        setUpperBound( parseInt( $input.value, 10 ) );
        $input.parentNode.style.setProperty( `--${$input.id}`, +$input.value );
        break;
    }

    setOutOfBounds( lowerBound > upperBound );
  } );

  return (
    <div
      className="ml-range"
      style={ {
        "--lower-bound": lowerBound,
        "--upper-bound": upperBound,
        "--min": min,
        "--max": max,
      } }
    >
      <Stack space="1">
        <p>
          <span className={ `ml-range__review${outOfBounds ? ` ml-range__review--inverted` : ''}` }>
            <output className="ml-range__output" htmlFor="lower-bound">{ `${lowerBound}%` }</output>
            <span className="en-dash">–</span>
            <output className="ml-range__output" htmlFor="upper-bound">{ `${upperBound}%` }</output>
          </span>
          &#30;<abbr className="ml-range__review-unit">AMI</abbr></p>
        <div
          className="ml-range__multi-input"
          role="group"
          // onChange={ handleInput }
        >
          <label
            className="sr-only"
            htmlFor="lower-bound"
          >{ outOfBounds ? 'Maximum' : 'Minimum' }</label>
          <input
            className={ `ml-range__input${outOfBounds ? ` ml-range__input--inverted` : ''}` }
            type="range"
            id="lower-bound"
            name="lowerBound"
            min={ min }
            defaultValue={ lowerBound }
            max={ max }
            onChange={ handleInput }
          />

          <label
            className="sr-only"
            htmlFor="upper-bound"
          >{ outOfBounds ? 'Minimum' : 'Maximum' }</label>
          <input
            className={ `ml-range__input${outOfBounds ? ` ml-range__input--inverted` : ''}` }
            type="range"
            id="upper-bound"
            name="upperBound"
            min={ min }
            defaultValue={ upperBound }
            max={ max }
            onChange={ handleInput }
          />
        </div>
      </Stack>
    </div>
  );
}

Range.displayName = 'Range';

Range.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "criterion": PropTypes.string,
  "min": PropTypes.number,
  "max": PropTypes.number,
  "lowerBound": PropTypes.number,
  "upperBound": PropTypes.number,
};

export default Range;
