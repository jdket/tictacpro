import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import GameBoard from './GameBoard';
import GameUI from './GameUI';
import EffectDisplay from './EffectDisplay';
import ObstacleDisplay from './ObstacleDisplay';
import ScoreDisplay from './ScoreDisplay';
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
    if (gameState.currentEffect?.id === 'e013') { // Ghost Peek
      setGhostPreview(cellIndex);
    }
  };

  return (
    <div className="tic-tac-pro">
      <div className="game-header">
        <LevelDisplay level={gameState.currentLevel} />
        <ScoreDisplay 
          totalCoins={gameState.totalCoins} 
          levelCoins={gameState.levelCoins} 
        />
      </div>

      {gameState.phase === 'menu' && (
        <div className="menu-screen">
          <h1>TicTacPro</h1>
          <p>Enhanced Tic-Tac-Toe with 50 Effects & 20 Obstacles</p>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      )}

      {gameState.phase === 'playing' && (
        <div className="game-area">
          <div className="effects-panel">
            {gameState.currentEffect && (
              <EffectDisplay effect={gameState.currentEffect} />
            )}
            {gameState.currentObstacle && (
              <ObstacleDisplay obstacle={gameState.currentObstacle} />
            )}
          </div>

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

          <GameUI
            gameState={gameState}
            useSpecialAbility={useSpecialAbility}
          />
        </div>
      )}

      {gameState.phase === 'level_complete' && (
        <div className="level-complete-screen">
          <h2>Level {gameState.currentLevel} Complete!</h2>
          <p>Coins earned: {gameState.levelCoins}</p>
          <p>Total coins: {gameState.totalCoins + gameState.levelCoins}</p>
          {gameState.currentLevel < 10 ? (
            <button onClick={nextLevel} className="next-level-button">
              Next Level
            </button>
          ) : (
            <div className="game-complete">
              <h2>Game Complete!</h2>
              <p>Final Score: {gameState.totalCoins + gameState.levelCoins} coins</p>
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
