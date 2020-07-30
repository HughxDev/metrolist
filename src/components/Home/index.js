import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import UnitGroup from '@components/UnitGroup';
import HomeInfo from '@components/HomeInfo';
import Button from '@components/Button';
import Stack from '@components/Stack';
import Row from '@components/Row';

import { homeObject } from '@util/validation';
import { generateRandomNumberString } from '@util/strings';
import { isLiveDev } from '@util/dev';
import { isOnGoogleTranslate, copyGoogleTranslateParametersToNewUrl } from '@util/translation';
import { getGlobalThis } from '@util/objects';

import './Home.scss';
import { capitalCase } from 'change-case';

const globalThis = getGlobalThis();

function wasJustListed( listingDate, unitOfTime = 'hours', newnessThreshold = 48 ) {
  // testing:
  // return true;

  const now = moment();
  const then = moment( listingDate );
  const diff = now.diff( then, unitOfTime );

  if ( diff <= newnessThreshold ) {
    return true;
  }

  return false;
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
  if ( !type ) {
    return type;
  }

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

function serializeFiltersToUrlParams( filters, home ) {
  // /metrolist/search/listing/275-roxbury-street?ami=30-120&bedrooms=1+2&type=rent
  // /metrolist/search/listing/{slug}?ami={ami_low}-{ami_high}&bedrooms={num_beds}+{num_beds}&type={offer}
  const params = [];
  const { amiQualification, bedrooms } = filters;

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

  // Since single developments can be split into two virtual “homes” by the API, then
  // we need to tell the Property Page which version of a home it should display when
  // the user clicks on More Info.
  if ( home ) {
    if ( home.offer ) {
      params.push( `type=${home.offer}` );
    }

    if ( home.assignment ) {
      params.push( `assignment=${home.assignment}` );
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

  let containsUnitWhereRentalPriceIsPercentageOfIncome = false;
  let percentageOfIncomeExplanationId = '';

  for ( let index = 0; index < units.length; index++ ) {
    const unit = units[index];

    if (
      ( unit.price === null )
      || ( unit.price === 'null' )
    ) {
      containsUnitWhereRentalPriceIsPercentageOfIncome = true;
      percentageOfIncomeExplanationId = `rental-price-percentage-income-explanation-${generateRandomNumberString()}`;
      break;
    }
  }

  const isBeingTranslated = isOnGoogleTranslate();
  let baseUrl;

  if ( isBeingTranslated ) {
    baseUrl = document.querySelector( 'base' ).getAttribute( 'href' ).replace( /\/metrolist\/.*/, '' );

    if ( isLiveDev( baseUrl ) ) {
      baseUrl = 'https://d8-dev.boston.gov';
    }
  } else if ( isLiveDev() ) {
    baseUrl = 'https://d8-dev.boston.gov';
  } else {
    baseUrl = globalThis.location.origin;
  }

  const relativePropertyPageUrl = `/metrolist/search/housing/${slug}/${serializeFiltersToUrlParams( filters, home )}`;
  const absolutePropertyPageUrl = `${baseUrl}${relativePropertyPageUrl}`;
  const propertyPageUrl = ( isBeingTranslated ? copyGoogleTranslateParametersToNewUrl( absolutePropertyPageUrl ) : absolutePropertyPageUrl );

  return (
    <article className="ml-home">
      <div className="ml-home__content">
        <Stack space="home-header">
          <header className="ml-home__header">
            <Stack space="home-header">
              <Row>
                <h4 className="ml-home__title" data-column-width="3/4">{ title }</h4>
                { renderJustListed( listingDate ) }
              </Row>
              <p className="ml-home__byline">{
                [city, neighborhood, renderOffer( offer ), renderType( type )]
                  .filter( ( item ) => !!item )
                  .join( ' – ' )
              }</p>
            </Stack>
          </header>
          <UnitGroup units={ units } percentageOfIncomeExplanationId={ percentageOfIncomeExplanationId } />
          {
            containsUnitWhereRentalPriceIsPercentageOfIncome
              && (
                <p id={ percentageOfIncomeExplanationId } className="ml-home__rental-price-percentage-income-explanation">
                  <span aria-hidden="true">**</span> Rent is determined by the administering agency based on household income.
                </p>
              )
          }
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
            href={ propertyPageUrl }
            target={ isBeingTranslated ? '_blank' : undefined }
            aria-label={ `More info about ${title}` }
          >More info</Button>
        </Row>
      </div>
    </article>
  );
}

Home.propTypes = {
  "home": homeObject,
  "filters": PropTypes.object,
};

export default Home;
