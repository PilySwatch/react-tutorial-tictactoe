
import { useState } from 'react';

//---------- SQUARE
function Square({value, onSquareClick}) {
  return (
  <button className="square" onClick={onSquareClick}>
    {value}
  </button>
  );
}

//---------- BOARD
function Board({ xIsNext, squares, onPlay }) {
  // const [xIsNext, setXIsNext] = useState(true);
  //const [squares, setSquares] = useState(Array(9).fill(null));

  //  Square click
  function handleClick(i) {
    // avoid the X to be overwritten by an O, and viceversa -> squares[i]
    // check if someone won -> calculateWinner(squares)
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // immutability!
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "❌"; // before "X"
    } else {
      nextSquares[i] = "⭕️"; // before "O"
    }
    // setSquares(nextSquares);
    // setXIsNext(!xIsNext);
    onPlay(nextSquares);

  }

  // Display winner
  const winnerInfo = calculateWinner(squares);

  const winner = winnerInfo ? winnerInfo[0] : null;
  const winningLine = winnerInfo ? winnerInfo[1] : [];

  let status;
  if (winner) {
    status = "Winner: " + winner + "👏";
  } else {
    status = "Next player: " + (xIsNext ? "❌" : "⭕️");
  }

  // here was the hardcode of my squares. Now, we use 2 loops 
  const boardLength = 3
    const boardRows = [...Array(boardLength).keys()].map((row) => {
        const boardSquares = [...Array(boardLength).keys()].map((col) => {
            const i = boardLength*row + col;
            return (
                <Square 
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                winning={winningLine.includes(i)}
                />
            )
        })

        return (
            <div key={row} className="board-row">{boardSquares}</div>
        )
    })

    return (
        <>
            <div className="status">{status}</div>
            {boardRows}
        </>
    );
}

//---------- GAME (MAIN COMPONENT)
export default function Game() {
  //const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); // keep track of which step the user is currently viewing
  const xIsNext = currentMove % 2 === 0;
  //const currentSquares = history[history.length - 1];
  const currentSquares = history[currentMove];
  

  function handlePlay(nextSquares) {
    // setHistory([...history, nextSquares]); // array with ALL the items in history
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    //setXIsNext(!xIsNext);
  }

  // History of moves
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    //setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      
      <li key={move}>
        {move === currentMove ? (<>You are at move #{move}</>) : (<button onClick={() => jumpTo(move)}>{description}</button>)}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


//---------- CALCULATE WINNER
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

