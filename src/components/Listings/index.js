import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { hasOwnProperty } from '@util/objects';

import './Listings.scss';
import 'whatwg-fetch';

import FiltersPanel from '@components/FiltersPanel';
import ResultsPanel from '@components/ResultsPanel';
import Row from '@components/Row';
import Inset from '@components/Inset';
import Stack from '@components/Stack';
import Callout from '@components/Callout';
import Icon from '@components/Icon';

// const demoHomes = [
//   {
//     "title": "Neazor Point",
//     "listingDate": "2020-04-01T00:00:00",
//     "applicationDueDate": "2020-05-01",
//     "assignment": "lottery",
//     "city": "Boston",
//     "neighborhood": "West Roxbury",
//     "type": "apartment",
//     "offer": "rental",
//     "units": [
//       {
//         "size": "studio",
//         "bedrooms": 0,
//         "numberOfIdenticalUnits": 0,
//         "amiQualification": 60,
//         "price": 1058,
//         "priceRate": "monthly",
//       },
//       {
//         "size": "bedrooms",
//         "bedrooms": 1,
//         "numberOfIdenticalUnits": 5,
//         "amiQualification": 80,
//         "price": 1449,
//         "priceRate": "monthly",
//       },
//     ],
//   },
//   {
//     "title": "The Maltby Building",
//     "listingDate": "2020-03-01T00:00:00",
//     "applicationDueDate": "2020-04-01",
//     "assignment": "waitlist",
//     "city": "Boston",
//     "neighborhood": "Hyde Park",
//     "type": "apartment",
//     "offer": "rental",
//     "units": [
//       {
//         "size": "bedrooms",
//         "bedrooms": 2,
//         "numberOfIdenticalUnits": 0,
//         "amiQualification": 60,
//         "price": 1058,
//         "priceRate": "monthly",
//       },
//     ],
//   },
//   {
//     "title": "Carlton Heights Building",
//     "listingDate": "2020-02-01T00:00:00",
//     "applicationDueDate": "2020-03-01",
//     "assignment": null,
//     "city": "Boston",
//     "neighborhood": "Hyde Park",
//     "type": "apartment",
//     "offer": "rental",
//     "units": [
//       {
//         "size": "studio",
//         "bedrooms": 0,
//         "numberOfIdenticalUnits": 0,
//         "amiQualification": 60,
//         "price": 1058,
//         "priceRate": "monthly",
//       },
//     ],
//   },
// ];

// const units = [
//   {
//     "development": "2424 Boylston st Boston - Fenway",
//     "developmentID": "11566036",
//     "developmentURI": "\/2424-boylston-st-boston-fenway",
//     "developmentURL": "https:\/\/d8-dev2.boston.gov\/2424-boylston-st-boston-fenway",
//     "region": "Boston",
//     "city": "Boston",
//     "neighborhood": "Fenway",
//     "type": "Rent",
//     "unitType": "",
//     "beds": "4",
//     "ami": "80",
//     "price": "2400",
//     "incomeRestricted": "true",
//     "userGuidType": "Waitlist",
//     "openWaitlist": "true",
//     "posted": "2020-04-22T14:38:55-0400",
//     "postedTimeAgo": "1 day ago",
//     "appDueDate": "",
//     "appDueDateTimeAgo": "",
//   },
// ];

import units from './sample-api-response.json';

const dev2Ip = '54.227.255.2';
const dev2Domain = 'd8-dev2.boston.gov';
const dev2Endpoint = `https://${dev2Domain}/metro/api/v1/units?_format=json`;

function Listings( props ) {
  const [filters, setFilters] = useState( {} );
  const [homes, setHomes] = useState( [] );

  useEffect( () => {
    // fetch(
    //   dev2Endpoint,
    //   {
    //     "mode": "no-cors",
    //     "headers": {
    //       "Content-Type": "application/json",
    //     },
    //   },
    // ) // TODO: CORS
    //   .then( ( response ) => {
    //     console.log( {
    //       "responseBody": response.body,
    //     } );
    //     if ( !response.body ) {
    //       throw new Error( `API returned an invalid response.` );
    //     }
    //   } )
    //   .then( ( response ) => response.json() )
    //   .then( ( units ) => {
    const developments = {};

    // units.map( ( unit ) => {} );
    units.forEach( ( unit ) => {
      const formattedUnit = { ...unit };
      delete formattedUnit.beds;
      delete formattedUnit.ami;
      delete formattedUnit.price;
      delete formattedUnit.postedTimeAgo;
      delete formattedUnit.posted;
      delete formattedUnit.appDueDate;
      delete formattedUnit.openWaitlist;

      formattedUnit.assignment = ( ( unit.openWaitlist === true ) ? 'waitlist' : unit.userGuidType.toLowerCase() );
      formattedUnit.listingDate = unit.posted;
      formattedUnit.applicationDueDate = unit.appDueDate;
      formattedUnit.offer = ( ( unit.type === 'Own' ) ? 'sale' : 'rental' );
      formattedUnit.incomeRestricted = ( unit.incomeRestricted == 'true' ); // eslint-disable-line eqeqeq

      if ( !hasOwnProperty( developments, unit.developmentID ) ) {
        developments[unit.developmentID] = formattedUnit;
        developments[unit.developmentID].units = [];
      }

      developments[unit.developmentID].units.push( {
        "size": ( +unit.beds > 0 ) ? 'bedrooms' : 'studio',
        "bedrooms": +unit.beds,
        "amiQualification": +unit.ami,
        "price": +unit.price,
        "priceRate": ( ( formattedUnit.offer === 'rental' ) ? 'monthly' : 'once' ),
      } );
    } );

    // return developments;
    const newHomes = Object.keys( developments ).map( ( developmentID ) => developments[developmentID] );

    console.log( { newHomes } );

    setHomes( newHomes );
    // console.log( { homes } );
    // } )
    // .then( ( formattedApiResponse ) => {
    //   setHomes( formattedApiResponse );
    //   console.log( 'homes', homes );
    // } )
    // .catch( ( error ) => {
    //   console.log( 'dev2Endpoint', dev2Endpoint );
    //   console.error( error );
    // } );
  }, [] );

  return (
    <article className={ `ml-listings${props.className ? ` ${props.className}` : ''}` }>
      <h2 className="sr-only">Search</h2>
      <Row space="panel" stackUntil="medium">
        <Stack data-column-width="1/3" space="below-filters" reverseAt="large">
          <FiltersPanel
            className="ml-listings__filters"
            filters={ filters }
            setFilters={ setFilters }
          />
          <Inset className="filters-panel__callout-container" until="large">
            <Callout className="filters-panel__callout" as="a" href="#">
              <Callout.Heading as="span">Use our AMI Estimator to find homes that match your income</Callout.Heading>
              <Callout.Icon>
                <Icon use="#icon-mobile-link-marker" />
              </Callout.Icon>
            </Callout>
          </Inset>
        </Stack>
        <ResultsPanel
          className="ml-listings__results"
          columnWidth="2/3"
          filters={ filters }
          homes={ homes }
          setHomes={ setHomes }
        />
      </Row>
    </article>
  );
}

Listings.propTypes = {
  "amiEstimation": PropTypes.string,
  // "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

export default Listings;
