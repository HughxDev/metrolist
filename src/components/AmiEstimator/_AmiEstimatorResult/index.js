import React, {
  useEffect, useRef, useState, forwardRef,
} from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';
import Stack from '@components/Stack';
import InputSummary from '../_AmiEstimatorInputSummary';

import './AmiEstimatorResult.scss';

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
  // console.log(
  //   'input',
  //   {
  //     householdSize,
  //     householdIncome,
  //     incomeRate,
  //   },
  // );

  householdSize = householdSize.value;
  householdIncome = householdIncome.value;
  incomeRate = incomeRate.value;

  // const parsedHouseholdSize = parseInt( householdSize, 10 );
  // const deformattedHouseholdIncome = householdIncome.replace( /[$,]/g, '' );
  const parsedHouseholdIncome = parseFloat( householdIncome.replace( /[$,]/g, '' ) );
  const maxIncome = amiDefinition[`people_${householdSize}`];
  let annualizedHouseholdIncome = parsedHouseholdIncome;
  let estimation;

  if ( incomeRate === 'Monthly' ) {
    annualizedHouseholdIncome *= 12;
  }

  if (
    Number.isNaN( annualizedHouseholdIncome )
    || Number.isNaN( maxIncome )
  ) {
    console.warn(
      `AMI calculation failed: one or both of \`annualizedHouseholdIncome\` and \`maxIncome\` resolved to non-numeric values.`
      + ` This could be due to \`props.formData\` being incomplete or missing.`,
    );
    estimation = 0;
  } else {
    estimation = Math.floor( ( annualizedHouseholdIncome / maxIncome ) * 100 );
  }

  // console.log( {
  //   householdSize,
  //   householdIncome,
  //   parsedHouseholdIncome,
  //   annualizedHouseholdIncome,
  //   incomeRate,
  //   maxIncome,
  //   estimation,
  //   "math": `Math.floor( ( ${annualizedHouseholdIncome} / ${maxIncome} ) * 100 ) -> ${estimation}`,
  // } );

  return estimation;
}

const AmiEstimatorResult = forwardRef( ( props, ref ) => {
  const selfRef = useRef();
  const [hasSetHeights, setHasSetHeights] = useState( false );
  // const data = props.formData.householdSize.value ? props.formData : props.fakeFormData;
  const [amiEstimation, setAmiEstimation] = useState( estimateAmi( props.formData ) );

  useEffect( () => props.setStep( props.step ), [] );

  // useEffect( () => setAmiEstimation( estimateAmi( {
  //   "householdSize": props.formData.householdSize.value,
  //   "householdIncome": props.formData.householdIncome.value,
  //   "incomeRate": props.formData.incomeRate.value,
  // } ) ), [props.formData] );

  // useEffect( () => {
  //   props.adjustParentHeight( selfRef );
  // }, [props.step, selfRef.current] );

  useEffect( () => {
    setTimeout( () => {
      // if ( !hasSetHeights ) {
      const newHeights = {
        ...props.heights,
      };
      newHeights[props.pathname] = getComputedStyle( selfRef.current.querySelector( '.ml-ami-estimator__prompt-inner' ) ).getPropertyValue( 'height' );

      props.setHeights( newHeights );

      // setHasSetHeights( true );
      // }
    }, 1000 );
  }, [] );

  console.log( props.formData );

  return (
    <div ref={ selfRef } className={ `ml-ami-estimator__result ml-ami-estimator__prompt${props.className ? ` ${props.className}` : ''}` }>
      <Stack space="2" className="ml-ami-estimator__prompt-inner">
        <InputSummary formData={ props.formData } />
        <Stack space="1">
          <p><span className="ml-all-caps">Estimated Eligibility:</span> <dfn className="ml-ami">{ amiEstimation }% AMI</dfn> (Area Median Income)</p>
        </Stack>
        <Stack as="nav" space="1">
          <Button as="a" variant="primary">See homes that match your eligibility</Button>
          <Button as="a">Exit the calculator</Button>
        </Stack>
      </Stack>
    </div>
  );
} );

AmiEstimatorResult.displayName = 'Result';

AmiEstimatorResult.propTypes = {
  "stepRef": PropTypes.object,
  "children": PropTypes.node,
  "className": PropTypes.string,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "formData": PropTypes.object,
  "fakeFormData": PropTypes.object,
};

AmiEstimatorResult.defaultProps = {
  "fakeFormData": {
    "householdSize": {
      "value": "4",
    },
    "householdIncome": {
      "value": "$5,000.00",
    },
    "incomeRate": {
      "value": "Monthly",
    },
  },
};

export default AmiEstimatorResult;
