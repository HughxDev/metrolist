import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { hasOwnProperty } from '@util/objects';
import { camelCase } from 'change-case';

import './Search.scss';
import 'whatwg-fetch';

import FiltersPanel from '@components/FiltersPanel';
import ResultsPanel from '@components/ResultsPanel';
import Row from '@components/Row';
import Inset from '@components/Inset';
import Stack from '@components/Stack';
import Callout from '@components/Callout';
import Icon from '@components/Icon';

import { homeObject, filtersObject } from '@util/validation';
import isDev from '@util/dev';

// const dev2Ip = '54.227.255.2';
// const dev2Domain = 'd8-dev2.boston.gov';
const ciDomain = 'd8-ci.boston.gov';
const dev2Endpoint = `https://${ciDomain}/metrolist/api/v1/developments?_format=json`;

function Search( props ) {
  const [filters, setFilters] = useState( props.filters );
  const [allHomes, setAllHomes] = useState( Object.freeze( props.homes ) );
  const [filteredHomes, setFilteredHomes] = useState( Object.freeze( props.homes ) );

  const getListingCounts = ( homes ) => {
    const listingCounts = {
      "offer": {
        "rent": 0,
        "sale": 0,
      },
      "location": {
        "city": {
          "boston": 0,
          "beyondBoston": 0,
        },
        "neighborhood": {},
        "cardinalDirection": {
          "west": 0,
          "north": 0,
          "south": 0,
        },
      },
    };

    homes.forEach( ( home ) => {
      if ( home.offer === 'sale' ) {
        listingCounts.offer.sale++;
      } else if ( home.offer === 'rent' ) {
        listingCounts.offer.rent++;
      }

      if ( home.city.toLowerCase() === 'boston' ) {
        listingCounts.location.city.boston++;
      } else {
        listingCounts.location.city.beyondBoston++;
      }

      if ( home.neighborhood ) {
        const neighborhoodKey = camelCase( home.neighborhood );

        if ( hasOwnProperty( listingCounts.location.neighborhood, neighborhoodKey ) ) {
          listingCounts.location.neighborhood[neighborhoodKey]++;
        } else {
          listingCounts.location.neighborhood[neighborhoodKey] = 1;
        }
      } else if ( home.cardinalDirection ) {
        listingCounts.location.cardinalDirection[home.cardinalDirection]++;
      }
    } );

    return listingCounts;
  };

  const filterHomes = ( filtersToApply, matchOnNoneSelected = true ) => {
    const matchingHomes = allHomes
      .filter( ( home ) => {
        if ( !home.incomeRestricted ) {
          return true;
        }

        let matchesOffer = (
          (
            filtersToApply.offer.rent
              && ( home.offer === 'rent' )
          )
            || (
              filtersToApply.offer.sale
              && ( home.offer === 'sale' )
            )
        );
        let matchesBroadLocation = (
          (
            filtersToApply.location.city.boston
            && ( home.cardinalDirection === null )
          )
          || (
            filtersToApply.location.city.beyondBoston
            && ( home.cardinalDirection !== null )
          )
        );
        const unitBedroomSizes = home.units.map( ( unit ) => unit.bedrooms ).sort();
        let matchesBedrooms = (
          (
            filtersToApply.bedrooms['0']
            && ( unitBedroomSizes.indexOf( 0 ) !== -1 )
          )
          || (
            filtersToApply.bedrooms['1']
            && ( unitBedroomSizes.indexOf( 1 ) !== -1 )
          )
          || (
            filtersToApply.bedrooms['2']
            && ( unitBedroomSizes.indexOf( 2 ) !== -1 )
          )
          || (
            filtersToApply.bedrooms['3']
            && ( unitBedroomSizes.indexOf( 3 ) !== -1 )
          )
          || (
            filtersToApply.bedrooms['4+']
            && ( unitBedroomSizes[unitBedroomSizes.length - 1] >= 4 )
          )
        );
        const dedupedAmi = new Set( home.units.map( ( unit ) => unit.amiQualification ) );
        const unitAmiQualifications = Array.from( dedupedAmi );
        let matchesAmiQualification;

        for ( let index = 0; index < unitAmiQualifications.length; index++ ) {
          const amiQualification = ( unitAmiQualifications[index] || null );

          if ( amiQualification === null ) {
            matchesAmiQualification = true;
            break;
          }

          if ( filtersToApply.amiQualification.lowerBound <= filtersToApply.amiQualification.upperBound ) {
            matchesAmiQualification = (
              ( amiQualification >= filtersToApply.amiQualification.lowerBound )
              && ( amiQualification <= filtersToApply.amiQualification.upperBound )
            );
          // These values can be switched in the UI causing the names to no longer be semantic
          } else if ( filtersToApply.amiQualification.lowerBound > filtersToApply.amiQualification.upperBound ) {
            matchesAmiQualification = (
              ( amiQualification >= filtersToApply.amiQualification.upperBound )
              && ( amiQualification <= filtersToApply.amiQualification.lowerBound )
            );
          }

          if ( matchesAmiQualification ) {
            break;
          }
        }

        if ( matchOnNoneSelected ) {
          if ( !filtersToApply.offer.rent && !filtersToApply.offer.rent ) {
            matchesOffer = true;
          }

          if ( !filtersToApply.location.city.boston && !filtersToApply.location.city.beyondBoston ) {
            matchesBroadLocation = true;
          }

          if ( !filtersToApply.bedrooms['0'] && !filtersToApply.bedrooms['1'] && !filtersToApply.bedrooms['2'] && !filtersToApply.bedrooms['3'] && !filtersToApply.bedrooms['4+'] ) {
            matchesBedrooms = true;
          }
        }

        return ( matchesOffer && matchesBroadLocation && matchesBedrooms && matchesAmiQualification );
      } )
      .map( ( home ) => {
        const newUnits = home.units.filter( ( unit ) => {
          let unitMatchesBedrooms = (
            (
              filtersToApply.bedrooms['0']
              && ( unit.bedrooms === 0 )
            )
            || (
              filtersToApply.bedrooms['1']
              && ( unit.bedrooms === 1 )
            )
            || (
              filtersToApply.bedrooms['2']
              && ( unit.bedrooms === 2 )
            )
            || (
              filtersToApply.bedrooms['3']
              && ( unit.bedrooms === 3 )
            )
            || (
              filtersToApply.bedrooms['4+']
              && ( unit.bedrooms >= 4 )
            )
          );

          if ( matchOnNoneSelected ) {
            if (
              !filtersToApply.bedrooms['0']
              && !filtersToApply.bedrooms['1']
              && !filtersToApply.bedrooms['2']
              && !filtersToApply.bedrooms['3']
              && !filtersToApply.bedrooms['4+']
            ) {
              unitMatchesBedrooms = true;
            }
          }

          return unitMatchesBedrooms;
        } );

        return {
          ...home,
          "units": newUnits,
        };
      } )
      .map( ( home ) => {
        const newUnits = home.units.filter( ( unit ) => {
          let unitMatchesAmiQualification;
          const unitAmiQualification = ( unit.amiQualification || null );

          if ( unitAmiQualification === null ) {
            return true;
          }

          if ( filters.amiQualification.lowerBound <= filters.amiQualification.upperBound ) {
            unitMatchesAmiQualification = (
              ( unitAmiQualification >= filters.amiQualification.lowerBound )
              && ( unitAmiQualification <= filters.amiQualification.upperBound )
            );
          // These values can be switched in the UI causing the names to no longer be semantic
          } else if ( filters.amiQualification.lowerBound > filters.amiQualification.upperBound ) {
            unitMatchesAmiQualification = (
              ( unitAmiQualification >= filters.amiQualification.upperBound )
              && ( unitAmiQualification <= filters.amiQualification.lowerBound )
            );
          }

          return unitMatchesAmiQualification;
        } );

        return {
          ...home,
          "units": newUnits,
        };
      } );

    return matchingHomes;
  };

  useEffect( () => {
    if ( !allHomes.length ) {
      fetch(
        dev2Endpoint,
        {
          "mode": "no-cors",
          "headers": {
            "Content-Type": "application/json",
          },
        },
      ) // TODO: CORS
        .then( async ( response ) => {
          console.log( {
            "responseBody": response.body,
          } );
          if ( !response.body ) {
            if ( isDev() ) {
              console.warn( 'API returned an invalid response; falling back to test data since we’re in a development environment.' );

              return import( './test-data' )
                .then( ( json ) => {
                  console.log( 'json.default', json.default );
                  return json.default;
                } );
            }

            throw new Error( `API returned an invalid response.` );
          } else {
            return response.json();
          }
        } )
        .then( ( apiHomes ) => {
          console.log( 'apiHomes', apiHomes );
          setAllHomes( apiHomes );
        } )
        .catch( ( error ) => {
          console.error( error );
        } );
    }
  }, [] );

  useEffect( () => {
    setFilteredHomes( filterHomes( filters ) );
  }, [filters, allHomes] );

  const handleFilterChange = ( event ) => {
    const $input = event.target;
    let newValue;
    const newFilters = { ...filters };
    let valueAsKey = false;
    let isNumeric = false;
    let specialCase = false;
    let parent;
    let parentCriterion;

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
        parentCriterion = event.metrolist.parentCriterion;

        switch ( parentCriterion ) { // eslint-disable-line default-case
          case 'amiQualification':
            isNumeric = true;
            break;
        }

        if ( isNumeric ) {
          newValue = Number.parseInt( newValue, 10 );
        }

        if ( parentCriterion !== $input.name ) {
          if ( valueAsKey ) {
            specialCase = true;
            parent = newFilters[parentCriterion][$input.name];
            parent[$input.value] = newValue;
          } else {
            specialCase = true;
            parent = newFilters[parentCriterion];
            parent[$input.name] = newValue;
          }
        }
      }
    }

    if ( !specialCase ) {
      parent = newFilters[$input.name];
      parent[$input.value] = newValue;
    }

    switch ( $input.name ) {
      case 'neighborhood':
        if ( newValue && !filters.location.city.boston ) {
          newFilters.location.city.boston = newValue;
        }
        break;

      case 'cardinalDirection':
        if ( newValue && !filters.location.city.beyondBoston ) {
          newFilters.location.city.beyondBoston = newValue;
        }
        break;

      default:
    }

    // Selecting Boston or Beyond Boston checks/unchecks all subcategories
    switch ( $input.value ) {
      case 'boston':
        Object.keys( filters.location.neighborhood ).forEach( ( neighborhood ) => {
          newFilters.location.neighborhood[neighborhood] = newValue;
        } );
        break;

      case 'beyondBoston':
        Object.keys( filters.location.cardinalDirection ).forEach( ( cardinalDirection ) => {
          newFilters.location.cardinalDirection[cardinalDirection] = newValue;
        } );
        break;

        // case ''

      default:
    }

    setFilters( newFilters );
    setFilteredHomes( filterHomes( filters ) );
  };

  return (
    <article className={ `ml-search${props.className ? ` ${props.className}` : ''}` }>
      <h2 className="sr-only">Search</h2>
      <Row space="panel" stackUntil="large">
        <Stack data-column-width="1/3" space="panel" reverseAt="large">
          <FiltersPanel
            className="ml-search__filters"
            filters={ filters }
            listingCounts={ getListingCounts( allHomes ) }
            handleFilterChange={ handleFilterChange }
          />
          <Inset className="filters-panel__callout-container" until="large">
            <Callout className="filters-panel__callout" as="a" href="/metrolist/ami-estimator/">
              <Callout.Heading as="span">Use our AMI Estimator to find homes that match your income</Callout.Heading>
              <Callout.Icon>
                <Icon use="#icon-mobile-link-marker" />
              </Callout.Icon>
            </Callout>
          </Inset>
        </Stack>
        <ResultsPanel
          className="ml-search__results"
          columnWidth="2/3"
          filters={ filters }
          homes={ filteredHomes }
        />
      </Row>
    </article>
  );
}

Search.propTypes = {
  "amiEstimation": PropTypes.number,
  "filters": filtersObject,
  "homes": PropTypes.arrayOf( homeObject ),
  "className": PropTypes.string,
};

Search.defaultProps = {
  "homes": [],
  "amiEstimation": null,
  "filters": {
    "offer": {
      "rent": false,
      "sale": false,
    },
    "location": {
      "city": {
        "boston": false,
        "beyondBoston": false,
      },
      "neighborhood": {
        // "southBoston": false,
        // "hydePark": false,
        // "dorchester": false,
        // "mattapan": false,
      },
      "cardinalDirection": {
        "west": false,
        "north": false,
        "south": false,
      },
    },
    "bedrooms": {
      "0": false,
      "1": false,
      "2": false,
      "3": false,
      "4+": false,
    },
    "amiQualification": {
      "lowerBound": ( localStorage.getItem( 'amiRecommendation' ) || 0 ),
      "upperBound": 200,
    },
  },
};

export default Search;
