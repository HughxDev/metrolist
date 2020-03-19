import React from 'react';

import Layout from '@components/Layout';
import Listings from '@components/Listings';
import AppHeader from '@components/AppHeader';

import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  return (
    <Layout className="ml-app">
      <AppHeader />
      <Listings />
    </Layout>
  );
}

export default App;
