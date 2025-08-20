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
    
    // Winning line highlight
    if (winningLine && winningLine.includes(index)) {
      classes.push('cell-winner');
    }
    
    return classes.join(' ');
  };

  const getCellContent = (index: number): string => {
    return board[index] || '';
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
        >
          {getCellContent(index)}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;