import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { capitalize } from '@util/strings';
// import { capitalCase } from 'change-case';

import './HomeInfo.scss';

function HomeInfo( props ) {
  const { className, info } = props;

  function formatKey( key, value ) {
    let formattedKey;

    switch ( key ) {
      case 'listingDate':
        formattedKey = 'Posted: ';
        break;
      case 'applicationDueDate':
        formattedKey = 'Application Due: ';
        break;
      case 'assignment':
        break;
      case 'incomeRestricted':
        if ( value === true ) {
          formattedKey = 'Income-restricted';

          if ( props.info.assignment ) {
            formattedKey += ' – ';
          }
        } else {
          formattedKey = 'Open Market';
        }
        break;
      default:
        if ( typeof key === 'string' ) {
          formattedKey = `${capitalize( key )}: `;
        } else {
          formattedKey = `${key}: `;
        }
        break;
    }

    return formattedKey;
  }

  function formatValue( key, value ) {
    let formattedValue;

    switch ( key ) {
      case 'listingDate':
        formattedValue = moment( value ).format( 'M/D/YY' );
        break;
      case 'applicationDueDate':
        formattedValue = ( value ? moment( value ).format( 'M/D/YY' ) : null );
        // formattedValue = null;
        break;
      case 'assignment':
        break;
      case 'incomeRestricted':
        if ( value === true ) {
          switch ( props.info.assignment ) {
            case 'lottery':
              formattedValue = 'Housing lottery';
              break;
            case 'waitlist':
              formattedValue = 'Open waitlist';
              break;
            case 'first':
              formattedValue = 'First come, first served';
              break;
            default:
              if ( typeof props.info.assignment === 'string' ) {
                formattedValue = capitalize( props.info.assignment );
              } else {
                formattedValue = `${value}`;
              }
          }
        } else {
          if ( typeof value === 'string' ) {
            formattedValue = capitalize( value );
          } else {
            formattedValue = `${value}`;
          }
        }
        break;
      default:
        if ( typeof key === 'string' ) {
          formattedValue = capitalize( key );
        } else {
          formattedValue = `${value}`;
        }
        break;
    }

    return formattedValue;
  }

  return (
    <dl className={ `ml-home-info${className ? ` ${className}` : ''}` }>{
      Object.keys( info )
        .map( ( key, index ) => {
          const value = info[key];
          const formattedKey = formatKey( key, value );
          const formattedValue = formatValue( key, value );
          const isRelevantValue = ( ( formattedValue !== null ) && ( formattedValue !== 'false' ) && ( formattedValue !== '' ) );
          const isRelevantKey = ( key !== 'assignment' );
          const isIrrelevantDueDate = (
            ( key === 'applicationDueDate' )
            && ( value === '' )
          );

          if ( isRelevantKey && !isIrrelevantDueDate ) {
            return (
              <div key={ index }>
                <dt className="ml-home-info__key">{ formattedKey }</dt>
                { isRelevantValue && <dd className="ml-home-info__value">{ formattedValue }</dd> }
              </div>
            );
          }

          return undefined;
        } )
    }</dl>
  );
}

HomeInfo.propTypes = {
  "className": PropTypes.string,
  "info": PropTypes.object,
};

export default HomeInfo;
