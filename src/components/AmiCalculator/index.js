import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Switch, Route, Link, useRouteMatch, useLocation, withRouter,
} from 'react-router-dom';
import {
  TransitionGroup,
  CSSTransition,
} from "react-transition-group";
// import { pascalCase } from 'change-case';

import { hasOwnProperty } from '@util/objects';
import { slugify, uncapitalize, componentCase } from '@util/strings';

import Button from '@components/Button';
import ProgressBar from '@components/ProgressBar';
import Row from '@components/Row';
import Stack from '@components/Stack';
import Alert from '@components/Alert';

import HouseholdSize from './_AmiCalculatorHouseholdSize';
import HouseholdIncome from './_AmiCalculatorHouseholdIncome';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  // const { match, location, history } = props;
  const { path, url } = useRouteMatch();
  const location = useLocation();

  const noErrors = {
    "alert": {
      "page": "all",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "householdSize": {
      "page": 1,
      "errorMessage": "",
      "value": 0,
      "errorRef": useRef(),
    },
    "householdIncome": {
      "page": 2,
      "errorMessage": "",
      "value": 0,
      "errorRef": useRef(),
    },
  };
  const [formData, setFormData] = useState( noErrors );

  const formRef = useRef();
  const totalSteps = props.steps.length;
  const badErrorMessageElementError = ( showHide = 'show/hide' ) => (
    console.error(
      `Can’t ${showHide} UI error message: the value passed to \`${showHide}ErrorMessage\` is “${typeof $errorMessage}”;`
      + ` should be a DOM element or a React ref pointing to a DOM element.`,
    )
  );

  const hideErrorMessage = ( $errorMessage ) => {
    if ( $errorMessage ) {
      if ( hasOwnProperty( $errorMessage, 'current' ) ) {
        $errorMessage = $errorMessage.current;
      }

      if ( !$errorMessage ) {
        badErrorMessageElementError( 'hide' );
        return;
      }

      $errorMessage.classList.remove( '--visible' );

      setTimeout( () => {
        $errorMessage.hidden = true;
      }, 62.5 );
    } else {
      badErrorMessageElementError( 'hide' );
    }
  };

  const showErrorMessage = ( $errorMessage, index ) => {
    if ( $errorMessage ) {
      if ( hasOwnProperty( $errorMessage, 'current' ) ) {
        $errorMessage = $errorMessage.current;
      }

      if ( !$errorMessage ) {
        badErrorMessageElementError( 'show' );
        return;
      }

      $errorMessage.hidden = false;

      setTimeout( () => {
        $errorMessage.classList.add( '--visible' );

        if ( index === 0 ) {
          $errorMessage.focus();
        }
      }, 62.5 );
    } else {
      badErrorMessageElementError( 'show' );
    }
  };

  const reportMissingValidityProperty = ( $formControl ) => {
    throw new Error(
      `Form control `
        + `\`${$formControl.nodeName.toLowerCase()}`
        + `${$formControl.id && `#${$formControl.id}`}`
        + `${$formControl.className && `.${$formControl.className}`}\``
      + ` does not have the \`validity\` or \`checkValidity\` properties.`
      + ` This means either the current browser does not support HTML5 forms, or the React ref is misconfigured.`,
    );
  };

  const reportMissingDisplayNameProperty = ( index ) => {
    throw new Error(
      `AMI Calculator step definition is incomplete:`
      + ` the object at \`AmiCalculator.steps[${index}]\` either needs a \`relativePath\` property,`
      + ` or its constituent component needs to specify React’s \`displayName\` property.`,
    );
  };

  const getStepNumberFromPath = () => {
    const currentRelativePath = location.pathname.replace( path, '/' ).replace( '//', '/' );

    for ( let index = 0; index < props.steps.length; index++ ) {
      const currentStep = props.steps[index];
      let relativePath;

      if ( hasOwnProperty( currentStep, 'relativePath' ) ) {
        relativePath = currentStep.relativePath;
      } else if ( hasOwnProperty( currentStep.Component, 'displayName' ) ) {
        relativePath = `/${slugify( currentStep.Component )}`;
      } else {
        reportMissingDisplayNameProperty( index );
      }

      if ( relativePath === currentRelativePath ) {
        return ( index + 1 );
      }
    }

    throw new Error( `Cannot find step number for ${location.pathname}; please check the \`AmiCalculator.steps\` array.` );
  };

  const [step, setStep] = useState( getStepNumberFromPath() );

  useEffect( () => {
    console.log( 'location', location );
    console.log( 'step', step );
  }, [] );

  const getNextStepPath = () => {
    const nextStep = ( step + 1 );
    const stepDefinition = props.steps[nextStep - 1];

    console.log( 'stepDefinition', stepDefinition );

    if ( nextStep <= props.steps.length ) {
      if ( stepDefinition === props.steps[0] ) {
        return path;
      }

      return `${path}/${slugify( stepDefinition.Component.displayName )}`;
    }

    return null;
  };

  const getPreviousStepPath = () => {
    const previousStep = ( step - 1 );
    const stepDefinition = props.steps[previousStep - 1];

    console.log( 'stepDefinition', stepDefinition );

    if ( previousStep >= 0 ) {
      if ( stepDefinition === props.steps[0] ) {
        return path;
      }

      return `${path}/${slugify( stepDefinition.Component.displayName )}`;
    }

    return null;
  };

  const navigateForward = () => {
    const nextStepPath = getNextStepPath();

    if ( nextStepPath !== null ) {
      props.history.push( nextStepPath );
    } else {
      console.error( 'Can’t navigate forward' );
    }
  };

  const navigateBackward = () => {
    const previousStepPath = getPreviousStepPath();

    // console.log( 'step')
    console.log( 'previousStepPath', previousStepPath );

    if ( previousStepPath !== null ) {
      props.history.push( previousStepPath );
    } else {
      console.error( 'Can’t navigate backward' );
    }
  };

  const handleSubmit = ( event ) => {
    event.preventDefault();
  };

  const getErrors = () => {
    const $form = formRef.current;
    const formValidity = $form.checkValidity();
    const newErrors = { ...formData };
    let numberOfErrors = 0;

    if ( !formValidity ) {
      const $elements = $form.elements;
      const radioButtons = {};

      newErrors.alert = {
        ...formData.alert,
        "errorMessage": "There were errors in your submission.",
      };

      for ( let index = 0; index < $elements.length; index++ ) {
        const $element = $elements[index];
        const { name } = $element;

        if ( hasOwnProperty( radioButtons, $element.name ) ) {
          break;
        }

        if ( 'validity' in $element ) {
          const { validity } = $element;

          if ( validity.valueMissing === true ) {
            if ( $element.type === 'radio' ) {
              radioButtons[name] = true;
            }

            newErrors[name] = {
              ...newErrors[name],
              "errorMessage": "Please fill out this field.",
            };

            numberOfErrors++;
          }
        } else {
          reportMissingValidityProperty( $element );
        } // if validity in $element
      } // for
    } else {
      Object.keys( formData ).forEach( ( errorName ) => {
        newErrors[errorName].errorMessage = '';
      } );
    }

    return [newErrors, numberOfErrors];
  };

  const handleFormInteraction = ( event ) => {
    const [newErrors, numberOfErrors] = getErrors();
    const newErrorList = Object.keys( newErrors ).filter( ( formControlDataKey ) => (
      ( newErrors[formControlDataKey].page === step )
        || ( newErrors[formControlDataKey].page === 'all' )
    ) );

    const navigatePrevious = event.target.hasAttribute( 'data-navigate-previous' );
    const navigateNext = event.target.hasAttribute( 'data-navigate-next' );

    // console.log( 'newErrors', newErrors );
    console.log( 'numberOfErrors', numberOfErrors );
    console.log( 'newErrorList', newErrorList );

    if ( numberOfErrors ) {
      newErrorList.forEach( ( newError ) => {
        showErrorMessage( newErrors[newError].errorRef );
      } );

      setFormData( newErrors );

      if ( navigatePrevious ) {
        navigateBackward();
      }
    } else {
      newErrorList.forEach( ( newError ) => {
        hideErrorMessage( newErrors[newError].errorRef );
      } );

      setFormData( noErrors );

      if ( navigateNext ) {
        console.log( 'Navigate Next' );
        navigateForward();
      } else if ( navigatePrevious ) {
        console.log( 'Navigate Prev' );
        navigateBackward();
      }
    }

    if ( navigateNext || navigatePrevious ) {
      event.preventDefault();
    }

    console.log( '---' );
  };

  return (
    <Stack as="article" className={ `ml-ami-calculator${props.className ? ` ${props.className}` : ''}` } space="2">
      <h2 className="sr-only">AMI Calculator</h2>
      <Stack as="header" space="2">
        <h3 className="sh-title ml-ami-calculator__heading">Find Housing Based on Your Income &amp; Household Size…</h3>
        <ProgressBar current={ step } total={ totalSteps } />
      </Stack>
      <Alert
        id="ami-calculator-form-formData"
        ref={ formData.alert.errorRef }
        className={ `ml-ami-calculator__error-alert` }
        variant="danger"
      >
        { formData.alert.errorMessage }
      </Alert>
      <form
        ref={ formRef }
        className="ami-calculator__form"
        onSubmit={ handleSubmit }
        onChange={ handleFormInteraction }
        // onClick={ handleFormInteraction }
      >
        <Stack space="1">{/* ami-calculator-navigation */}
          <nav>
            <Link to={`${path}`}>Step 1</Link><br/>
            <Link to={`${path}/household-income`}>Step 2</Link>
          </nav>
          <TransitionGroup className="step">
            {/*
              This is no different than other usage of
              <CSSTransition>, just make sure to pass
              `location` to `Switch` so it can match
              the old location as it animates out.
            */}
            <CSSTransition
              key={location.key}
              classNames="fade"
              timeout={450}
            >
              <Switch location={location}>
                {
                  props.steps.map( ( currentStep, index ) => {
                    const isFirstStep = ( index === 0 );
                    let displayName;

                    if ( hasOwnProperty( currentStep, 'relativePath' ) && currentStep.relativePath !== '/' ) {
                      displayName = componentCase( currentStep.relativePath );
                    } else if ( hasOwnProperty( currentStep.Component, 'displayName' ) ) {
                      displayName = currentStep.Component.displayName;
                    } else {
                      reportMissingDisplayNameProperty( index );
                    }

                    const formControlDataKey = uncapitalize( displayName );
                    // const Step = React.createElement( currentStep, { setStep, "formControlData": formData[formControlDataKey] }, null );
                    const routePath = ( isFirstStep ? path : `${path}/${slugify( displayName )}` );

                    return (
                      <Route key={ index } exact={ isFirstStep } path={ routePath }>
                        <currentStep.Component step={ index + 1 } setStep={ setStep } formControlData={ formData[formControlDataKey] } />
                      </Route>
                    );
                  } )
                }
              </Switch>
            </CSSTransition>
          </TransitionGroup>
          <Row as="nav" className={ `ml-ami-calculator__navigation ml-ami-calculator__navigation--step-${step}` } onClick={ handleFormInteraction }>
            <Button
              className="ml-ami-calculator__button"
              type="button"
              disabled={ ( step === 1 ) }
              data-is-navigation-button
              data-navigate-previous
            >Back</Button>
            <Button
              className="ml-ami-calculator__button"
              type="button"
              variant="primary"
              disabled={ ( step === totalSteps ) }
              data-is-navigation-button
              data-navigate-next
            >Next</Button>
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
  // "match": PropTypes.object.isRequired,
  // "location": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "steps": PropTypes.arrayOf(
    PropTypes.shape( {
      "relativePath": PropTypes.string,
      "Component": PropTypes.func.isRequired,
    } ),
  ).isRequired,
};

AmiCalculator.defaultProps = {
  "steps": [
    {
      "relativePath": "/",
      "Component": HouseholdSize,
    }, {
      "relativePath": "/household-income",
      "Component": HouseholdIncome,
    },
  ], // "Disclosure", "Result"],
};

export default withRouter( AmiCalculator );
// export default AmiCalculator;
