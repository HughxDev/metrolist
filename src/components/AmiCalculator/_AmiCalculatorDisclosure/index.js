import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Stack from '@components/Stack';
import Icon from '@components/Icon';
import Checkbox from '@components/Checkbox';
import FormErrorMessage from '@components/FormErrorMessage';

import './AmiCalculatorDisclosure.scss';

function AmiCalculatorDisclosure( props ) {
  useEffect( () => props.setStep( props.step ), [] );

  return (
    <Stack space="2" className={ `ml-ami-calculator__disclosure${props.className ? ` ${props.className}` : ''}` }>
      <Row as="dl" className="ml-ami-calculator__input-review">
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
      <p>The above information will be combined to estimate your eligibility for income-restricted housing.  Eligibility is officially and finally determined during the application process.</p>
      <Stack space="1">
        <Checkbox className="ml-ami-calculator__disclosure-accept" criterion="disclosure" aria-describedby="ami-calculator-disclosure-accept-error" required>I have read and understand the above statement.</Checkbox>
        <FormErrorMessage
          ref={ props.formData.disclosure.errorRef }
          id="ami-calculator-disclosure-accept-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formData.disclosure.errorMessage }</FormErrorMessage>
      </Stack>
    </Stack>
  );
}

AmiCalculatorDisclosure.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

// AmiCalculatorDisclosure.

export default AmiCalculatorDisclosure;
