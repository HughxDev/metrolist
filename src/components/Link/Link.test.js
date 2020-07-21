import '__mocks__/matchMedia';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';

import Link from './index';

describe( 'Link', () => {
  it( 'renders', () => {
    render(
      <MemoryRouter>
        <Link to="/" />
      </MemoryRouter>,
    );
  } );
} );
