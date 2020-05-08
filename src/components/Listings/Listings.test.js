import '__mocks__/matchMedia';
import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Listings from './index';

function generateFakeId() {
  return Math.round( Math.random() * 100000000 ).toString();
}

function getNoFiltersApplied() {
  return {
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
      "lowerBound": 0,
      "upperBound": 200,
    },
  };
}
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
    const studioUnit = {
      "id": "studio",
      "bedrooms": 0,
    };
    const oneBedroomUnit = {
      "id": "1br",
      "bedrooms": 1,
    };
    const twoBedroomUnit = {
      "id": "2br",
      "bedrooms": 2,
    };
    const threeBedroomUnit = {
      "id": "3br",
      "bedrooms": 3,
    };
    const fourBedroomUnit = {
      "id": "4br",
      "bedrooms": 4,
    };
    const aboveFourBedroomUnit = {
      "id": "4+br",
      "bedrooms": 10,
    };
    let noFiltersApplied = getNoFiltersApplied();

    beforeEach( () => {
      noFiltersApplied = getNoFiltersApplied();
    } );

    describe( 'Offer', () => {
      const homeToRent = {
        ...minimalHomeDefinition,
        "id": generateFakeId(),
        "title": "Home 1",
        "offer": "rent",
      };
      const homeToBuy = {
        ...minimalHomeDefinition,
        "id": generateFakeId(),
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
        "id": generateFakeId(),
        "title": "Home 1",
        "city": "Boston",
        "cardinalDirection": null,
      };
      const homeOutsideBoston = {
        ...minimalHomeDefinition,
        "id": generateFakeId(),
        "title": "Home 2",
        "city": "Cambridge",
        "cardinalDirection": "west",
      };

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

      it( 'Sets all neighborhood checkboxes appropriately when the “Boston” checkbox is toggled', () => {
        const { getByLabelText } = render( <Listings filters={ noFiltersApplied } /> );
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
      } );

      it( 'Sets all cardinal direction checkboxes appropriately when the “Beyond Boston” checkbox is toggled', () => {
        const { getByLabelText } = render( <Listings filters={ noFiltersApplied } /> );
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
        const homeWithUnitsForEveryBedroomSize = {
          ...minimalHomeDefinition,
          "id": generateFakeId(),
          "units": [
            studioUnit,
            oneBedroomUnit,
            twoBedroomUnit,
            threeBedroomUnit,
            fourBedroomUnit,
            aboveFourBedroomUnit,
          ],
        };
        const homesToFilter = [homeWithUnitsForEveryBedroomSize];
        const {
          getByLabelText, getByTestId, queryByTestId,
        } = render(
          <Listings
            homes={ homesToFilter }
            filters={ noFiltersApplied }
          />,
        );
        const zeroBedroomInput = getByLabelText( '0' );
        const twoBedroomInput = getByLabelText( '2' );
        const aboveFourBedroomInput = getByLabelText( '4+' );

        fireEvent.click( zeroBedroomInput );

        getByTestId( 'studio' );
        expect( queryByTestId( '1br' ) ).not.toBeInTheDocument();
        expect( queryByTestId( '2br' ) ).not.toBeInTheDocument();
        expect( queryByTestId( '3br' ) ).not.toBeInTheDocument();
        expect( queryByTestId( '4br' ) ).not.toBeInTheDocument();
        expect( queryByTestId( '4+br' ) ).not.toBeInTheDocument();

        fireEvent.click( zeroBedroomInput );
        fireEvent.click( twoBedroomInput );
        fireEvent.click( aboveFourBedroomInput );

        expect( queryByTestId( 'studio' ) ).not.toBeInTheDocument();
        expect( queryByTestId( '1br' ) ).not.toBeInTheDocument();
        getByTestId( '2br' );
        expect( queryByTestId( '3br' ) ).not.toBeInTheDocument();
        getByTestId( '4br' );
        getByTestId( '4+br' );
      } );
    } );

    describe( 'AMI Qualification', () => {
      it( 'Filters by AMI Percentage', () => {
        const amiBetweenEightyAndOneHundred = {
          ...noFiltersApplied,
          "amiQualification": {
            "lowerBound": 80,
            "upperBound": 100,
          },
        };
        const homeWithAmiAboveUpperBound = {
          ...minimalHomeDefinition,
          "id": generateFakeId(),
          "offer": "rent",
          "units": [{
            ...studioUnit,
            "id": generateFakeId(),
            "amiQualification": 110,
          }],
        };
        const homeWithAmiWithinBounds = {
          ...minimalHomeDefinition,
          "id": generateFakeId(),
          "offer": "rent",
          "units": [{
            ...studioUnit,
            "id": generateFakeId(),
            "amiQualification": 90,
          }],
        };
        const homeWithAmiBelowLowerBound = {
          ...minimalHomeDefinition,
          "id": generateFakeId(),
          "offer": "rent",
          "units": [{
            ...studioUnit,
            "id": generateFakeId(),
            "amiQualification": 70,
          }],
        };
        const homesToFilter = [homeWithAmiAboveUpperBound, homeWithAmiWithinBounds, homeWithAmiBelowLowerBound];
        const {
          getByTestId, queryByTestId,
        } = render(
          <Listings
            homes={ homesToFilter }
            filters={ amiBetweenEightyAndOneHundred }
          />,
        );

        getByTestId( homeWithAmiWithinBounds.units[0].id );
        expect( queryByTestId( homeWithAmiAboveUpperBound.units[0].id ) ).not.toBeInTheDocument();
        expect( queryByTestId( homeWithAmiBelowLowerBound.units[0].id ) ).not.toBeInTheDocument();
      } );
    } );
  } );
} );
