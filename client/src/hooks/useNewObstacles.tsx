import { useCallback } from 'react';
import { GameState, Obstacle } from '../types/game';
import { getCellType, getCellRow, getCellColumn } from '../utils/gameUtils';

export const useNewObstacles = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  
  const processObstacle = useCallback((cellIndex: number, player: 'player' | 'ai', winningLine?: number[] | null): { newCellIndex: number; scorePenalty: number } => {
    if (!gameState.currentObstacle) return { newCellIndex: cellIndex, scorePenalty: 0 };
    
    const obstacle = gameState.currentObstacle;
    
    switch (obstacle.id) {
      case 'o003': // Dim Penalty - any 4-in-a-row next to Dimmed tiles loses 1000 pts
        if (winningLine && player === 'player') {
          const hasAdjacentDimmed = winningLine.some(cell => {
            const adjacent = getAdjacentCells(cell);
            return adjacent.some(adjCell => gameState.effectState.dimmedCells.includes(adjCell));
          });
          if (hasAdjacentDimmed) {
            console.log('Dim Penalty applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o004': // Wild Trap - any 4-in-a-row next to Wild tiles loses 1000 pts
        if (winningLine && player === 'player') {
          const hasAdjacentWild = winningLine.some(cell => {
            const adjacent = getAdjacentCells(cell);
            return adjacent.some(adjCell => gameState.effectState.wildCells.includes(adjCell));
          });
          if (hasAdjacentWild) {
            console.log('Wild Trap applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o006': // Wild Penalty - Wild tiles in your line subtract 1000 pts
        if (winningLine && player === 'player') {
          const wildInLine = winningLine.filter(cell => gameState.effectState.wildCells.includes(cell)).length;
          if (wildInLine > 0) {
            console.log(`Wild Penalty applied: -${wildInLine * 1000} points`);
            return { newCellIndex: cellIndex, scorePenalty: -wildInLine * 1000 };
          }
        }
        break;
      
      case 'o007': // Edge Tax
        if (winningLine && player === 'player') {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          const hasEdge = winningLine.some(cell => edges.includes(cell));
          if (hasEdge) {
            console.log('Edge Tax applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o008': // Corner Tax
        if (winningLine && player === 'player') {
          const corners = [0, 4, 20, 24];
          const hasCorner = winningLine.some(cell => corners.includes(cell));
          if (hasCorner) {
            console.log('Corner Tax applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o009': // Center Tax
        if (winningLine && winningLine.includes(12) && player === 'player') {
          console.log('Center Tax applied: -2000 points');
          return { newCellIndex: cellIndex, scorePenalty: -2000 };
        }
        break;
    }
    
    return { newCellIndex: cellIndex, scorePenalty: 0 };
  }, [gameState]);

  const getAdjacentCells = (cellIndex: number): number[] => {
    const row = Math.floor(cellIndex / 5);
    const col = cellIndex % 5;
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

  const initializeObstacle = useCallback((obstacle: Obstacle) => {
    setGameState(prev => {
      // Get existing effect cells to avoid conflicts
      const existingDimmed = prev.effectState.dimmedCells;
      const existingWild = prev.effectState.wildCells;
      const allExistingCells = [...existingDimmed, ...existingWild];
      
      switch (obstacle.id) {
        case 'o001': // Memory Drain - Dim 5 tiles, Dimmed tiles give Opponent double score
          const dimCells5 = getRandomCells(5, undefined, true, existingDimmed, 'dim');
          console.log(`Memory Drain: Adding dimmed cells at positions ${dimCells5.join(', ')}`);
          return {
            ...prev,
            effectState: {
              ...prev.effectState,
              dimmedCells: [...prev.effectState.dimmedCells, ...dimCells5]
            }
          };
        
        case 'o002': // Wild Drain - 5 tiles become Wild, Wild tiles in your 4-in-a-row give Opponent double score
          const existingWildCells = prev.effectState.wildCells;
          const wildCells5 = getRandomCells(5, undefined, true, existingWildCells, 'wild');
          console.log(`Wild Drain: Adding wild cells at positions ${wildCells5.join(', ')}`);
          return {
            ...prev,
            effectState: {
              ...prev.effectState,
              wildCells: [...prev.effectState.wildCells, ...wildCells5]
            }
          };
      
        case 'o003': // Dim Penalty - Dim 2 tiles, any 4-in-a-row next to Dimmed tiles loses 1000 pts
          const existingDimmed2 = prev.effectState.dimmedCells;
          const dimCells2 = getRandomCells(2, undefined, true, existingDimmed2, 'dim');
          console.log(`Dim Penalty: Adding dimmed cells at positions ${dimCells2.join(', ')}`);
          return {
            ...prev,
            effectState: {
              ...prev.effectState,
              dimmedCells: [...prev.effectState.dimmedCells, ...dimCells2]
            }
          };
        
        case 'o004': // Wild Trap - 2 tiles become Wild, any 4-in-a-row next to Wild tiles loses 1000 pts
          const existingWild2 = prev.effectState.wildCells;
          const wildCells2 = getRandomCells(2, undefined, true, existingWild2, 'wild');
          console.log(`Wild Trap: Adding wild cells at positions ${wildCells2.join(', ')}`);
          return {
            ...prev,
            effectState: {
              ...prev.effectState,
              wildCells: [...prev.effectState.wildCells, ...wildCells2]
            }
          };
        
        case 'o005': // Dim Flood - Dim 8 tiles at random
          const existingDimmed8 = prev.effectState.dimmedCells;
          const dimCells8 = getRandomCells(8, undefined, true, existingDimmed8, 'dim');
          console.log(`Dim Flood: Adding 8 dimmed cells at positions ${dimCells8.join(', ')}`);
          return {
            ...prev,
            effectState: {
              ...prev.effectState,
              dimmedCells: [...prev.effectState.dimmedCells, ...dimCells8]
            }
          };
        
        case 'o006': // Wild Penalty - 5 tiles become Wild, Wild tiles in your line subtract 1000 pts
          const existingWildPenalty = prev.effectState.wildCells;
          const wildCells5Penalty = getRandomCells(5, undefined, true, existingWildPenalty, 'wild');
          console.log(`Wild Penalty: Adding wild cells at positions ${wildCells5Penalty.join(', ')}`);
          return {
            ...prev,
            effectState: {
              ...prev.effectState,
              wildCells: [...prev.effectState.wildCells, ...wildCells5Penalty]
            }
          };
        
        default:
          return prev;
      }
    });
  }, []);

  return { initializeObstacle, processObstacle };
};

// Helper functions
const getRandomCells = (count: number, pool?: number[], avoidAdjacent?: boolean, existingCells?: number[], cellType?: 'dim' | 'wild'): number[] => {
  const availableCells = pool || Array.from({ length: 25 }, (_, i) => i);
  const selected: number[] = [];
  const allExistingCells = [...(existingCells || [])];
  
  while (selected.length < count && selected.length < availableCells.length) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cell = availableCells[randomIndex];
    
    if (!selected.includes(cell) && !allExistingCells.includes(cell)) {
      // Check if we need to avoid adjacent cells
      if (avoidAdjacent && selected.length > 0) {
        const adjacentToSelected = selected.some(selectedCell => areAdjacent(cell, selectedCell));
        
        if (!adjacentToSelected) {
          selected.push(cell);
        }
      } else {
        selected.push(cell);
      }
    }
  }
  
  return selected;
};

const areAdjacent = (cell1: number, cell2: number): boolean => {
  const row1 = Math.floor(cell1 / 5);
  const col1 = cell1 % 5;
  const row2 = Math.floor(cell2 / 5);
  const col2 = cell2 % 5;
  
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  
  // Adjacent if they're in neighboring cells (including diagonally)
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
};