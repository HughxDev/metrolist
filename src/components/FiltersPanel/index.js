import React from 'react';
import PropTypes from 'prop-types';

import FilterGroup from '@components/FilterGroup';
import Filter from '@components/Filter';
import Callout from '@components/Callout';
import Icon from '@components/Icon';
import Stack from '@components/Stack';

import './FiltersPanel.scss';

function FiltersPanel( props ) {
  const attributes = { ...props };

  if ( props.columnWidth ) {
    delete attributes.columnWidth;
    attributes['data-column-width'] = props.columnWidth;
  }

  return (
    <section className={ `ml-filters-panel${props.className ? ` ${props.className}` : ''}` }{ ...attributes }>
      <h3 className="sr-only">Filters</h3>
      <div className="ml-filters__content">
        <Stack space="panel">
          <FilterGroup>
            <FilterGroup.Label>Offer</FilterGroup.Label>
            <Stack space="rent-sale" toppleUntil="large">
              <Filter type="checkbox-button" criterion="offer" value="rental">For Rent</Filter>
              <Filter type="checkbox-button" criterion="offer" value="sale">For Sale</Filter>
            </Stack>
          </FilterGroup>
          <FilterGroup>
            <FilterGroup.Label>Location</FilterGroup.Label>
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
            <FilterGroup.Label>Bedrooms</FilterGroup.Label>
            <Filter type="scale" criterion="bedrooms" value="0,1,2,3,4+">Bedrooms</Filter>
          </FilterGroup>
          <FilterGroup>
            <FilterGroup.Label>Income Eligibility (AMI%)</FilterGroup.Label>
            <Filter>
              {/* <Filter.Label>Eligibility (AMI%)</Filter.Label> */}
              <Filter type="checkbox">50%</Filter>
              <Filter type="checkbox">60%</Filter>
              <Filter type="checkbox">70%</Filter>
              <Filter type="checkbox">80%</Filter>
            </Filter>
          </FilterGroup>
          <Callout>
            <Icon icon="wallet" width="67" />
            <Callout.Heading>Search for housing based on your income</Callout.Heading>
            <Callout.Text>
              <p>Enter basic information to help determine your eligibility for income-restricted housing.</p>
              <a className="btn btn--700 btn--metrolist" style={ { "width": "100%" } } href="#">Search</a>
            </Callout.Text>
          </Callout>
        </Stack>
      </div>
    </section>
  );
}

FiltersPanel.propTypes = {
  "className": PropTypes.string,
  "columnWidth": PropTypes.string,
};

export default FiltersPanel;
