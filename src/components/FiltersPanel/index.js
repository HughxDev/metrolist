import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { capitalCase } from 'change-case';

import FilterGroup from '@components/FilterGroup';
import Filter from '@components/Filter';
// import Callout from '@components/Callout';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
// import Inset from '@components/Inset';
import Row from '@components/Row';
import Column from '@components/Column';

import './FiltersPanel.scss';

function FiltersPanel( props ) {
  const isDesktop = globalThis.matchMedia( '(min-width: 992px)' ).matches; // TODO: define breakpoints that line up with the CSS in JS somewhere
  const $drawer = useRef();
  const attributes = { ...props };
  const [isExpanded, setExpanded] = useState( isDesktop );
  // const [filters, setFilters] = useState( props.filters );
  const $self = useRef();
  let updatingDrawerHeight = false;

  const updateDrawerHeight = ( wait ) => {
    const updateHeight = () => {
      if ( $drawer.current ) {
        const height = getComputedStyle( $drawer.current ).getPropertyValue( 'height' );

        if ( height !== '0px' ) {
          $drawer.current.style.height = height;
        }
      }

      updatingDrawerHeight = false;
    };

    if ( wait ) {
      setTimeout( updateHeight, wait );
    } else {
      updateHeight();
    }
  };

  const updateOwnHeight = () => {
    const bodyHeight = getComputedStyle( document.body ).getPropertyValue( 'height' ).replace( 'px', '' );
    const topOffset = getComputedStyle( $self.current ).getPropertyValue( 'top' ).replace( 'px', '' );

    $self.current.style.height = `${bodyHeight - topOffset}px`;
  };

  const handleDoubleClick = ( event ) => {
    // https://stackoverflow.com/a/43321596/214325
    if ( event.detail > 1 ) { // Number of clicks
      event.preventDefault();
    }
  };

  const handleClick = ( event ) => {
    const $element = event.target;
    let { className, nodeName } = $element;

    nodeName = nodeName.toLowerCase();

    if ( nodeName === 'use' ) {
      className = $element.parentNode.className;
    }

    if ( className instanceof SVGAnimatedString ) {
      className = className.baseVal;
    }

    const isFiltersPanelClick = /\bml-filters-panel/.test( className );

    if ( isFiltersPanelClick ) {
      setExpanded( !isExpanded );
    } else {
      if ( !updatingDrawerHeight ) {
        updatingDrawerHeight = true;
        $drawer.current.style.height = '';
        updateDrawerHeight( 250 );
      }
    }

    updateOwnHeight();
  };

  useEffect( updateDrawerHeight );
  useEffect( updateOwnHeight );

  if ( props.className ) {
    delete attributes.className;
  }

  if ( props.columnWidth ) {
    delete attributes.columnWidth;
    attributes['data-column-width'] = props.columnWidth;
  }

  if ( props.filters ) {
    delete attributes.filters;
  }

  if ( props.handleFilterChange ) {
    delete attributes.handleFilterChange;
  }

  const {
    offer,
    location,
    bedrooms,
    amiQualification,
  } = props.filters;

  return (
    <section
      data-testid="ml-filters-panel"
      ref={ $self }
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
      onChange={ () => {
        props.handleFilterChange();
        updateOwnHeight();
      } }
    >
      <div className="ml-filters-panel__menu">
        <h3
          className="ml-filters-panel__heading"
          aria-expanded={ isExpanded.toString() }
          aria-controls="filters-panel-content"
          onMouseDown={ handleDoubleClick }
        >
          Filter Listings
          <Icon className="ml-filters-panel__heading-icon" use="#icon-details-marker" />
        </h3>
        <div
          id="filters-panel-content"
          ref={ $drawer }
          className={ `ml-filters-panel__content${isExpanded ? ' ml-filters-panel__content--expanded' : ''}` }
        >
          <FilterGroup criterion="offer">
            <FilterGroup.Label>Offer</FilterGroup.Label>
            <Row space="rent-sale" stackAt="large">
              <Column width="1/2">
                <Filter type="checkbox-button" criterion="offer" value="rent" checked={ offer.rent }>For Rent</Filter>
              </Column>
              <Column width="1/2">
                <Filter type="checkbox-button" criterion="offer" value="sale" checked={ offer.sale }>For Sale</Filter>
              </Column>
            </Row>
          </FilterGroup>
          <FilterGroup criterion="location">
            <FilterGroup.Label>Location</FilterGroup.Label>
            <Stack space="sister-checkboxes">
              <Filter type="checkbox" criterion="city" value="boston" checked={ location.city.boston }>
                <Filter.Label>Boston</Filter.Label>
                {
                  Object.keys( location.neighborhood ).map( ( neighborhood ) => (
                    <Filter
                      key={ neighborhood }
                      type="checkbox"
                      criterion="neighborhood"
                      value={ neighborhood }
                      checked={ location.neighborhood[neighborhood] }
                    >{ capitalCase( neighborhood ) }</Filter>
                  ) )
                }
              </Filter>
              <Filter type="checkbox" criterion="city" value="beyondBoston" checked={ location.city.beyondBoston }>
                <Filter.Label>Beyond Boston</Filter.Label>
                {
                  Object.keys( location.cardinalDirection ).map( ( cardinalDirection ) => (
                    <Filter
                      key={ cardinalDirection }
                      type="checkbox"
                      criterion="cardinalDirection"
                      value={ cardinalDirection }
                      checked={ location.cardinalDirection[cardinalDirection] }
                    >{ `${capitalCase( cardinalDirection )} of Boston` }</Filter>
                  ) )
                }
              </Filter>
            </Stack>
          </FilterGroup>
          <FilterGroup criterion="bedrooms" orientation="horizontal">
            <FilterGroup.Label>Bedrooms</FilterGroup.Label>
            <Filter type="checkbox" criterion="bedrooms" checked={ bedrooms['0'] }>0</Filter>
            <Filter type="checkbox" criterion="bedrooms" checked={ bedrooms['1'] }>1</Filter>
            <Filter type="checkbox" criterion="bedrooms" checked={ bedrooms['2'] }>2</Filter>
            <Filter type="checkbox" criterion="bedrooms" checked={ bedrooms['3'] }>3</Filter>
            <Filter type="checkbox" criterion="bedrooms" checked={ bedrooms['4+'] }>4+</Filter>
          </FilterGroup>
          <FilterGroup criterion="amiQualification">
            <FilterGroup.Label>Income Eligibility</FilterGroup.Label>
            <div
              onClick={ ( event ) => event.stopPropagation() }
              // onChange={ ( event ) => event.stopPropagation() }
            >
              <Filter
                type="range"
                criterion="amiQualification"
                min={ 0 }
                max={ 200 }
                lowerBound={ amiQualification.lowerBound }
                upperBound={ amiQualification.upperBound }
              />
            </div>
          </FilterGroup>
        </div>
      </div>{/* filters-panel__menu */}
    </section>
  );
}

FiltersPanel.propTypes = {
  "className": PropTypes.string,
  "columnWidth": PropTypes.string,
  "filters": PropTypes.object.isRequired,
  "handleFilterChange": PropTypes.func,
};

export default FiltersPanel;
