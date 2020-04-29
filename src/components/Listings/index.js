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
  const [allHomes, setAllHomes] = useState( props.homes );
  const [filteredHomes, setFilteredHomes] = useState( props.homes );

  const filterHomes = ( filtersToApply, homesToFilter = allHomes, matchOnNoneSelected = true ) => {
    const matchingHomes = homesToFilter.filter( ( home ) => {
      let matchesOffer = (
        (
          filters.offer.rent
            && ( home.offer === 'rent' )
        )
          || (
            filters.offer.sale
            && ( home.offer === 'sale' )
          )
      );
      let matchesBroadLocation = (
        (
          filters.location.city.boston
          && ( home.cardinalDirection === null )
        )
        || (
          filters.location.city['!boston']
          && ( home.cardinalDirection !== null )
        )
      );
      const unitBedroomSizes = home.units.map( ( unit ) => unit.bedrooms ).sort();
      let matchesBedrooms = (
        (
          filters.bedrooms['0']
          && ( unitBedroomSizes.indexOf( 0 ) !== -1 )
        )
        || (
          filters.bedrooms['1']
          && ( unitBedroomSizes.indexOf( 1 ) !== -1 )
        )
        || (
          filters.bedrooms['2']
          && ( unitBedroomSizes.indexOf( 2 ) !== -1 )
        )
        || (
          filters.bedrooms['3']
          && ( unitBedroomSizes.indexOf( 3 ) !== -1 )
        )
        || (
          filters.bedrooms['4+']
          && ( unitBedroomSizes[unitBedroomSizes.length - 1] >= 4 )
        )
      );
      let matchesAmiQualification;

      const unitAmiQualifications = Array.from( new Set( home.units.map( ( unit ) => unit.amiQualification ) ) );

      unitAmiQualifications.forEach( ( amiQualification ) => {
        if ( filters.amiQualification.lowerBound <= filters.amiQualification.upperBound ) {
          matchesAmiQualification = (
            ( amiQualification >= filters.amiQualification.lowerBound )
            && ( amiQualification <= filters.amiQualification.upperBound )
          );
        // These values can be switched in the UI causing the names to no longer be semantic
        } else if ( filters.amiQualification.lowerBound > filters.amiQualification.upperBound ) {
          matchesAmiQualification = (
            ( amiQualification >= filters.amiQualification.upperBound )
            && ( amiQualification <= filters.amiQualification.lowerBound )
          );
        }
      } );

      if ( matchOnNoneSelected ) {
        if ( !filters.offer.rent && !filters.offer.rent ) {
          matchesOffer = true;
        }

        if ( !filters.location.city.boston && !filters.location.city['!boston'] ) {
          matchesBroadLocation = true;
        }

        if ( !filters.bedrooms['0'] && !filters.bedrooms['1'] && !filters.bedrooms['2'] && !filters.bedrooms['3'] && !filters.bedrooms['4+'] ) {
          matchesBedrooms = true;
        }
      }

      return ( matchesOffer && matchesBroadLocation && matchesBedrooms && matchesAmiQualification );
    } );

    return matchingHomes;
  };

  useEffect( () => {
    if ( !allHomes.length ) {
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
        delete formattedUnit.region;

        formattedUnit.cardinalDirection = ( ( unit.region === 'Boston' ) ? null : unit.region.toLowerCase().replace( ' of boston', '' ) );
        formattedUnit.id = unit.developmentID;
        formattedUnit.slug = unit.developmentURI.slice( 1 );
        formattedUnit.title = unit.development;
        // formattedUnit.city = unit.city.toLowerCase();

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
          // "size": ( +unit.beds > 0 ) ? 'bedrooms' : 'studio',
          "bedrooms": +unit.beds,
          "amiQualification": +unit.ami,
          "price": +unit.price,
          "priceRate": ( ( formattedUnit.offer === 'rental' ) ? 'monthly' : 'once' ),
        } );
      } );

      // return developments;
      const apiHomes = Object.keys( developments ).map( ( developmentID ) => developments[developmentID] );

      setAllHomes( apiHomes );
      setFilteredHomes( filterHomes( filters, apiHomes ) );
      // } )
      // .then( ( formattedApiResponse ) => {
      // } )
      // .catch( ( error ) => {
      // } );
    }
  }, [] );

  const handleFilterChange = ( event ) => {
    const $input = event.target;
    let newValue;
    const newFilters = { ...filters };
    let valueAsKey = false;
    let isNumeric = false;
    let specialCase = false;

    switch ( $input.type ) {
      case 'checkbox':
        newValue = $input.checked;
        valueAsKey = true;
        break;

      default:
        newValue = $input.value;
    }

    if ( hasOwnProperty( event, 'metrolist' ) ) {
      if ( hasOwnProperty( event.metrolist, 'parentCriterion' ) ) {
        switch ( event.metrolist.parentCriterion ) { // eslint-disable-line default-case
          case 'amiQualification':
            isNumeric = true;
            break;
        }

        if ( isNumeric ) {
          newValue = Number.parseInt( newValue, 10 );
        }

        if ( event.metrolist.parentCriterion !== $input.name ) {
          if ( valueAsKey ) {
            specialCase = true;
            newFilters[event.metrolist.parentCriterion][$input.name][$input.value] = newValue;
          } else {
            specialCase = true;
            newFilters[event.metrolist.parentCriterion][$input.name] = newValue;
          }
        }
      }
    }

    if ( !specialCase ) {
      newFilters[$input.name][$input.value] = newValue;
    }

    setFilters( newFilters );
    setFilteredHomes( filterHomes( filters ) );
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
          homes={ filteredHomes }
        />
      </Row>
    </article>
  );
}

Listings.propTypes = {
  "amiEstimation": PropTypes.number,
  "filters": PropTypes.shape( {
    "offer": PropTypes.shape( {
      "rent": PropTypes.bool,
      "sale": PropTypes.bool,
    } ),
    "location": PropTypes.shape( {
      "city": PropTypes.shape( {
        "boston": PropTypes.bool,
        "!boston": PropTypes.bool,
      } ),
      "neighborhood": PropTypes.objectOf( PropTypes.bool ),
      "cardinalDirection": PropTypes.shape( {
        "west": PropTypes.bool,
        "north": PropTypes.bool,
        "south": PropTypes.bool,
      } ),
    } ),
    "bedrooms": PropTypes.shape( {
      "0": PropTypes.bool,
      "1": PropTypes.bool,
      "2": PropTypes.bool,
      "3": PropTypes.bool,
      "4+": PropTypes.bool,
    } ),
    "amiQualification": PropTypes.shape( {
      "lowerBound": PropTypes.number,
      "upperBound": PropTypes.number,
    } ),
  } ),
  "homes": PropTypes.arrayOf( PropTypes.object ),
  "className": PropTypes.string,
};

Listings.defaultProps = {
  "homes": [],
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
