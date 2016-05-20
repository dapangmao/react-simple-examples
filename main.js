import React from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"
import TodoApp from "./component"
import todoApp from "./reducer"


// "Getting Started with Redux" (by Dan Abramov)
// https://egghead.io/series/getting-started-with-redux

// This file on JSBin (by Jesse Buchanan):
// http://jsbin.com/wuwezo/74/edit?js,console,output
////////////////////////////////////////////////


// Create the Redux store from the root reducer.
const store = createStore(todoApp)

// Look at how simple the application is now!
// The top level React component needs no props.


// react-redux <Provider> uses the React Context feature (`getChildContext`,
// `childContextTypes`) to inject the store, automatically subscribe and
// unsubscribe to it at the correct React lifecycle hooks (e.g. `componentDidMount`).
//
// See how <Provider> works here:
// https://github.com/rackt/react-redux/blob/master/src/components/Provider.js

render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
)
