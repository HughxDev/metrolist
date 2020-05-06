import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Icon from '@components/Icon';

import './AmiEstimatorInputSummary.scss';

function removeEmptyCents( money ) {
  const decimalPosition = ( money.length - 3 );

  if ( money.substring( decimalPosition ) === '.00' ) {
    return money.substring( 0, decimalPosition );
  }

  return money;
}

function formatIncome( income ) {
  if ( income ) {
    return removeEmptyCents( income );
  }

  return '$0.00';
}

function formatIncomeRate( incomeRate ) {
  if ( incomeRate ) {
    return incomeRate.toLowerCase().substring( 0, incomeRate.length - 2 );
  }

  return 'month';
}

const AmiEstimatorInputSummary = forwardRef( ( props, ref ) => (
  <Row ref={ ref } as="dl" className="ml-ami-estimator__input-summary" data-testid="ml-ami-estimator__input-summary">
    <div>
      <dt>
        <Icon className="ml-ami-estimator__prompt-answer-icon" icon="family2" width="114" />
        Household:
      </dt>
      <dd>{ props.formData.householdSize.value || '0' }</dd>
    </div>
    <div>
      <dt>
        <Icon className="ml-ami-estimator__prompt-answer-icon" icon="deposit check" width="114" />
        Income:
      </dt>
      <dd>{ formatIncome( props.formData.householdIncome.value ) }/{ formatIncomeRate( props.formData.incomeRate.value ) }</dd>
    </div>
  </Row>
) );

AmiEstimatorInputSummary.displayName = 'InputSummary';

AmiEstimatorInputSummary.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

export default AmiEstimatorInputSummary;
