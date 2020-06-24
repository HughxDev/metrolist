import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route,
} from 'react-router-dom';

import Search from '@components/Search';
import AmiEstimator from '@components/AmiEstimator';

import { resolveLocationConsideringGoogleTranslate } from '@util/a11y-seo';

import './Routes.scss';

function Routes( props ) {
  return (
    <Switch location={ resolveLocationConsideringGoogleTranslate() }>
      <Route path="/metrolist/search">
        <Search />
      </Route>
      <Route path="/metrolist/ami-estimator">
        <AmiEstimator googleTranslateLocation={ props.googleTranslateLocation } />
      </Route>
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
  "googleTranslateLocation": PropTypes.oneOfType( [PropTypes.object, PropTypes.string] ),
};

export default Routes;
