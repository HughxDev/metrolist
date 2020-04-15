import React, { forwardRef } from 'react';
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

const Scale = forwardRef( ( props, ref ) => (
  <div className={ `ml-scale${props.className ? ` ${props.className}` : ''}` } onChange={ props.onChange }>{
    props.values.split( ',' )
      .map( ( value, index ) => (
        <label key={ index } className="ml-scale__label">
          <input
            ref={ ( index === 0 ) ? ref : null }
            className="ml-scale__form-control"
            name={ props.criterion }
            value={ value }
            type="radio"
            required={ props.required }
            defaultChecked={ value === props.value }
          />
          <span className="ml-scale__text">{ value }</span>
        </label>
      ) )
  }</div>
) );

Scale.displayName = 'Scale';

Scale.propTypes = {
  "children": PropTypes.node,
  "required": PropTypes.bool,
  "className": PropTypes.string,
  "criterion": PropTypes.string,
  "values": function commaDelimited( props, propName, componentName ) {
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
  "value": PropTypes.string,
  "onChange": PropTypes.func,
};

export default Scale;
