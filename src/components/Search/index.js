import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { hasOwnProperty } from '@util/objects';

import FiltersPanel from '@components/FiltersPanel';
import ResultsPanel from '@components/ResultsPanel';
import Row from '@components/Row';
import Inset from '@components/Inset';
import Callout from '@components/Callout';

import { homeObject, filtersObject } from '@util/validation';
import { getDevelopmentsApiEndpoint } from '@util/dev';
import { isOnGoogleTranslate, copyGoogleTranslateParametersToNewUrl } from '@util/a11y-seo';
import Stack from '@components/Stack';

import './Search.scss';
import 'whatwg-fetch';

const apiEndpoint = getDevelopmentsApiEndpoint();

// https://stacko;verflow.com/a/11764168/214325
function paginate( homes, homesPerPage = 8 ) {
  const pages = [];
  let i = 0;
  const numberOfHomes = homes.length;

  while ( i < numberOfHomes ) {
    pages.push( homes.slice( i, i += homesPerPage ) );
  }

  return pages;
}

function getQuery( location ) {
  return new URLSearchParams( location.search );
}

function useQuery() {
  return new URLSearchParams( useLocation().search );
}

function getPage( location ) {
  return parseInt( getQuery( location ).get( 'page' ), 10 );
}

function Search( props ) {
  const [filters, setFilters] = useState( props.filters );
  const [paginatedHomes, setPaginatedHomes] = useState( paginate( Object.freeze( props.homes ) ) );
  const [filteredHomes, setFilteredHomes] = useState( Object.freeze( props.homes ) );
  const [currentPage, setCurrentPage] = useState( 1 );
  const [totalPages, setTotalPages] = useState( 1 );
  const [pages, setPages] = useState( [1] );
  const [isDesktop, setIsDesktop] = useState( window.matchMedia( '(min-width: 992px)' ).matches );
  const history = useHistory();
  const location = useLocation();

  const query = useQuery();
  const $drawer = useRef();
  let [updatingDrawerHeight, setUpdatingDrawerHeight] = useState( false ); // eslint-disable-line

  history.listen( ( newLocation ) => {
    const requestedPage = getPage( newLocation );

    if ( requestedPage ) {
      setCurrentPage( requestedPage );
    } else {
      setCurrentPage( 1 );
    }
  } );

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
      // Technically not a count, but better to just log here than
      // loop through the entire home array again in a separate function
      "rentalPrice": {
        "lowerBound": 0,
        "upperBound": 0,
      },
    };

    homes.forEach( ( home ) => {
      if ( home.offer === 'sale' ) {
        listingCounts.offer.sale++;
      } else if ( home.offer === 'rent' ) {
        listingCounts.offer.rent++;
      }

      if ( home.city ) {
        if ( home.city.toLowerCase() === 'boston' ) {
          listingCounts.location.city.boston++;
        } else {
          listingCounts.location.city.beyondBoston++;
        }
      }

      if ( home.neighborhood ) {
        // const neighborhoodKey = camelCase( home.neighborhood );
        const neighborhoodKey = home.neighborhood;

        if ( hasOwnProperty( listingCounts.location.neighborhood, neighborhoodKey ) ) {
          listingCounts.location.neighborhood[neighborhoodKey]++;
        } else {
          listingCounts.location.neighborhood[neighborhoodKey] = 1;
        }
      } else if ( home.cardinalDirection ) {
        listingCounts.location.cardinalDirection[home.cardinalDirection]++;
      }

      if ( Array.isArray( home.units ) ) {
        home.units.forEach( ( unit ) => {
          if ( home.offer === 'rent' ) {
            // Not extracting lowest rent since we can just default to $0 and let the user adjust

            if ( unit.price > listingCounts.rentalPrice.upperBound ) {
              listingCounts.rentalPrice.upperBound = unit.price;
            }
          }
        } );
      }
    } );

    return listingCounts;
  };

  const filterHomes = ( homesToFilter, filtersToApply, matchOnNoneSelected = true ) => {
    const matchingHomes = homesToFilter
      .filter( ( home ) => {
        let matchesOffer = (
          (
            ( filtersToApply.offer.rent !== false )
            && ( home.offer === 'rent' )
          )
          || (
            ( filtersToApply.offer.sale !== false )
            && ( home.offer === 'sale' )
          )
        );

        let matchesBroadLocation = (
          (
            ( filtersToApply.location.city.boston !== false )
            && ( home.cardinalDirection === null )
          )
          || (
            ( filtersToApply.location.city.beyondBoston !== false )
            && ( home.cardinalDirection !== null )
          )
        );

        let matchesNarrowLocation = (
          ( home.cardinalDirection === null )
            ? (
              hasOwnProperty( filtersToApply.location.neighborhood, home.neighborhood )
              && ( filtersToApply.location.neighborhood[home.neighborhood] === true )
            )
            : (
              hasOwnProperty( filtersToApply.location.cardinalDirection, home.cardinalDirection )
              && ( filtersToApply.location.cardinalDirection[home.cardinalDirection] === true )
            )
        );

        const unitBedroomSizes = home.units.map( ( unit ) => unit.bedrooms ).sort();
        let matchesBedrooms = (
          (
            ( filtersToApply.bedrooms['0'] === true )
            && ( unitBedroomSizes.indexOf( 0 ) !== -1 )
          )
          || (
            ( filtersToApply.bedrooms['1'] === true )
            && ( unitBedroomSizes.indexOf( 1 ) !== -1 )
          )
          || (
            ( filtersToApply.bedrooms['2'] === true )
            && ( unitBedroomSizes.indexOf( 2 ) !== -1 )
          )
          || (
            ( filtersToApply.bedrooms['3'] === true )
            && ( unitBedroomSizes.indexOf( 3 ) !== -1 )
          )
          || (
            filtersToApply.bedrooms['4+']
            && ( unitBedroomSizes[unitBedroomSizes.length - 1] >= 4 )
          )
        );

        let matchesRentalPrice;

        if (
          !( ( filtersToApply.rentalPrice.lowerBound === 0 ) && ( filtersToApply.rentalPrice.upperBound === 0 ) )
          && (
            ( home.offer === 'rent' )
            || ( home.type === 'apt' )
          )
        ) {
          let rentalPriceLowerBound;
          let rentalPriceUpperBound;

          if ( filtersToApply.rentalPrice.lowerBound > filtersToApply.rentalPrice.upperBound ) {
            rentalPriceLowerBound = filtersToApply.rentalPrice.upperBound;
            rentalPriceUpperBound = filtersToApply.rentalPrice.lowerBound;
          } else {
            rentalPriceLowerBound = filtersToApply.rentalPrice.lowerBound;
            rentalPriceUpperBound = filtersToApply.rentalPrice.upperBound;
          }

          const unitsWithinPriceRange = home.units.filter( ( unit ) => (
            // ( unit.priceRate === 'monthly' )
            ( unit.price >= rentalPriceLowerBound )
              && ( unit.price <= rentalPriceUpperBound )
          ) );

          matchesRentalPrice = !!unitsWithinPriceRange.length;
        } else {
          matchesRentalPrice = true;
        }

        const dedupedAmi = new Set( home.units.map( ( unit ) => unit.amiQualification ) );
        const unitAmiQualifications = Array.from( dedupedAmi );
        let matchesAmiQualification;

        if ( home.incomeRestricted === false ) {
          matchesAmiQualification = true;
        } else {
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
        }

        if ( matchOnNoneSelected ) {
          if ( !filtersToApply.offer.rent && !filtersToApply.offer.sale ) {
            matchesOffer = true;
          }

          if ( !filtersToApply.location.city.boston && !filtersToApply.location.city.beyondBoston ) {
            matchesBroadLocation = true;
            matchesNarrowLocation = true;
          }

          if ( !filtersToApply.bedrooms['0'] && !filtersToApply.bedrooms['1'] && !filtersToApply.bedrooms['2'] && !filtersToApply.bedrooms['3'] && !filtersToApply.bedrooms['4+'] ) {
            matchesBedrooms = true;
          }
        }

        return (
          matchesOffer
          && matchesBroadLocation
          && matchesNarrowLocation
          && matchesBedrooms
          && matchesAmiQualification
          && matchesRentalPrice
        );
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

  const getAllHomes = () => {
    if ( paginatedHomes.length ) {
      return paginatedHomes.reduce( ( pageA, pageB ) => pageA.concat( pageB ) );
    }

    return [];
  };

  useEffect( () => {
    if ( !getAllHomes().length ) {
      fetch(
        apiEndpoint,
        {
          "mode": "cors",
          "headers": {
            "Content-Type": "application/json",
          },
        },
      ) // TODO: CORS
        .then( async ( response ) => {
          // console.log( {
          //   "responseBody": response.body,
          // } );

          if ( !response.body && !response._bodyInit ) {
            // if ( isDev() ) {
            //   console.warn( 'API returned an invalid response; falling back to test data since we’re in a development environment.' );

            //   return import( './test-data' )
            //     .then( ( json ) => json.default );
            // }

            throw new Error( `Metrolist Developments API returned an invalid response.` );
          } else {
            return response.json();
          }
        } )
        .then( ( apiHomes ) => {
          const paginatedApiHomes = paginate( apiHomes );
          const listingCounts = getListingCounts( apiHomes );
          const existingFilters = localStorage.getItem( 'filters' );
          const requestedPage = parseInt( query.get( 'page' ), 10 );
          let newFilters;

          // setAllHomes( apiHomes );
          setPaginatedHomes( paginatedApiHomes );
          // setCurrentHomes( paginatedApiHomes[0] );

          if ( requestedPage ) {
            setCurrentPage( requestedPage );
          } else {
            setCurrentPage( 1 );
          }

          setTotalPages( paginatedApiHomes.length );

          if ( existingFilters ) {
            newFilters = { ...JSON.parse( existingFilters ) };
          } else {
            newFilters = { ...filters };
          }

          Object.keys( listingCounts.location.neighborhood ).forEach( ( nb ) => {
            newFilters.location.neighborhood[nb] = ( newFilters.location.neighborhood[nb] || null );
          } );

          Object.keys( listingCounts.location.cardinalDirection ).forEach( ( cd ) => {
            newFilters.location.cardinalDirection[cd] = ( newFilters.location.cardinalDirection[cd] || null );
          } );

          // if ( existingFilters.rentalPrice.lowerBound ) {
          //   newFilters.rentalPrice.lowerBound = existingFilters.rentalPrice.lowerBound;
          // }

          // if ( existingFilters.rentalPrice.upperBound ) {
          //   newFilters.rentalPrice.upperBound = existingFilters.rentalPrice.upperBound;
          // }

          setFilters( newFilters );
          localStorage.setItem( 'filters', JSON.stringify( newFilters ) );
        } )
        .catch( ( error ) => {
          console.error( error );
        } );
    }

    let isResizing = false;

    window.addEventListener( 'resize', ( /* event */ ) => {
      if ( !isResizing ) {
        isResizing = true;

        setTimeout( () => {
          setIsDesktop( window.matchMedia( '(min-width: 992px)' ).matches );
          isResizing = false;
        }, 125 );
      }
    } );
  }, [] );

  useEffect( () => {
    const allHomes = getAllHomes();

    if ( !allHomes.length ) {
      return;
    }

    const filteredAllHomes = filterHomes( allHomes, filters );
    const paginatedFilteredHomes = paginate( filteredAllHomes );
    const currentPageFilteredHomes = paginatedFilteredHomes[currentPage - 1];

    // console.log( {
    //   filteredAllHomes,
    //   paginatedFilteredHomes,
    //   // currentPageFilteredHomes,
    //   "currentPage - 1": currentPage - 1,
    // } );

    setFilteredHomes( currentPageFilteredHomes );
    setTotalPages( paginatedFilteredHomes.length );
  }, [paginatedHomes, filters, currentPage] );

  // useEffect( () => {
  //   if ( currentPage === 1 ) {
  //     history.push( location.pathname );
  //   } else {
  //     history.push( `${location.pathname}?page=${currentPage}` );
  //   }
  // }, [currentPage] );

  useEffect( () => {
    setPages( Array.from( { "length": totalPages }, ( v, k ) => k + 1 ) );
  }, [totalPages] );

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
          case 'rentalPrice':
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
    setCurrentPage( 1 );
    localStorage.setItem( 'filters', JSON.stringify( newFilters ) );
  };

  const updateDrawerHeight = ( drawerRef, wait ) => {
    // console.log( 'updateDrawerHeight' );

    const updateHeight = () => {
      if ( drawerRef && drawerRef.current ) {
        const height = getComputedStyle( drawerRef.current ).getPropertyValue( 'height' );

        if ( height !== '0px' ) {
          drawerRef.current.style.height = height;
        }
      }

      setUpdatingDrawerHeight( false );
    };

    if ( wait ) {
      setTimeout( updateHeight, wait );
    } else {
      updateHeight();
    }
  };

  const handleHomesLoaded = () => {
    // updateDrawerHeight( $drawer );
  };

  const supportsSvg = ( typeof SVGRect !== "undefined" );

  const FiltersPanelUi = (
    <FiltersPanel
      key="filters-panel"
      className="ml-search__filters"
      drawerRef={ $drawer }
      filters={ filters }
      listingCounts={ getListingCounts( getAllHomes() ) }
      updateDrawerHeight={ updateDrawerHeight }
      updatingDrawerHeight={ updatingDrawerHeight }
      setUpdatingDrawerHeight={ setUpdatingDrawerHeight }
      handleFilterChange={ handleFilterChange }
    />
  );

  const isBeingTranslated = isOnGoogleTranslate();
  const baseUrl = ( isBeingTranslated ? document.querySelector( 'base' ).getAttribute( 'href' ).replace( /\/metrolist\/.*/, '' ) : globalThis.location.origin );
  const relativeAmiEstimatorUrl = '/metrolist/ami-estimator';
  const absoluteAmiEstimatorUrl = `${baseUrl}${relativeAmiEstimatorUrl}`;
  const amiEstimatorUrl = ( isBeingTranslated ? copyGoogleTranslateParametersToNewUrl( absoluteAmiEstimatorUrl ) : relativeAmiEstimatorUrl );

  const CalloutUi = (
    <Inset key="ami-estimator-callout" className="filters-panel__callout-container" until="large">
      <Callout
        className={ `${supportsSvg ? 'ml-callout--icon-visible ' : ''}filters-panel__callout` }
        as="a"
        href={ amiEstimatorUrl }
        target={ isBeingTranslated ? '_blank' : undefined }
      >
        <Callout.Heading as="span">Use our AMI Estimator to find homes that match your income</Callout.Heading>
        <Callout.Icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            className="ml-icon ml-icon--rightward-arrowhead"
            viewBox="0 0 10.842 18.615"
            width="11"
            height="19"
          >
            <title>&gt;</title>
            <path
              d="m0.93711 17.907c2.83-2.8267 5.66-5.6533 8.49-8.48-2.9067-2.9067-5.8133-5.8133-8.72-8.72"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth="2"
            ></path>
          </svg>
        </Callout.Icon>
      </Callout>
    </Inset>
  );
  const SidebarUi = [FiltersPanelUi, CalloutUi];

  return (
    <article className={ `ml-search${props.className ? ` ${props.className}` : ''}` }>
      <h2 className="sr-only">Search</h2>
      <Row space="panel" stackUntil="large">
        <Stack data-column-width="1/3" space="panel">
          { isDesktop ? SidebarUi.reverse() : SidebarUi }
        </Stack>
        <ResultsPanel
          className="ml-search__results"
          columnWidth="2/3"
          filters={ filters }
          homes={ filteredHomes }
          // homes={ ( filteredHomes && filteredHomes.length ) ? filteredHomes : getAllHomes() }
          handleHomesLoaded={ handleHomesLoaded }
        />
      </Row>
      <nav className="ml-search__pagination">
        <h3 className="sr-only">Pages</h3>
        <Row className="pg" space="panel">{
          pages.map( ( pageNumber, index ) => {
            const isCurrentPage = ( currentPage === pageNumber );

            return (
              <span className="pg-li ml-search__page-link-container" key={ index }>
                <Link
                  className={ `pg-li-i pg-li-i--link${isCurrentPage ? ' pg-li-i--a ' : ' '}ml-search__page-link` }
                  to={ ( pageNumber > 1 ) ? `${location.pathname}?page=${pageNumber}` : location.pathname }
                  aria-label={ `Search Results: Page ${pageNumber}` }
                >{ pageNumber }</Link>
              </span>
            );
          } )
        }</Row>
      </nav>
    </article>
  );
}

Search.propTypes = {
  "amiEstimation": PropTypes.number,
  "filters": filtersObject,
  "homes": PropTypes.arrayOf( homeObject ),
  "className": PropTypes.string,
};

let savedFilters = localStorage.getItem( 'filters' );
if ( savedFilters ) {
  savedFilters = JSON.parse( savedFilters );
}

let useAmiRecommendationAsLowerBound = localStorage.getItem( 'useAmiRecommendationAsLowerBound' );
if ( useAmiRecommendationAsLowerBound ) {
  useAmiRecommendationAsLowerBound = ( useAmiRecommendationAsLowerBound === 'true' );

  if ( useAmiRecommendationAsLowerBound ) {
    savedFilters.amiQualification.lowerBound = parseInt( localStorage.getItem( 'amiRecommendation' ), 10 );
    localStorage.setItem( 'useAmiRecommendationAsLowerBound', 'false' );
  }
}

Search.defaultProps = {
  "homes": [],
  "amiEstimation": null,
  "filters": savedFilters || {
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
      "lowerBound": 0,
      "upperBound": 200,
    },
    "rentalPrice": {
      "lowerBound": 0,
      "upperBound": 0,
    },
  },
};

export default Search;
