import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Layout from '@components/Layout';
import AppHeader from '@components/AppHeader';
import Listings from '@components/Listings';
import AmiCalculator from '@components/AmiCalculator';

import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  return (
    <Layout className="ml-app">
      <AppHeader />
      <Router>
        <Switch>
          <Route path="/listings">
            <Listings />
          </Route>
          <Route path="/ami">
            <AmiCalculator />
          </Route>
          <Route path="/">
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
      </Router>
    </Layout>
  );
}

export default App;
