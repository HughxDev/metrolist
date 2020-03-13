import React from 'react';

import Layout from '@components/Layout';
import Homepage from '@components/Homepage';

import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  return (
    <Layout>
      <Homepage />
    </Layout>
  );
}

export default App;
