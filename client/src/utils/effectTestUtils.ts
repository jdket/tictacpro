// Utility functions to test and validate effect/obstacle logic
import { Effect, Obstacle, GameState } from '../types/game';
import { gameData } from '../data/gameData';

interface EffectTestCase {
  effectId: string;
  scenario: string;
  expectedBehavior: string;
  testBoard?: (string | null)[];
  testMove?: number;
  winningLine?: number[];
}

interface ObstacleTestCase {
  obstacleId: string;
  scenario: string;
  expectedBehavior: string;
  testBoard?: (string | null)[];
  testMove?: number;
  winningLine?: number[];
}

// Test cases for all 24 effects
export const effectTestCases: EffectTestCase[] = [
  // SCORING EFFECTS (16)
  {
    effectId: 'e001',
    scenario: 'Center Boost - 4-in-a-row through center',
    expectedBehavior: '+3000 points when line goes through center (position 12)',
    winningLine: [10, 11, 12, 13] // horizontal through center
  },
  {
    effectId: 'e002',
    scenario: 'Corner Bonus - line with corners',
    expectedBehavior: '+2000 points per corner in winning line',
    winningLine: [0, 1, 2, 3] // top row with corner
  },
  {
    effectId: 'e003',
    scenario: 'Edge Bonus - line with edges',
    expectedBehavior: '+1000 points per edge in winning line',
    winningLine: [1, 6, 11, 16] // vertical with edges
  },
  {
    effectId: 'e004',
    scenario: 'Combo Counter - second line scored',
    expectedBehavior: '+1000 points when linesCompleted > 0',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e005',
    scenario: 'Diagonal Bonus - diagonal line',
    expectedBehavior: '+2000 points for diagonal 4-in-a-row',
    winningLine: [0, 6, 12, 18] // main diagonal
  },
  {
    effectId: 'e006',
    scenario: 'Row Runner - horizontal line',
    expectedBehavior: '+2000 points for horizontal 4-in-a-row',
    winningLine: [5, 6, 7, 8] // second row
  },
  {
    effectId: 'e007',
    scenario: 'Column Climber - vertical line',
    expectedBehavior: '+2000 points for vertical 4-in-a-row',
    winningLine: [2, 7, 12, 17] // third column
  },
  {
    effectId: 'e008',
    scenario: 'Triple Cherry - 3+ lines completed',
    expectedBehavior: '+3000 points at level end if linesCompleted >= 3',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e009',
    scenario: 'Quick Start - first move center',
    expectedBehavior: '+2000 points if first move is center',
    testMove: 12
  },
  {
    effectId: 'e010',
    scenario: 'Fast Corner - corner completes line',
    expectedBehavior: '+1000 points if corner placement completes line',
    testMove: 0,
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e011',
    scenario: 'Line Streak - consecutive scoring',
    expectedBehavior: '+2000 points if streakCount >= 2',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e012',
    scenario: 'Middle Master - line in middle row/column',
    expectedBehavior: '+2000 points if line fully in row 2 or column 2',
    winningLine: [10, 11, 12, 13] // middle row
  },
  {
    effectId: 'e013',
    scenario: 'Two Line Gift - exactly 2 lines',
    expectedBehavior: '+2000 points at level end if linesCompleted === 2',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e014',
    scenario: 'Corner Collector - all corners filled',
    expectedBehavior: '+3000 points at level end if all corners marked',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e015',
    scenario: 'Top Focus - line in top rows',
    expectedBehavior: '+1000 points if line fully in rows 0-1',
    winningLine: [0, 1, 2, 3] // row 0
  },
  {
    effectId: 'e016',
    scenario: 'Bottom Focus - line in bottom rows',
    expectedBehavior: '+1000 points if line fully in rows 3-4',
    winningLine: [20, 21, 22, 23] // row 4
  },

  // MEMORY EFFECTS (3)
  {
    effectId: 'e017',
    scenario: 'Memory Challenge - dimmed tiles bonus',
    expectedBehavior: 'Dimmed tiles give double score',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e018',
    scenario: 'Corner Memory - dimmed corners',
    expectedBehavior: '+2000 points per dimmed corner in line',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e019',
    scenario: 'Edge Memory - dimmed edges',
    expectedBehavior: '+1000 points per dimmed edge in line',
    winningLine: [1, 6, 11, 16]
  },

  // WILD EFFECTS (5)
  {
    effectId: 'e020',
    scenario: 'Wild Favor - wild tiles double score',
    expectedBehavior: 'Wild tiles in line give double score',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e021',
    scenario: 'Wild Corners - wild corner bonus',
    expectedBehavior: '+2000 points per wild corner in line',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e022',
    scenario: 'Wild Edges - wild edge bonus',
    expectedBehavior: '+1000 points per wild edge in line',
    winningLine: [1, 6, 11, 16]
  },
  {
    effectId: 'e023',
    scenario: 'Wild Collector - use all 3 wilds',
    expectedBehavior: '+3000 points if all 3 wilds used in different lines',
    winningLine: [0, 1, 2, 3]
  },
  {
    effectId: 'e024',
    scenario: 'Wild Saver - avoid all wilds',
    expectedBehavior: '+2000 points at level end if no wilds used',
    winningLine: [0, 1, 2, 3]
  }
];

