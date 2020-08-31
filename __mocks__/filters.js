export function getNoFiltersApplied() { // eslint-disable-line import/prefer-default-export
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
        "South Boston": false,
        "Hyde Park": false,
        "Dorchester": false,
        "Mattapan": false,
      },
      "cardinalDirection": {
        "west": false,
        "north": false,
        "south": false,
      },
    },
    "bedrooms": {
      "0br": false,
      "1br": false,
      "2br": false,
      "3+br": false,
    },
    "amiQualification": {
      "lowerBound": 0,
      "upperBound": 200,
    },
    "incomeQualification": {
      "upperBound": null,
    },
    "rentalPrice": {
      "lowerBound": 0,
      "upperBound": 3000,
    },
  };
}
