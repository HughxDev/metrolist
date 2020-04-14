import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Row from '@components/Row';
import Stack from '@components/Stack';
import Icon from '@components/Icon';
import Checkbox from '@components/Checkbox';

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
        <div
          ref={ props.formControlData.disclosure.errorRef }
          id="ami-calculator-disclosure-accept-error"
          className={ `t--subinfo t--err m-t100 ml-ami-calculator__prompt-answer-error` }
          aria-live="polite"
        >{ props.formControlData.disclosure.errorMessage }</div>
      </Stack>
    </div>
  );
}

AmiCalculatorDisclosure.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formControlData": PropTypes.object,
};

// AmiCalculatorDisclosure.

export default AmiCalculatorDisclosure;
