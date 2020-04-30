import React, { useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Stack from '@components/Stack';
import Checkbox from '@components/Checkbox';
import FormErrorMessage from '@components/FormErrorMessage';
import InputSummary from '../_AmiEstimatorInputSummary';

import './AmiEstimatorDisclosure.scss';

const AmiEstimatorDisclosure = forwardRef( ( props, ref ) => {
  useEffect( () => {
    props.setStep( props.step );
    console.log( 'props.formData', props.formData );
  }, [] );

  return (
    <Stack ref={ props.stepRef } space="2" className={ `ml-ami-estimator__disclosure ml-ami-estimator__prompt${props.className ? ` ${props.className}` : ''}` }>
      <InputSummary formData={ props.formData } />
      <p>The above information will be combined to estimate your eligibility for income-restricted housing.  Eligibility is officially and finally determined during the application process.</p>
      <Stack space="1">
        <Checkbox className="ml-ami-estimator__disclosure-accept" criterion="disclosure" aria-describedby="ami-estimator-disclosure-accept-error" required>I have read and understand the above statement.</Checkbox>
        <FormErrorMessage
          ref={ props.formData.disclosure.errorRef }
          id="ami-estimator-disclosure-accept-error"
          className="ml-ami-estimator__prompt-answer-error"
        >{ props.formData.disclosure.errorMessage }</FormErrorMessage>
      </Stack>
    </Stack>
  );
} );

AmiEstimatorDisclosure.displayName = 'Disclosure';

AmiEstimatorDisclosure.propTypes = {
  "stepRef": PropTypes.object,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
};

// AmiEstimatorDisclosure.

export default AmiEstimatorDisclosure;
