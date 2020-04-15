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
    <div className={ `ml-ami-calculator__disclosure${props.className ? ` ${props.className}` : ''}` }>
      <Row>
        <div>
          <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
          <span><b>Household:</b> X</span>
        </div>
        <div>
          <Icon className="ml-ami-calculator__prompt-answer-icon" icon="deposit check" width="227" />
          <span><b>Income:</b> $Y/mo</span>
        </div>
      </Row>
      <Stack space="1">
        <p>The above information will be combined to estimate your eligibility for income-restricted housing.  Eligibility is officially and finally determined during the application process.</p>
        <Checkbox criterion="disclosure" aria-describedby="ami-calculator-disclosure-accept-error" required>I have read and understand the above statement.</Checkbox>
        <FormErrorMessage
          ref={ props.formData.disclosure.errorRef }
          id="ami-calculator-disclosure-accept-error"
          className="ml-ami-calculator__prompt-answer-error"
        >{ props.formData.disclosure.errorMessage }</FormErrorMessage>
      </Stack>
    </div>
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
