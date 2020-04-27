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

import units from './sample-api-response.json';

const dev2Ip = '54.227.255.2';
const dev2Domain = 'd8-dev2.boston.gov';
const dev2Endpoint = `https://${dev2Domain}/metro/api/v1/units?_format=json`;

function Listings( props ) {
  const [filters, setFilters] = useState( props.filters );
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
      delete formattedUnit.unitType;
      delete formattedUnit.development;
      delete formattedUnit.developmentURI;
      delete formattedUnit.developmentURL;
      delete formattedUnit.developmentID;
      delete formattedUnit.userGuidType;
      delete formattedUnit.appDueDateTimeAgo;
      delete formattedUnit.postedTimeAgo;

      formattedUnit.id = unit.developmentID;
      formattedUnit.slug = unit.developmentURI.slice( 1 );
      formattedUnit.title = unit.development;

      switch ( unit.unitType.toLowerCase() ) {
        case 'single room occupancy':
          formattedUnit.type = 'sro';
          break;

        case 'apartment':
          formattedUnit.type = 'apt';
          break;

        default:
          formattedUnit.type = unit.unitType.toLowerCase();
      }

      formattedUnit.assignment = ( ( unit.openWaitlist === true ) ? 'waitlist' : unit.userGuidType.toLowerCase().split( ' ' )[0] );
      formattedUnit.listingDate = unit.posted.replace( '-0400', 'Z' ); // TODO: not a real conversion to UTC
      formattedUnit.applicationDueDate = unit.appDueDate.replace( 'T12:00:00', '' ); // TODO: not a real conversion to UTC
      formattedUnit.offer = ( ( unit.type === 'Own' ) ? 'sale' : 'rent' );
      formattedUnit.incomeRestricted = ( unit.incomeRestricted == 'true' ); // eslint-disable-line eqeqeq
      formattedUnit.url = `https://${dev2Domain}/${formattedUnit.slug}`;

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

  const handleFilterChange = ( event ) => {
    const $input = event.target;
    console.log( 'Filter change:', $input.type, $input.name, $input.value, $input.checked );
  };

  return (
    <article className={ `ml-listings${props.className ? ` ${props.className}` : ''}` }>
      <h2 className="sr-only">Search</h2>
      <Row space="panel" stackUntil="medium">
        <Stack data-column-width="1/3" space="below-filters" reverseAt="large">
          <FiltersPanel
            className="ml-listings__filters"
            filters={ filters }
            handleFilterChange={ handleFilterChange }
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
  "amiEstimation": PropTypes.number,
  "filters": PropTypes.object,
  // "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

Listings.defaultProps = {
  "amiEstimation": null,
  "filters": {
    "offer": {
      "rent": true,
      "sale": false,
    },
    "location": {
      "city": {
        "boston": true,
        "!boston": false,
      },
      "neighborhood": {
        "southBoston": true,
        "hydePark": true,
        "dorchester": true,
        "mattapan": true,
      },
      "cardinalDirection": {
        "west": false,
        "north": false,
        "south": false,
        // "east": false,
      },
    },
    "bedrooms": {
      "0": true,
      "1": true,
      "2": false,
      "3": false,
      "4+": false,
    },
    "amiQualification": {
      "lowerBound": 30,
      "upperBound": 150,
    },
  },
};

export default Listings;
