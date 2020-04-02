import React from 'react';
import PropTypes from 'prop-types';

import './Listings.scss';

import FiltersPanel from '@components/FiltersPanel';
import ResultsPanel from '@components/ResultsPanel';
import Row from '@components/Row';
import Inset from '@components/Inset';
import Stack from '@components/Stack';
import Callout from '@components/Callout';
import Icon from '@components/Icon';

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
      <h2 className="sr-only">Search</h2>
      <Row space="panel" stackUntil="medium">
        <Stack data-column-width="1/3" space="below-filters" reverseAt="large">
          <FiltersPanel className="ml-listings__filters" />
          <Inset className="filters-panel__callout-container" until="large">
            <Callout className="filters-panel__callout" as="a" href="#">
              <Callout.Heading as="span">Use our AMI Estimator to find homes that match your income</Callout.Heading>
              <Callout.Icon>
                <Icon use="#icon-mobile-link-marker" />
              </Callout.Icon>
            </Callout>
          </Inset>
        </Stack>
        <ResultsPanel className="ml-listings__results" columnWidth="2/3" homes={ homes } />
      </Row>
    </article>
  );
}

Listings.propTypes = {
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

export default Listings;
