import '__mocks__/matchMedia';
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Component from './index';

describe( 'Component', () => {
  afterEach( cleanup );

  it( 'renders', () => {
    throw new Error( 'Test missing' );
  } );
} );
