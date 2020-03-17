import React from 'react';

import Layout from '@components/Layout';
import Listings from '@components/Listings';

import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  return (
    <Layout>
      <Listings />
    </Layout>
  );
}

export default App;
