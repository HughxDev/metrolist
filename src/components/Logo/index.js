import React from 'react';
import metrolistLogo from './metrolist-logo.png';

export default function Logo( props ) {
  console.error( 'Using placeholder Metrolist logo; please update with SVG' );

  return (
    <img
      src={ metrolistLogo }
      alt="Metrolist"
      { ...props }
    />
  );
}
