import React, { useEffect, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';
import Stack from '@components/Stack';
import InputSummary from '../_AmiCalculatorInputSummary';

import './AmiCalculatorResult.scss';

// 100% AMI
const amiDefinition = {
  "people_1": 79350,
  "people_2": 90650,
  "people_3": 102000,
  "people_4": 113300,
  "people_5": 122400,
  "people_6": 131450,
};

function estimateAmi( { householdSize, householdIncome, incomeRate } ) {
  // const parsedHouseholdSize = parseInt( householdSize, 10 );
  // const deformattedHouseholdIncome = householdIncome.replace( /[$,]/g, '' );
  householdIncome = parseFloat( householdIncome.value.replace( /[$,]/g, '' ) );
  const maxIncome = amiDefinition[`people_${householdSize.value}`];

  if ( incomeRate.value === 'Monthly' ) {
    householdIncome *= 12;
  }

  return Math.floor( ( householdIncome / maxIncome ) * 100 );
}

const AmiCalculatorResult = forwardRef( ( props, ref ) => {
  const data = props.formData.householdSize.value ? props.formData : props.fakeFormData;
  const [amiEstimation, setAmiEstimation] = useState( estimateAmi( data ) );

  useEffect( () => props.setStep( props.step ), [] );

  // useEffect( () => setAmiEstimation( estimateAmi( {
  //   "householdSize": props.formData.householdSize.value,
  //   "householdIncome": props.formData.householdIncome.value,
  //   "incomeRate": props.formData.incomeRate.value,
  // } ) ), [props.formData] );

  console.log( props.formData );

  return (
    <Stack ref={ ref } space="2" className={ `ml-ami-calculator__result ml-ami-calculator__prompt${props.className ? ` ${props.className}` : ''}` }>
      <InputSummary formData={ props.formData } />
      <Stack space="1">
        <p><span className="ml-all-caps">Estimated Eligibility:</span> <dfn className="ml-ami">{ amiEstimation }% AMI</dfn> (Area Median Income)</p>
      </Stack>
      <Stack as="nav" space="1">
        <Button as="a" variant="primary">See homes that match your eligibility</Button>
        <Button as="a">Exit the calculator</Button>
      </Stack>
    </Stack>
  );
} );

AmiCalculatorResult.displayName = 'Result';

AmiCalculatorResult.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "formData": PropTypes.object,
  "fakeFormData": PropTypes.object,
};

AmiCalculatorResult.defaultProps = {
  "fakeFormData": {
    "householdSize": {
      "value": 4,
    },
    "householdIncome": {
      "value": "$5,000.00",
    },
    "incomeRate": {
      "value": "Monthly",
    },
  },
};

export default AmiCalculatorResult;
