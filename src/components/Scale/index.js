import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { propTypeErrorMessage } from '@util/errors';

import './Scale.scss';

// function getAriaLabel( props, value, omitValue = false ) {
//   const { units, unitLabel } = props;
//   const integerValue = parseInt( value, 10 );

//   if ( unitLabel && ( unitLabel.type === 'aria' ) ) {
//     if ( unitLabel.affix === 'prepend' ) {
//       if ( integerValue > 1 ) {
//         if ( units.many ) {
//           if ( omitValue ) {
//             return units.many;
//           }

//           return `${units.many} ${value}`;
//         }

//         return false;
//       }

//       if ( units.one ) {
//         if ( omitValue ) {
//           return units.one;
//         }

//         return `${units.one} ${value}`;
//       }

//       return false;
//     }

//     if ( unitLabel.affix === 'append' ) {
//       if ( integerValue > 1 ) {
//         if ( units.many ) {
//           if ( omitValue ) {
//             return units.many;
//           }

//           return `${value} ${units.many}`;
//         }

//         return false;
//       }

//       if ( units.one ) {
//         if ( omitValue ) {
//           return units.one;
//         }

//         return `${value} ${units.one}`;
//       }

//       return false;
//     }
//   }

//   return false;
// }

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
            // aria-label={ getAriaLabel( props, value, true ) }
            aria-describedby={ props['aria-describedby'] }
            aria-label={ props['aria-label'] }
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
  // "units": PropTypes.shape( {
  //   "one": PropTypes.string,
  //   "many": PropTypes.string,
  // } ),
  // "unitLabel": PropTypes.shape( {
  //   "type": PropTypes.oneOf( ['aria', 'text'] ),
  //   "affix": PropTypes.oneOf( ['prepend', 'append'] ),
  // } ),
  "aria-describedby": PropTypes.string,
  "aria-label": PropTypes.string,
};

export default Scale;
