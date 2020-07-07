import '@babel/polyfill';
import '__mocks__/matchMedia';
import mockApiResponse from '__mocks__/developmentsApiResponse.json';
import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  getAllByRole,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { getDevelopmentsApiEndpoint } from '@util/dev';
import { MemoryRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { act } from 'react-dom/test-utils';

import Search from './index';

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
    "rentalPrice": {
      "lowerBound": 0,
      "upperBound": 0,
    },
  };
}
// import testData from './test-data.json';

// console.error( mockApiResponse );

// Mock Developments API response
const server = setupServer(
  rest.get(
    getDevelopmentsApiEndpoint(),
    ( request, response, context ) => response(
      context.json( mockApiResponse ),
    ),
  ),
);

describe( 'Search', () => {
  beforeAll( () => server.listen() );

  afterEach( () => {
    server.resetHandlers();
    cleanup();
  } );

  afterAll( () => server.close() );

  it( 'Renders', async () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
        <Search />
      </MemoryRouter>,
    );
    const FiltersPanel = getByTestId( 'ml-filters-panel' );
    const ResultsPanel = getByTestId( 'ml-results-panel' );

    await act( async () => {
      await waitForElement( () => getAllByRole( ResultsPanel, 'article' ) );
    } );

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
      "price": 900,
      "priceRate": "monthly",
    };
    const oneBedroomUnit = {
      "id": "1br",
      "bedrooms": 1,
      "price": 1000,
      "priceRate": "monthly",
    };
    const twoBedroomUnit = {
      "id": "2br",
      "bedrooms": 2,
      "price": 2000,
      "priceRate": "monthly",
    };
    const threeBedroomUnit = {
      "id": "3br",
      "bedrooms": 3,
      "price": 3000,
      "priceRate": "monthly",
    };
    const fourBedroomUnit = {
      "id": "4br",
      "bedrooms": 4,
      "price": 4000,
      "priceRate": "monthly",
    };
    const aboveFourBedroomUnit = {
      "id": "4+br",
      "bedrooms": 10,
      "price": 5000,
      "priceRate": "monthly",
    };
    let noFiltersApplied = getNoFiltersApplied();

    beforeEach( () => {
      noFiltersApplied = getNoFiltersApplied();
    } );

    describe( 'Rental Price', () => {
      const homeWithUnitWithinPriceRange = {
        ...minimalHomeDefinition,
        "id": generateFakeId(),
        "title": "Affordable",
        "offer": "rent",
        "units": [
          threeBedroomUnit,
        ],
      };
      const homeWithUnitOutsidePriceRange = {
        ...minimalHomeDefinition,
        "id": generateFakeId(),
        "title": "Unaffordable",
        "offer": "rent",
        "units": [
          aboveFourBedroomUnit,
        ],
      };

      it( 'Filters results to only homes with units in the specified price range', () => {
        const homesToFilter = [homeWithUnitWithinPriceRange, homeWithUnitOutsidePriceRange];
        const { queryByText, getByTestId } = render(
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={
                {
                  ...Search.defaultProps.filters,
                  "rentalPrice": {
                    "lowerBound": 1000,
                    "upperBound": 4000,
                  },
                }
              }
            />
          </MemoryRouter>,
        );

        const lowerBoundInput = getByTestId( 'rentalPriceLowerBound' );
        const upperBoundInput = getByTestId( 'rentalPriceUpperBound' );

        const fourThousandPerMonth = () => queryByText( homeWithUnitWithinPriceRange.title );
        const fiveThousandPerMonth = () => queryByText( homeWithUnitOutsidePriceRange.title );

        expect( fourThousandPerMonth() ).toBeInTheDocument();
        expect( fiveThousandPerMonth() ).not.toBeInTheDocument();

        act( () => {
          fireEvent.change( lowerBoundInput, { "target": { "value": "4000" } } );
          fireEvent.change( upperBoundInput, { "target": { "value": "5000" } } );
        } );

        expect( fourThousandPerMonth() ).not.toBeInTheDocument();
        expect( fiveThousandPerMonth() ).toBeInTheDocument();
      } );
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
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={
                {
                  ...Search.defaultProps.filters,
                  "offer": {
                    "rent": false,
                    "sale": false,
                  },
                }
              }
            />
          </MemoryRouter>,
        );
        const forRentInput = getByLabelText( /For Rent \(.*\)/, { "selector": "input" } );

        fireEvent.click( forRentInput );

        const homeToBeFilteredOut = queryByText( homeToBuy.title );

        expect( forRentInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );

      it( 'Filters results to only homes for sale', () => {
        const homesToFilter = [homeToRent, homeToBuy];
        const { getByLabelText, queryByText } = render(
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={
                {
                  ...Search.defaultProps.filters,
                  "offer": {
                    "rent": false,
                    "sale": false,
                  },
                }
              }
            />
          </MemoryRouter>,
        );
        const forSaleInput = getByLabelText( /For Sale \(.*\)/, { "selector": "input" } );
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
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={ noFiltersApplied }
            />
          </MemoryRouter>,
        );
        const bostonInput = getByLabelText( 'Boston', { "selector": "input" } );
        fireEvent.click( bostonInput );
        const homeToBeFilteredOut = queryByText( homeOutsideBoston.title );

        expect( bostonInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );

      it( 'Filters results to only homes outside Boston', () => {
        const homesToFilter = [homeWithinBoston, homeOutsideBoston];
        const { getByLabelText, queryByText } = render(
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={ noFiltersApplied }
            />
          </MemoryRouter>,
        );
        const beyondBostonInput = getByLabelText( 'Beyond Boston', { "selector": "input" } );
        fireEvent.click( beyondBostonInput );
        const homeToBeFilteredOut = queryByText( homeWithinBoston.title );

        expect( beyondBostonInput ).toBeChecked();
        expect( homeToBeFilteredOut ).not.toBeInTheDocument();
      } );

      it( 'Sets all neighborhood checkboxes appropriately when the “Boston” checkbox is toggled', async () => {
        const { getByLabelText } = render(
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search filters={ noFiltersApplied } />
          </MemoryRouter>,
        );
        const bostonInput = getByLabelText( 'Boston', { "selector": "input" } );
        let dotInput;
        let southieInput;

        await act( async () => {
          dotInput = await waitForElement( () => getByLabelText( /Dorchester \(.*\)/, { "selector": "input" } ) );
          southieInput = await waitForElement( () => getByLabelText( /South Boston \(.*\)/, { "selector": "input" } ) );
        } );

        fireEvent.click( bostonInput );

        expect( bostonInput ).toBeChecked();
        expect( dotInput ).toBeChecked();
        expect( southieInput ).toBeChecked();

        fireEvent.click( bostonInput );

        expect( bostonInput ).not.toBeChecked();
        expect( dotInput ).not.toBeChecked();
        expect( southieInput ).not.toBeChecked();
      } );

      it( 'Sets all cardinal direction checkboxes appropriately when the “Beyond Boston” checkbox is toggled', async () => {
        const { getByLabelText } = render(
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search filters={ noFiltersApplied } />
          </MemoryRouter>,
        );
        const beyondBostonInput = getByLabelText( 'Beyond Boston', { "selector": "input" } );
        let westInput;
        let southInput;

        await act( async () => {
          westInput = await waitForElement( () => getByLabelText( /West of Boston \(.*\)/, { "selector": "input" } ) );
          southInput = await waitForElement( () => getByLabelText( /South of Boston \(.*\)/, { "selector": "input" } ) );

          // For some reason this fireEvent has to go inside act() or there is a race condition and the test fails,
          // even though it works outside of act() in the previous test
          fireEvent.click( beyondBostonInput );
        } );

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
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={ noFiltersApplied }
            />
          </MemoryRouter>,
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
          <MemoryRouter initialEntries={['/metrolist/search']} initialIndex={0}>
            <Search
              homes={ homesToFilter }
              filters={ amiBetweenEightyAndOneHundred }
            />
          </MemoryRouter>,
        );

        getByTestId( homeWithAmiWithinBounds.units[0].id );
        expect( queryByTestId( homeWithAmiAboveUpperBound.units[0].id ) ).not.toBeInTheDocument();
        expect( queryByTestId( homeWithAmiBelowLowerBound.units[0].id ) ).not.toBeInTheDocument();
      } );
    } );
  } );
} );
