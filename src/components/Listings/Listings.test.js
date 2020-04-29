import '__mocks__/matchMedia';
import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Listings from './index';
// import testData from './test-data.json';

describe( 'Listings', () => {
  afterEach( cleanup );

  it( 'Renders', () => {
    const { getByTestId } = render( <Listings /> );
    const FiltersPanel = getByTestId( 'ml-filters-panel' );
    const ResultsPanel = getByTestId( 'ml-results-panel' );

    expect( FiltersPanel ).toBeInTheDocument();
    expect( ResultsPanel ).toBeInTheDocument();
  } );

  describe( 'Filters', () => {
    const minimalHomeDefinition = {
      "title": "Home",
      "type": "apt",
      "offer": "rent",
      "listingDate": ( new Date() ).toISOString(),
      "units": [],
    };

    describe( 'Offer', () => {
      const homeToRent = {
        ...minimalHomeDefinition,
        "title": "Home 1",
        "offer": "rent",
      };
      const homeToBuy = {
        ...minimalHomeDefinition,
        "title": "Home 2",
        "offer": "sale",
      };

      it( 'Filters results to only homes for rent', () => {
        const homesToFilter = [homeToRent, homeToBuy];
        const { getByLabelText, queryByText } = render(
          <Listings
            homes={ homesToFilter }
            filters={
              {
                ...Listings.defaultProps.filters,
                "offer": {
                  "rent": false,
                  "sale": false,
                },
              }
            }
          />,
        );
        const forRentInput = getByLabelText( 'For Rent' );

        fireEvent.click( forRentInput );

        const homeToBeFilteredOut = queryByText( homeToBuy.title );

        expect( forRentInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );

      it( 'Filters results to only homes for sale', () => {
        const homesToFilter = [homeToRent, homeToBuy];
        const { getByLabelText, queryByText } = render(
          <Listings
            homes={ homesToFilter }
            filters={
              {
                ...Listings.defaultProps.filters,
                "offer": {
                  "rent": false,
                  "sale": false,
                },
              }
            }
          />,
        );
        const forSaleInput = getByLabelText( 'For Sale' );
        fireEvent.click( forSaleInput );
        const homeToBeFilteredOut = queryByText( homeToRent.title );

        expect( forSaleInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );
    } );

    describe( 'Location', () => {
      const homeWithinBoston = {
        ...minimalHomeDefinition,
        "title": "Home 1",
        "city": "Boston",
        "cardinalDirection": null,
      };
      const homeOutsideBoston = {
        ...minimalHomeDefinition,
        "title": "Home 2",
        "city": "Cambridge",
        "cardinalDirection": "west",
      };
      let noFiltersApplied;

      beforeEach( () => {
        noFiltersApplied = {
          "offer": {
            "rent": false,
            "sale": false,
          },
          "location": {
            "city": {
              "boston": false,
              "beyondBoston": false,
            },
            "neighborhood": {
              "southBoston": false,
              "hydePark": false,
              "dorchester": false,
              "mattapan": false,
            },
            "cardinalDirection": {
              "west": false,
              "north": false,
              "south": false,
            },
          },
          "bedrooms": {
            "0": false,
            "1": false,
            "2": false,
            "3": false,
            "4+": false,
          },
          "amiQualification": {
            "lowerBound": 30,
            "upperBound": 150,
          },
        };
      } );

      it( 'Filters results to only homes within Boston', () => {
        const homesToFilter = [homeWithinBoston, homeOutsideBoston];
        const { getByLabelText, queryByText } = render(
          <Listings
            homes={ homesToFilter }
            filters={ noFiltersApplied }
          />,
        );
        const bostonInput = getByLabelText( 'Boston' );
        fireEvent.click( bostonInput );
        const homeToBeFilteredOut = queryByText( homeOutsideBoston.title );

        expect( bostonInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );

      it( 'Filters results to only homes outside Boston', () => {
        const homesToFilter = [homeWithinBoston, homeOutsideBoston];
        const { getByLabelText, queryByText } = render(
          <Listings
            homes={ homesToFilter }
            filters={ noFiltersApplied }
          />,
        );
        const beyondBostonInput = getByLabelText( 'Beyond Boston' );
        fireEvent.click( beyondBostonInput );
        const homeToBeFilteredOut = queryByText( homeWithinBoston.title );

        expect( beyondBostonInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );

      it( 'Sets all subcategory checkboxes appropriately when the top-level checkboxes are toggled', () => {
        const { getByLabelText } = render( <Listings filters={ noFiltersApplied } /> );

        // Boston

        const bostonInput = getByLabelText( 'Boston' );
        const dotInput = getByLabelText( 'Dorchester' );
        const southieInput = getByLabelText( 'South Boston' );

        fireEvent.click( bostonInput );

        expect( bostonInput ).toBeChecked();
        expect( dotInput ).toBeChecked();
        expect( southieInput ).toBeChecked();

        fireEvent.click( bostonInput );

        expect( bostonInput ).not.toBeChecked();
        expect( dotInput ).not.toBeChecked();
        expect( southieInput ).not.toBeChecked();

        // Beyond Boston

        const beyondBostonInput = getByLabelText( 'Beyond Boston' );
        const westInput = getByLabelText( 'West of Boston' );
        const southInput = getByLabelText( 'South of Boston' );

        fireEvent.click( beyondBostonInput );

        expect( beyondBostonInput ).toBeChecked();
        expect( westInput ).toBeChecked();
        expect( southInput ).toBeChecked();

        fireEvent.click( beyondBostonInput );

        expect( beyondBostonInput ).not.toBeChecked();
        expect( westInput ).not.toBeChecked();
        expect( southInput ).not.toBeChecked();
      } );
    } );

    // Unit filtering

    describe( 'Bedrooms', () => {
      it( 'Filters by unit size', () => {

      } );
    } );

    describe( 'AMI Qualification', () => {

    } );
  } );
} );
