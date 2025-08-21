import { useState, useCallback, useEffect } from 'react';
import { GameState, CellValue, Effect, Obstacle, EffectType } from '../types/game';
import { gameData } from '../data/gameData';
import { checkWinningLine, checkPlayerWinningLines, checkNewWinningLines, isBoardFull, getEmptyCells } from '../utils/gameUtils';
import { useNewEffects } from './useNewEffects';
import { useNewObstacles } from './useNewObstacles';

const getRandomPositiveEffect = (): Effect => {
  // Get only positive effects (scoring, memory, wild)
  const positiveEffects = gameData.effects.filter(effect => 
    ['scoring', 'memory', 'wild'].includes(effect.type)
  );
  const effectData = positiveEffects[Math.floor(Math.random() * positiveEffects.length)];
  console.log('Selected random effect:', effectData.name, 'type:', effectData.type);
  return {
    ...effectData,
    type: effectData.type as EffectType
  };
};

const getRandomObstacle = (): Obstacle => {
  return gameData.obstacles[Math.floor(Math.random() * gameData.obstacles.length)];
};

const getEffectsForLevel = (level: number): Effect[] => {
  // Always have exactly 1 positive effect per level
  return [getRandomPositiveEffect()];
};

const getObstaclesForLevel = (level: number): Obstacle[] => {
  // Negative effects (obstacles) appear every 2 levels starting from level 2
  if (level % 2 === 0) {
    return [getRandomObstacle()];
  }
  return [];
};

