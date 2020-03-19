import React from 'react';
import PropTypes from 'prop-types';

import './Listings.scss';

import Filters from '@components/Filters';
import Homes from '@components/Homes';

const demoHomes = [
  {
    "title": "Neazor Point",
    "listingDate": "2020-04-01T00:00:00",
    "applicationDueDate": "2020-05-01",
    "assignment": "lottery",
    "city": "Boston",
    "neighborhood": "West Roxbury",
    "type": "apartment",
    "offer": "rental",
    "units": [
      {
        "size": "studio",
        "bedrooms": 0,
        "numberOfIdenticalUnits": 0,
        "amiQualification": 60,
        "price": 1058,
        "priceRate": "monthly",
      },
      {
        "size": "bedrooms",
        "bedrooms": 1,
        "numberOfIdenticalUnits": 5,
        "amiQualification": 80,
        "price": 1449,
        "priceRate": "monthly",
      },
    ],
  },
  {
    "title": "The Maltby Building",
    "listingDate": "2020-03-01T00:00:00",
    "applicationDueDate": "2020-04-01",
    "assignment": "waitlist",
    "city": "Boston",
    "neighborhood": "Hyde Park",
    "type": "apartment",
    "offer": "rental",
    "units": [
      {
        "size": "bedrooms",
        "bedrooms": 2,
        "numberOfIdenticalUnits": 0,
        "amiQualification": 60,
        "price": 1058,
        "priceRate": "monthly",
      },
    ],
  },
  {
    "title": "Carlton Heights Building",
    "listingDate": "2020-02-01T00:00:00",
    "applicationDueDate": "2020-03-01",
    "assignment": null,
    "city": "Boston",
    "neighborhood": "Hyde Park",
    "type": "apartment",
    "offer": "rental",
    "units": [
      {
        "size": "studio",
        "bedrooms": 0,
        "numberOfIdenticalUnits": 0,
        "amiQualification": 60,
        "price": 1058,
        "priceRate": "monthly",
      },
    ],
  },
];

function Listings( props ) {
  const homes = ( props.homes || demoHomes );

  return (
    <article className={ `ml-listings${props.className ? ` ${props.className}` : ''}` }>
      <Filters className="ml-listings__filters" />
      <Homes className="ml-listings__homes" homes={ homes } />
    </article>
  );
}

Listings.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

export default Listings;
