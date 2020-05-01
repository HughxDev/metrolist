import React from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Icon from '@components/Icon';

import './AmiEstimatorInputSummary.scss';

const AmiEstimatorInputSummary = ( props ) => (
  <Row as="dl" className="ml-ami-estimator__input-summary">
    <div>
      <dt>
        <Icon className="ml-ami-estimator__prompt-answer-icon" icon="family2" width="227" />
        Household:
      </dt>
      <dd>{ props.formData.householdSize.value || '0' }</dd>
    </div>
    <div>
      <dt>
        <Icon className="ml-ami-estimator__prompt-answer-icon" icon="deposit check" width="227" />
        Income:
      </dt>
      <dd>{ props.formData.householdIncome.value || '$0.00' }/{ props.formData.incomeRate.value ? props.formData.incomeRate.value.substring( 0, props.formData.incomeRate.value.length - 2 ) : 'month' }</dd>
    </div>
  </Row>
);

AmiEstimatorInputSummary.displayName = 'InputSummary';

AmiEstimatorInputSummary.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

export default AmiEstimatorInputSummary;
