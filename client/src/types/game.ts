export type CellValue = 'X' | 'O' | null;
export type GamePhase = 'menu' | 'playing' | 'level_complete' | 'game_over';
export type EffectType = 'scoring' | 'placement' | 'memory' | 'ai' | 'economy';

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  score: number;
  opponentScore: number;
  board: CellValue[];
  currentEffect: Effect | null;
  currentObstacle: Obstacle | null;
  nextLevelEffects: Effect[];
  nextLevelObstacles: Obstacle[];
  showLevelPreview: boolean;
  moveHistory: number[];
  lastPlayerMove: number | null;
  lastAIMove: number | null;
  firstMoveWasCenter: boolean;
  usedCenter: boolean;
  winningLine: number[] | null;
  showingFlash: boolean;
  boardBlinking: boolean;
  ghostPreview: number | null;
  effectState: EffectState;
}

export interface EffectState {
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
  dimmedCells: number[];
  wildCells: number[];
  lastRowUsed: number | null;
  lastColumnUsed: number | null;
  trailX: number | null;
  shadowO: number | null;
  mirrorHint: number | null;
  flashLine: number[] | null;
  bounceTile: number | null;
  swapTile: number | null;
  gravityActive: boolean;
  windBlocked: number[];
}

export interface Effect {
  id: string;
  name: string;
  type: EffectType;
  text: string;
  value: number;
}

export interface Obstacle {
  id: string;
  name: string;
  text: string;
  rule: string;
}
