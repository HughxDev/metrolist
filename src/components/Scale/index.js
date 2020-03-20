import React from 'react';
import PropTypes from 'prop-types';

import { propTypeErrorMessage } from '@util/errors';
import { pascalCase } from 'change-case';

import './Scale.scss';

/*
<label className="ml-scale__label">
  <span className="ml-scale__text">{ props.children }</span>
  <input className="ml-scale__form-control" type="range" list="tickmarks" />
</label>
<datalist id="tickmarks">{
  props.value.split( ',' )
    .map( ( value, index, array ) => (
      <option key={ index } value={ Math.round( ( index / ( array.length - 1 ) ) * 100 ) } label={ value }></option>
    ) )
}</datalist>
*/

function Scale( props ) {
  return (
    <fieldset className={ `ml-scale${props.className ? ` ${props.className}` : ''}` }>
      <legend className="ml-scale__heading">{ props.children }</legend>
      <div className="ml-scale__inputs">{
        props.value.split( ',' )
          .map( ( value, index ) => (
            <label key={ index } className="ml-scale__label">
              <input className="ml-scale__form-control" name={ props.criterion } type="radio" />
              <span className="ml-scale__text">{ value }</span>
            </label>
          ) )
      }</div>
    </fieldset>
  );
}

Scale.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "criterion": PropTypes.string,
  "value": function commaDelimited( props, propName, componentName ) {
    const prop = props[propName];

    if ( prop.indexOf( ',' ) === -1 ) {
      return new Error( propTypeErrorMessage( {
        propName,
        componentName,
        "got": prop,
        "expected": "comma-delimited string",
        "example": "0,1,2,3,4+",
      } ) );
    }

    return null;
  },
};

export default Scale;
