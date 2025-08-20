import React from 'react';
import { GameState } from '../types/game';

interface GameUIProps {
  gameState: GameState;
  useSpecialAbility: (abilityType: string, cellIndex?: number) => boolean;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, useSpecialAbility }) => {
  const renderSpecialAbilities = () => {
    if (!gameState.currentEffect) return null;

    const abilities = [];

    // Safe Retry (e012)
    if (gameState.currentEffect.id === 'e012' && !gameState.effectState.safeRetryUsed) {
      abilities.push(
        <button
          key="safe-retry"
          onClick={() => useSpecialAbility('safe_retry')}
          className="ability-button"
          disabled={gameState.lastPlayerMove === null}
        >
          Safe Retry
        </button>
      );
    }

    // Skip AI (e019)
    if (gameState.currentEffect.id === 'e019' && !gameState.effectState.skipAIUsed) {
      abilities.push(
        <button
          key="skip-ai"
          onClick={() => useSpecialAbility('skip_ai')}
          className="ability-button"
        >
          Skip AI Turn
        </button>
      );
    }

    // Recall - Remove O (e020)
    if (gameState.currentEffect.id === 'e020' && !gameState.effectState.recallUsed) {
      const oPositions = gameState.board
        .map((cell, index) => cell === 'O' ? index : -1)
        .filter(index => index !== -1);
      
      if (oPositions.length > 0) {
        abilities.push(
          <div key="recall" className="recall-ability">
            <p>Click an O to remove it:</p>
            <div className="recall-buttons">
              {oPositions.map(pos => (
                <button
                  key={pos}
                  onClick={() => useSpecialAbility('recall', pos)}
                  className="recall-button"
                >
                  Remove O at {pos}
                </button>
              ))}
            </div>
          </div>
        );
      }
    }

    // Cross Swap (e014)
    if (gameState.currentEffect.id === 'e014' && !gameState.effectState.crossSwapUsed) {
      const xPositions = gameState.board
        .map((cell, index) => cell === 'X' ? index : -1)
        .filter(index => index !== -1);
      
      if (xPositions.length > 0) {
        abilities.push(
          <div key="cross-swap" className="swap-ability">
            <p>Cross Swap available - move an X to empty cell</p>
          </div>
        );
      }
    }

    // Twin Mark (e016)
    if (gameState.currentEffect.id === 'e016' && !gameState.effectState.twinMarkUsed) {
      abilities.push(
        <div key="twin-mark" className="ability-indicator">
          Twin Mark Active - Place 2 X this turn!
        </div>
      );
    }

    return abilities.length > 0 ? (
      <div className="special-abilities">
        <h3>Special Abilities</h3>
        {abilities}
      </div>
    ) : null;
  };

  const renderGameStats = () => (
    <div className="game-stats">
      <div className="stat">
        <span className="stat-label">Moves:</span>
        <span className="stat-value">{gameState.moveCount}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Lines:</span>
        <span className="stat-value">{gameState.linesCompleted}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Combo:</span>
        <span className="stat-value">{gameState.comboCount}</span>
      </div>
      {gameState.streakCount > 0 && (
        <div className="stat">
          <span className="stat-label">Streak:</span>
          <span className="stat-value">{gameState.streakCount}</span>
        </div>
      )}
    </div>
  );

  const renderMoveHistory = () => (
    <div className="move-history">
      <h4>Recent Moves</h4>
      <div className="moves">
        {gameState.moveHistory.slice(-6).map((move, index) => (
          <span key={index} className="move-indicator">
            {move}
          </span>
        ))}
      </div>
    </div>
  );

  const renderEffectProgress = () => {
    if (!gameState.currentEffect) return null;

    const effect = gameState.currentEffect;
    
    // Triple Cherry progress (e008)
    if (effect.id === 'e008') {
      return (
        <div className="effect-progress">
          <span>Triple Cherry Progress: {gameState.linesCompleted}/3</span>
        </div>
      );
    }

    // Order Recall (e028)
    if (effect.id === 'e028') {
      const recentMoves = gameState.moveHistory.slice(-3);
      return (
        <div className="effect-progress">
          <span>Last 3 moves: {recentMoves.join(', ')}</span>
        </div>
      );
    }

    // Two Line Gift progress (e047)
    if (effect.id === 'e047') {
      return (
        <div className="effect-progress">
          <span>Two Line Gift: {gameState.linesCompleted}/2</span>
        </div>
      );
    }

    // Corner Collector progress (e049)
    if (effect.id === 'e049') {
      const corners = [0, 2, 6, 8];
      const filledCorners = corners.filter(corner => gameState.board[corner] !== null).length;
      return (
        <div className="effect-progress">
          <span>Corner Collector: {filledCorners}/4 corners filled</span>
        </div>
      );
    }

    // No Center Gift tracker (e048)
    if (effect.id === 'e048') {
      return (
        <div className="effect-progress">
          <span>No Center Gift: {gameState.usedCenter ? 'FAILED' : 'ACTIVE'}</span>
        </div>
      );
    }

    // Combo Counter (e004)
    if (effect.id === 'e004') {
      return (
        <div className="effect-progress">
          <span>Combo Multiplier: x{gameState.comboCount + 1}</span>
        </div>
      );
    }

    return null;
  };

  const renderConstraints = () => {
    const constraints = [];
    
    // Edge Magnet constraint (e017)
    if (gameState.currentEffect?.id === 'e017' && gameState.moveCount === 0) {
      constraints.push(
        <div key="edge-magnet" className="constraint">
          First move must be on an edge!
        </div>
      );
    }

    // Corner Magnet constraint (e018)
    if (gameState.currentEffect?.id === 'e018' && gameState.moveCount === 0) {
      constraints.push(
        <div key="corner-magnet" className="constraint">
          First move must be on a corner!
        </div>
      );
    }

    // Row/Column repeat constraints
    if (gameState.currentObstacle?.id === 'o009' && gameState.effectState.lastRowUsed !== null) {
      constraints.push(
        <div key="no-repeat-row" className="constraint">
          Cannot repeat row {gameState.effectState.lastRowUsed}
        </div>
      );
    }

    if (gameState.currentObstacle?.id === 'o010' && gameState.effectState.lastColumnUsed !== null) {
      constraints.push(
        <div key="no-repeat-col" className="constraint">
          Cannot repeat column {gameState.effectState.lastColumnUsed}
        </div>
      );
    }

    return constraints.length > 0 ? (
      <div className="constraints">
        <h4>Constraints</h4>
        {constraints}
      </div>
    ) : null;
  };

  const renderHints = () => {
    const hints = [];

    // Memory Mark hint (e021)
    if (gameState.currentEffect?.id === 'e021' && gameState.effectState.memoryCell !== null) {
      hints.push(
        <div key="memory-mark" className="hint">
          Remember the hidden cell!
        </div>
      );
    }

    // Ghost Peek hint (e013)
    if (gameState.currentEffect?.id === 'e013') {
      hints.push(
        <div key="ghost-peek" className="hint">
          Hover over cells to preview winning moves
        </div>
      );
    }

    // Hide Corners/Edges hints (e025, e026)
    if (gameState.currentEffect?.id === 'e025') {
      hints.push(
        <div key="hide-corners" className="hint">
          Corners are dimmed - remember them for bonus coins!
        </div>
      );
    }

    if (gameState.currentEffect?.id === 'e026') {
      hints.push(
        <div key="hide-edges" className="hint">
          Edges are dimmed - remember them for bonus coins!
        </div>
      );
    }

    return hints.length > 0 ? (
      <div className="hints">
        <h4>Hints</h4>
        {hints}
      </div>
    ) : null;
  };

  return (
    <div className="game-ui">
      {renderGameStats()}
      {renderSpecialAbilities()}
      {renderEffectProgress()}
      {renderConstraints()}
      {renderHints()}
      {renderMoveHistory()}
      
      {/* Debug info (can be removed in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <h4>Debug Info</h4>
          <p>Phase: {gameState.phase}</p>
          <p>Level: {gameState.currentLevel}</p>
          <p>Effect: {gameState.currentEffect?.name || 'None'}</p>
          <p>Obstacle: {gameState.currentObstacle?.name || 'None'}</p>
          <p>Blocked: [{gameState.effectState.blockedCells.join(', ')}]</p>
          <p>Hidden: [{gameState.effectState.hiddenCells.join(', ')}]</p>
          <p>Wind Blocked: [{gameState.effectState.windBlocked.join(', ')}]</p>
          <p>Used Center: {gameState.usedCenter.toString()}</p>
          <p>First Move Center: {gameState.firstMoveWasCenter.toString()}</p>
        </div>
      )}
    </div>
  );
};

export default GameUI;
