import { useCallback } from 'react';
import { GameState, Effect } from '../types/game';
import { getCellType, isLineType, getWinningLines } from '../utils/gameUtils';

export const useEffects = (
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
    let multiplier = 1;

    switch (effect.id) {
      // Scoring Effects
      case 'e001': // Center Boost
        if (winningLine && winningLine.includes(12)) coins += effect.value;
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
        // TODO: Implement combo counter logic when comboCount is added to GameState
        break;
      
      case 'e005': // Diagonal Doubler
        if (winningLine && isLineType(winningLine, 'diagonal')) {
          multiplier = effect.value;
        }
        break;
      
      case 'e006': // Row Runner
        if (winningLine && isLineType(winningLine, 'row')) {
          coins += effect.value;
        }
        break;
      
      case 'e007': // Column Climber
        if (winningLine && isLineType(winningLine, 'column')) {
          coins += effect.value;
        }
        break;
      
      case 'e008': // Triple Cherry
        // TODO: Implement when linesCompleted is tracked in GameState
        break;
      
      case 'e009': // Perfect Fill
        if (context === 'level_end' && gameState.board.every(cell => cell !== null)) {
          coins += effect.value;
        }
        break;
      
      case 'e010': // Quick Start
        if (cellIndex === 12 && gameState.firstMoveWasCenter) {
          coins += effect.value;
        }
        break;
      
      case 'e011': // Speed Bonus
        if (gameState.moveHistory.length < 3) {
          coins += effect.value;
        }
        break;
      
      case 'e012': // Fast Corner
        if ([0, 4, 20, 24].includes(cellIndex)) {
          coins += effect.value;
        }
        break;
      
      case 'e013': // Multi Strike
        // TODO: Implement when linesCompleted is tracked in GameState
        break;
      
      case 'e014': // Line Streak
        // TODO: Implement when streak tracking is added
        break;
      
      case 'e015': // Center Power
        if (winningLine && winningLine.includes(12)) {
          coins += effect.value;
        }
        break;
      
      case 'e016': // Edge Master
        if (winningLine) {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          const edgeCount = winningLine.filter(cell => edges.includes(cell)).length;
          if (edgeCount >= 3) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e019': // Pattern Master
        if (winningLine) {
          // Simple pattern: line goes across the middle row (row 2)
          const isMiddleRow = winningLine.every(cell => Math.floor(cell / 5) === 2);
          if (isMiddleRow) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e020': // Board Control
        if (winningLine) {
          const emptyCells = gameState.board.filter(cell => cell === null).length;
          coins += emptyCells * effect.value;
        }
        break;
      
      case 'e017': // Edge Magnet
        if (winningLine && gameState.moveHistory.length === 1) {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          if (winningLine.some(cell => edges.includes(cell))) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e018': // Corner Magnet
        if (winningLine && gameState.moveHistory.length === 1) {
          const corners = [0, 4, 20, 24];
          if (winningLine.some(cell => corners.includes(cell))) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e025': // Hide Corners
        if (cellIndex !== -1 && [0, 4, 20, 24].includes(cellIndex)) {
          coins += effect.value;
        }
        break;
      
      case 'e026': // Hide Edges
        if (cellIndex !== -1) {
          const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
          if (edges.includes(cellIndex)) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e041': // Bonus Bank
        if (winningLine) coins += effect.value;
        break;
      
      case 'e042': // Streak Saver
        // TODO: Implement when streakCount is tracked in GameState
        break;
      
      case 'e043': // Top Half
        if (winningLine) {
          // Top half is rows 0 and 1 (cells 0-9)
          const isTopHalf = winningLine.every(cell => Math.floor(cell / 5) <= 1);
          if (isTopHalf) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e044': // Bottom Half
        if (winningLine) {
          // Bottom half is rows 3 and 4 (cells 15-24)
          const isBottomHalf = winningLine.every(cell => Math.floor(cell / 5) >= 3);
          if (isBottomHalf) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e045': // First Line Boost
        // TODO: Implement when linesCompleted is tracked in GameState
        break;
      
      case 'e046': // Last Line Boost
        if (context === 'level_end' && gameState.board.filter(cell => cell === null).length <= 1) {
          multiplier = effect.value;
        }
        break;
      
      case 'e047': // Two Line Gift
        // TODO: Implement when linesCompleted is tracked in GameState
        break;
      
      case 'e048': // No Center Gift
        if (context === 'level_end' && !gameState.usedCenter) {
          coins += effect.value;
        }
        break;
      
      case 'e049': // Corner Collector
        if (context === 'level_end') {
          const corners = [0, 4, 20, 24];
          if (corners.every(corner => gameState.board[corner] !== null)) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e050': // Saver
        // TODO: Implement when totalCoins is tracked in GameState
        break;
    }

    return coins * multiplier;
  }, [gameState]);

  const initializeEffect = useCallback((effect: Effect) => {
    switch (effect.id) {
      // Most scoring effects don't need initialization
      // Only special effects that modify game state need initialization here
      
      case 'e021': // Memory Mark
        const emptyCells = gameState.board
          .map((cell, index) => cell === null ? index : -1)
          .filter(index => index !== -1);
        
        if (emptyCells.length > 0) {
          const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          setGameState(prev => ({
            ...prev,
            effectState: {
              ...prev.effectState,
              memoryCell: randomCell,
              hiddenCells: [randomCell]
            }
          }));
        }
        break;
      
      case 'e022': // Quick Peek
        const lines = getWinningLines();
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        console.log('Quick Peek shows winning line:', randomLine);
        // Just log it, no visual effects for children
        break;
      
      case 'e025': // Hide Corners
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            hiddenCells: [0, 4, 20, 24]
          }
        }));
        break;
      
      case 'e026': // Hide Edges
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            hiddenCells: [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23]
          }
        }));
        break;
    }
  }, [gameState, setGameState]);

  return { processEffect, initializeEffect };
};
