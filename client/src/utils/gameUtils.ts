import { CellValue } from '../types/game';

export const getWinningLines = (): number[][] => {
  const lines: number[][] = [];
  
  // Rows (4-in-a-row horizontally)
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= 1; col++) { // 5-4+1 = 2 starting positions per row
      const line = [];
      for (let i = 0; i < 4; i++) {
        line.push(row * 5 + col + i);
      }
      lines.push(line);
    }
  }
  
  // Columns (4-in-a-row vertically)
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row <= 1; row++) { // 5-4+1 = 2 starting positions per column
      const line = [];
      for (let i = 0; i < 4; i++) {
        line.push((row + i) * 5 + col);
      }
      lines.push(line);
    }
  }
  
  // Diagonals (4-in-a-row diagonally)
  // Top-left to bottom-right
  for (let row = 0; row <= 1; row++) {
    for (let col = 0; col <= 1; col++) {
      const line = [];
      for (let i = 0; i < 4; i++) {
        line.push((row + i) * 5 + (col + i));
      }
      lines.push(line);
    }
  }
  
  // Top-right to bottom-left
  for (let row = 0; row <= 1; row++) {
    for (let col = 3; col < 5; col++) {
      const line = [];
      for (let i = 0; i < 4; i++) {
        line.push((row + i) * 5 + (col - i));
      }
      lines.push(line);
    }
  }
  
  return lines;
};

export const checkWinningLine = (board: CellValue[]): number[] | null => {
  const lines = getWinningLines();
  
  for (const line of lines) {
    if (line.every(cell => board[cell] && board[cell] === board[line[0]])) {
      return line;
    }
  }
  
  return null;
};

export const checkPlayerWinningLines = (board: CellValue[], player: 'X' | 'O'): number[][] => {
  const lines = getWinningLines();
  const winningLines: number[][] = [];
  
  for (const line of lines) {
    if (line.every(cell => board[cell] === player)) {
      winningLines.push(line);
    }
  }
  
  return winningLines;
};

export const checkNewWinningLines = (board: CellValue[], player: 'X' | 'O', lastMove: number): number[][] => {
  const lines = getWinningLines();
  const winningLines: number[][] = [];
  
  for (const line of lines) {
    // Only check lines that include the cell that was just played
    if (line.includes(lastMove) && line.every(cell => board[cell] === player)) {
      winningLines.push(line);
    }
  }
  
  return winningLines;
};

export const isBoardFull = (board: CellValue[]): boolean => {
  return board.every(cell => cell !== null);
};

export const getEmptyCells = (board: CellValue[]): number[] => {
  return board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);
};

export const getCellType = (index: number): 'corner' | 'edge' | 'center' => {
  // For 5x5 board (indices 0-24)
  const row = Math.floor(index / 5);
  const col = index % 5;
  
  // Center is position (2,2) = index 12
  if (row === 2 && col === 2) return 'center';
  
  // Corners are (0,0), (0,4), (4,0), (4,4) = indices 0, 4, 20, 24
  if ((row === 0 || row === 4) && (col === 0 || col === 4)) return 'corner';
  
  // Everything else is edge
  return 'edge';
};

export const getCellRow = (cellIndex: number): number => {
  return Math.floor(cellIndex / 3);
};

export const getCellColumn = (cellIndex: number): number => {
  return cellIndex % 3;
};

export const getAdjacentCells = (cellIndex: number): number[] => {
  const row = getCellRow(cellIndex);
  const col = getCellColumn(cellIndex);
  const adjacent: number[] = [];
  
  for (let r = Math.max(0, row - 1); r <= Math.min(2, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(2, col + 1); c++) {
      const index = r * 3 + c;
      if (index !== cellIndex && index >= 0 && index < 9) {
        adjacent.push(index);
      }
    }
  }
  
  return adjacent;
};

export const getMirroredCell = (cellIndex: number): number => {
  const row = getCellRow(cellIndex);
  const col = getCellColumn(cellIndex);
  const mirroredCol = 2 - col;
  return row * 3 + mirroredCol;
};

export const applyGravity = (cellIndex: number, board: CellValue[]): number => {
  const col = getCellColumn(cellIndex);
  
  // Find the lowest empty cell in the column
  for (let row = 2; row >= 0; row--) {
    const targetIndex = row * 3 + col;
    if (board[targetIndex] === null) {
      return targetIndex;
    }
  }
  
  return cellIndex; // No gravity effect if column is full
};

export const getRandomEmptyCell = (board: CellValue[], excludeCells: number[] = []): number | null => {
  const emptyCells = getEmptyCells(board).filter(cell => !excludeCells.includes(cell));
  
  if (emptyCells.length === 0) return null;
  
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const isLineType = (line: number[], type: 'row' | 'column' | 'diagonal'): boolean => {
  const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const columns = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
  const diagonals = [[0, 4, 8], [2, 4, 6]];
  
  switch (type) {
    case 'row':
      return rows.some(row => row.every(cell => line.includes(cell)));
    case 'column':
      return columns.some(col => col.every(cell => line.includes(cell)));
    case 'diagonal':
      return diagonals.some(diag => diag.every(cell => line.includes(cell)));
    default:
      return false;
  }
};
