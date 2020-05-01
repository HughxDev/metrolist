import PropTypes from 'prop-types';
import { date, dateTime } from './datetime';

export const unitObjectDefinition = PropTypes.shape( {
  "id": PropTypes.string.isRequired,
  "bedrooms": PropTypes.number,
  "amiQualification": PropTypes.number,
  "price": PropTypes.number,
  "priceRate": PropTypes.oneOf( ['monthly', 'once'] ),
} );

export const homeObjectDefinition = PropTypes.shape( { // eslint-disable-line import/prefer-default-export
  "id": PropTypes.string.isRequired,
  "slug": PropTypes.string,
  "url": PropTypes.string,
  "title": PropTypes.string,
  "listingDate": dateTime,
  "applicationDueDate": date,
  "assignment": PropTypes.oneOf( [null, '', 'lottery', 'waitlist', 'first'] ),
  "city": PropTypes.string,
  "neighborhood": PropTypes.string,
  "type": PropTypes.oneOf( ['', 'apt', 'house', 'sro', 'condo'] ),
  "offer": PropTypes.oneOf( ['rent', 'sale'] ),
  "units": PropTypes.arrayOf( unitObjectDefinition ),
  "incomeRestricted": PropTypes.bool,
} );
