import React from 'react';
import PropTypes from 'prop-types';

import Layout from '../Layout';
import Metrolist from '../Metrolist';

import './App.scss';

function App( props ) {
  return (
    <Layout>
      <Metrolist />
    </Layout>
  );
}

App.propTypes = {
  "children": PropTypes.node,
};

export default App;
