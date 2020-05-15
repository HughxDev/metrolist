import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import UnitGroup from '@components/UnitGroup';
import HomeInfo from '@components/HomeInfo';
import Button from '@components/Button';
import Stack from '@components/Stack';
import Row from '@components/Row';

// import { capitalize } from '@util/strings';
import { date, dateTime } from '@util/datetime';
import { homeObjectDefinition } from '@util/validation';

import './Home.scss';
import { capitalCase } from 'change-case';

function wasJustListed( listingDate, unitOfTime = 'days', newnessThreshold = 1 ) {
  // testing:
  return true;

  // const now = moment();
  // const then = moment( listingDate );
  // const diff = now.diff( then, unitOfTime );

  // if ( diff <= newnessThreshold ) {
  //   return true;
  // }

  // return false;
}

function renderJustListed( listingDate ) {
  if ( wasJustListed( listingDate ) ) {
    return <b className="ml-home__just-listed" data-column-width="1/4">Just listed!</b>;
  }

  return null;
}

function renderOffer( offer ) {
  offer = offer.toLowerCase();

  switch ( offer ) {
    case 'rental':
      return 'For Rent';

    case 'sale':
      return 'For Sale';

    default:
      return null;
  }
}

function renderType( type ) {
  type = type.toLowerCase();

  switch ( type ) {
    case 'apt':
      return 'Apartment';

    case 'sro':
      return 'Single Room Occupancy';

    case 'condo':
      return 'Condominium';

    case 'multi-family':
      return 'Multi-family';

    default:
      return capitalCase( type );
  }
}

function serializeFiltersToUrlParams( filters ) {
  // /metrolist/search/listing/275-roxbury-street?ami=30-120&bedrooms=1+2&type=rent
  // /metrolist/search/listing/{slug}?ami={ami_low}-{ami_high}&bedrooms={num_beds}+{num_beds}&type={offer}
  const params = [];
  const {
    amiQualification, bedrooms, offer,
  } = filters;

  if ( amiQualification ) {
    let amiParam = 'ami=';

    if ( amiQualification.lowerBound ) {
      amiParam += amiQualification.lowerBound;
    } else {
      amiParam += '0';
    }

    amiParam += '-';

    if ( amiQualification.upperBound ) {
      amiParam += amiQualification.upperBound;
    } else {
      amiParam += '200';
    }

    if ( amiParam !== 'ami=0-200' ) {
      params.push( amiParam );
    }
  }

  if ( bedrooms ) {
    let bedroomsParam = 'bedrooms=';
    let preferredBedroomSizeCount = 0;

    Object.keys( bedrooms ).forEach( ( bedroomSize, index ) => {
      const bedroomSizeToggled = bedrooms[bedroomSize];

      if ( bedroomSizeToggled ) {
        if ( ( index > 0 ) && ( preferredBedroomSizeCount > 0 ) ) {
          bedroomsParam += '+';
        }

        preferredBedroomSizeCount++;
        bedroomsParam += bedroomSize.replace( /\+/g, '' ); // TODO: Question for Alex: does 4 work for 4+?
      }
    } );

    if ( preferredBedroomSizeCount ) {
      params.push( bedroomsParam );
    }
  }

  if ( offer ) {
    let offerParam = 'type=';

    if ( offer.rent ) {
      offerParam += 'rent';
    }

    if ( offer.rent && offer.sale ) {
      offerParam += '+';
    }

    if ( offer.sale ) {
      offerParam += 'sale';
    }

    if ( offerParam !== 'type=' ) {
      params.push( offerParam );
    }
  }

  if ( params.length ) {
    return `?${params.join( '&' )}`;
  }

  return '';
}

function Home( props ) {
  const { home, filters } = props;
  const {
    title,
    listingDate,
    incomeRestricted,
    applicationDueDate,
    assignment,
    city,
    neighborhood,
    type,
    units,
    offer,
    slug,
    // id,
    // url,
  } = home;

  return (
    <article className="ml-home">
      <div className="ml-home__content">
        <Stack space="home-header">
          <header className="ml-home__header">
            <Stack space="home-header">
              <Row>
                <h2 className="ml-home__title" data-column-width="3/4">{ title }</h2>
                { renderJustListed( listingDate ) }
              </Row>
              <p className="ml-home__byline">{
                [city, neighborhood, renderOffer( offer ), renderType( type )]
                  .filter( ( item ) => !!item )
                  .join( ' – ' )
              }</p>
            </Stack>
          </header>
          <UnitGroup units={ units } />
        </Stack>
        <Row as="footer" className="ml-home__footer" space="panel" stackUntil="small">{/* TODO: Should be home-info--two-column */}
          <HomeInfo
            className="ml-home-footer__home-info"
            info={ {
              listingDate,
              applicationDueDate,
              assignment,
              incomeRestricted,
            } }
          />
          <Button
            as="link"
            className="ml-home-footer__more-info-link"
            variant="primary"
            href={ `https://d8-ci.boston.gov/metrolist/search/listing/${slug}/${serializeFiltersToUrlParams( filters )}` }
          >More info</Button>
        </Row>
      </div>
    </article>
  );
}

Home.propTypes = {
  "home": homeObjectDefinition,
  "filters": PropTypes.object,
};

export default Home;
