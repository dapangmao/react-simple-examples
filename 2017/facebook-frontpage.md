```js
import React, {Component} from 'react'
import "./App.css"

export default class extends Component {
    state = {items: [], text: ''}

    render() {
        return (
            <div>
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

const TodoList = (props) => (
        <ul>
            {props.items.map((x, i) => (
                <li key={i}>{x}</li>
            ))}
        </ul>
    )
```
