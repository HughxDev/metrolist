import React, {
  useEffect, useRef, useState, forwardRef,
} from 'react';
import PropTypes from 'prop-types';

import Button from '@components/Button';
import Stack from '@components/Stack';

import { updatePageTitle } from '@util/a11y-seo';
import { isOnGoogleTranslate, copyGoogleTranslateParametersToNewUrl, getUrlBeingTranslated } from '@util/translation';
import { hasOwnProperty } from '@util/objects';

import InputSummary from '../_AmiEstimatorInputSummary';
import amiDefinitions from '../ami-definitions.json';

import './AmiEstimatorResult.scss';

function get100percentAmiDefinition() {
  if ( !Array.isArray( amiDefinitions ) ) {
    return false;
  }

  for ( let index = 0; index < amiDefinitions.length; index++ ) {
    const amiEstimation = amiDefinitions[index];

    if ( amiEstimation && hasOwnProperty( amiEstimation, 'ami' ) && ( amiEstimation.ami === 100 ) ) {
      return amiEstimation;
    }
  }

  throw new Error( 'No 100% AMI definition (HUD) could be found.' );
}

function estimateAmi( {
  amiDefinition, householdSize, householdIncome, incomeRate,
} ) {
  if ( !amiDefinition ) {
    return 0;
  }

  householdSize = householdSize.value.replace( '+', '' );
  householdIncome = householdIncome.value;
  incomeRate = incomeRate.value;

  const parsedHouseholdIncome = parseFloat( householdIncome.replace( /[$,]/g, '' ) );
  const maxIncome = amiDefinition[householdSize];
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

  return estimation;
}

function recommendAmi( amiEstimation ) {
  if ( amiEstimation < 0 ) {
    return 0;
  }

  if ( amiEstimation ) {
    return ( Math.ceil( amiEstimation / 5 ) * 5 );
  }

  return amiEstimation;
}

function isAboveUpperBound( amiEstimation ) {
  return ( amiEstimation > 200 );
}

const AmiEstimatorResult = forwardRef( ( props, ref ) => {
  const selfRef = ( ref || useRef() );
  const [amiEstimation, setAmiEstimation] = useState( 0 );
  let amiRecommendation = recommendAmi( amiEstimation );
  const isBeingTranslated = isOnGoogleTranslate();

  localStorage.setItem( 'amiRecommendation', amiRecommendation );
  localStorage.setItem( 'useAmiRecommendationAsLowerBound', 'true' );

  useEffect( () => {
    updatePageTitle( 'Result', 'AMI Estimator' );
    props.setStep( props.step );
    props.adjustContainerHeight( selfRef );

    setAmiEstimation(
      estimateAmi( {
        "amiDefinition": get100percentAmiDefinition(),
        ...props.formData,
      } ),
    );
  }, [] );

  useEffect( () => {
    amiRecommendation = recommendAmi( amiEstimation );
    localStorage.setItem( 'amiRecommendation', amiRecommendation );
  }, [amiEstimation] );

  const metrolistSearchPath = '/metrolist/search';
  const urlBeingTranslated = getUrlBeingTranslated();
  const metrolistSearchUrl = ( isBeingTranslated ? copyGoogleTranslateParametersToNewUrl( urlBeingTranslated.replace( /\/metrolist\/.*/, metrolistSearchPath ) ) : metrolistSearchPath );

  return (
    <div ref={ selfRef } className={ `ml-ami-estimator__result ml-ami-estimator__prompt${props.className ? ` ${props.className}` : ''}` } data-testid="ml-ami-estimator__result">
      <Stack space="2" className="ml-ami-estimator__prompt-inner">
        <InputSummary formData={ props.formData } />
        <Stack space="1">
          <p>Estimated Eligibility: <dfn className="ml-ami">{ amiEstimation }% AMI</dfn> (Area Median Income)</p>
          { isAboveUpperBound( amiEstimation ) && <p>Given your income level, you are unlikely to qualify for units marketed on Metrolist.</p> }
          { !isAboveUpperBound( amiEstimation ) && <p>We recommend searching for homes listed at <b className="ml-ami">{ amiRecommendation }% AMI</b> and above. Note that minimum income restrictions apply, and are listed in the unit details.</p> }
        </Stack>
        <Stack as="nav" space="1">
          <Button as="a" variant="primary" href={ metrolistSearchUrl } target={ isBeingTranslated ? '_blank' : undefined }>See homes that match this eligibility range</Button>
        </Stack>
      </Stack>
    </div>
  );
} );

AmiEstimatorResult.displayName = 'Result';

AmiEstimatorResult.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
  "step": PropTypes.number,
  "setStep": PropTypes.func,
  "formData": PropTypes.object,
  "fakeFormData": PropTypes.object,
  "adjustContainerHeight": PropTypes.func,
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
