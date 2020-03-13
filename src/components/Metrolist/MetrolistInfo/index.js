import React from 'react';
import PropTypes from 'prop-types';

import Column from '@components/Column';
import DetailItem from '@components/DetailItem';

import './MetrolistInfo.scss';

function MetrolistInfo( props ) {
  return (
    <footer className="cob-metrolist-info">
      <Column jumbotron>
        <p>We provide access to income-restricted homes for rent and purchase in Boston and the surrounding area.</p>
        <DetailItem emailAddress="metrolist@boston.gov" />
      </Column>
    </footer>
  );
}

MetrolistInfo.propTypes = {
  "children": PropTypes.node,
};

export default MetrolistInfo;
