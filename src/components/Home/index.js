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

    default:
      return capitalCase( type );
  }
}

// function serializeFiltersToUrlParams( filters ) {
//   // /metrolist/search/listing/275-roxbury-street?ami=30-120&bedrooms=1+2&type=rent
//   const params = [];
//   const {
//     amiQualification, bedrooms, location, offer,
//   } = filters;

//   if ( amiQualification ) {
//     let amiParam = 'ami=';

//     if ( amiQualification.lowerBound ) {
//       amiParam += amiQualification.lowerBound;
//     }

//     if ( amiQualification.upperBound ) {
//       amiParam += amiQualification.upperBound;
//     }
//   }
// }

function Home( props ) {
  const { home } = props;
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

  console.log( 'props.filters', props.filters );

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
            data-href={ `listing/${slug}` }
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
