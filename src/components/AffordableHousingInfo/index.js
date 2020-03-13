import React from 'react';
import PropTypes from 'prop-types';

import SectionHeader from '@components/SectionHeader';

import './AffordableHousingInfo.scss';

function AffordableHousingInfo( props ) {
  return (
    <div className="cob-affordable-housing-info">
      <SectionHeader>Learn About Affordable Housing</SectionHeader>
      { props.children }
    </div>
  );
}

AffordableHousingInfo.propTypes = {
  "children": PropTypes.node,
};

export default AffordableHousingInfo;
