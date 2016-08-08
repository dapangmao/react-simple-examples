import React, { createClass } from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, Link, withRouter } from 'react-router'
import Parse from 'parse'


Parse.initialize("myAppId");
Parse.serverURL = 'https://www.jhuangs.com/parse'


function App(props) {
  return (
    <div>
      <ul>

          {Parse.User.current() ? (
            <div>
            <li><Link to="/logout">Log out</Link> </li>
            <li><Link to="/page">Top secret</Link></li>
            </div>
          ) : (
            <li><Link to="/login">Sign in</Link></li>
          )}

      </ul>
      {props.children}
    </div>
  )
}


const Logout = React.createClass({
  componentDidMount() {
    Parse.User.logOut()
  },

  render() {
    return <p>You are now logged out</p>
  }
})


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
      Parse.User.logIn(this.state.value, this.state.pass).then(
        () => this.props.router.push({
                pathname: '/page'
              }),
        () => this.props.router.push({
                pathname: '/error'
              })
      )
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
          <label><input placeholder="username" value={this.state.value}
            onChange={this.handleValueChange}/></label>
          <label><input placeholder="password" value={this.state.pass}
            onChange={this.handlePassChange}/></label>

          <button type="submit">Submit the thing</button>
          <p><Link to="/page">Or authenticate via URL</Link></p>
          <p><Link to="/page?qsparam=bacon">Or try failing to authenticate via URL</Link></p>
        </form>
      )
    }
  })
)

function Page() {
  return <h1>This is the top secret you are looking for!</h1>
}

function ErrorPage() {
  return <h1>Oh no! Your auth failed!</h1>
}

function requireCredentials(nextState, replace, next) {
    // nextState is required to use replace
    if (Parse.User.current()) {
        next()
    } else {
      console.log('login failed')
      replace('/error')
      next()
    }
}

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Form} />
      <Route path="logout" component={Logout} />
      <Route path="page" component={Page} onEnter={requireCredentials}/>
      <Route path="error" component={ErrorPage}/>
    </Route>
  </Router>
), document.getElementById('root'))
