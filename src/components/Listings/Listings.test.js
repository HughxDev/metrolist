import '__mocks__/matchMedia';
import React from 'react';
import {
  render, fireEvent, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Listings from './index';
import testData from './test-data.json';

describe( 'Listings', () => {
  it( 'renders', () => {
    const { getByText, findByText } = render( <Listings /> );
    const FiltersPanel = getByText( 'Filter Listings' );
    const ResultsPanel = getByText( 'Results' );

    expect( FiltersPanel ).toBeInTheDocument();
    expect( ResultsPanel ).toBeInTheDocument();
  } );

  // it( 'filters', () => {
  //   // fireEvent.change();
  // } );
} );
