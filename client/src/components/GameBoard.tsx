import React from 'react';
import { CellValue, EffectState } from '../types/game';

interface GameBoardProps {
  board: CellValue[];
  onCellClick: (cellIndex: number) => void;
  onCellHover: (cellIndex: number | null) => void;
  winningLine: number[] | null;
  ghostPreview: number | null;
  effectState: EffectState;
  showingFlash: boolean;
  boardBlinking: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  onCellHover,
  winningLine,
  ghostPreview,
  effectState,
  showingFlash,
  boardBlinking
}) => {
  const getCellClassName = (index: number): string => {
    const classes = ['cell'];
    
    // Basic cell state
    if (board[index] === 'X') classes.push('x-cell');
    if (board[index] === 'O') classes.push('o-cell');
    
    // Winning line highlight
    if (winningLine && winningLine.includes(index)) {
      classes.push('winning-cell');
    }
    
    // Ghost preview
    if (ghostPreview === index && board[index] === null) {
      classes.push('ghost-preview');
    }
    
    // Effect states
    if (effectState.blockedCells.includes(index)) {
      classes.push('blocked-cell');
    }
    
    if (effectState.frozenCells.includes(index)) {
      classes.push('frozen-cell');
    }
    
    if (effectState.hiddenCells.includes(index)) {
      classes.push('hidden-cell');
    }
    
    if (effectState.trailX === index) {
      classes.push('trail-x');
    }
    
    if (effectState.shadowO === index) {
      classes.push('shadow-o');
    }
    
    if (effectState.mirrorHint === index) {
      classes.push('mirror-hint');
    }
    
    if (effectState.bounceTile === index) {
      classes.push('bounce-tile');
    }
    
    if (effectState.swapTile === index) {
      classes.push('swap-tile');
    }
    
    if (effectState.windBlocked.includes(index)) {
      classes.push('wind-blocked');
    }
    
    // Flash effect
    if (showingFlash && effectState.flashLine && effectState.flashLine.includes(index)) {
      classes.push('flash-cell');
    }
    
    // Board blinking
    if (boardBlinking) {
      classes.push('blinking');
    }
    
    // Memory effects
    if (effectState.memoryCell === index) {
      classes.push('memory-cell');
    }
    
    return classes.join(' ');
  };

  const getCellContent = (index: number): string => {
    if (effectState.hiddenCells.includes(index) && board[index] === null) {
      return '?';
    }
    
    if (ghostPreview === index && board[index] === null) {
      return 'X';
    }
    
    return board[index] || '';
  };

  const isCellClickable = (index: number): boolean => {
    return board[index] === null && 
           !effectState.blockedCells.includes(index) &&
           !effectState.windBlocked.includes(index);
  };

  return (
    <div className={`game-board ${boardBlinking ? 'board-blinking' : ''}`}>
      {board.map((_, index) => (
        <div
          key={index}
          className={getCellClassName(index)}
          onClick={() => isCellClickable(index) && onCellClick(index)}
          onMouseEnter={() => isCellClickable(index) && onCellHover(index)}
          onMouseLeave={() => onCellHover(null)}
          data-cell-index={index}
          data-cell-type={
            index === 4 ? 'center' : 
            [0, 2, 6, 8].includes(index) ? 'corner' : 'edge'
          }
        >
          <span className="cell-content">
            {getCellContent(index)}
          </span>
          
          {/* Special visual indicators */}
          {effectState.blockedCells.includes(index) && (
            <div className="blocked-indicator">🗿</div>
          )}
          
          {effectState.frozenCells.includes(index) && (
            <div className="frozen-indicator">❄️</div>
          )}
          
          {effectState.bounceTile === index && (
            <div className="bounce-indicator">↗️</div>
          )}
          
          {effectState.swapTile === index && (
            <div className="swap-indicator">🔄</div>
          )}
          
          {effectState.windBlocked.includes(index) && (
            <div className="wind-indicator">💨</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
