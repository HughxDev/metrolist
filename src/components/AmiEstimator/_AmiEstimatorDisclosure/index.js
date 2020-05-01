import React, {
  useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';

import Stack from '@components/Stack';
import Checkbox from '@components/Checkbox';
import FormErrorMessage from '@components/FormErrorMessage';
import InputSummary from '../_AmiEstimatorInputSummary';

import './AmiEstimatorDisclosure.scss';

const AmiEstimatorDisclosure = ( props ) => {
  const selfRef = useRef();

  useEffect( () => {
    props.setStep( props.step );
    props.adjustContainerHeight( selfRef );
  }, [] );

  return (
    <div ref={ selfRef } className={ `ml-ami-estimator__disclosure ml-ami-estimator__prompt${props.className ? ` ${props.className}` : ''}` }>
      <Stack space="2" className="ml-ami-estimator__prompt-inner">
        <InputSummary formData={ props.formData } />
        <p>The above information will be combined to estimate your eligibility for income-restricted housing.  Eligibility is officially and finally determined during the application process.</p>
        <Stack space="1">
          <Checkbox
            className="ml-ami-estimator__disclosure-accept"
            criterion="disclosure"
            aria-describedby="ami-estimator-disclosure-accept-error"
            checked={ true }
            required
          >I have read and understand the above statement.</Checkbox>
          <FormErrorMessage
            ref={ props.formData.disclosure.errorRef }
            id="ami-estimator-disclosure-accept-error"
            className="ml-ami-estimator__prompt-answer-error"
          >{ props.formData.disclosure.errorMessage }</FormErrorMessage>
        </Stack>
      </Stack>
    </div>
  );
};

AmiEstimatorDisclosure.displayName = 'Disclosure';

AmiEstimatorDisclosure.propTypes = {
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "formData": PropTypes.object,
  "adjustContainerHeight": PropTypes.func,
};

// AmiEstimatorDisclosure.

export default AmiEstimatorDisclosure;
