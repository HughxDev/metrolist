import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, useLocation, Redirect,
} from 'react-router-dom';


import Search from '@components/Search';
import AmiEstimator from '@components/AmiEstimator';

import './Routes.scss';

function Routes( props ) {
  const location = useLocation();

  console.log( 'useLocationObject', location );
  console.log( 'window.location', window.location );
  console.log( 'window.parent', window.parent );

  let metrolistUrlBeingTranslated = '/metrolist/';
  // let isBeingTranslated = false;

  /*
    pathname: "/translate_c"
    search: "?depth=1&pto=aue&rurl=translate.google.com&sl=auto&sp=nmt4&tl=ja&u=https://metrolist.netlify.app/metrolist/search&usg=ALkJrhhsNi3jF5ynWyb-Ncz__3jCJj7CzQ"
  */

  if ( ( location.pathname === '/translate_c' ) && location.search.length ) {
    // isBeingTranslated = true;
    const filteredQueryParameters = location.search.split( '&' ).filter( ( item ) => item.indexOf( '/metrolist/' ) !== -1 );

    console.log( 'filteredQueryParameters', filteredQueryParameters );

    if ( filteredQueryParameters.length ) {
      const metrolistSubroute = filteredQueryParameters[0].replace( /[a-z]+=https?:\/\/[^/]+\/metrolist\/(.*)/i, '$1' );

      metrolistUrlBeingTranslated += metrolistSubroute;
    }
  }

  console.log( 'props', props );

  return (
    <Switch>
      <Route path="/metrolist/search">
        <Search />
      </Route>
      <Route path="/metrolist/ami-estimator">
        <AmiEstimator />
      </Route>
      <Route path="/translate_c" render={ () => (
        <Redirect to={ metrolistUrlBeingTranslated } />
      ) } />
      <Route exact path="/metrolist/">
        <article>
          <div className="hro hro--t">
            <div className="hro-c">
              <div className="hro-i hro-i--l">Welcome to the new</div>
              <h2 className="hro-t hro-t--l">Homepage</h2>
            </div>
          </div>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. In voluptatibus nisi minima obcaecati, at facilis, et quos maiores ad provident qui. Quos libero culpa ad. Alias corporis ipsum sequi commodi?</p>
        </article>
      </Route>
    </Switch>
  );
}

Routes.displayName = 'Routes';

Routes.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default Routes;
