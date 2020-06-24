import React from 'react';

import { slugify } from '@util/strings';
import { isOnGoogleTranslate, resolveLocationConsideringGoogleTranslate } from '@util/a11y-seo';

import Layout from '@components/Layout';
import AppHeader from '@components/AppHeader';
import Routes from '@components/Routes';

// import '@patterns/stylesheets/public.css';
import './App.scss';


function App() {
  const location = resolveLocationConsideringGoogleTranslate();
  const baselessPathname = location.pathname.replace( /^\/metrolist\//, '/' );
  const isBeingTranslated = isOnGoogleTranslate();
  let rootPathSlug;

  if ( baselessPathname.lastIndexOf( '/' ) === 0 ) {
    rootPathSlug = slugify( baselessPathname );
  } else {
    rootPathSlug = slugify( baselessPathname.substring( 0, baselessPathname.lastIndexOf( '/' ) ) );
  }

  // Make sure that localStorage.amiRecommendation is a valid number value.
  let amiRecommendation = parseInt( localStorage.getItem( 'amiRecommendation' ), 10 );
  if ( Number.isNaN( amiRecommendation ) || ( Math.sign( amiRecommendation ) < 1 ) ) {
    localStorage.setItem( 'amiRecommendation', '0' );
    amiRecommendation = 0;
  }

  // Fix CORS issue with history.push routing inside of Google Translate
  if ( isBeingTranslated ) {
    const $base = document.querySelector( 'base[href]' );

    if ( $base ) {
      $base.href = window.location.origin;
    }
  }

  return (
    <Layout className={ `ml-app ml-app--${rootPathSlug}` }>
      <AppHeader />
      <Routes />
    </Layout>
  );
}

export default App;
