import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { capitalize } from '@util/strings';

import './HomeInfo.scss';

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
      if ( value ) {
        formattedKey = 'Income-restricted – ';
      } else {
        formattedKey = 'Open Market';
      }
      break;
    default:
      formattedKey = capitalize( key );
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
      formattedValue = moment( value ).format( 'M/D/YY' );
      break;
    case 'assignment':
      switch ( value ) {
        case 'lottery':
          formattedValue = 'Housing Lottery';
          break;
        case 'waitlist':
          formattedValue = 'Open Waitlist';
          break;
        default:
          formattedValue = capitalize( value );
      }
      break;
    default:
      formattedValue = capitalize( key );
      break;
  }

  return formattedValue;
}

function HomeInfo( { info } ) {
  console.log( 'info', info );

  return (
    <dl className="cob-home-info">{
      Object.keys( info )
        .map( ( key, index ) => {
          const value = info[key];

          return (
            <React.Fragment key={ index }>
              <dt className="cob-home-info__key">{ formatKey( key, value ) }</dt>
              { value && <dd className="cob-home-info__value">{ formatValue( key, value ) }</dd> }
            </React.Fragment>
          );
        } )
    }</dl>
  );
}

HomeInfo.propTypes = {
  "info": PropTypes.object,
};

export default HomeInfo;
