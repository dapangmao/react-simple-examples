import { combineReducers } from "redux"

function todos(state = [], action) {
  switch (action.type) {
    // Returns a new array of todos, containing the added todo as described by `action`.
    // The new todo is constructed by delegating to the `todo` reducer.
    case "ADD_TODO":
      // ... below is ES6 "spread operator" (arrays only)
      return [
        ...state,
        todo(undefined, action)
      ]
    // Returns a new array of todos, with an individual todo"s completed status
    // toggled as identified by `action.id`.
    // Must operate on entire list (seems wrong somehow).
    case "TOGGLE_TODO":
      return state.map(t =>
        todo(t, action)
      )
    default:
      return state
  }
}

// 2nd level reducer
// Here, `state` refers to a simple configuration string (enum/atom)
// Remember, we are only returning the state we are concerned with
function visibilityFilter(state = "SHOW_ALL", action) {
  if (action.type === "SET_VISIBILITY_FILTER") {
      return action.filter
    }
  return state
}

// 3rd level reducer.
// Here, `state` refers to a single todo object.
// Remember, no mutation.
// Initial state is considered (or not, in the ADD_TODO case),
// and used to construct a new state object, always.
function todo(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      console.log("todo ADD_TODO" + " with ID " + action.id)
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case "TOGGLE_TODO":
      console.log("todo TOGGLE_TODO" + " with ID " + action.id)
      // Bail out if the action is for a different todo than the one passed in.
      if (state.id !== action.id) {
        return state
      }
      // ... below is ES7 "Object Rest Destructuring"
      // https://github.com/sebmarkbage/ecmascript-rest-spread/blob/master/Spread.md
      // Think of it as "and the rest", or "override these object properties"
      return Object.assign({}, state, {completed: !state.completed})
    default:
      return state
  }
}

// Top level reducer.
const todoApp = combineReducers({
  // n.b. following syntax is ES6 Object Initializer (shorthand property names)
  todos,              // todos: todos,
  visibilityFilter    // visibilityFilter: visibilityFilter
})

export default todoApp
