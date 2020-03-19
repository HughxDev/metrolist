import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { capitalize } from '@util/strings';

import './Unit.scss';

function formatSize( size, bedrooms, numberOfIdenticalUnits ) {
  let formattedSize = '';

  if ( bedrooms ) {
    formattedSize += `${bedrooms} Bedroom`;
  }

  if ( numberOfIdenticalUnits ) {
    formattedSize += ` (×${numberOfIdenticalUnits})`;
  }

  if ( formattedSize.length ) {
    return formattedSize;
  }

  return capitalize( size );
}

function formatAmiQualification( amiQualification ) {
  return `AMI ${amiQualification}%`;
}

function formatPrice( price, priceRate ) {
  return (
    <NumberFormat
      value={ price }
      displayType={ 'text' }
      prefix={ '$' }
      thousandSeparator={ true }
      renderText={ ( value ) => (
        <>
          { `${value}/` }
          <abbr className="ml-unit__price-rate" title={ priceRate.substring( 0, 5 ) }>{ priceRate.substring( 0, 2 )}.</abbr>
        </>
      ) }
    />
  );
}

function Unit( { unit } ) {
  const {
    size, bedrooms, numberOfIdenticalUnits, amiQualification, price, priceRate,
  } = unit;

  /*
    Order:
      1. Size
      2. Qualification
      3. Price
  */
  return (
    <tr className="ml-unit">
      <td className="ml-unit__cell ml-unit__size">{ formatSize( size, bedrooms, numberOfIdenticalUnits ) }</td>
      <td className="ml-unit__cell ml-unit__ami-qualification">{ formatAmiQualification( amiQualification ) }</td>
      <td className="ml-unit__cell ml-unit__price">{ formatPrice( price, priceRate ) }</td>
    </tr>
  );
}

Unit.propTypes = {
  "unit": PropTypes.shape( {
    "size": PropTypes.oneOf( ['studio', 'bedrooms'] ),
    "bedrooms": PropTypes.number,
    "numberOfIdenticalUnits": PropTypes.number,
    "amiQualification": PropTypes.number,
    "price": PropTypes.number,
    "priceRate": PropTypes.oneOf( ['once', 'monthly'] ),
  } ),
};

export default Unit;
