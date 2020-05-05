import React from 'react';
import { slugify } from '@util/strings';
import { useLocation } from 'react-router-dom';
import Layout from '@components/Layout';
import AppHeader from '@components/AppHeader';
import Routes from '@components/Routes';

// import '@patterns/stylesheets/public.css';
import './App.scss';

function App() {
  const location = useLocation();
  let rootPathSlug;

  if ( location.pathname.lastIndexOf( '/' ) === 0 ) {
    rootPathSlug = slugify( location.pathname );
  } else {
    rootPathSlug = slugify( location.pathname.substring( 0, location.pathname.lastIndexOf( '/' ) ) );
  }

  return (
    <Layout className={ `ml-app${location.pathname ? ` ml-app--${rootPathSlug}` : ''}` }>
      <AppHeader />
      <Routes />
    </Layout>
  );
}

export default App;
