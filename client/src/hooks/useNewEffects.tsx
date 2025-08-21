import { useCallback } from 'react';
import { GameState, Effect } from '../types/game';
import { getCellType, getCellRow, getCellColumn } from '../utils/gameUtils';

export const useNewEffects = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  
  const processEffect = useCallback((
    cellIndex: number, 
    winningLine: number[] | null, 
    context: 'move' | 'level_end' = 'move'
  ): number => {
    if (!gameState.currentEffect) return 0;
    
    const effect = gameState.currentEffect;
    let coins = 0;

    switch (effect.id) {
      // SCORING EFFECTS
      case 'e001': // Center Boost
        if (winningLine && winningLine.includes(12)) {
          coins += effect.value;
        }
        break;
      
      case 'e002': // Corner Bonus
        if (winningLine) {
          const corners = [0, 4, 20, 24];
          const cornerCount = winningLine.filter(cell => corners.includes(cell)).length;
          coins += cornerCount * effect.value;
        }
        break;
      
      case 'e003': // Edge Bonus
        if (winningLine) {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          const edgeCount = winningLine.filter(cell => edges.includes(cell)).length;
          coins += edgeCount * effect.value;
        }
        break;
      
      case 'e004': // Combo Counter
        // Each additional 4-in-a-row after the first gives +1000 pts
        // This would need combo tracking in game state
        break;
      
      case 'e005': // Diagonal Bonus
        if (winningLine) {
          const isDiagonal = isLineDiagonal(winningLine);
          if (isDiagonal) coins += effect.value;
        }
        break;
      
      case 'e006': // Row Runner
        if (winningLine) {
          const isHorizontal = isLineHorizontal(winningLine);
          if (isHorizontal) coins += effect.value;
        }
        break;
      
      case 'e007': // Column Climber
        if (winningLine) {
          const isVertical = isLineVertical(winningLine);
          if (isVertical) coins += effect.value;
        }
        break;
      
      case 'e008': // Triple Cherry
        if (context === 'level_end') {
          // If you score 3+ 4-in-a-rows this level, +3000 at end
          // This would need line counting in game state
        }
        break;
      
      case 'e009': // Quick Start
        if (cellIndex === 12 && gameState.moveHistory.length === 1) {
          coins += effect.value;
        }
        break;
      
      case 'e010': // Fast Corner
        if (winningLine) {
          const corners = [0, 4, 20, 24];
          if (corners.includes(cellIndex)) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e011': // Line Streak
        // Scoring on two consecutive turns gives +2000 pts
        // This would need turn tracking
        break;
      
      case 'e012': // Middle Master
        if (winningLine) {
          const isMiddleRow = winningLine.every(cell => getCellRow(cell) === 2);
          const isMiddleCol = winningLine.every(cell => getCellColumn(cell) === 2);
          if (isMiddleRow || isMiddleCol) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e013': // Two Line Gift
        if (context === 'level_end') {
          // Exactly 2 lines this level, +2000 pts
          // This would need line counting
        }
        break;
      
      case 'e014': // Corner Collector
        if (context === 'level_end') {
          const corners = [0, 4, 20, 24];
          if (corners.every(corner => gameState.board[corner] !== null)) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e015': // Top Focus
        if (winningLine) {
          const isTopHalf = winningLine.every(cell => getCellRow(cell) <= 1);
          if (isTopHalf) coins += effect.value;
        }
        break;
      
      case 'e016': // Bottom Focus
        if (winningLine) {
          const isBottomHalf = winningLine.every(cell => getCellRow(cell) >= 3);
          if (isBottomHalf) coins += effect.value;
        }
        break;
      
      // MEMORY EFFECTS
      case 'e017': // Memory Challenge
        if (winningLine) {
          // Dimmed tiles give double score
          const dimmedInLine = winningLine.filter(cell => 
            gameState.effectState.dimmedCells.includes(cell)
          ).length;
          if (dimmedInLine > 0) {
            coins += 1000 * dimmedInLine; // Base score gets doubled elsewhere
          }
        }
        break;
      
      case 'e018': // Corner Memory
        if (winningLine) {
          const corners = [0, 4, 20, 24];
          const dimmedCorners = winningLine.filter(cell => 
            corners.includes(cell) && gameState.effectState.dimmedCells.includes(cell)
          ).length;
          coins += dimmedCorners * effect.value;
        }
        break;
      
      case 'e019': // Edge Memory
        if (winningLine) {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          const dimmedEdges = winningLine.filter(cell => 
            edges.includes(cell) && gameState.effectState.dimmedCells.includes(cell)
          ).length;
          coins += dimmedEdges * effect.value;
        }
        break;
      
      // WILD EFFECTS
      case 'e020': // Wild Favor
        if (winningLine) {
          // Wild tiles in 4-in-a-row give double score
          const wildInLine = winningLine.filter(cell => 
            gameState.effectState.wildCells.includes(cell)
          ).length;
          if (wildInLine > 0) {
            coins += 1000 * wildInLine; // Base score gets doubled elsewhere
          }
        }
        break;
      
      case 'e021': // Wild Corners
        if (winningLine) {
          const corners = [0, 4, 20, 24];
          const wildCorners = winningLine.filter(cell => 
            corners.includes(cell) && gameState.effectState.wildCells.includes(cell)
          ).length;
          coins += wildCorners * effect.value;
        }
        break;
      
      case 'e022': // Wild Edges
        if (winningLine) {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          const wildEdges = winningLine.filter(cell => 
            edges.includes(cell) && gameState.effectState.wildCells.includes(cell)
          ).length;
          coins += wildEdges * effect.value;
        }
        break;
      
      case 'e023': // Wild Collector
        if (context === 'level_end') {
          // Use all 3 in different 4-in-a-rows for +3000 pts
          // This would need tracking of which wilds were used
        }
        break;
      
      case 'e024': // Wild Saver
        if (context === 'level_end') {
          // Avoid Wild tiles all level for +2000 pts
          const usedWild = gameState.moveHistory.some(move => 
            gameState.effectState.wildCells.includes(move)
          );
          if (!usedWild) {
            coins += effect.value;
          }
        }
        break;
    }

    return coins;
  }, [gameState]);

  const initializeEffect = useCallback((effect: Effect) => {
    switch (effect.id) {
      // MEMORY EFFECTS - Set up dimmed cells
      case 'e017': // Memory Challenge - Dim 5 tiles
        const randomCells5 = getRandomCells(5);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: randomCells5
          }
        }));
        break;
      
      case 'e018': // Corner Memory - Dim all 4 corners
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: [0, 4, 20, 24]
          }
        }));
        break;
      
      case 'e019': // Edge Memory - Dim 4 edges
        const randomEdges = getRandomCells(4, [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23]);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: randomEdges
          }
        }));
        break;
      
      // WILD EFFECTS - Set up wild cells
      case 'e020': // Wild Favor - 5 tiles become Wild
        const wildCells5 = getRandomCells(5);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCells5
          }
        }));
        break;
      
      case 'e021': // Wild Corners - 2 corners become Wild
        const wildCorners = getRandomCells(2, [0, 4, 20, 24]);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCorners
          }
        }));
        break;
      
      case 'e022': // Wild Edges - 3 edges become Wild
        const wildEdges = getRandomCells(3, [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23]);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildEdges
          }
        }));
        break;
      
      case 'e023': // Wild Collector - 3 tiles become Wild
        const wildCells3 = getRandomCells(3);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCells3
          }
        }));
        break;
      
      case 'e024': // Wild Saver - 2 tiles become Wild
        const wildCells2 = getRandomCells(2);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCells2
          }
        }));
        break;
    }
  }, [setGameState]);

  return { processEffect, initializeEffect };
};

