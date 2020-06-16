import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import Search from '@components/Search';
import AmiEstimator from '@components/AmiEstimator';

import './Routes.scss';

function Routes( props ) {
  return (
    <Switch>
      <Route path="/(search|pklwqd)">
        <Search />
      </Route>
      <Route path="/(ami-estimator|rytxh)">
        <AmiEstimator />
      </Route>
      <Route exact path="/">
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
