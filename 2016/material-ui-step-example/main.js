import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import Box from './components'
import { createStore } from "redux"
import rootReducer from "./reducer"


const store = createStore(
    rootReducer,
    window.devToolsExtension && window.devToolsExtension()
)


render(
  <Provider store={store}>
    <Box />
  </Provider>
  ,
  document.getElementById("root")
)
