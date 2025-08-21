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
  return Math.floor(cellIndex / 5);
};

export const getCellColumn = (cellIndex: number): number => {
  return cellIndex % 5;
};

export const getAdjacentCells = (cellIndex: number): number[] => {
  const row = getCellRow(cellIndex);
  const col = getCellColumn(cellIndex);
  const adjacent: number[] = [];
  
  for (let r = Math.max(0, row - 1); r <= Math.min(4, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(4, col + 1); c++) {
      const index = r * 5 + c;
      if (index !== cellIndex && index >= 0 && index < 25) {
        adjacent.push(index);
      }
    }
  }
  
  return adjacent;
};

export const getMirroredCell = (cellIndex: number): number => {
  const row = getCellRow(cellIndex);
  const col = getCellColumn(cellIndex);
  const mirroredCol = 4 - col;
  return row * 5 + mirroredCol;
};

export const applyGravity = (cellIndex: number, board: CellValue[]): number => {
  const col = getCellColumn(cellIndex);
  
  // Find the lowest empty cell in the column
  for (let row = 4; row >= 0; row--) {
    const targetIndex = row * 5 + col;
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
  const firstCell = line[0];
  const firstRow = Math.floor(firstCell / 5);
  const firstCol = firstCell % 5;
  
  switch (type) {
    case 'row':
      // Check if all cells are in the same row and consecutive
      return line.every(cell => Math.floor(cell / 5) === firstRow) &&
             line.length === 4 &&
             line.every((cell, i) => cell === firstCell + i);
    case 'column':
      // Check if all cells are in the same column and consecutive
      return line.every(cell => cell % 5 === firstCol) &&
             line.length === 4 &&
             line.every((cell, i) => cell === firstCell + (i * 5));
    case 'diagonal':
      // Check if it's a diagonal pattern
      if (line.length !== 4) return false;
      const isMainDiagonal = line.every((cell, i) => cell === firstCell + (i * 6)); // +6 for main diagonal in 5x5
      const isAntiDiagonal = line.every((cell, i) => cell === firstCell + (i * 4)); // +4 for anti-diagonal in 5x5
      return isMainDiagonal || isAntiDiagonal;
    default:
      return false;
  }
};
