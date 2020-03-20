import React from 'react';
import PropTypes from 'prop-types';

import FilterGroup from '@components/FilterGroup';
import Filter from '@components/Filter';

import './FiltersPanel.scss';

function FiltersPanel( props ) {
  return (
    <section className={ `ml-filters-panel${props.className ? ` ${props.className}` : ''}` }>
      <h3 className="sr-only">FiltersPanel</h3>
      <div className="ml-filters__content">
        <FilterGroup>
          <Filter type="checkbox" criterion="offer" value="rental">For Rent</Filter>
          <Filter type="checkbox" criterion="offer" value="sale">For Sale</Filter>
        </FilterGroup>
        <FilterGroup>
          <Filter type="checkbox" criterion="city" value="Boston">
            <Filter.Label>Boston</Filter.Label>
            <Filter type="checkbox" criterion="neighborhood" value="south-boston">South Boston</Filter>
            <Filter type="checkbox" criterion="neighborhood" value="hyde-park">Hyde Park</Filter>
            <Filter type="checkbox" criterion="neighborhood" value="dorchester">Dorchester</Filter>
            <Filter type="checkbox" criterion="neighborhood" value="mattapan">Mattapan</Filter>
          </Filter>
          <Filter type="checkbox" criterion="city" value="!Boston">
            <Filter.Label>Beyond Boston</Filter.Label>
            <Filter type="checkbox">West of Boston</Filter>
            <Filter type="checkbox">North of Boston</Filter>
            <Filter type="checkbox">South of Boston</Filter>
          </Filter>
        </FilterGroup>
        <FilterGroup>
          <Filter type="scale" criterion="bedrooms" value="0,1,2,3,4+">Bedrooms</Filter>
        </FilterGroup>
      </div>
    </section>
  );
}

FiltersPanel.propTypes = {
  "className": PropTypes.string,
};

export default FiltersPanel;
