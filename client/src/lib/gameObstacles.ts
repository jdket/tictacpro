import { Obstacle } from '@/data/gameData';
import { CellValue, useGameState } from '@/lib/stores/useGameState';
import { getAdjacentCells, getRandomAIMove } from '@/lib/gameLogic';

export class ObstacleProcessor {
  private gameState: ReturnType<typeof useGameState.getState>;
  
  constructor(gameState: ReturnType<typeof useGameState.getState>) {
    this.gameState = gameState;
  }
  
  initializeObstacle(obstacle: Obstacle) {
    switch (obstacle.id) {
      case 'o001': // Locked Center
        this.initializeLockedCenter();
        break;
      case 'o002': // Locked Corner
        this.initializeLockedCorner();
        break;
      case 'o003': // Locked Edge
        this.initializeLockedEdge();
        break;
      case 'o004': // Ice Tile
        this.initializeIceTile();
        break;
      case 'o005': // Fog Tile
        this.initializeFogTile();
        break;
      case 'o006': // Bounce Tile
        this.initializeBounceTile();
        break;
      case 'o008': // Slow Reveal
        this.initializeSlowReveal();
        break;
    }
  }
  
  processObstacle(obstacle: Obstacle, context: {
    cellIndex?: number;
    isPlayerMove?: boolean;
    isAIMove?: boolean;
  }): number {
    switch (obstacle.id) {
      case 'o006': // Bounce Tile
        return this.processBounceTile(context.cellIndex);
      case 'o007': // Swap Tile
        return this.processSwapTile(context.cellIndex);
      case 'o011': // Wind
        return this.processWind(context.isAIMove);
      case 'o012': // Gravity
        return this.processGravity(context.cellIndex);
      case 'o016': // Time Blink
        return this.processTimeBlink(context.isAIMove);
      case 'o017': // Double O Chance
        return this.processDoubleOChance();
      case 'o018': // Center Tax
        return this.processCenterTax(context.cellIndex);
      case 'o019': // Edge Tax
        return this.processEdgeTax(context.cellIndex);
      case 'o020': // Corner Tax
        return this.processCornerTax(context.cellIndex);
      default:
        return 0;
    }
  }
  
  // Initialization methods
  private initializeLockedCenter() {
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      blockedCells: [4]
    });
  }
  
  private initializeLockedCorner() {
    const corners = [0, 2, 6, 8];
    const randomCorner = corners[Math.floor(Math.random() * corners.length)];
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      blockedCells: [randomCorner]
    });
  }
  
  private initializeLockedEdge() {
    const edges = [1, 3, 5, 7];
    const randomEdge = edges[Math.floor(Math.random() * edges.length)];
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      blockedCells: [randomEdge]
    });
  }
  
  private initializeIceTile() {
    const randomCell = Math.floor(Math.random() * 9);
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      frozenCells: [randomCell]
    });
  }
  
  private initializeFogTile() {
    const randomCell = Math.floor(Math.random() * 9);
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      hiddenCells: [randomCell]
    });
  }
  
  private initializeBounceTile() {
    const randomCell = Math.floor(Math.random() * 9);
    // Store bounce tile in a special way
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      memoryCell: randomCell // Reuse memoryCell for bounce tile
    });
  }
  
  private initializeSlowReveal() {
    // Hide all cells initially, reveal one per turn
    this.gameState.updateEffectState({
      ...this.gameState.effectState,
      hiddenCells: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    });
  }
  
  // Processing methods
  private processBounceTile(cellIndex?: number): number {
    if (cellIndex === undefined || cellIndex !== this.gameState.effectState.memoryCell) {
      return cellIndex || 0;
    }
    
    // Bounce to adjacent empty cell
    const adjacent = getAdjacentCells(cellIndex);
    const emptyAdjacent = adjacent.filter(cell => this.gameState.board[cell] === null);
    
    if (emptyA# thoughts
I need to create TicTacPro, an enhanced Tic-Tac-Toe game with 50 effects and 20 obstacles following the provided JSON structure. The existing project has a React setup but the App.tsx is mostly empty and commented out. I'll implement:

1. A complete Tic-Tac-Toe game with 3x3 grid
2. 10-level progression system
3. All 50 effects from the JSON across 5 categories (scoring, placement, memory, AI, economy)
4. 20 obstacles introduced every 2 levels
5. Random O placement (no AI decision making)
6. Score/coin system for display
7. Visual feedback for effects and obstacles

The game will be a web application that binds to port 5000 and uses the existing React structure. I'll create components for the game board, effect system, obstacle system, and UI elements.

# useful_guidelines_from_blueprints
- Use React for UI components and game state
- Use JavaScript for game logic and effect processing
- Use CSS3 for styling, animations, and visual effects
- Implement proper game state management for complex interactions
- Create visual indicators for active effects and obstacles

# directory_structure
```json
[
    {"path": "client/src/App.tsx", "status": "overwritten"},
    {"path": "client/src/components/TicTacPro.tsx", "status": "new"},
    {"path": "client/src/components/GameBoard.tsx", "status": "new"},
    {"path": "client/src/components/EffectDisplay.tsx", "status": "new"},
    {"path": "client/src/components/ObstacleDisplay.tsx", "status": "new"},
    {"path": "client/src/components/ScoreDisplay.tsx", "status": "new"},
    {"path": "client/src/components/LevelDisplay.tsx", "status": "new"},
    {"path": "client/src/hooks/useGameLogic.tsx", "status": "new"},
    {"path": "client/src/hooks/useEffects.tsx", "status": "new"},
    {"path": "client/src/hooks/useObstacles.tsx", "status": "new"},
    {"path": "client/src/data/gameData.ts", "status": "new"},
    {"path": "client/src/types/game.ts", "status": "new"},
    {"path": "client/src/utils/gameUtils.ts", "status": "new"},
    {"path": "client/src/styles/game.css", "status": "new"}
]
