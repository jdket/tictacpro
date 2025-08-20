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
        if (winningLine && winningLine.includes(4)) coins += effect.value;
        break;
      
      case 'e002': // Corner Bonus
        if (winningLine) {
          const corners = [0, 2, 6, 8];
          const cornerCount = winningLine.filter(cell => corners.includes(cell)).length;
          coins += cornerCount * effect.value;
        }
        break;
      
      case 'e003': // Edge Bonus
        if (winningLine) {
          const edges = [1, 3, 5, 7];
          const edgeCount = winningLine.filter(cell => edges.includes(cell)).length;
          coins += edgeCount * effect.value;
        }
        break;
      
      case 'e004': // Combo Counter
        if (winningLine) {
          setGameState(prev => ({
            ...prev,
            comboCount: prev.comboCount + 1
          }));
          coins += gameState.comboCount * effect.value;
        }
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
        if (context === 'level_end' && gameState.linesCompleted === 3) {
          multiplier = effect.value;
        }
        break;
      
      case 'e009': // Perfect Fill
        if (context === 'level_end' && gameState.board.every(cell => cell !== null)) {
          coins += effect.value;
        }
        break;
      
      case 'e010': // Quick Start
        if (cellIndex === 4 && gameState.moveCount === 1) {
          coins += effect.value;
        }
        break;
      
      case 'e017': // Edge Magnet
        if (winningLine && gameState.moveCount === 1) {
          const edges = [1, 3, 5, 7];
          if (winningLine.some(cell => edges.includes(cell))) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e018': // Corner Magnet
        if (winningLine && gameState.moveCount === 1) {
          const corners = [0, 2, 6, 8];
          if (winningLine.some(cell => corners.includes(cell))) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e025': // Hide Corners
        if (cellIndex !== -1 && [0, 2, 6, 8].includes(cellIndex)) {
          coins += effect.value;
        }
        break;
      
      case 'e026': // Hide Edges
        if (cellIndex !== -1 && [1, 3, 5, 7].includes(cellIndex)) {
          coins += effect.value;
        }
        break;
      
      case 'e041': // Bonus Bank
        if (winningLine) coins += effect.value;
        break;
      
      case 'e042': // Streak Saver
        if (gameState.streakCount >= 2) coins += effect.value;
        break;
      
      case 'e043': // Even Up
        if (winningLine && winningLine.every(cell => cell % 2 === 0)) {
          coins += effect.value;
        }
        break;
      
      case 'e044': // Odd Up
        if (winningLine && winningLine.every(cell => cell % 2 === 1)) {
          coins += effect.value;
        }
        break;
      
      case 'e045': // First Line Boost
        if (winningLine && gameState.linesCompleted === 0) {
          multiplier = effect.value;
        }
        break;
      
      case 'e046': // Last Line Boost
        if (context === 'level_end' && gameState.board.filter(cell => cell === null).length <= 1) {
          multiplier = effect.value;
        }
        break;
      
      case 'e047': // Two Line Gift
        if (context === 'level_end' && gameState.linesCompleted === 2) {
          coins += effect.value;
        }
        break;
      
      case 'e048': // No Center Gift
        if (context === 'level_end' && !gameState.usedCenter) {
          coins += effect.value;
        }
        break;
      
      case 'e049': // Corner Collector
        if (context === 'level_end') {
          const corners = [0, 2, 6, 8];
          if (corners.every(corner => gameState.board[corner] !== null)) {
            coins += effect.value;
          }
        }
        break;
      
      case 'e050': // Saver
        if (context === 'level_end') {
          coins += Math.floor(gameState.totalCoins * effect.value);
        }
        break;
    }

    return coins * multiplier;
  }, [gameState]);

  const initializeEffect = useCallback((effect: Effect) => {
    switch (effect.id) {
      case 'e011': // Lucky Corner
        if (gameState.moveCount === 0) {
          const corners = [0, 2, 6, 8];
          const emptyCorners = corners.filter(c => gameState.board[c] === null);
          if (emptyCorners.length > 0) {
            const randomCorner = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
            setGameState(prev => {
              const newBoard = [...prev.board];
              newBoard[randomCorner] = 'X';
              return {
                ...prev,
                board: newBoard,
                moveCount: 1,
                lastPlayerMove: randomCorner
              };
            });
          }
        }
        break;
      
      case 'e015': // Free Center
        if (gameState.moveCount === 0 && gameState.board[4] === null) {
          setGameState(prev => {
            const newBoard = [...prev.board];
            newBoard[4] = 'X';
            return {
              ...prev,
              board: newBoard,
              moveCount: 1,
              lastPlayerMove: 4,
              firstMoveWasCenter: true,
              usedCenter: true
            };
          });
        }
        break;
      
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
      
      case 'e022': // Flash Path
        const lines = getWinningLines();
        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            flashLine: randomLine
          },
          showingFlash: true
        }));
        
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            showingFlash: false,
            effectState: {
              ...prev.effectState,
              flashLine: null
            }
          }));
        }, 1000);
        break;
      
      case 'e025': // Hide Corners
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            hiddenCells: [0, 2, 6, 8]
          }
        }));
        break;
      
      case 'e026': // Hide Edges
        setGameState(prev => ({
          ...prev,
          effectState: {
            ...prev.effectState,
            hiddenCells: [1, 3, 5, 7]
          }
        }));
        break;
    }
  }, [gameState, setGameState]);

  return { processEffect, initializeEffect };
};
