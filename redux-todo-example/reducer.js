import { combineReducers } from "redux"

function todos(state = [], action) {
  if (action.type === "ADD_TODO") {
    let current = {
      id: action.id,
      text: action.text,
      completed: false
    }
    return [...state, current]
  }
  if (action.type === "TOGGLE_TODO")
    return state.map( t => todo(t, action) )
  return state
}

// Here, `state` refers to a simple configuration string (enum/atom)
// Remember, we are only returning the state we are concerned with
function visibilityFilter(state = "SHOW_ALL", action) {
  if (action.type === "SET_VISIBILITY_FILTER")
      return action.filter
  return state
}


function currentAddTodoStore(state = "", action) {
  if (action.type === "CURRENT_ADD_TODO")
      return action.text
  return state
}
//
// 3rd level reducer.
// Here, `state` refers to a single todo object.
// Remember, no mutation.
// Initial state is considered (or not, in the ADD_TODO case),
// and used to construct a new state object, always.
function todo(state, action) {
  if (state.id !== action.id)
      return state
  // ES7 has "Object Rest Destructuring"
  // https://github.com/sebmarkbage/ecmascript-rest-spread/blob/master/Spread.md
  return Object.assign({}, state, {completed: !state.completed})
}

// Top level reducer.
const todoApp = combineReducers({
  todos,
  visibilityFilter,
  currentAddTodoStore
})

export default todoApp