const initialGameState: GameState = {
  phase: 'menu',
  currentLevel: 1,
  score: 0,
  opponentScore: 0,
  board: Array(25).fill(null),
  currentEffect: null,
  currentObstacle: null,
  nextLevelEffects: [],
  nextLevelObstacles: [],
  showLevelPreview: false,
  moveHistory: [],
  lastPlayerMove: null,
  lastAIMove: null,
  firstMoveWasCenter: false,
  usedCenter: false,
  winningLine: null,
  showingFlash: false,
  boardBlinking: false,
  ghostPreview: null,
  linesCompleted: 0,
  streakCount: 0,
  comboCount: 0,
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
    dimmedCells: [],
    wildCells: [],
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
  const { processEffect, initializeEffect } = useNewEffects(gameState, setGameState);
  const { processObstacle, initializeObstacle } = useNewObstacles(gameState, setGameState);

  const startGame = useCallback(() => {
    // Show level preview before level 1 and after each level
    if (gameState.currentLevel === 1 && !gameState.showLevelPreview) {
      const effects = getEffectsForLevel(1);
      const obstacles = getObstaclesForLevel(1);
      
      setGameState(prev => ({
        ...prev,
        nextLevelEffects: effects,
        nextLevelObstacles: obstacles,
        showLevelPreview: true
      }));
      return;
    }

    // Start actual gameplay
    const effects = gameState.nextLevelEffects.length > 0 ? gameState.nextLevelEffects : getEffectsForLevel(gameState.currentLevel);
    const obstacles = gameState.nextLevelObstacles.length > 0 ? gameState.nextLevelObstacles : getObstaclesForLevel(gameState.currentLevel);
    
    setGameState(prev => ({
      ...initialGameState,
      phase: 'playing',
      currentLevel: prev.currentLevel,
      score: prev.score,
      currentEffect: effects[0] || null,
      currentObstacle: obstacles[0] || null,
      showLevelPreview: false,
      nextLevelEffects: [],
      nextLevelObstacles: []
    }));
    
    // Initialize effect and obstacle
    setTimeout(() => {
      if (effects[0]) {
        console.log('Initializing effect:', effects[0].name, effects[0].type);
        initializeEffect(effects[0]);
      }
      if (obstacles[0]) {
        console.log('Initializing obstacle:', obstacles[0].name);
        initializeObstacle(obstacles[0]);
      }
    }, 100);
  }, [gameState.currentLevel, gameState.showLevelPreview, gameState.nextLevelEffects, gameState.nextLevelObstacles, initializeEffect, initializeObstacle]);

  const nextLevel = useCallback(() => {
    const nextLevelNum = gameState.currentLevel + 1;
    const effects = getEffectsForLevel(nextLevelNum);
    const obstacles = getObstaclesForLevel(nextLevelNum);
    
    setGameState(prev => ({
      ...prev,
      currentLevel: nextLevelNum,
      phase: 'menu',
      nextLevelEffects: effects,
      nextLevelObstacles: obstacles,
      showLevelPreview: true
    }));
  }, [gameState.currentLevel]);

  const makeAIMove = useCallback(() => {
    setGameState(prev => {
      // Don't make AI move if level is already complete
      if (prev.phase === 'level_complete') {
        console.log('Level complete, skipping AI move');
        return prev;
      }

      console.log('AI making move, board before AI move:', prev.board);
      
      // Check for empty cells (exclude wild cells from being playable)
      const emptyCells = prev.board
        .map((cell, index) => ({ cell, index }))
        .filter(item => item.cell === null && !prev.effectState.wildCells.includes(item.index))
        .map(item => item.index);
      
      if (emptyCells.length === 0) {
        console.log('No empty cells, level complete');
        return { ...prev, phase: 'level_complete' };
      }
      
      let aiMoveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      
      // Apply AI behavior based on effects
      if (prev.currentEffect && aiMoveIndex !== null) {
        const corners = [0, 4, 20, 24];
        const edges = [1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
        const center = 12;

        switch (prev.currentEffect.id) {
          case 'e031': // O Drift - prefers edges
            const emptyEdges = edges.filter(edge => prev.board[edge] === null && !prev.effectState.wildCells.includes(edge));
            aiMoveIndex = emptyEdges.length > 0 ? emptyEdges[Math.floor(Math.random() * emptyEdges.length)] : aiMoveIndex;
            break;
          
          case 'e032': // O Corner Habit - prefers corners
            const emptyCorners = corners.filter(corner => prev.board[corner] === null && !prev.effectState.wildCells.includes(corner));
            aiMoveIndex = emptyCorners.length > 0 ? emptyCorners[Math.floor(Math.random() * emptyCorners.length)] : aiMoveIndex;
            break;
          
          case 'e033': // O Avoid Center
            const nonCenterEmpty = emptyCells.filter(cell => cell !== center);
            aiMoveIndex = nonCenterEmpty.length > 0 ? nonCenterEmpty[Math.floor(Math.random() * nonCenterEmpty.length)] : aiMoveIndex;
            break;
          
          case 'e039': // O Center Rush
            aiMoveIndex = (prev.board[center] === null && !prev.effectState.wildCells.includes(center)) ? center : aiMoveIndex;
            break;
          
          case 'e040': // O Edge Rush
            if (prev.lastAIMove === null) {
              const emptyEdges = edges.filter(edge => prev.board[edge] === null && !prev.effectState.wildCells.includes(edge));
              aiMoveIndex = emptyEdges.length > 0 ? emptyEdges[Math.floor(Math.random() * emptyEdges.length)] : aiMoveIndex;
            }
            break;
        }
      }

      console.log('AI choosing cell:', aiMoveIndex);
      
      const newBoard = [...prev.board];
      newBoard[aiMoveIndex] = 'O';
      
      console.log('Board after AI move:', newBoard);
      
      // Check for NEW AI O winning lines created by this move only
      const newWinningLines = checkNewWinningLines(newBoard, 'O', aiMoveIndex, prev.effectState.wildCells);
      const lineCount = newWinningLines.length;
      
      let opponentScoreIncrease = 0;
      let newWinningLine = prev.winningLine;
      
      if (lineCount > 0) {
        // Base points: 1000 per line (same as player)
        opponentScoreIncrease = lineCount * 1000;
        
        // Bonus for multiple lines: 500 extra points (same as player)
        if (lineCount >= 2) {
          opponentScoreIncrease += 500;
          console.log(`AI created ${lineCount} lines! Bonus awarded!`);
        }
        
        // Use the first winning line for display (or keep existing if we already had one)
        newWinningLine = newWinningLines[0];
        
        console.log(`AI scored ${opponentScoreIncrease} points for ${lineCount} NEW scoring line(s)`);
      }
      
      // Check if level is complete
      const isComplete = isBoardFull(newBoard, prev.effectState.wildCells);
      
      console.log('Board is complete:', isComplete);
      
      return {
        ...prev,
        board: newBoard,
        lastAIMove: aiMoveIndex,
        winningLine: newWinningLine,
        opponentScore: prev.opponentScore + opponentScoreIncrease,
        phase: isComplete ? 'level_complete' : prev.phase
      };
    });
  }, []);

  const makeMove = useCallback((cellIndex: number): boolean => {
    setGameState(prev => {
      // Validation
      if (prev.phase !== 'playing' || prev.board[cellIndex] !== null) {
        return prev;
      }

      console.log('Making player move at index:', cellIndex);
      console.log('Current board before move:', prev.board);

      const newBoard = [...prev.board];
      newBoard[cellIndex] = 'X';
      
      console.log('Board after player move:', newBoard);
      
      const newMoveHistory = [...prev.moveHistory, cellIndex];
      const isCenter = cellIndex === 12;
      
      // Check for NEW player X winning lines created by this move only
      console.log('Checking for X lines with wild cells:', prev.effectState.wildCells);
      const newWinningLines = checkNewWinningLines(newBoard, 'X', cellIndex, prev.effectState.wildCells);
      const lineCount = newWinningLines.length;
      console.log('Found', lineCount, 'new player scoring lines:', newWinningLines);
      
      let scoreIncrease = 0;
      let newWinningLine = prev.winningLine;
      let newLinesCompleted = prev.linesCompleted;
      let newStreakCount = prev.streakCount;
      
      if (lineCount > 0) {
        // Base points: 1000 per line
        scoreIncrease = lineCount * 1000;
        
        // Bonus for multiple lines: 500 extra points
        if (lineCount >= 2) {
          scoreIncrease += 500;
          console.log(`Player created ${lineCount} lines! Bonus awarded!`);
        }
        
        // Apply effects for each winning line
        for (const line of newWinningLines) {
          const effectBonus = processEffect(cellIndex, line);
          scoreIncrease += effectBonus;
          if (effectBonus > 0) {
            console.log(`Effect bonus: +${effectBonus} points`);
          }
        }
        
        // Use the first winning line for display (or keep existing if we already had one)
        newWinningLine = newWinningLines[0];
        
        console.log(`Player scored ${scoreIncrease} points for ${lineCount} NEW scoring line(s)`);
        
        // Update line count and streak tracking
        newLinesCompleted = prev.linesCompleted + lineCount;
        newStreakCount = prev.streakCount + 1;
      } else {
        // Reset streak if no lines scored
        newStreakCount = 0;
        // Check for effects that trigger on any move (not just winning moves)
        const effectBonus = processEffect(cellIndex, null);
        scoreIncrease += effectBonus;
        if (effectBonus > 0) {
          console.log(`Move effect bonus: +${effectBonus} points`);
        }
      }
      
      // Process obstacles for scoring penalties (check for line-based penalties)
      if (newWinningLines.length > 0) {
        for (const line of newWinningLines) {
          const obstacleResult = processObstacle(cellIndex, 'player', line);
          if (obstacleResult.scorePenalty < 0) {
            scoreIncrease += obstacleResult.scorePenalty;
            console.log(`Obstacle penalty: ${obstacleResult.scorePenalty} points`);
          }
        }
      }
      
      // Check if board is complete after player move
      const isComplete = isBoardFull(newBoard, prev.effectState.wildCells);
      console.log('Board complete after player move:', isComplete);
      
      return {
        ...prev,
        board: newBoard,
        moveHistory: newMoveHistory,
        lastPlayerMove: cellIndex,
        firstMoveWasCenter: prev.moveHistory.length === 0 && isCenter,
        usedCenter: prev.usedCenter || isCenter,
        winningLine: newWinningLine,
        score: prev.score + scoreIncrease,
        phase: isComplete ? 'level_complete' : prev.phase,
        linesCompleted: newLinesCompleted,
        streakCount: newStreakCount
      };
    });

    // Only schedule AI move if board isn't full
    setTimeout(() => {
      setGameState(prev => {
        if (prev.phase === 'level_complete') {
          console.log('Level already complete, skipping AI move');
          return prev;
        }
        return prev;
      });
      
      if (gameState.phase !== 'level_complete') {
        makeAIMove();
      }
    }, 300);

    return true;
  }, [makeAIMove, gameState.phase]);





  const isValidMove = useCallback((cellIndex: number): boolean => {
    // Basic validation - only check if cell is empty
    return gameState.board[cellIndex] === null;
  }, [gameState]);



  const setGhostPreview = useCallback((cellIndex: number | null) => {
    setGameState(prev => ({
      ...prev,
      ghostPreview: cellIndex
    }));
  }, []);

  const useSpecialAbility = useCallback((abilityType: string, cellIndex?: number) => {
    // Special abilities functionality removed for simplicity
    return false;
  }, []);

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
