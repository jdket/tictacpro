import { useState, useCallback, useEffect } from 'react';
import { GameState, CellValue, Effect, Obstacle } from '../types/game';
import { gameData } from '../data/gameData';
import { checkWinningLine, isBoardFull, getRandomEmptyCell } from '../utils/gameUtils';
import { useEffects } from './useEffects';
import { useObstacles } from './useObstacles';

const getRandomEffect = (): Effect => {
  return gameData.effects[Math.floor(Math.random() * gameData.effects.length)];
};

const getRandomObstacle = (): Obstacle => {
  return gameData.obstacles[Math.floor(Math.random() * gameData.obstacles.length)];
};

const initialGameState: GameState = {
  phase: 'menu',
  currentLevel: 1,
  totalCoins: 0,
  levelCoins: 0,
  board: Array(9).fill(null),
  moveCount: 0,
  linesCompleted: 0,
  currentEffect: null,
  currentObstacle: null,
  moveHistory: [],
  lastPlayerMove: null,
  lastAIMove: null,
  firstMoveWasCenter: false,
  usedCenter: false,
  streakCount: 0,
  comboCount: 0,
  winningLine: null,
  showingFlash: false,
  boardBlinking: false,
  ghostPreview: null,
  effectState: {
    safeRetryUsed: false,
    crossSwapUsed: false,
    twinMarkUsed: false,
    skipAIUsed: false,
    recallUsed: false,
    doubleOUsed: false,
    memoryCell: null,
    hiddenCells: [],
    frozenCells: [],
    blockedCells: [],
    lastRowUsed: null,
    lastColumnUsed: null,
    trailX: null,
    shadowO: null,
    mirrorHint: null,
    flashLine: null,
    bounceTile: null,
    swapTile: null,
    gravityActive: false,
    windBlocked: []
  }
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { processEffect, initializeEffect } = useEffects(gameState, setGameState);
  const { processObstacle, initializeObstacle } = useObstacles(gameState, setGameState);

  const startGame = useCallback(() => {
    const newEffect = getRandomEffect();
    const newObstacle = gameState.currentLevel >= 2 && gameState.currentLevel % 2 === 0 ? getRandomObstacle() : null;
    
    setGameState(prev => ({
      ...initialGameState,
      phase: 'playing',
      currentLevel: prev.currentLevel,
      totalCoins: prev.totalCoins,
      currentEffect: newEffect,
      currentObstacle: newObstacle
    }));
    
    // Initialize effect and obstacle
    setTimeout(() => {
      initializeEffect(newEffect);
      if (newObstacle) {
        initializeObstacle(newObstacle);
      }
    }, 100);
  }, [gameState.currentLevel, initializeEffect, initializeObstacle]);

  const nextLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentLevel: prev.currentLevel + 1,
      totalCoins: prev.totalCoins + prev.levelCoins,
      phase: 'playing'
    }));
    
    setTimeout(() => {
      startGame();
    }, 100);
  }, [startGame]);

  const makeMove = useCallback((cellIndex: number): boolean => {
    if (gameState.phase !== 'playing' || gameState.board[cellIndex] !== null) {
      return false;
    }

    // Check if move is valid based on obstacles and effects
    if (!isValidMove(cellIndex)) {
      return false;
    }

    const newBoard = [...gameState.board];
    let finalCellIndex = cellIndex;

    // Process obstacles that might modify the move
    if (gameState.currentObstacle) {
      finalCellIndex = processObstacle(cellIndex, 'player');
    }

    newBoard[finalCellIndex] = 'X';
    
    const newMoveHistory = [...gameState.moveHistory, finalCellIndex];
    const isFirstMove = gameState.moveCount === 0;
    const isCenter = finalCellIndex === 4;
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      moveCount: prev.moveCount + 1,
      moveHistory: newMoveHistory,
      lastPlayerMove: finalCellIndex,
      firstMoveWasCenter: isFirstMove && isCenter,
      usedCenter: prev.usedCenter || isCenter,
      effectState: {
        ...prev.effectState,
        trailX: finalCellIndex,
        lastRowUsed: Math.floor(finalCellIndex / 3),
        lastColumnUsed: finalCellIndex % 3,
      }
    }));

    // Check for winning line
    const winningLine = checkWinningLine(newBoard);
    if (winningLine) {
      setGameState(prev => ({
        ...prev,
        winningLine,
        linesCompleted: prev.linesCompleted + 1
      }));
      
      // Process scoring effects
      if (gameState.currentEffect) {
        const coins = processEffect(finalCellIndex, winningLine);
        setGameState(prev => ({
          ...prev,
          levelCoins: prev.levelCoins + coins
        }));
      }
    }

    // Schedule AI move if not skipped
    if (!gameState.effectState.skipAIUsed || gameState.currentEffect?.id !== 'e019') {
      setTimeout(() => {
        makeAIMove();
      }, gameState.currentEffect?.id === 'e034' ? 500 : 300);
    }

    return true;
  }, [gameState, processObstacle, processEffect]);

  const makeAIMove = useCallback(() => {
    const blockedCells = [
      ...gameState.effectState.blockedCells,
      ...gameState.effectState.windBlocked
    ];
    
    let aiMoveIndex = getRandomEmptyCell(gameState.board, blockedCells);
    
    // Apply AI behavior based on effects
    if (gameState.currentEffect && aiMoveIndex !== null) {
      aiMoveIndex = applyAIBehavior(aiMoveIndex);
    }

    if (aiMoveIndex === null) return;

    const newBoard = [...gameState.board];
    newBoard[aiMoveIndex] = 'O';
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      lastAIMove: aiMoveIndex,
      effectState: {
        ...prev.effectState,
        trailX: null, // Clear trail after AI move
      }
    }));

    // Process post-AI obstacles
    if (gameState.currentObstacle) {
      processObstacle(aiMoveIndex, 'ai');
    }

    // Check if level is complete
    checkLevelComplete(newBoard);
  }, [gameState, processObstacle]);

  const applyAIBehavior = useCallback((aiMoveIndex: number): number => {
    const emptyCells = getRandomEmptyCell(gameState.board, gameState.effectState.blockedCells);
    if (!gameState.currentEffect || emptyCells === null) return aiMoveIndex;

    const corners = [0, 2, 6, 8];
    const edges = [1, 3, 5, 7];
    const center = 4;

    switch (gameState.currentEffect.id) {
      case 'e031': // O Drift - prefers edges
        const emptyEdges = edges.filter(edge => gameState.board[edge] === null);
        return emptyEdges.length > 0 ? emptyEdges[Math.floor(Math.random() * emptyEdges.length)] : aiMoveIndex;
      
      case 'e032': // O Corner Habit - prefers corners
        const emptyCorners = corners.filter(corner => gameState.board[corner] === null);
        return emptyCorners.length > 0 ? emptyCorners[Math.floor(Math.random() * emptyCorners.length)] : aiMoveIndex;
      
      case 'e033': // O Avoid Center
        return aiMoveIndex === center ? emptyCells : aiMoveIndex;
      
      case 'e039': // O Center Rush
        return gameState.board[center] === null && gameState.moveCount <= 2 ? center : aiMoveIndex;
      
      case 'e040': // O Edge Rush
        if (gameState.lastAIMove === null) {
          const emptyEdges = edges.filter(edge => gameState.board[edge] === null);
          return emptyEdges.length > 0 ? emptyEdges[Math.floor(Math.random() * emptyEdges.length)] : aiMoveIndex;
        }
        return aiMoveIndex;
      
      default:
        return aiMoveIndex;
    }
  }, [gameState]);

  const isValidMove = useCallback((cellIndex: number): boolean => {
    // Basic validation
    if (gameState.board[cellIndex] !== null) return false;
    if (gameState.effectState.blockedCells.includes(cellIndex)) return false;
    if (gameState.effectState.frozenCells.includes(cellIndex)) return false;
    
    // Row/column repeat validation for obstacles
    const row = Math.floor(cellIndex / 3);
    const col = cellIndex % 3;
    
    if (gameState.effectState.lastRowUsed === row && gameState.currentObstacle?.id === 'o009') return false;
    if (gameState.effectState.lastColumnUsed === col && gameState.currentObstacle?.id === 'o010') return false;
    
    // Effect-specific validations
    if (gameState.currentEffect?.id === 'e017' && gameState.moveCount === 0) {
      // Edge Magnet - first move must be edge
      if (![1, 3, 5, 7].includes(cellIndex)) return false;
    }
    
    if (gameState.currentEffect?.id === 'e018' && gameState.moveCount === 0) {
      // Corner Magnet - first move must be corner
      if (![0, 2, 6, 8].includes(cellIndex)) return false;
    }
    
    return true;
  }, [gameState]);

  const checkLevelComplete = useCallback((board: CellValue[]) => {
    const isComplete = isBoardFull(board) || gameState.linesCompleted >= 3;
    
    if (isComplete) {
      // Apply end-of-level effects
      let finalCoins = gameState.levelCoins;
      
      if (gameState.currentEffect) {
        const endBonus = processEffect(-1, null, 'level_end');
        finalCoins += endBonus;
      }
      
      setGameState(prev => ({
        ...prev,
        phase: 'level_complete',
        levelCoins: finalCoins
      }));
    }
  }, [gameState, processEffect]);

  const setGhostPreview = useCallback((cellIndex: number | null) => {
    setGameState(prev => ({
      ...prev,
      ghostPreview: cellIndex
    }));
  }, []);

  const useSpecialAbility = useCallback((abilityType: string, cellIndex?: number) => {
    if (!gameState.currentEffect) return false;

    switch (abilityType) {
      case 'safe_retry':
        if (gameState.currentEffect.id === 'e012' && !gameState.effectState.safeRetryUsed && gameState.lastPlayerMove !== null) {
          const newBoard = [...gameState.board];
          newBoard[gameState.lastPlayerMove] = null;
          setGameState(prev => ({
            ...prev,
            board: newBoard,
            effectState: { ...prev.effectState, safeRetryUsed: true }
          }));
          return true;
        }
        break;
      
      case 'cross_swap':
        if (gameState.currentEffect.id === 'e014' && !gameState.effectState.crossSwapUsed && cellIndex !== undefined) {
          // Implementation for moving existing X to empty cell
          return true;
        }
        break;
      
      case 'skip_ai':
        if (gameState.currentEffect.id === 'e019' && !gameState.effectState.skipAIUsed) {
          setGameState(prev => ({
            ...prev,
            effectState: { ...prev.effectState, skipAIUsed: true }
          }));
          return true;
        }
        break;
      
      case 'recall':
        if (gameState.currentEffect.id === 'e020' && !gameState.effectState.recallUsed && cellIndex !== undefined) {
          const newBoard = [...gameState.board];
          if (newBoard[cellIndex] === 'O') {
            newBoard[cellIndex] = null;
            setGameState(prev => ({
              ...prev,
              board: newBoard,
              effectState: { ...prev.effectState, recallUsed: true }
            }));
            return true;
          }
        }
        break;
    }
    
    return false;
  }, [gameState]);

  return {
    gameState,
    startGame,
    nextLevel,
    makeMove,
    setGhostPreview,
    useSpecialAbility,
    setGameState
  };
};
