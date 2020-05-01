import '__mocks__/matchMedia';
import React from 'react';
import {
  render, fireEvent, getByPlaceholderText, queryByPlaceholderText, queryByLabelText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { MemoryRouter } from 'react-router-dom';
import AmiEstimator from './index';
import Routes from '../Routes';

describe( 'AmiEstimator', () => {
  const steps = AmiEstimator.WrappedComponent.defaultProps.steps.map( ( step ) => step.component.displayName );

  it( 'Renders', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/ami-estimator']} initialIndex={0}>
        <Routes />
      </MemoryRouter>,
    );
    getByText( /Step [0-9]+ of [0-9]+/ );
  } );

  it( 'Warns about missing input', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter initialEntries={['/ami-estimator']} initialIndex={0}>
        <Routes />
      </MemoryRouter>,
    );
    const nextButton = getByText( 'Next' );
    const errorMessage = getByRole( 'alert' );

    fireEvent.click( nextButton );

    expect( errorMessage ).toHaveTextContent( 'There were errors in your submission.' );
  } );

  it( 'Navigates between steps', () => {
    const {
      getByText, getByRole, getByLabelText, queryByPlaceholderText, queryByLabelText,
    } = render(
      <MemoryRouter initialEntries={['/ami-estimator']} initialIndex={0}>
        <Routes />
      </MemoryRouter>,
    );
    const nextButton = getByText( 'Next' );
    let firstStepInput;
    let secondStepInput;

    switch ( steps[0] ) {
      case 'HouseholdSize':
        firstStepInput = getByLabelText( '4' );
        break;

      case 'HouseholdIncome':
        firstStepInput = getByPlaceholderText( '$0.00' );
        break;

      case 'Disclosure':
        firstStepInput = getByLabelText( 'I have read and understand the above statement.' );
        break;

      default:
    }

    fireEvent.click( firstStepInput );
    fireEvent.click( nextButton );

    switch ( steps[1] ) {
      case 'HouseholdSize':
        secondStepInput = queryByLabelText( '4' );
        break;

      case 'HouseholdIncome':
        secondStepInput = queryByPlaceholderText( '$0.00' );
        break;

      case 'Disclosure':
        secondStepInput = queryByLabelText( 'I have read and understand the above statement.' );
        break;

      default:
    }

    expect( secondStepInput ).toBeVisible();
    expect( queryByLabelText( '4' ) ).not.toBeInTheDocument();
  } );

  // it( 'Returns to the previous step', () => {

  // } );
} );
