import React from 'react';
import {
  Switch, Route, useLocation,
} from 'react-router-dom';
import { slugify } from '@util/strings';

import Layout from '@components/Layout';
import AppHeader from '@components/AppHeader';
import Listings from '@components/Listings';
import AmiCalculator from '@components/AmiCalculator';

import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  const location = useLocation();

  console.log( location );

  return (
    <Layout className={ `ml-app${location.pathname ? ` ml-app--${slugify( location.pathname )}` : ''}` }>
      <AppHeader />
      <Switch>
        <Route path="/listings">
          <Listings />
        </Route>
        <Route path="/ami-calculator">
          <AmiCalculator />
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
    </Layout>
  );
}

export default App;