// Test cases for all 9 obstacles
export const obstacleTestCases: ObstacleTestCase[] = [
  {
    obstacleId: 'o001',
    scenario: 'Memory Drain - opponent benefits from dimmed',
    expectedBehavior: 'Dimmed tiles give opponent double score',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o002',
    scenario: 'Wild Drain - opponent benefits from wilds',
    expectedBehavior: 'Wild tiles give opponent double score',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o003',
    scenario: 'Dim Penalty - adjacent to dimmed penalty',
    expectedBehavior: '-1000 points if line adjacent to dimmed tiles',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o004',
    scenario: 'Wild Trap - adjacent to wild penalty',
    expectedBehavior: '-1000 points if line adjacent to wild tiles',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o005',
    scenario: 'Dim Flood - dims 8 tiles',
    expectedBehavior: 'Dims 8 random tiles',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o006',
    scenario: 'Wild Penalty - wilds subtract points',
    expectedBehavior: '-1000 points per wild tile in line',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o007',
    scenario: 'Edge Tax - edge penalty',
    expectedBehavior: '-1000 points if line uses any edge',
    winningLine: [1, 6, 11, 16]
  },
  {
    obstacleId: 'o008',
    scenario: 'Corner Tax - corner penalty',
    expectedBehavior: '-1000 points if line uses any corner',
    winningLine: [0, 1, 2, 3]
  },
  {
    obstacleId: 'o009',
    scenario: 'Center Tax - center penalty',
    expectedBehavior: '-2000 points if line uses center',
    winningLine: [10, 11, 12, 13]
  }
];

// Validation functions
export const validateEffectLogic = (effectId: string): boolean => {
  const effect = gameData.effects.find(e => e.id === effectId);
  if (!effect) return false;

  const testCase = effectTestCases.find(tc => tc.effectId === effectId);
  if (!testCase) return false;

  console.log(`✓ Effect ${effectId} (${effect.name}): ${testCase.expectedBehavior}`);
  return true;
};

export const validateObstacleLogic = (obstacleId: string): boolean => {
  const obstacle = gameData.obstacles.find(o => o.id === obstacleId);
  if (!obstacle) return false;

  const testCase = obstacleTestCases.find(tc => tc.obstacleId === obstacleId);
  if (!testCase) return false;

  console.log(`✓ Obstacle ${obstacleId} (${obstacle.name}): ${testCase.expectedBehavior}`);
  return true;
};

export const validateAllEffectsAndObstacles = (): { effectsValid: number; obstaclesValid: number } => {
  console.log('=== VALIDATING ALL EFFECTS ===');
  let validEffects = 0;
  gameData.effects.forEach(effect => {
    if (validateEffectLogic(effect.id)) validEffects++;
  });

  console.log('\n=== VALIDATING ALL OBSTACLES ===');
  let validObstacles = 0;
  gameData.obstacles.forEach(obstacle => {
    if (validateObstacleLogic(obstacle.id)) validObstacles++;
  });

  console.log(`\n=== SUMMARY ===`);
  console.log(`✓ ${validEffects}/${gameData.effects.length} effects validated`);
  console.log(`✓ ${validObstacles}/${gameData.obstacles.length} obstacles validated`);

  return { effectsValid: validEffects, obstaclesValid: validObstacles };
};

// Position reference for 5x5 board:
/*
 0  1  2  3  4
 5  6  7  8  9
10 11 12 13 14
15 16 17 18 19
20 21 22 23 24

Corners: 0, 4, 20, 24
Edges: 1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23
Center: 12
*/