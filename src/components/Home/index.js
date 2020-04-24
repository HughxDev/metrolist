import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import UnitGroup from '@components/UnitGroup';
import HomeInfo from '@components/HomeInfo';
import Button from '@components/Button';
import Stack from '@components/Stack';
import Row from '@components/Row';

import { capitalize } from '@util/strings';
import { date, dateTime } from '@util/datetime';

import './Home.scss';

function wasJustListed( listingDate, unitOfTime = 'days', newnessThreshold = 1 ) {
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
    return <b className="ml-home__just-listed">Just listed!</b>;
  }

  return null;
}

function Home( { home } ) {
  const {
    title, listingDate, incomeRestricted, applicationDueDate, assignment, city, neighborhood, type, units,
  } = home;

  return (
    <article className="ml-home">
      <div className="ml-home__content">
        <Stack space="home-header">
          <header className="ml-home__header">
            <Stack space="home-header">
              <h2 className="ml-home__title">{ title }</h2>
              <p className="ml-home__byline">{ [city, neighborhood, capitalize( type )].join( ' – ' ) }</p>
              { renderJustListed( listingDate ) }
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
            href="#"
          >More info</Button>
        </Row>
      </div>
    </article>
  );
}

Home.propTypes = {
  "home": PropTypes.shape(
    {
      "title": PropTypes.string,
      "listingDate": dateTime,
      "applicationDueDate": date,
      "assignment": PropTypes.oneOf( [null, 'lottery', 'waitlist'] ),
      "city": PropTypes.string,
      "neighborhood": PropTypes.string,
      "type": PropTypes.oneOf( ['apartment', 'house'] ),
      "offer": PropTypes.oneOf( ['rental', 'sale'] ),
      "units": PropTypes.arrayOf( PropTypes.object ),
      "incomeRestricted": PropTypes.bool,
    },
  ),
};

export default Home;
