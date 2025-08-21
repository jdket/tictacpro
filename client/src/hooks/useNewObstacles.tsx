import { useCallback } from 'react';
import { GameState, Obstacle } from '../types/game';
import { getCellType, getCellRow, getCellColumn } from '../utils/gameUtils';

export const useNewObstacles = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  
  const processObstacle = useCallback((cellIndex: number, player: 'player' | 'ai'): { newCellIndex: number; scorePenalty: number } => {
    if (!gameState.currentObstacle) return { newCellIndex: cellIndex, scorePenalty: 0 };
    
    const obstacle = gameState.currentObstacle;
    
    switch (obstacle.id) {
      case 'o007': // Edge Tax
        if (player === 'player') {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          if (edges.includes(cellIndex)) {
            console.log('Edge Tax applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o008': // Corner Tax
        if (player === 'player') {
          const corners = [0, 4, 20, 24];
          if (corners.includes(cellIndex)) {
            console.log('Corner Tax applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o009': // Center Tax
        if (cellIndex === 12 && player === 'player') {
          console.log('Center Tax applied: -2000 points');
          return { newCellIndex: cellIndex, scorePenalty: -2000 };
        }
        break;
    }
    
    return { newCellIndex: cellIndex, scorePenalty: 0 };
  }, [gameState]);

  const initializeObstacle = useCallback((obstacle: Obstacle) => {
    switch (obstacle.id) {
      case 'o001': // Memory Drain - Dim 5 tiles, Dimmed tiles give Opponent double score
        const dimCells5 = getRandomCells(5);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: dimCells5
          }
        }));
        break;
      
      case 'o002': // Wild Drain - 5 tiles become Wild, Wild tiles in your 4-in-a-row give Opponent double score
        const wildCells5 = getRandomCells(5);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCells5
          }
        }));
        break;
      
      case 'o003': // Dim Penalty - Dim 2 tiles, any 4-in-a-row next to Dimmed tiles loses 1000 pts
        const dimCells2 = getRandomCells(2);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: dimCells2
          }
        }));
        break;
      
      case 'o004': // Wild Trap - 2 tiles become Wild, any 4-in-a-row next to Wild tiles loses 1000 pts
        const wildCells2 = getRandomCells(2);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCells2
          }
        }));
        break;
      
      case 'o005': // Dim Flood - Dim 8 tiles at random
        const dimCells8 = getRandomCells(8);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: dimCells8
          }
        }));
        break;
      
      case 'o006': // Wild Penalty - 5 tiles become Wild, Wild tiles in your line subtract 1000 pts
        const wildCells5Penalty = getRandomCells(5);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            wildCells: wildCells5Penalty
          }
        }));
        break;
    }
  }, [setGameState]);

  return { initializeObstacle, processObstacle };
};

// Helper function
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