import React from "react"
import { render } from "react-dom"
import { createStore, combineReducers } from "redux"
import { Provider, connect} from "react-redux"
import injectTapEventPlugin from 'react-tap-event-plugin'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import {deepOrange500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
injectTapEventPlugin()


/**
 * In this file, we create a React component
 * which incorporates components providedby material-ui.
 */


function Box_({ openStatus, dispatch }) {
  const standardActions = (
    <FlatButton
      label="Ok"
      secondary={true}
      onTouchTap={ () => {dispatch({"type": "SET_POPUP",  "open": false})} }
    />
  )

  const muiTheme = getMuiTheme({
    palette: {
      accent1Color: deepOrange500
    }
  })

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div style={{textAlign: 'center', paddingTop: 200}}>
        <Dialog
          open={ openStatus }
          title="Super Secret Password"
          actions={standardActions}
          onRequestClose={ () => {dispatch({"type": "SET_POPUP",  "open": false})} }
        >
          1-2-3-4-5
        </Dialog>
        <h1>material-ui</h1>
        <h2>example project</h2>
        <RaisedButton
          label="Super Secret Password"
          primary={true}
          onTouchTap={ () => {dispatch({"type": "SET_POPUP",  "open": true})} }
        />
      </div>
    </MuiThemeProvider>
  )
}

const Box = connect( (state) => ({"openStatus": state.boxStore}) )(Box_)

function boxStore(state = false, action) {
  if (action.type === "SET_POPUP") {
    return action.open
  }
  return state
}


const BoxStore = combineReducers({
  boxStore
})
const store = createStore(BoxStore)

render(
  <Provider store={store}>
    <Box />
  </Provider>,
  document.getElementById("root")
)
