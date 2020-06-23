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

  // Fix for Google Translate iframe shenanigans
  let metrolistUrlBeingTranslated = '/';

  if ( ( location.pathname === '/translate_c' ) && location.search.length ) {
    // isBeingTranslated = true;
    const filteredQueryParameters = location.search.split( '&' ).filter( ( item ) => item.indexOf( '/metrolist/' ) !== -1 );

    if ( filteredQueryParameters.length ) {
      const metrolistSubroute = filteredQueryParameters[0].replace( /[a-z]+=https?:\/\/[^/]+\/metrolist\/(.*)/i, '$1' );

      metrolistUrlBeingTranslated += metrolistSubroute;
    }
  }

  return (
    <Switch>
      <Route path="/metrolist/search">
        <Search />
      </Route>
      <Route path="/metrolist/ami-estimator">
        <AmiEstimator />
      </Route>
      <Route path="/translate_c" render={ () => (
        <Redirect push to={ metrolistUrlBeingTranslated } />
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
