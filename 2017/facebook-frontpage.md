```js

import React, {Component} from 'react'
import "./App.css"

import Remarkable from 'remarkable'

export default class extends Component {
    state = {items: [], text: ''}

    render() {
        return (
            <div>
                <Timer/>
                <hr/>
                <MarkdownEditor/>
                <hr/>
                <h3>TO-DO</h3>
                <TodoList items={this.state.items}/>
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        value={this.state.text}
                    />
                    <button>
                        Add #{this.state.items.length + 1}
                    </button>
                </form>
            </div>
        );
    }

    handleChange = (e) => {
        this.setState({text: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.state.text.length) {
            return;
        }

        this.setState((prevState) => ({
            items: prevState.items.concat(this.state.text),
            text: ''
        }));
    }
}

class Timer extends Component {

    state = {seconds: 0};

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState((prevState) => ({
                seconds: prevState.seconds + 1
            }))
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div>
                Seconds: {this.state.seconds}
            </div>
        );
    }
}

const TodoList = (props) => (
    <ul>
        {props.items.map((x, i) => (
            <li key={i}>{x}</li>
        ))}
    </ul>
)

class MarkdownEditor extends Component {
    state = {value: 'Type some *markdown* here!'};

    handleChange = (e) => {
        this.setState({value: e.target.value});
    }

    getRawMarkup() {
        const md = new Remarkable();
        return {__html: md.render(this.state.value)};
    }

    render() {
        return (
            <div className="MarkdownEditor">
                <h3>Input</h3>
                <textarea
                    onChange={this.handleChange}
                    defaultValue={this.state.value}
                />
                <h3>Output</h3>
                <div
                    className="content"
                    dangerouslySetInnerHTML={this.getRawMarkup()}
                />
            </div>
        );
    }
}
```
