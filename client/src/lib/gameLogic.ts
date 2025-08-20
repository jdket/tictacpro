import { CellValue } from '@/lib/stores/useGameState';
import { getWinningLines } from '../utils/gameUtils';

export const checkWinningLine = (board: CellValue[]): number[] | null => {
  const lines = getWinningLines();
  
  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  
  return null;
};

export const isBoardFull = (board: CellValue[]): boolean => {
  return board.every(cell => cell !== null);
};

export const getEmptyCells = (board: CellValue[]): number[] => {
  return board
    .map((cell, index) => cell === null ? index : -1)
    .filter(index => index !== -1);
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
  
  for (let r = Math.max(0, row - 1); r <= Math.min(2, row + 1); r++) {
    for (let c = Math.max(0, col - 1); c <= Math.min(2, col + 1); c++) {
      const index = r * 3 + c;
      if (index !== cellIndex) {
        adjacent.push(index);
      }
    }
  }
  
  return adjacent;
};

export const getMirroredCell = (cellIndex: number): number => {
  // Mirror horizontally around center
  const row = getCellRow(cellIndex);
  const col = getCellColumn(cellIndex);
  const mirroredCol = 2 - col;
  return row * 3 + mirroredCol;
};

export const getRandomAIMove = (board: CellValue[], blockedCells: number[] = []): number | null => {
  const emptyCells = getEmptyCells(board).filter(cell => !blockedCells.includes(cell));
  
  if (emptyCells.length === 0) return null;
  
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

export const getAIMoveWithPreference = (
  board: CellValue[], 
  preference: 'center' | 'corners' | 'edges' | 'avoid-center' | 'near-last' | 'scatter',
  lastMove?: number,
  blockedCells: number[] = []
): number | null => {
  const emptyCells = getEmptyCells(board).filter(cell => !blockedCells.includes(cell));
  
  if (emptyCells.length === 0) return null;
  
  const corners = [0, 4, 20, 24];
  const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
  const center = [12];
  
  let preferredCells: number[] = [];
  
  switch (preference) {
    case 'center':
      preferredCells = emptyCells.filter(cell => center.includes(cell));
      break;
    case 'corners':
      preferredCells = emptyCells.filter(cell => corners.includes(cell));
      break;
    case 'edges':
      preferredCells = emptyCells.filter(cell => edges.includes(cell));
      break;
    case 'avoid-center':
      preferredCells = emptyCells.filter(cell => !center.includes(cell));
      break;
    case 'near-last':
      if (lastMove !== undefined) {
        const adjacent = getAdjacentCells(lastMove);
        preferredCells = emptyCells.filter(cell => adjacent.includes(cell));
      }
      break;
    case 'scatter':
      if (lastMove !== undefined) {
        const adjacent = getAdjacentCells(lastMove);
        preferredCells = emptyCells.filter(cell => !adjacent.includes(cell));
      }
      break;
  }
  
  const targetCells = preferredCells.length > 0 ? preferredCells : emptyCells;
  return targetCells[Math.floor(Math.random() * targetCells.length)];
};

export const canPlayerWin = (board: CellValue[]): number | null => {
  const lines = getWinningLines();
  
  for (const line of lines) {
    const values = line.map((i: number) => board[i]);
    
    // Check if player has 3 X's and one empty cell (4-in-a-row)
    if (values.filter((v: CellValue) => v === 'X').length === 3 && values.filter((v: CellValue) => v === null).length === 1) {
      return line.find((i: number) => board[i] === null) || null;
    }
  }
  
  return null;
};

export const canAIWin = (board: CellValue[]): number | null => {
  const lines = getWinningLines();
  
  for (const line of lines) {
    const values = line.map((i: number) => board[i]);
    
    // Check if AI has 3 O's and one empty cell (4-in-a-row)
    if (values.filter((v: CellValue) => v === 'O').length === 3 && values.filter((v: CellValue) => v === null).length === 1) {
      return line.find((i: number) => board[i] === null) || null;
    }
  }
  
  return null;
};
