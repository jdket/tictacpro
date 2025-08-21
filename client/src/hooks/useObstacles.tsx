import { useCallback } from 'react';
import { GameState, Obstacle } from '../types/game';
import { getRandomEmptyCell, getAdjacentCells, applyGravity } from '../utils/gameUtils';

export const useObstacles = (
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  const initializeObstacle = useCallback((obstacle: Obstacle) => {
    switch (obstacle.id) {
      case 'o001': // Locked Center
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            blockedCells: [12]
          }
        }));
        break;
      
      case 'o002': // Locked Corner
        const corners = [0, 4, 20, 24];
        const randomCorner = corners[Math.floor(Math.random() * corners.length)];
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            blockedCells: [randomCorner]
          }
        }));
        break;
      
      case 'o003': // Locked Edge
        const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
        const randomEdge = edges[Math.floor(Math.random() * edges.length)];
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            blockedCells: [randomEdge]
          }
        }));
        break;
      
      case 'o004': // Ice Tile
        const randomIceCell = Math.floor(Math.random() * 25);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            frozenCells: [randomIceCell]
          }
        }));
        break;
      
      case 'o005': // Fog Tile
        const randomFogCell = Math.floor(Math.random() * 25);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            hiddenCells: [randomFogCell]
          }
        }));
        break;
      
      case 'o006': // Bounce Tile
        const randomBounceCell = Math.floor(Math.random() * 25);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            bounceTile: randomBounceCell
          }
        }));
        break;
      
      case 'o007': // Swap Tile
        const randomSwapCell = Math.floor(Math.random() * 25);
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            swapTile: randomSwapCell
          }
        }));
        break;
      
      case 'o008': // Slow Reveal
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            hiddenCells: Array.from({ length: 25 }, (_, i) => i)
          }
        }));
        break;
      
      case 'o012': // Gravity
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            gravityActive: true
          }
        }));
        break;
      
      case 'o021': // Memory Fog
        const allCells = Array.from({ length: 25 }, (_, i) => i);
        const randomDimmedCells: number[] = [];
        
        while (randomDimmedCells.length < 3) {
          const randomCell = allCells[Math.floor(Math.random() * allCells.length)];
          if (!randomDimmedCells.includes(randomCell)) {
            randomDimmedCells.push(randomCell);
          }
        }
        
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            dimmedCells: randomDimmedCells
          }
        }));
        break;
    }
  }, [setGameState]);

  const processObstacle = useCallback((cellIndex: number, player: 'player' | 'ai'): { newCellIndex: number; scorePenalty: number } => {
    if (!gameState.currentObstacle) return { newCellIndex: cellIndex, scorePenalty: 0 };
    
    const obstacle = gameState.currentObstacle;
    
    switch (obstacle.id) {
      case 'o006': // Bounce Tile
        if (cellIndex === gameState.effectState.bounceTile) {
          const adjacent = getAdjacentCells(cellIndex);
          const emptyAdjacent = adjacent.filter(cell => gameState.board[cell] === null);
          if (emptyAdjacent.length > 0) {
            return { newCellIndex: emptyAdjacent[Math.floor(Math.random() * emptyAdjacent.length)], scorePenalty: 0 };
          }
        }
        break;
      
      case 'o007': // Swap Tile
        if (cellIndex === gameState.effectState.swapTile && player === 'player') {
          const adjacent = getAdjacentCells(cellIndex);
          const nearestO = adjacent.find(cell => gameState.board[cell] === 'O');
          if (nearestO !== undefined) {
            setGameState(prev => {
              const newBoard = [...prev.board];
              newBoard[nearestO] = 'X';
              return { ...prev, board: newBoard };
            });
          }
        }
        break;
      
      case 'o011': // Wind
        if (player === 'ai') {
          const emptyCell = getRandomEmptyCell(gameState.board);
          if (emptyCell !== null) {
            setGameState(prev => ({
              ...prev,
              effectState: {
                ...prev.effectState,
                windBlocked: [...prev.effectState.windBlocked, emptyCell]
              }
            }));
          }
        }
        break;
      
      case 'o012': // Gravity
        if (player === 'player') {
          return { newCellIndex: applyGravity(cellIndex, gameState.board), scorePenalty: 0 };
        }
        break;
      
      case 'o016': // Time Blink
        if (player === 'ai') {
          setGameState(prev => ({
            ...prev,
            boardBlinking: true
          }));
          
          setTimeout(() => {
            setGameState(prev => ({
              ...prev,
              boardBlinking: false
            }));
          }, 250);
        }
        break;
      
      case 'o017': // Double O Chance
        if (player === 'ai' && !gameState.effectState.doubleOUsed && Math.random() < 0.2) {
          const emptyCell = getRandomEmptyCell(gameState.board);
          if (emptyCell !== null) {
            setTimeout(() => {
              setGameState(prev => {
                const newBoard = [...prev.board];
                newBoard[emptyCell] = 'O';
                return {
                  ...prev,
                  board: newBoard,
                  effectState: {
                    ...prev.effectState,
                    doubleOUsed: true
                  }
                };
              });
            }, 500);
          }
        }
        break;
      
      case 'o018': // Center Tax
        if (cellIndex === 12 && player === 'player') {
          console.log('Center Tax applied: -2000 points');
          return { newCellIndex: cellIndex, scorePenalty: -2000 };
        }
        break;
      
      case 'o019': // Edge Tax
        if (player === 'player') {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          if (edges.includes(cellIndex)) {
            console.log('Edge Tax applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
      
      case 'o020': // Corner Tax
        if (player === 'player') {
          const corners = [0, 4, 20, 24];
          if (corners.includes(cellIndex)) {
            console.log('Corner Tax applied: -1000 points');
            return { newCellIndex: cellIndex, scorePenalty: -1000 };
          }
        }
        break;
    }
    
    return { newCellIndex: cellIndex, scorePenalty: 0 };
  }, [gameState, setGameState]);

  return { initializeObstacle, processObstacle };
};
