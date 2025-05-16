import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [gameAreaSize, setGameAreaSize] = useState({ width: 600, height: 400 });
  const gameAreaRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      placeTarget();
      const interval = setInterval(() => {
        moveTarget();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, isGameOver]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setGameStarted(true);
    if (gameAreaRef.current) {
      const { clientWidth, clientHeight } = gameAreaRef.current;
      setGameAreaSize({ width: clientWidth, height: clientHeight });
    }
  };

  const placeTarget = () => {
    const maxX = gameAreaSize.width - 60;
    const maxY = gameAreaSize.height - 60;
    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);
    setTargetPosition({ x, y });
  };

  const moveTarget = () => {
    const newX = Math.floor(Math.random() * (gameAreaSize.width - 60));
    const newY = Math.floor(Math.random() * (gameAreaSize.height - 60));
    setTargetPosition({ x: newX, y: newY });
  };

  const handleClick = () => {
    setScore(score + 1);
    moveTarget();
  };

  const handleMissClick = () => {
    if (lives > 1) {
      setLives(lives - 1);
      moveTarget();
    } else {
      setLives(0);
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsGameOver(false);
    setScore(0);
    setLives(3);
  };

  return (
    <div className="app-container">
      <div className="max-width-wrapper">
        <header className="game-header">
          <h1>Target Shooter</h1>
          <p>Test your reflexes and aim!</p>
        </header>

        <main className="game-main">
          {!gameStarted ? (
            <div className="start-screen">
              <div className="instructions">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h2>How to Play</h2>
                <ul>
                  <li><span className="bullet green"></span>Click the red targets as fast as you can</li>
                  <li><span className="bullet blue"></span>You get 1 point for each successful hit</li>
                  <li><span className="bullet yellow"></span>You have 3 lives - be careful!</li>
                </ul>
              </div>
              <button onClick={startGame} className="start-button">Start Game</button>
            </div>
          ) : (
            <div className="game-info">
              <div className="score-box">
                <div className="label">Score</div>
                <div className="value">{score}</div>
              </div>
              <div className="lives-box">
                <div className="label">Lives</div>
                <div className="lives-indicator">
                  {[...Array(lives)].map((_, i) => (
                    <div key={i} className="live active"></div>
                  ))}
                  {[...Array(3 - lives)].map((_, i) => (
                    <div key={`empty-${i}`} className="live inactive"></div>
                  ))}
                </div>
              </div>
              <div className="reset-box">
                <button onClick={resetGame} className="reset-button">Reset Game</button>
              </div>
            </div>
          )}

          {gameStarted && (
            <div ref={gameAreaRef} className="game-area" onClick={handleMissClick}>
              <div
                className="target"
                style={{
                  left: `${targetPosition.x}px`,
                  top: `${targetPosition.y}px`,
                  transform: `translate(-50%, -50%)`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <div className="target-inner">
                  <div className="center-dot"></div>
                </div>
              </div>

              {isGameOver && (
                <div className="game-over-overlay">
                  <h2>Game Over</h2>
                  <p>Your final score: <span>{score}</span></p>
                  <button onClick={resetGame} className="play-again-button">Play Again</button>
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="game-footer">
          <p>© {new Date().getFullYear()} Ahmad Fashich | Target Shooter Game</p>
        </footer>
      </div>
    </div>
  );
}

export default App;