import React from 'react';
import PropTypes from 'prop-types';

import Units from '@components/Units';

import { capitalize } from '@util/strings';

import './Home.scss';

function Home( { home } ) {
  const {
    title, listingDate, applicationDueDate, assignment, city, neighborhood, type, units,
  } = home;

  return (
    <article className="cob-home">
      <header>
        <h2 className="cob-home__title">{ title }</h2>
        <p>{ [city, neighborhood, capitalize( type )].join( ' – ' ) }</p>
      </header>
      <Units units={ units } />
      <footer>
        <dl>
          <dt>Posted:</dt>
          <dd>{ listingDate }</dd>
          <dt>Income restricted:</dt>
          <dd>{ assignment }</dd>
          <dt>Application Due:</dt>
          <dd>{ applicationDueDate }</dd>
        </dl>
        <a href="#">More info</a>
      </footer>
    </article>
  );
}

Home.propTypes = {
  "home": PropTypes.shape(
    {
      "title": PropTypes.string,
      "listingDate": PropTypes.string,
      "applicationDueDate": PropTypes.string,
      "assignment": PropTypes.oneOf( ['lottery', 'waitlist'] ),
      "city": PropTypes.string,
      "neighborhood": PropTypes.string,
      "type": PropTypes.oneOf( ['apartment', 'house'] ),
      "offer": PropTypes.oneOf( ['rental', 'sale'] ),
      "units": PropTypes.arrayOf( PropTypes.object ),
    },
  ),
};

export default Home;
