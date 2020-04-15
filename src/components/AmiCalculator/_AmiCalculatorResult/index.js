import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';
import Stack from '@components/Stack';
import InputSummary from '../_AmiCalculatorInputSummary';

import './AmiCalculatorResult.scss';

function AmiCalculatorResult( props ) {
  useEffect( () => {
    props.setStep( props.step );
    console.log( 'props.formData', props.formData );
  }, [] );

  return (
    <Stack space="2" className={ `ml-ami-calculator__result${props.className ? ` ${props.className}` : ''}` }>
      <InputSummary formData={ props.formData } />
      <Stack space="1">
        <p><span className="ml-all-caps">Estimated Eligibility:</span> <dfn className="ml-ami">54% AMI</dfn> (Area Median Income)</p>
        <p>54% qualifies you for homes listed at <b className="ml-ami">60% AMI</b> and above.</p>
      </Stack>
      <Stack as="nav" space="1">
        <Button as="a" variant="primary">See homes that match your eligibility</Button>
        <Button as="a">Exit the calculator</Button>
      </Stack>
    </Stack>
  );
}

AmiCalculatorResult.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "formData": PropTypes.object,
};

export default AmiCalculatorResult;
