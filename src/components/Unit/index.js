import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

import { unitObject } from '@util/validation';

import './Unit.scss';

function formatSize( bedrooms, numberOfIdenticalUnits ) {
  let formattedSize = '';

  if ( bedrooms > 0 ) {
    formattedSize = <>
      <abbr title={ `${bedrooms} Bedroom` } className="ml-unit__shorthand --hide-at-large">{ `${bedrooms} BR` }</abbr>
      <span className="--hide-until-large">{ `${bedrooms} Bedroom` }</span>
    </>;
  } else {
    formattedSize = 'Studio';
  }

  if ( numberOfIdenticalUnits ) {
    formattedSize += ` (×${numberOfIdenticalUnits})`;
  }

  return formattedSize;
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
      renderText={ ( value ) => {
        const isForSale = ( priceRate === 'once' );

        if ( isForSale ) {
          return <>{ value }</>;
        }

        return (
          <>
            { `${value}/` }
            <abbr className="ml-unit__price-rate ml-unit__shorthand" title={ priceRate.substring( 0, 5 ) }>{ priceRate.substring( 0, 2 ) }.</abbr>
          </>
        );
      } }
    />
  );
}

function Unit( { unit } ) {
  const {
    id, bedrooms, numberOfIdenticalUnits, amiQualification, price, priceRate,
  } = unit;

  /*
    Order:
      1. Size
      2. Qualification
      3. Price
  */
  return (
    <tr className="ml-unit" data-testid={ id }>
      <td className="ml-unit__cell ml-unit__size">{ formatSize( bedrooms, numberOfIdenticalUnits ) }</td>
      <td className="ml-unit__cell ml-unit__ami-qualification">{ formatAmiQualification( amiQualification ) }</td>
      <td className="ml-unit__cell ml-unit__price">{ price && priceRate && formatPrice( price, priceRate ) }</td>
    </tr>
  );
}

Unit.propTypes = {
  "unit": unitObject,
};

export default Unit;
