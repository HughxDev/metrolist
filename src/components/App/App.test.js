import '__mocks__/matchMedia';
import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './index';

it( 'Renders', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
} );
