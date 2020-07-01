import '__mocks__/matchMedia';
import React from 'react';
import {
  render, act, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { MemoryRouter } from 'react-router-dom';
import AmiEstimator from './index';
import Routes from '../Routes';

// jest.useFakeTimers();

describe( 'AmiEstimator', () => {
  beforeAll( () => {
    jest.useFakeTimers();
  } );

  afterAll( () => {
    jest.useRealTimers();
  } );

  const steps = AmiEstimator.WrappedComponent.defaultProps.steps.map( ( step ) => step.component.displayName );

  it( 'Renders', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/metrolist/ami-estimator']} initialIndex={0}>
        <Routes />
      </MemoryRouter>,
    );
    getByText( /Step [0-9]+ of [0-9]+/ );
  } );

  it( 'Warns about missing input', () => {
    const { getByText, getByRole } = render(
      <MemoryRouter initialEntries={['/metrolist/ami-estimator']} initialIndex={0}>
        <Routes />
      </MemoryRouter>,
    );
    const nextButton = getByText( 'Next' );
    const errorMessage = getByRole( 'alert' );

    act( () => {
      fireEvent.click( nextButton );
    } );

    expect( errorMessage ).toHaveTextContent( 'There were errors in your submission.' );
  } );

  it( 'Navigates between steps', async () => {
    const {
      getByText, getByLabelText, queryByTestId, getByPlaceholderText,
    } = render(
      <MemoryRouter initialEntries={['/metrolist/ami-estimator']} initialIndex={0}>
        <Routes />
      </MemoryRouter>,
    );
    const nextButton = getByText( 'Next' );
    const previousButton = getByText( 'Back' );
    let firstStep;
    let firstStepInput;

    switch ( steps[0] ) {
      case 'HouseholdSize':
        firstStep = () => queryByTestId( 'ml-ami-estimator__household-size' );
        firstStepInput = getByLabelText( '4' );
        break;

      case 'HouseholdIncome':
        firstStep = () => queryByTestId( 'ml-ami-estimator__household-income' );
        firstStepInput = getByPlaceholderText( '$0.00' );
        break;

      case 'Disclosure':
        firstStep = () => queryByTestId( 'ml-ami-estimator__disclosure' );
        firstStepInput = getByLabelText( 'I have read and understand the above statement.' );
        break;

      default:
    }

    act( () => {
      fireEvent.click( firstStepInput );
      fireEvent.click( nextButton );
      jest.advanceTimersByTime( 1000 );
    } );

    let secondStep;

    switch ( steps[1] ) {
      case 'HouseholdSize':
        secondStep = () => queryByTestId( 'ml-ami-estimator__household-size' );
        break;

      case 'HouseholdIncome':
        secondStep = () => queryByTestId( 'ml-ami-estimator__household-income' );
        break;

      case 'Disclosure':
        secondStep = () => queryByTestId( 'ml-ami-estimator__disclosure' );
        break;

      default:
    }

    expect( firstStep() ).not.toBeInTheDocument();
    expect( secondStep() ).toBeInTheDocument();

    act( () => {
      fireEvent.click( previousButton );
      jest.advanceTimersByTime( 1000 );
    } );

    expect( firstStep() ).toBeInTheDocument();
    expect( secondStep() ).not.toBeInTheDocument();
  } );
} );
