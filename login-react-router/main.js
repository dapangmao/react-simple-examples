import React, { createClass } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, browserHistory, Link, withRouter } from 'react-router'
import Parse from 'parse'


Parse.initialize("myAppId");
Parse.serverURL = 'https://www.jhuangs.com/parse'


function App(props) {
  return (
    <div>
      {props.children}
    </div>
  )
}

const Form = withRouter(
  createClass({

    getInitialState() {
      return {
        value: '',
        pass: ''
      }
    },

    submitAction(event) {
      event.preventDefault()
      this.props.router.push({
        pathname: '/page',
        query: {
          username: this.state.value,
          password: this.state.pass
        }
      })
    },

    handleValueChange(event) {
      this.setState({ value: event.target.value })
    },

    handlePassChange(event) {
      this.setState({ pass: event.target.value })
    },

    render() {
      return (
        <form onSubmit={this.submitAction}>
          <p>Token is <em>pancakes</em></p>

          <label><input placeholder="username" value={this.state.value}
            onChange={this.handleValueChange}/></label>
          <label><input placeholder="password" value={this.state.pass}
            onChange={this.handlePassChange}/></label>

          <button type="submit">Submit the thing</button>
          <p><Link to="/page?qsparam=pancakes">Or authenticate via URL</Link></p>
          <p><Link to="/page?qsparam=bacon">Or try failing to authenticate via URL</Link></p>
        </form>
      )
    }
  })
)

function Page() {
  return <h1>Hey, I see you are authenticated. Welcome!</h1>
}

function ErrorPage() {
  return <h1>Oh no! Your auth failed!</h1>
}

function requireCredentials(nextState, replace, next) {
    const query = nextState.location.query
    if (query.username && query.password) {
      Parse.User.logIn(query.username, query.password)
        .then(
          () => next(),
          () => {
            replace('/error')
            next()
          }
        )
    } else {
      replace('/error')
      next()
    }
}


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Form} />
      <Route path="page" component={Page} onEnter={requireCredentials}/>
      <Route path="error" component={ErrorPage}/>
    </Route>
  </Router>
), document.getElementById('root'))
