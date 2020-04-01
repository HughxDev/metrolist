import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import FilterGroup from '@components/FilterGroup';
import Filter from '@components/Filter';
import Callout from '@components/Callout';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Inset from '@components/Inset';

import './FiltersPanel.scss';

function FiltersPanel( props ) {
  const $drawer = useRef();
  const attributes = { ...props };
  const [isExpanded, setExpanded] = useState( true );

  const updateDrawerHeight = ( wait ) => {
    const updateHeight = () => {
      const height = getComputedStyle( $drawer.current ).getPropertyValue( 'height' );

      if ( height !== '0px' ) {
        $drawer.current.style.height = height;
      }
    };

    if ( wait ) {
      setTimeout( updateHeight, wait );
    } else {
      updateHeight();
    }
  };

  const handleDoubleClick = ( event ) => {
    // https://stackoverflow.com/a/43321596/214325
    if ( event.detail > 1 ) { // Number of clicks
      event.preventDefault();
    }
  };

  const handleClick = ( event ) => {
    const isFiltersPanelClick = /\bml-filters-panel/.test( event.target.className );

    if ( isFiltersPanelClick ) {
      setExpanded( !isExpanded );
    } else {
      $drawer.current.style.height = '';
      updateDrawerHeight( 250 );
    }
  };


  useEffect( updateDrawerHeight );

  if ( props.className ) {
    delete attributes.className;
  }

  if ( props.columnWidth ) {
    delete attributes.columnWidth;
    attributes['data-column-width'] = props.columnWidth;
  }

  return (
    <section
      className={
        `ml-filters-panel${
          props.className
            ? ` ${props.className}`
            : ''
        }${
          isExpanded ? ' ml-filters-panel--expanded' : ''
        }`
      }
      { ...attributes }
      onClick={ handleClick }
    >
      <h3
        className="ml-filters-panel__heading"
        aria-expanded={ isExpanded.toString() }
        aria-controls="filters-panel-content"
        onMouseDown={ handleDoubleClick }
      >
        Filter Listings
        <Icon className="ml-filters-panel__heading-icon" use="#icon-details-marker" />
      </h3>
      <Stack space="panel">
        <Inset until="large">
          <Stack
            ref={ $drawer }
            id="filters-panel-content"
            className={ `ml-filters-panel__content${isExpanded ? ' ml-filters-panel__content--expanded' : ''}` }
            space="panel"
          >
            <FilterGroup>
              <FilterGroup.Label>Offer</FilterGroup.Label>
              <Stack space="rent-sale" toppleUntil="large">
                <Filter columnWidth="1/2" type="checkbox-button" criterion="offer" value="rental">For Rent</Filter>
                <Filter columnWidth="1/2" type="checkbox-button" criterion="offer" value="sale">For Sale</Filter>
              </Stack>
            </FilterGroup>
            <FilterGroup>
              <FilterGroup.Label>Location</FilterGroup.Label>
              <Stack space="sister-checkboxes">
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
              </Stack>
            </FilterGroup>
            <FilterGroup>
              <FilterGroup.Label>Bedrooms</FilterGroup.Label>
              <Filter type="scale" criterion="bedrooms" value="0,1,2,3,4+">Bedrooms</Filter>
            </FilterGroup>
            <FilterGroup>
              <FilterGroup.Label>Income Eligibility (AMI%)</FilterGroup.Label>
              {/* <Stack space="1"> */}
              <Filter>
                <Filter type="checkbox">40%</Filter>
                <Filter type="checkbox">50%</Filter>
                <Filter type="checkbox">60%</Filter>
                <Filter type="checkbox">70%</Filter>
                <Filter type="checkbox">80%</Filter>
                <Filter type="checkbox">90%</Filter>
                <Filter type="checkbox">100%</Filter>
                <Filter type="checkbox">110%</Filter>
                <Filter type="checkbox">120%</Filter>
              </Filter>
              {/* </Stack> */}
            </FilterGroup>
          </Stack>
        </Inset>
        <Inset until="large">
          <Callout as="a" href="#">
            <Callout.Heading as="span">Use our AMI Estimator to find homes that match your income</Callout.Heading>
            <Callout.Icon>
              <Icon use="#icon-mobile-link-marker" />
            </Callout.Icon>
          </Callout>
        </Inset>
      </Stack>
    </section>
  );
}

FiltersPanel.propTypes = {
  "className": PropTypes.string,
  "columnWidth": PropTypes.string,
};

export default FiltersPanel;
