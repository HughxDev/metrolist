import React, {
  useState, useRef, useEffect, useMemo,
} from 'react';
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
import Disclosure from './_AmiCalculatorDisclosure';

import './AmiCalculator.scss';

function AmiCalculator( props ) {
  // const { match, location, history } = props;
  const { path } = useRouteMatch();
  const location = useLocation();

  const noErrors = {
    "steps": [...props.steps],
    "alert": {
      "page": "all",
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "householdSize": {
      "page": 1,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "householdIncome": {
      "page": 2,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "incomeRate": {
      "page": 2,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
    "disclosure": {
      "page": 3,
      "value": "",
      "errorMessage": "",
      "errorRef": useRef(),
    },
  };
  const [formData, setFormData] = useState( noErrors );
  const formRef = useRef();
  const totalSteps = props.steps.length;
  const badErrorMessageElementError = ( showHide = 'show/hide' ) => {
    throw new Error(
      `Can’t ${showHide} UI error message: the value passed to \`${showHide}ErrorMessage\` is “${typeof $errorMessage}”;`
      + ` should be a DOM element or a React ref pointing to a DOM element. Check the state object and make sure your input has an \`errorRef\` property.`,
    );
  };

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
      + ` or its constituent ami-calculator needs to specify React’s \`displayName\` property.`,
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

    console.log( `Going from step ${step} to step ${nextStep}` );
    console.log( `props.steps[${nextStep - 1}]`, stepDefinition );

    if ( nextStep <= props.steps.length ) {
      if ( stepDefinition === props.steps[0] ) {
        return path;
      }

      let relativePath = '';

      if ( hasOwnProperty( stepDefinition, 'relativePath' ) ) {
        relativePath = stepDefinition.relativePath;
      } else if ( hasOwnProperty( stepDefinition.Component, 'displayName' ) ) {
        relativePath = `/${slugify( stepDefinition.Component.displayName )}`;
      } else {
        reportMissingDisplayNameProperty( nextStep - 1 );
      }

      return `${path}${relativePath}`;
    }

    return null;
  };

  const getPreviousStepPath = () => {
    const previousStep = ( step - 1 );
    const stepDefinition = props.steps[previousStep - 1];

    console.log( `Going from step ${step} to step ${previousStep}` );
    console.log( `props.steps[${previousStep - 1}]`, stepDefinition );

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

      if ( numberOfErrors ) {
        console.log( 'newErrors', newErrors );

        newErrors.alert = {
          ...formData.alert,
          "errorMessage": "There were errors in your submission.",
        };
      }
    } else {
      Object.keys( formData ).forEach( ( errorName ) => {
        newErrors[errorName].errorMessage = '';
      } );
    }

    return [newErrors, numberOfErrors];
  };

  const clearErrors = ( errorNameList, newFormData = formData ) => {
    errorNameList.forEach( ( errorName ) => {
      try {
        hideErrorMessage( newFormData[errorName].errorRef );
      } catch ( exception ) {
        console.error( exception );
      }
    } );

    setFormData( newFormData );
  };

  const populateErrors = ( errorNameList, newFormData = formData ) => {
    errorNameList.forEach( ( errorName ) => {
      try {
        showErrorMessage( newFormData[errorName].errorRef );
      } catch ( exception ) {
        console.error( exception );
      }
    } );

    setFormData( newFormData );
  };

  const clearAlert = ( newFormData = formData ) => {
    hideErrorMessage( newFormData.alert.errorRef );
    newFormData.alert.errorMessage = '';
    setFormData( newFormData );
  };

  const handleFormInteraction = ( event ) => {
    const navigatePrevious = event.target.hasAttribute( 'data-navigate-previous' );
    const navigateNext = event.target.hasAttribute( 'data-navigate-next' );

    if ( navigatePrevious ) {
      console.log( 'Navigate Previous' );
      clearAlert();
      navigateBackward();
    } else {
      const [newFormData, numberOfErrors] = getErrors();
      const errorNameList = Object.keys( newFormData )
        .filter( ( formControlDataKey ) => (
          ( newFormData[formControlDataKey].page === step )
            || ( newFormData[formControlDataKey].page === 'all' )
        ) );

      if (
        ( event.type === 'change' )
        || ( event.type === 'keydown' )
      ) {
        const { name } = event.target;

        if ( hasOwnProperty( newFormData, name ) ) {
          newFormData[name].value = event.target.value;
        } else {
          console.error( new Error( `Can’t update state: the state object for AmiCalculator is missing a key named \`${name}\`.` ) );
        }
      } // if change event

      if ( numberOfErrors > 0 ) {
        populateErrors( errorNameList, newFormData );
      } else {
        clearErrors( errorNameList, newFormData );

        if ( navigateNext ) {
          console.log( 'Navigate Next' );
          navigateForward();
        }
      }

      if ( navigateNext || navigatePrevious ) {
        event.preventDefault();
      }
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
        // onKeyDown={ handleFormInteraction }
        // onClick={ handleFormInteraction }
      >
        <Stack space="1">{/* ami-calculator-navigation */}
          <nav>
            <Link to={`${path}`}>Step 1</Link><br/>
            <Link to={`${path}/household-income`}>Step 2</Link><br/>
            <Link to={`${path}/disclosure`}>Step 3</Link>
            {/* <Link to={`${path}/results`}>Step 4</Link> */}
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

                    if ( hasOwnProperty( currentStep, 'relativePath' ) && ( currentStep.relativePath !== '/' ) ) {
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
                      <Route key={ formControlDataKey } exact={ isFirstStep } path={ routePath } render={ () => (
                        <currentStep.Component step={ index + 1 } setStep={ setStep } formControlData={ formData } />
                      ) }>
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
    },
    {
      "relativePath": "/household-income",
      "Component": HouseholdIncome,
    },
    {
      "relativePath": "/disclosure",
      "Component": Disclosure,
    },
  ], // "Disclosure", "Result"],
};

export default withRouter( AmiCalculator );
// export default AmiCalculator;