// Helper functions
const getRandomCells = (count: number, pool?: number[]): number[] => {
  const availableCells = pool || Array.from({ length: 25 }, (_, i) => i);
  const selected: number[] = [];
  
  while (selected.length < count && selected.length < availableCells.length) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cell = availableCells[randomIndex];
    if (!selected.includes(cell)) {
      selected.push(cell);
    }
  }
  
  return selected;
};

const isLineDiagonal = (line: number[]): boolean => {
  const sortedLine = [...line].sort((a, b) => a - b);
  
  // Check if it's a main diagonal (top-left to bottom-right)
  const isMainDiag = sortedLine.every((cell, index) => {
    if (index === 0) return true;
    const prevRow = getCellRow(sortedLine[index - 1]);
    const prevCol = getCellColumn(sortedLine[index - 1]);
    const currRow = getCellRow(cell);
    const currCol = getCellColumn(cell);
    return currRow === prevRow + 1 && currCol === prevCol + 1;
  });
  
  // Check if it's an anti-diagonal (top-right to bottom-left)
  const isAntiDiag = sortedLine.every((cell, index) => {
    if (index === 0) return true;
    const prevRow = getCellRow(sortedLine[index - 1]);
    const prevCol = getCellColumn(sortedLine[index - 1]);
    const currRow = getCellRow(cell);
    const currCol = getCellColumn(cell);
    return currRow === prevRow + 1 && currCol === prevCol - 1;
  });
  
  return isMainDiag || isAntiDiag;
};

const isLineHorizontal = (line: number[]): boolean => {
  const row = getCellRow(line[0]);
  return line.every(cell => getCellRow(cell) === row);
};

const isLineVertical = (line: number[]): boolean => {
  const col = getCellColumn(line[0]);
  return line.every(cell => getCellColumn(cell) === col);
};