import React from 'react';
import { render } from '@testing-library/react';
import Scale from './index';

it( 'Renders', () => {
  render( <Scale values="1,2,3,4,5" /> );
} );
