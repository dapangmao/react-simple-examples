import React from "react"
import { render } from "react-dom"
import { createStore, combineReducers } from "redux"
import { Provider, connect} from "react-redux"
import injectTapEventPlugin from 'react-tap-event-plugin'
import RaisedButton from 'material-ui/RaisedButton'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
// import RaisedButton from 'material-ui/RaisedButton';

injectTapEventPlugin()


/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */


function Box() {
  const muiTheme = getMuiTheme({
    palette: {
      accent1Color: deepOrange500
    }
  })

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{textAlign: 'center', paddingTop: 200}}>
          <HorizontalLinearStepper/>
        </div>

    </MuiThemeProvider>
  )
}


function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0:
      return 'Select campaign settings...';
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'You\'re a long way from home sonny jim!';
  }
}

function HorizontalLinearStepper_({ stepIndex, dispatch }) {
   let finished = (stepIndex >= 2)
    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Select campaign settings</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create an ad group</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create an ad</StepLabel>
          </Step>
        </Stepper>
        <div style={{margin: '0 16px'}}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  dispatch({ "type": "RESET_STEP" })
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              <p>{getStepContent(stepIndex)}</p>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={ ()  => {
                      dispatch({ "type": "DECREASE_STEP" })
                      }
                    }
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  onTouchTap={ () => {
                    dispatch({ "type": "INCREASE_STEP" })
                    }
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

const HorizontalLinearStepper = connect( (state) => ({"stepIndex":
  state.stepStore}) )(HorizontalLinearStepper_)

//-------------------------------------------------------------------


function stepStore(state = 0, action) {
  if (action.type === "INCREASE_STEP") {
    return state + 1
  }
  if (action.type === "DECREASE_STEP") {
    return state - 1
  }
  if (action.type === "RESET_STEP") {
    return 0
  }
  return state
}

const StepStore = combineReducers({
  stepStore
})
const store = createStore(StepStore)

render(
  <Provider store={store}>
    <Box />
  </Provider>
  ,
  document.getElementById("root")
)
