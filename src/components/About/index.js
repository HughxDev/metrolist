import React from 'react';
import PropTypes from 'prop-types';

import Column from '@components/Column';
import DetailItem from '@components/DetailItem';

import './About.scss';

function About() {
  return (
    <footer className="ml-about">
      <Column jumbotron>
        <p>We provide access to income-restricted homes for rent and purchase in Boston and the surrounding area.</p>
        <DetailItem emailAddress="metrolist@boston.gov" />
      </Column>
    </footer>
  );
}

About.propTypes = {
  "children": PropTypes.node,
};

export default About;
