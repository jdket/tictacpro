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
    const classes = ['game-cell'];
    
    // Basic cell state
    if (board[index] === 'X') classes.push('cell-x');
    if (board[index] === 'O') classes.push('cell-o');
    
    // Dimmed cell state - grayed out appearance
    if (effectState.dimmedCells.includes(index)) {
      classes.push('cell-dimmed');
    }
    
    // Winning line highlight
    if (winningLine && winningLine.includes(index)) {
      classes.push('cell-winner');
    }
    
    return classes.join(' ');
  };

  const getCellContent = (index: number): string => {
    // If cell is dimmed and has content, hide the actual content (overlay will show ?)
    if (effectState.dimmedCells.includes(index) && board[index]) {
      return '';
    }
    return board[index] || '';
  };

  const getCellStyle = (index: number): React.CSSProperties => {
    // No inline style needed, handled by CSS now
    return {};
  };

  const getCellOverlay = (index: number): JSX.Element | null => {
    // Show question mark overlay for dimmed cells with content
    if (effectState.dimmedCells.includes(index) && board[index]) {
      return (
        <div className="question-mark-overlay">
          ?
        </div>
      );
    }
    return null;
  };

  const isCellClickable = (index: number): boolean => {
    return board[index] === null;
  };

  return (
    <div className="tic-tac-board">
      {board.map((_, index) => (
        <div
          key={index}
          className={getCellClassName(index)}
          onClick={() => isCellClickable(index) && onCellClick(index)}
          data-cell-index={index}
          style={getCellStyle(index)}
        >
          {getCellContent(index)}
          {getCellOverlay(index)}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;