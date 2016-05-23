import { createStore, applyMiddleware, combineReducers  } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'


const REQUEST_POSTS = 'REQUEST_POSTS'
const RECEIVE_POSTS = 'RECEIVE_POSTS'
const SELECT_REDDIT = 'SELECT_REDDIT'
const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'

function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}
 
function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function postsByReddit(state = { }, action) {
  if (action.type === REQUEST_POSTS) 
      return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
      })
  return state
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
})



export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware, createLogger())
  )
  return store
}



