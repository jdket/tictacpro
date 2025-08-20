import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Effect, Obstacle } from "@/data/gameData";

export type CellValue = 'X' | 'O' | null;
export type GamePhase = 'menu' | 'playing' | 'level_complete' | 'game_over';

interface GameState {
  // Game state
  phase: GamePhase;
  currentLevel: number;
  totalCoins: number;
  levelCoins: number;
  board: CellValue[];
  moveCount: number;
  linesCompleted: number;
  
  // Current level data
  currentEffect: Effect | null;
  currentObstacle: Obstacle | null;
  
  // Game history and tracking
  moveHistory: number[];
  lastPlayerMove: number | null;
  lastAIMove: number | null;
  firstMoveWasCenter: boolean;
  usedCenter: boolean;
  streakCount: number;
  comboCount: number;
  
  // Effect-specific state
  effectState: {
    safeRetryUsed: boolean;
    crossSwapUsed: boolean;
    twinMarkUsed: boolean;
    skipAIUsed: boolean;
    recallUsed: boolean;
    doubleOUsed: boolean;
    memoryCell: number | null;
    hiddenCells: number[];
    frozenCells: number[];
    blockedCells: number[];
    lastRowUsed: number | null;
    lastColumnUsed: number | null;
    trailX: number | null;
  };
  
  // Visual state
  winningLine: number[] | null;
  showingFlash: boolean;
  boardBlinking: boolean;
  ghostPreview: number | null;
  
  // Actions
  startGame: () => void;
  resetLevel: () => void;
  nextLevel: () => void;
  makeMove: (cellIndex: number) => boolean;
  makeAIMove: () => void;
  addCoins: (amount: number) => void;
  setGhostPreview: (cellIndex: number | null) => void;
  updateEffectState: (updates: Partial<GameState['effectState']>) => void;
  checkWin: () => number[] | null;
  isValidMove: (cellIndex: number) => boolean;
}

export const useGameState = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
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
    },
    
    winningLine: null,
    showingFlash: false,
    boardBlinking: false,
    ghostPreview: null,
    
    startGame: () => {
      set({
        phase: 'playing',
        currentLevel: 1,
        totalCoins: 0,
        board: Array(9).fill(null),
        moveCount: 0,
        linesCompleted: 0,
        moveHistory: [],
        lastPlayerMove: null,
        lastAIMove: null,
        firstMoveWasCenter: false,
        usedCenter: false,
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
          lastRowUsed: null,
          lastColumnUsed: null,
          trailX: null,
        },
        winningLine: null,
        showingFlash: false,
        boardBlinking: false,
        ghostPreview: null,
      });
    },
    
    resetLevel: () => {
      const state = get();
      set({
        board: Array(9).fill(null),
        moveCount: 0,
        linesCompleted: 0,
        levelCoins: 0,
        moveHistory: [],
        lastPlayerMove: null,
        lastAIMove: null,
        firstMoveWasCenter: false,
        usedCenter: false,
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
          lastRowUsed: null,
          lastColumnUsed: null,
          trailX: null,
        },
        winningLine: null,
        showingFlash: false,
        boardBlinking: false,
        ghostPreview: null,
      });
    },
    
    nextLevel: () => {
      const state = get();
      set({
        currentLevel: state.currentLevel + 1,
        totalCoins: state.totalCoins + state.levelCoins,
        phase: 'playing',
      });
    },
    
    makeMove: (cellIndex: number): boolean => {
      const state = get();
      
      if (!state.isValidMove(cellIndex)) {
        return false;
      }
      
      const newBoard = [...state.board];
      newBoard[cellIndex] = 'X';
      
      const newMoveHistory = [...state.moveHistory, cellIndex];
      const isFirstMove = state.moveCount === 0;
      const isCenter = cellIndex === 4;
      
      set({
        board: newBoard,
        moveCount: state.moveCount + 1,
        moveHistory: newMoveHistory,
        lastPlayerMove: cellIndex,
        firstMoveWasCenter: isFirstMove && isCenter,
        usedCenter: state.usedCenter || isCenter,
        effectState: {
          ...state.effectState,
          trailX: cellIndex,
          lastRowUsed: Math.floor(cellIndex / 3),
          lastColumnUsed: cellIndex % 3,
        }
      });
      
      return true;
    },
    
    makeAIMove: () => {
      const state = get();
      const emptyCells = state.board
        .map((cell, index) => cell === null ? index : -1)
        .filter(index => index !== -1 && !state.effectState.blockedCells.includes(index));
      
      if (emptyCells.length === 0) return;
      
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const aiMove = emptyCells[randomIndex];
      
      const newBoard = [...state.board];
      newBoard[aiMove] = 'O';
      
      set({
        board: newBoard,
        lastAIMove: aiMove,
        effectState: {
          ...state.effectState,
          trailX: null, // Clear trail after AI move
        }
      });
    },
    
    addCoins: (amount: number) => {
      const state = get();
      set({
        levelCoins: state.levelCoins + amount
      });
    },
    
    setGhostPreview: (cellIndex: number | null) => {
      set({ ghostPreview: cellIndex });
    },
    
    updateEffectState: (updates: Partial<GameState['effectState']>) => {
      const state = get();
      set({
        effectState: { ...state.effectState, ...updates }
      });
    },
    
    checkWin: (): number[] | null => {
      const state = get();
      const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
      ];
      
      for (const line of winningLines) {
        const [a, b, c] = line;
        if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
          return line;
        }
      }
      
      return null;
    },
    
    isValidMove: (cellIndex: number): boolean => {
      const state = get();
      
      // Basic validation
      if (state.board[cellIndex] !== null) return false;
      if (state.effectState.blockedCells.includes(cellIndex)) return false;
      if (state.effectState.frozenCells.includes(cellIndex)) return false;
      
      // Row/column repeat validation
      const row = Math.floor(cellIndex / 3);
      const col = cellIndex % 3;
      
      if (state.effectState.lastRowUsed === row && state.currentObstacle?.id === 'o009') return false;
      if (state.effectState.lastColumnUsed === col && state.currentObstacle?.id === 'o010') return false;
      
      // Effect-specific validations
      if (state.currentEffect?.id === 'e017' && state.moveCount === 0) {
        // Edge Magnet - first move must be edge
        if (![1, 3, 5, 7].includes(cellIndex)) return false;
      }
      
      if (state.currentEffect?.id === 'e018' && state.moveCount === 0) {
        // Corner Magnet - first move must be corner
        if (![0, 2, 6, 8].includes(cellIndex)) return false;
      }
      
      return true;
    },
  }))
);
