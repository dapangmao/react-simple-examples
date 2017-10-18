// body {
//     font: 14px "Century Gothic", Futura, sans-serif;
//     margin: 20px;
// }
//
// ol, ul {
//     padding-left: 30px;
// }
//
// .board-row:after {
//     clear: both;
//     content: "";
//     display: table;
// }
//
// .status {
//     margin-bottom: 10px;
// }
//
// .square {
//     background: #fff;
//     border: 1px solid #999;
//     float: left;
//     font-size: 24px;
//     font-weight: bold;
//     line-height: 34px;
//     height: 34px;
//     margin-right: -1px;
//     margin-top: -1px;
//     padding: 0;
//     text-align: center;
//     width: 34px;
// }
//
// .square:focus {
//     outline: none;
// }
//
// .kbd-navigation .square:focus {
//     background: #ddd;
// }
//
// .game {
//     display: flex;
//     flex-direction: row;
// }
//
// .game-info {
//     margin-left: 20px;
// }
import React, {Component} from 'react'
import "./App.css"

const Board = (props) => (
    <div className="game-board">
        {
            [0, 3, 6].map(i =>
                <div className="board-row" key={i}>
                    {[i, i + 1, i + 2].map(j =>
                        <button className="square" key={j} onClick={() => props.onClick(j)}>
                            {props.squares[j]}
                        </button>
                    )}
                </div>
            )
        }
    </div>
);

const Moves = (props) => (
    <ol>
        {props.history.map((step, i) =>
            <li key={i}>
                <a href="#" onClick={() => props.jumpTo(i)}>
                    {i > 0 ? "Move #" + i : "Game start"}
                </a>
            </li>
        )
        }
    </ol>
);

export default class extends Component {
    state = {
        history: [
            {
                squares: new Array(9).fill(null)
            }
        ],
        stepNumber: 0,
        xIsNext: true
    };

    // The two blocks below are the functions that need to be passed to the children components
    handleClick = (i) => {
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
    };

    jumpTo = (step) => {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    };

    renderStatus() {
        const current = this.state.history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status = "Next player: " + (this.state.xIsNext ? "X" : "O")
        if (winner)
            status = "Winner: " + winner
        return (
            <div>
                {status}
            </div>
        )
    };

    render() {
        return (
            <div className="game">
                <Board
                    squares={this.state.history[this.state.stepNumber].squares}
                    onClick={this.handleClick}
                />
                <div className="game-info">
                    {this.renderStatus()}
                    <Moves history={this.state.history} jumpTo={this.jumpTo}/>
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

