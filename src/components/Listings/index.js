import React from 'react';
import PropTypes from 'prop-types';

import './Listings.scss';

import Filters from '@components/Filters';
import Home from '@components/Home';

const demoHomes = [
  {
    "title": "Neazor Point",
    "listingDate": "2020-04-01",
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
    "listingDate": "2020-03-01",
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
    "listingDate": "2020-02-01",
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
    <article className="cob-listings">
      <Filters className="cob-listings__filters" />
      <div className="cob-listings__homes">{
        homes.length
          ? homes.map( ( home, index ) => <Home key={ index } home={ home } /> )
          : <p>No homes match the selected filters.</p>
      }</div>
    </article>
  );
}

Listings.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
};

export default Listings;
