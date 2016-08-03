import React from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"
import TodoApp from "./component"
import todoApp from "./reducer"

const store = createStore(todoApp, window.devToolsExtension && window.devToolsExtension())

render(
  <Provider store={store}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
)
