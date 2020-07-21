import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Alert from './index';

describe( 'Alert', () => {
  it( 'renders', () => {
    render( <Alert /> );
  } );

  it( 'has the “alert” ARIA role', () => {
    const { getByRole } = render( <Alert /> );

    getByRole( 'alert', { "hidden": true } );
  } );

  it( 'supports variants', () => {
    const { getByRole } = render( <Alert variant="primary" /> );
    const alert = getByRole( 'alert', { "hidden": true } );

    expect( alert ).toHaveClass( 'ml-alert', 'ml-alert--primary' );
  } );

  it( 'inherits classNames from the parent', () => {
    const { getByRole } = render( <Alert className="test-class" /> );
    const alert = getByRole( 'alert', { "hidden": true } );

    expect( alert ).toHaveClass( 'ml-alert', 'test-class' );
  } );
} );
