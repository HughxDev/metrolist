import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Stack from '@components/Stack';
import Checkbox from '@components/Checkbox';
import FormErrorMessage from '@components/FormErrorMessage';
import InputSummary from '../_AmiCalculatorInputSummary';

import './AmiCalculatorDisclosure.scss';

function AmiCalculatorDisclosure( props ) {
  useEffect( () => {
    props.setStep( props.step );
    console.log( 'props.formData', props.formData );
  }, [] );

  return (
    <Stack space="2" className={ `ml-ami-calculator__disclosure${props.className ? ` ${props.className}` : ''}` }>
      <InputSummary formData={ props.formData } />
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

AmiCalculatorDisclosure.displayName = 'Disclosure';

AmiCalculatorDisclosure.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

// AmiCalculatorDisclosure.

export default AmiCalculatorDisclosure;
