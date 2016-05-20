import React from 'react'
import { render } from 'react-dom'
import { combineReducers, createStore } from 'redux'
import { connect, Provider } from 'react-redux'

// "Getting Started with Redux" (by Dan Abramov)
// https://egghead.io/series/getting-started-with-redux

// This file on JSBin (by Jesse Buchanan):
// http://jsbin.com/wuwezo/74/edit?js,console,output
////////////////////////////////////////////////
//
// Reducers (except root, see bottom)
//

// 2nd level reducer
// Here, `state` refers to the array of todo objects
function todos(state = [], action) {
  console.log("todos reducer called")
  switch (action.type) {
    // Returns a new array of todos, containing the added todo as described by `action`.
    // The new todo is constructed by delegating to the `todo` reducer.
    case 'ADD_TODO':
      console.log('todos ADD_TODO')
      // ... below is ES6 "spread operator" (arrays only)
      return [
        ...state,
        todo(undefined, action)
      ]
    // Returns a new array of todos, with an individual todo's completed status
    // toggled as identified by `action.id`.
    // Must operate on entire list (seems wrong somehow).
    case 'TOGGLE_TODO':
      console.log('todos TOGGLE_TODO')
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
function visibilityFilter(state = 'SHOW_ALL', action) {
  console.log("visibilityFilter reducer called")
  if (action.type === 'SET_VISIBILITY_FILTER') {
      return action.filter
    }
  return state
}

// 3rd level reducer.
// Here, `state` refers to a single todo object.
function todo(state, action) {
  console.log("todo reducer called")
  // Remember, no mutation.
  // Initial state is considered (or not, in the ADD_TODO case),
  // and used to construct a new state object, always.

  switch (action.type) {
    case 'ADD_TODO':
      console.log('todo ADD_TODO')
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      console.log('todo TOGGLE_TODO')
      // Bail out if the action is for a different todo than the one passed in.
      if (state.id !== action.id) {
        return state
      }

      // ... below is ES7 "Object Rest Destructuring"
      // https://github.com/sebmarkbage/ecmascript-rest-spread/blob/master/Spread.md
      // Think of it as "and the rest", or "override these object properties"
      return Object.assign({}, state, {completed: !state.completed})
      //   ...state,
      //   completed: !state.completed
      // }
    default:
      return state
  }
}

////////////////////////////////////////////////
//
// React components
// (not including generated or root component/s)
//

// This is a "stateless component". It gets `props` passed in.
// https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
// Notice the curlybraces in the parameter list. This is destructuring
// `props` (e.g. filter = props.filter, children = props.children)
function TodoList({ todos, onTodoClick }) {
  return (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)}


function Todo({ onClick, completed, text }) {
  return (
    <li onClick={onClick}
      style={{textDecoration: completed ? 'line-through' : 'none'}}
    >
      {text}
    </li>
  )
}

function Link({ active, children, onClick }) {
  if (active)
    return <span>{children}</span>
  return (
    <a href='#'
       onClick={e => {
         e.preventDefault()
         onClick()
       }}
    >
      {children}
    </a>
  )
}

function Footer() {
  return (
    <p>
      Show:
      {' '}
      <FilterLink
        filter='SHOW_ALL'>All</FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'>Active</FilterLink>
      {' '}
      <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
    </p>
  )
}

// Intentionally not `const` here.
// We will override AddTodo later with a connected component.
function AddTodo({ dispatch }) {
  let input

  return (
    <div>
      <input ref={node => {
        // This is a newer 0.14 syntax where ref can be a callback.

        // n.b. no `this` available in a functional/stateless component.
        // Here, we're making a closure over `input`, defined above.
        input = node
      }} />
      <button onClick={() => {
        dispatch(addTodo(input.value))
        input.value = ''
      }}>
        Add todo
      </button>
    </div>
  )
}

////////////////////////////////////////////////
//
// react-redux mapping functions
//

// This takes Redux state, and returns the props needed
// for the presentational component.
function mapStateToTodoListProps(state) {
  console.log(`mapStateToTodoListProps(): state.todos = ${state.todos}`)
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  }
}

// This takes the store's dispatch method, and returns the
// callbacks props needed for the presentational component.
function mapDispatchToTodoListProps(dispatch) {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

function mapStateToFilterLinkProps(state, ownProps) {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
}

const mapDispatchToFilterLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      console.log('FilterLink onClick')
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

////////////////////////////////////////////////
//
// react-redux container components generated by `connect`
//


// To create a container component, we use react-redux `connect`.
// We pass the mapStateToProps and mapDispatchToProps functions
// defined above.
//
// `connect` returns a curried function, which you call on the
// presentational component. *This* function returns a "connected"
// or "container" component.
//
// What is a connected component anyway?
//
// In the mapStateToProps function, we pluck any necessary state
// from the Redux store, and react-redux wires it to the React props.
//
// In the mapDispatchToProps function, we accept a callback to store.dispatch.
// We return an object, whose keys are callback attributes (`onClick` etc)
// and whose values are functions that actually perform dispatch.
//
// This allows us to take a stateless, dumb, presentation only component,
// and transform it into a component that knows how to get state from the store,
// and knows how to dispatch events to the store.
//
// The egghead redux video tutorials walk through how to implement `connect`
// by hand.

const VisibleTodoList = connect(
  mapStateToTodoListProps, mapDispatchToTodoListProps
)(TodoList)

const FilterLink = connect(
  mapStateToFilterLinkProps,
  mapDispatchToFilterLinkProps
)(Link)

// Default behavior of `connect` (with 0 parameters):
//   Do not subscribe to any stores, inject `dispatch` as prop.
// This shorthand is equivalent to AddTodoHardWay, demonstrated below.
AddTodo = connect()(AddTodo)

// AddTodoTheHardWay = connect(
//   state => {
//     // AddToDo doesn't have any state to be mapped to props.
//     // Could have just specified null here instead of an anon fn.
//     return {}
//   },
//   dispatch => {
//     // A bit hard to follow here.
//     // The 2nd arg of `connect` is the mapDispatchToProps fn.
//     // This function takes a dispatch function, returns callbacks as needed.
//     // In other cases, we might return onSomethingClick callbacks here, calling
//     //  store.dispatch inside those callbacks as necessary.
//     // In this case, we're just taking dispatch, and returning
//     //  {dispatch: dispatch}
//
//     return { dispatch }
//   }
// )(AddTodo)


////////////////////////////////////////////////
//
// Redux action creators
//

// You could just litter the action object boilerplate all throughout
// the code. This is just DRY/shorthand...
//
// ...but it's actually more than that.
// (?) Closures mean I can keep state
// (?) Async operations are handled here!

let nextToDoId = 0 // global :shrug:
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    id: nextToDoId++,
    text
  }
}

function setVisibilityFilter(filter) {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  }
}

function toggleTodo(id) {
  return {
    type: 'TOGGLE_TODO',
    id
  }
}

////////////////////////////////////////////////
//
// Helpers (just a filter, really)
//``

function getVisibleTodos(todos, filter) {
  console.log(`getVisibleTodos: todos=${todos} filter=${filter}`)
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}


//////////////////////////////////////////////////
//
// Root reducer, root component, initial
//


// Top level reducer.
const todoApp = combineReducers({
  // n.b. following syntax is ES6 Object Initializer (shorthand property names)
  todos,              // todos: todos,
  visibilityFilter    // visibilityFilter: visibilityFilter
})

// Create the Redux store from the root reducer.
const store = createStore(todoApp)

// Look at how simple the application is now!
// The top level React component needs no props.
function TodoApp() {
  return (
    <div>
      <AddTodo />
      <VisibleTodoList />
      <Footer />
    </div>
  )
}

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
  document.getElementById('root')
)
