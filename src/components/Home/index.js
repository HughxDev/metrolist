import React from 'react';
import PropTypes from 'prop-types';

import Units from '@components/Units';
import HomeInfo from '@components/HomeInfo';

import { capitalize } from '@util/strings';
import { date, dateTime } from '@util/datetime';

import './Home.scss';

function Home( { home } ) {
  const {
    title, listingDate, applicationDueDate, assignment, city, neighborhood, type, units,
  } = home;

  return (
    <article className="cob-home">
      <div className="cob-home__content">
        <header className="cob-home__header">
          <h2 className="cob-home__title">{ title }</h2>
          <p className="cob-home__byline">{ [city, neighborhood, capitalize( type )].join( ' – ' ) }</p>
        </header>
        <Units units={ units } />
        <footer className="cob-home__footer">
          <HomeInfo
            className="cob-home-footer__home-info"
            info={ {
              listingDate,
              applicationDueDate,
              assignment,
            } }
          />
          <a className="cob-home-footer__more-info-link btn btn--700 btn--metrolist" href="#">More info</a>
        </footer>
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
    },
  ),
};

export default Home;
