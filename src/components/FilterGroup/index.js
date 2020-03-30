import React from 'react';
import PropTypes from 'prop-types';

import { slugify } from '@util/strings';

import Icon from '@components/Icon';

import './FilterGroup.scss';

class FilterGroup extends React.Component {
  constructor( props ) {
    super();
    this.state = {
      "isExpanded": props.isExpanded,
    };
    this.handleExpandCollapse = this.handleExpandCollapse.bind( this );
    // this.handleWindowResize = this.handleWindowResize.bind( this );
    this.updateFiltersHeight = this.updateFiltersHeight.bind( this );
    this.$filters = React.createRef();
  }

  handleExpandCollapse() {
    this.updateFiltersHeight();
    this.setState( {
      "isExpanded": !this.state.isExpanded,
    } );
  }

  renderFilters( { children } ) {
    let label;
    const childArray = React.Children.toArray( children );
    const firstChild = childArray.shift();
    let groupId;

    if ( firstChild.type.displayName === 'FilterGroupLabel' ) {
      groupId = slugify( firstChild.props.children );
      label = React.cloneElement(
        firstChild,
        {
          "disclosureTarget": groupId,
          "isExpanded": this.state.isExpanded,
          "handleExpandCollapse": this.handleExpandCollapse,
        },
        firstChild.props.children,
      );
    }

    return (
      <>
        { label }
        <div id={ groupId } ref={ this.$filters } className={ `ml-filter-group__filters${this.state.isExpanded ? ' ml-filter-group__filters--expanded' : ''}` }>
          { childArray }
        </div>
      </>
    );
  }

  // handleWindowResize() {}

  updateFiltersHeight() {
    const $filters = this.$filters.current;
    const currentHeight = `${this.$filters.current.style.height}`;

    $filters.style.height = '';

    // Could be setImmediate but probably not worth loading the polyfill just for this
    setTimeout( () => {
      const newHeight = getComputedStyle( $filters ).getPropertyValue( 'height' );

      if (
        this.state.isExpanded
        && ( newHeight !== currentHeight )
      ) {
        $filters.style.height = newHeight;
      }
    }, 1 );
  }

  componentDidMount() {
    this.updateFiltersHeight();

    window.addEventListener( 'resize', this.updateFiltersHeight );
  }

  render() {
    return (
      <fieldset className={ `ml-filter-group${this.props.className ? ` ${this.props.className}` : ''}${this.state.isExpanded ? ' ml-filter-group--expanded' : ''}` }>
        { this.renderFilters( this.props ) }
      </fieldset>
    );
  }
}
FilterGroup.propTypes = {
  "isExpanded": PropTypes.bool,
  "children": PropTypes.node,
  "className": PropTypes.string,
};
FilterGroup.defaultProps = {
  "isExpanded": true,
};

FilterGroup.Label = function FilterGroupLabel( props ) {
  return (
    <legend
      className="ml-filter-group__label"
      aria-expanded={ props.isExpanded.toString() }
      aria-controls={ props.disclosureTarget }
      onClick={ props.handleExpandCollapse }
    >
      <span className="ml-filter-group__label-text">{ props.children }</span>
      <Icon className="ml-filter-group__icon" use="#icon-details-marker" />
    </legend>
  );
};
FilterGroup.Label.displayName = 'FilterGroupLabel';
FilterGroup.Label.propTypes = {
  "handleExpandCollapse": PropTypes.func,
  "isExpanded": PropTypes.bool,
  "disclosureTarget": PropTypes.string,
  "children": PropTypes.node,
};

export default FilterGroup;
