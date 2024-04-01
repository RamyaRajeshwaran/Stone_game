import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [rounds, setRounds] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState('');
  const [player2Choice, setPlayer2Choice] = useState('');
  const [gameId, setGameId] = useState(null);

  const startGame = async () => {
    if (player1.trim() === '' || player2.trim() === '') {
      alert('Please enter names for both players.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/games', { player1, player2 });
      const { data } = response;
      setGameId(data._id);
      setGameStarted(true);
      setCurrentRound(1);
      setRounds([]);
      setPlayer1Choice('');
      setPlayer2Choice('');
      setGameOver(false);
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please check your network connection and try again.');
    }
  };

  const handlePlayer1Choice = (choice) => {
    if (currentRound > 6) {
      alert('Game Over! Please start a new game.');
      return;
    }
    setPlayer1Choice(choice);
  };

  const handlePlayer2Choice = (choice) => {
    if (currentRound > 6) {
      alert('Game Over! Please start a new game.');
      return;
    }
    setPlayer2Choice(choice);
  };

  const determineWinner = async () => {
    if (player1Choice === '' || player2Choice === '') {
      alert('Both players need to make a selection.');
      return;
    }

    const winner = determineRoundWinner(player1Choice, player2Choice);

    try {
      const response = await axios.put(`http://localhost:5000/api/games/${gameId}`, {
        round: currentRound,
        player1Choice,
        player2Choice,
        winner,
      });
      const { data } = response;
      setRounds([...rounds, { round: currentRound, player1, player2, winner }]);
      setCurrentRound(currentRound + 1);
      setPlayer1Choice('');
      setPlayer2Choice('');
      if (currentRound === 6) {
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error determining winner:', error);
      alert('Failed to determine winner. Please check your network connection and try again.');
    }
  };

  const determineRoundWinner = (choice1, choice2) => {
    if (choice1 === choice2) {
      return 'tie';
    } else if (
      (choice1 === 'stone' && choice2 === 'scissors') ||
      (choice1 === 'scissors' && choice2 === 'paper') ||
      (choice1 === 'paper' && choice2 === 'stone')
    ) {
      return player1;
    } else {
      return player2;
    }
  };

  const calculateFinalScores = () => {
    let player1Score = 0;
    let player2Score = 0;
    rounds.forEach(round => {
      if (round.winner === player1) {
        player1Score++;
      } else if (round.winner === player2) {
        player2Score++;
      }
    });
    return { player1Score, player2Score };
  };

  return (
    <div className="App">
      <h1 className='heading'>Stone Paper Scissors Game</h1>
      {!gameStarted && (
        <div className='inputbox'>
          <input type="text" placeholder="Player 1 Name" value={player1} onChange={e => setPlayer1(e.target.value)} />
          <input type="text" placeholder="Player 2 Name" value={player2} onChange={e => setPlayer2(e.target.value)} />
          <button onClick={startGame}>Start Game</button>
        </div>
      )}
      {gameStarted && !gameOver && currentRound <= 6 && (
        <div className="choices">
          <h2>{player1}'s Turn:</h2>
          <button onClick={() => handlePlayer1Choice('stone')}>Stone</button>
          <button onClick={() => handlePlayer1Choice('paper')}>Paper</button>
          <button onClick={() => handlePlayer1Choice('scissors')}>Scissors</button>
          <h2>{player2}'s Turn:</h2>
          <button onClick={() => handlePlayer2Choice('stone')}>Stone</button>
          <button onClick={() => handlePlayer2Choice('paper')}>Paper</button>
          <button onClick={() => handlePlayer2Choice('scissors')}>Scissors</button>
          
          <button onClick={determineWinner}>Submit</button>
          
          <div className="rounds">
            {rounds.map((round, index) => (
              <div key={index} className="round">
                <h5>
                  Round {round.round}: {round.player1} vs {round.player2} - Winner: {round.winner}
                </h5>
              </div>
            ))}
          </div>
        </div>
      )}
      {gameOver && (
        <div className="scoreboard">
          <h2>Game Over!</h2>
          <h3>Final Scores:</h3>
          <h5>{player1}: {calculateFinalScores().player1Score} - {player2}: {calculateFinalScores().player2Score}</h5>
          <h3>Winner</h3>
          <h5>{calculateFinalScores().player1Score > calculateFinalScores().player2Score ? player1 : calculateFinalScores().player1Score < calculateFinalScores().player2Score ? player2 : 'It\'s a Tie!'}</h5>
        </div>
      )}
    </div>
  );
}

export default App;
