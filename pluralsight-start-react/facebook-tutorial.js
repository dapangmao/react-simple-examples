import React, {Component} from 'react'
import "./App.css"


const Board = (props) => {

    const boardRow = (i) => {
        const arr = [i, i+1, i+2];
        return (
            <div className="board-row">
                {arr.map(i =>
                    <button className="square" key={i} onClick={() => props.onClick(i)}>
                        {props.squares[i]}
                    </button>
                )}
            </div>
        )
    };

    return (
        <div>
            {boardRow(0)}
            {boardRow(3)}
            {boardRow(6)}
        </div>
    )
};

class App extends Component {
    state = {
        history: [
            {
                squares: Array(9).fill(null)
            }
        ],
        stepNumber: 0,
        xIsNext: true
    };

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const squares = history[history.length - 1].squares.slice();
        if (calculateWinner(squares) || squares[i])
            return;

        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 ? false : true  // history will not get impact
        });
    }

    moves() {
        return this.state.history.map((step, i) => {
                return (
                    <li key={i}>
                        <a href="#" onClick={() => this.jumpTo(i)}>
                            {i > 0 ? "Move #" + i : "Game start"}
                        </a>
                    </li>
                )
            }
        )
    }

    render() {
        const current = this.state.history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const status = winner ? "Winner: " + winner : "Next player: " + (this.state.xIsNext ? "X" : "O");

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.moves()}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

export default App;


