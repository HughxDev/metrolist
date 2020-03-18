import React from 'react';

import Layout from '@components/Layout';
import Listings from '@components/Listings';
import MetrolistHeader from '@components/MetrolistHeader';

import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  return (
    <Layout className="cob-app">
      <MetrolistHeader />
      <Listings />
    </Layout>
  );
}

export default App;
