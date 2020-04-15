import React from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Icon from '@components/Icon';

import './AmiCalculatorInputSummary.scss';

function AmiCalculatorInputSummary( props ) {
  return (
    <Row as="dl" className="ml-ami-calculator__input-summary">
      <div>
        <dt>
          <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
          Household:
        </dt>
        <dd>{ props.formData.householdSize.value || '0' }</dd>
      </div>
      <div>
        <dt>
          <Icon className="ml-ami-calculator__prompt-answer-icon" icon="deposit check" width="227" />
          Income:
        </dt>
        <dd>{ props.formData.householdIncome.value || '$0.00' }/{ props.formData.incomeRate.value ? props.formData.incomeRate.value.substring( 0, props.formData.incomeRate.value.length - 2 ) : 'month' }</dd>
      </div>
    </Row>
  );
}

AmiCalculatorInputSummary.displayName = 'InputSummary';

AmiCalculatorInputSummary.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

export default AmiCalculatorInputSummary;
