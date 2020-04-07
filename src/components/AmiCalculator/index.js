import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '@components/Icon';
import Scale from '@components/Scale';
import Button from '@components/Button';
import ProgressBar from '@components/ProgressBar';
import Row from '@components/Row';
import Stack from '@components/Stack';
import Alert from '@components/Alert';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  const [step, setStep] = useState( 1 );
  const [formIsDirty, setFormDirtiness] = useState( false );
  const [formIsValid, setFormValidity] = useState( false );
  const [formControls, updateFormControls] = useState( {
    "$form": {
      "errorRef": useRef(),
    },
    "$familySize": {
      "ref": useRef(),
      "errorRef": useRef(),
      "isInvalid": false,
      "errorMessage": null,
    },
  } );
  const totalSteps = 4;
  const hideErrorMessage = ( $errorMessage ) => {
    $errorMessage.classList.remove( '--visible' );
    setTimeout( () => {
      $errorMessage.hidden = true;
    }, 62.5 );
  };
  const showErrorMessage = ( $errorMessage, index ) => {
    $errorMessage.hidden = false;
    setTimeout( () => {
      $errorMessage.classList.add( '--visible' );

      if ( index === 0 ) {
        $errorMessage.focus();
      }
    }, 62.5 );
  };
  const showHideValidationErrors = () => {
    Object.keys( formControls ).forEach( ( formControlName, index ) => {
      const formControl = formControls[formControlName];

      if ( formControl.isInvalid ) {
        // const $formControl = formControl.ref.current;
        const $errorMessage = formControl.errorRef.current;

        showErrorMessage( $errorMessage, index );
      } else {
        const $errorMessage = formControl.errorRef.current;

        hideErrorMessage( $errorMessage );
      }
    } );
  };

  useEffect( showHideValidationErrors );

  const reportMissingValidityProperty = ( $formControl ) => (
    console.error(
      `Form control `
        + `\`${$formControl.nodeName.toLowerCase()}`
        + `${$formControl.id && `#${$formControl.id}`}`
        + `${$formControl.className && `.${$formControl.className}`}\``
      + ` does not have the \`validity\` or \`checkValidity\` properties.`
      + ` This means either the current browser does not support HTML5 forms, or the React ref is misconfigured.`,
    )
  );

  const updateFormControlsBasedOnValidityState = ( formControlName, validityName, isInvalid ) => {
    const updatedFormControls = { ...formControls };

    // https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
    switch ( validityName ) {
      case 'valueMissing':
        updatedFormControls[formControlName] = {
          ...formControls[formControlName],
          isInvalid,
          "errorMessage": ( isInvalid ? 'Please fill out this field.' : '' ),
        };

        if ( isInvalid ) {
          setFormValidity( !isInvalid );
        }

        updateFormControls( updatedFormControls );
        break;

      // case 'badInput':
      // case 'customError':
      // case 'patternMismatch':
      // case 'rangeOverflow':
      // case 'rangeUnderflow':
      // case 'stepMismatch':
      // case 'tooLong':
      // case 'tooShort':
      // case 'typeMismatch':
      // case 'valid':
      default:
    }
  };

  const handleFormInteraction = ( event ) => {
    const { type } = event;
    const $form = event.currentTarget;
    const $clicked = event.target;
    const isNavigationButton = $clicked.hasAttribute( 'data-is-navigation-button' );
    const isChangeEvent = ( type === 'change' );
    const formValidity = $form.checkValidity();

    setFormDirtiness( true );
    setFormValidity( formValidity );

    if ( isChangeEvent || isNavigationButton ) {
      const formControlNames = Object.keys( formControls );

      formControlNames.forEach( ( formControlName ) => {
        const formControlEntry = formControls[formControlName];
        const $formElementOrControl = ( formControlEntry.ref ? formControlEntry.ref.current : false );

        if ( $formElementOrControl ) {
          // console.log( '$formControl', $formControl );

          if ( 'validity' in $formElementOrControl ) {
            // Form Control
            const { validity } = $formElementOrControl;

            for ( const validityName in validity ) { // eslint-disable-line no-restricted-syntax,guard-for-in
              const isInvalid = validity[validityName];

              if ( isInvalid ) {
                updateFormControlsBasedOnValidityState( formControlName, validityName, isInvalid );
                break;
              }
            }
          } else {
            // Nada
            reportMissingValidityProperty( $formElementOrControl );
          }
        } // if $formControl
      } );

      if ( isNavigationButton ) {
        event.preventDefault();
      }
    }
  };

  return (
    <Stack as="article" className={ `ml-ami-calculator${props.className ? ` ${props.className}` : ''}` } space="2">
      <h2 className="sr-only">AMI Calculator</h2>
      <Stack as="header" space="2">
        <h3 className="sh-title ml-ami-calculator__heading">Find Housing Based on Your Income &amp; Household Size…</h3>
        <ProgressBar current={ step } total={ totalSteps } />
      </Stack>
      <Alert
        id="ami-calculator-form-errors"
        ref={ formControls.$form.errorRef }
        className="ml-ami-calculator__error-alert"
        variant="danger"
        hidden
      >
        { ( formIsDirty && !formIsValid ) && <p>There were errors</p> }
      </Alert>
      <form ref={ formControls.$form.ref } className="ami-calculator__form" onClick={ handleFormInteraction } onChange={ handleFormInteraction } onSubmit={ ( e ) => e.preventDefault() }>
        <Stack space="ami-calculator-navigation">
          <fieldset className="ml-ami-calculator__prompt">
            <legend className="ml-ami-calculator__prompt-question">How many people live in your household of any age?</legend>
            <div className="ml-ami-calculator__prompt-answer">
              <Icon className="ml-ami-calculator__prompt-answer-icon" icon="family2" width="227" />
              <Scale
                ref={ formControls.$familySize.ref }
                className={ `ml-ami-calculator__prompt--answer-input${formControls.$familySize.isInvalid ? ' --invalid' : ''}` }
                criterion="familySize"
                value="1,2,3,4,5,6+"
                aria-describedby="ami-calculator-form-errors ami-calculator-family-size-error"
                required
              />
              <div
                id="ami-calculator-family-size-error"
                ref={ formControls.$familySize.errorRef }
                className="t--subinfo t--err m-t100 ml-ami-calculator__prompt-answer-error"
                aria-live="polite"
                hidden
              >{ formControls.$familySize.errorMessage }</div>
            </div>
          </fieldset>
          <Row as="nav" className={ `ml-ami-calculator__navigation ml-ami-calculator__navigation--step-${step}` }>
            { ( step > 1 ) && <Button className="ml-ami-calculator__button" data-is-navigation-button>Back</Button> }
            <Button className="ml-ami-calculator__button" variant="primary" disabled={ ( step === totalSteps ) } data-is-navigation-button>Next</Button>
          </Row>
        </Stack>
      </form>
      <Stack as="footer" className="ml-ami-calculator__footer" space="ami-calculator-footer">
        <p><a className="ml-ami-calculator__exit-link" href="#">Exit</a></p>
        <p><a className="ml-ami-calculator__email-link" href="mailto:metrolist@boston.gov" onClick={ ( e ) => e.preventDefault() }>For questions email <span className="ml-ami-calculator__email-link-email-address">metrolist@boston.gov</span></a></p>
      </Stack>
    </Stack>
  );
}

AmiCalculator.propTypes = {
  "children": PropTypes.node,
  "className": PropTypes.string,
};

export default AmiCalculator;
