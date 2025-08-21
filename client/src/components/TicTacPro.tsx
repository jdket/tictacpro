import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import GameBoard from './GameBoard';
import DualScoreDisplay from './DualScoreDisplay';
import LevelDisplay from './LevelDisplay';

const TicTacPro: React.FC = () => {
  const {
    gameState,
    startGame,
    nextLevel,
    makeMove,
    setGhostPreview,
    useSpecialAbility
  } = useGameLogic();

  const handleCellClick = (cellIndex: number) => {
    if (gameState.phase === 'playing') {
      makeMove(cellIndex);
    }
  };

  const handleCellHover = (cellIndex: number | null) => {
    setGhostPreview(cellIndex);
  };

  return (
    <div className="tic-tac-pro">
      {gameState.phase === 'menu' && !gameState.showLevelPreview && (
        <div className="menu-screen">
          <h1>TicTacPro</h1>
          <p>Enhanced Tic-Tac-Toe with 50 Effects & 20 Obstacles</p>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      )}

      {gameState.phase === 'menu' && gameState.showLevelPreview && (
        <div className="level-preview-screen">
          <h2>NEXT ROUND</h2>
          <div className="level-info">
            <LevelDisplay level={gameState.currentLevel} />
          </div>
          <div className="effects-preview">
            {gameState.nextLevelEffects.map((effect, index) => (
              <div key={index} className="effect-preview good-effect">
                <h3>{effect.name}</h3>
                <p>{effect.text}</p>
              </div>
            ))}
            {gameState.nextLevelObstacles.map((obstacle, index) => (
              <div key={index} className="effect-preview bad-effect">
                <h3>{obstacle.name}</h3>
                <p>{obstacle.text}</p>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="start-button">
            Start Level
          </button>
        </div>
      )}

      {gameState.phase === 'playing' && (
        <div className="game-area">
          <div className="game-layout">
            <div className="level-section">
              <LevelDisplay level={gameState.currentLevel} />
            </div>
            
            <div className="score-section">
              <DualScoreDisplay 
                playerScore={gameState.score} 
                opponentScore={gameState.opponentScore} 
              />
            </div>
            
            <div></div> {/* Empty space for grid balance */}
          </div>

          <div className="board-section">
            <GameBoard
              board={gameState.board}
              onCellClick={handleCellClick}
              onCellHover={handleCellHover}
              winningLine={gameState.winningLine}
              ghostPreview={gameState.ghostPreview}
              effectState={gameState.effectState}
              showingFlash={gameState.showingFlash}
              boardBlinking={gameState.boardBlinking}
            />
          </div>
        </div>
      )}

      {gameState.phase === 'level_complete' && (
        <div className="level-complete-screen">
          <h2>Level {gameState.currentLevel} Complete!</h2>
          <div className="round-scores">
            <p>Your Score: {gameState.score}</p>
            <p>Opponent Score: {gameState.opponentScore}</p>
          </div>
          {gameState.currentLevel < 10 ? (
            <button onClick={nextLevel} className="next-level-button">
              Next Level
            </button>
          ) : (
            <div className="game-complete">
              <h2>Game Complete!</h2>
              <div className="final-scores">
                <p>Final Score: {gameState.score}</p>
                <p>Opponent Final Score: {gameState.opponentScore}</p>
              </div>
              <button onClick={startGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicTacPro;
