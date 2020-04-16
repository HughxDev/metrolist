import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';
import Stack from '@components/Stack';
import InputSummary from '../_AmiCalculatorInputSummary';

import sampleApiResponse from './sample-api-response.json';
// import sampleApiResponse2 from './sample-api-response-2.json';

import './AmiCalculatorResult.scss';

function AmiCalculatorResult( props ) {
  function estimateAmi( { householdSize, householdIncome, incomeRate } ) {
    const parsedHouseholdSize = parseInt( householdSize, 10 );
    const deformattedHouseholdIncome = householdIncome.replace( /[$,]/g, '' );
    let parsedHouseholdIncome = parseFloat( deformattedHouseholdIncome );

    if ( incomeRate === 'Monthly' ) {
      parsedHouseholdIncome *= 12;
    }

    return (
      sampleApiResponse
        .map( ( amiBracket ) => {
          amiBracket.AMIPercent = parseInt( amiBracket.AMIPercent, 10 );
          amiBracket.people = parseInt( amiBracket.people.trim(), 10 );
          amiBracket.maxIncome = parseInt( amiBracket.maxIncome, 10 );

          return amiBracket;
        } )
        .filter( ( amiBracket ) => ( parsedHouseholdSize === amiBracket.people ) )
        .filter( ( amiBracket ) => ( parsedHouseholdIncome < amiBracket.maxIncome ) )
        .sort( ( a, b ) => b.AMIPercent - a.AMIPercent )
    );
  }

  useEffect( () => {
    props.setStep( props.step );
    console.log( 'props.formData', props.formData );
    console.log( 'sampleApiResponse', sampleApiResponse );
    // console.log( 'sampleApiResponse2', sampleApiResponse2 );

    const estimation = estimateAmi( {
      "householdSize": 4,
      "householdIncome": "$5,000.00",
      "incomeRate": "Monthly",
    } );

    console.log( 'estimation', estimation );
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
