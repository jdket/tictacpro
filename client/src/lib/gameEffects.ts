import { Effect, getCellType, getWinningLines } from '@/data/gameData';
import { CellValue, useGameState } from '@/lib/stores/useGameState';
import { getCellRow, getCellColumn, getAdjacentCells } from '@/lib/gameLogic';

export class EffectProcessor {
  private gameState: ReturnType<typeof useGameState.getState>;
  
  constructor(gameState: ReturnType<typeof useGameState.getState>) {
    this.gameState = gameState;
  }
  
  processEffect(effect: Effect, context: {
    cellIndex?: number;
    winningLine?: number[];
    isPlayerMove?: boolean;
  }) {
    switch (effect.id) {
      // Scoring Effects
      case 'e001': // Center Boost
        return this.processCenterBoost(context.winningLine, effect.value);
      case 'e002': // Corner Bonus
        return this.processCornerBonus(context.winningLine, effect.value);
      case 'e003': // Edge Bonus
        return this.processEdgeBonus(context.winningLine, effect.value);
      case 'e004': // Combo Counter
        return this.processComboCounter(effect.value);
      case 'e005': // Diagonal Doubler
        return this.processDiagonalDoubler(context.winningLine);
      case 'e006': // Row Runner
        return this.processRowRunner(context.winningLine, effect.value);
      case 'e007': // Column Climber
        return this.processColumnClimber(context.winningLine, effect.value);
      case 'e008': // Triple Cherry
        return this.processTripleCherry(effect.value);
      case 'e009': // Perfect Fill
        return this.processPerfectFill(effect.value);
      case 'e010': // Quick Start
        return this.processQuickStart(context.cellIndex, effect.value);
        
      // Placement Effects
      case 'e011': // Lucky Corner
        return this.processLuckyCorner();
      case 'e015': // Free Center
        return this.processFreeCenter();
      case 'e017': // Edge Magnet
        return this.processEdgeMagnet(context.winningLine, effect.value);
      case 'e018': // Corner Magnet
        return this.processCornerMagnet(context.winningLine, effect.value);
        
      // Memory Effects
      case 'e021': // Memory Mark
        return this.processMemoryMark();
      case 'e022': // Flash Path
        return this.processFlashPath();
      case 'e025': // Hide Corners
        return this.processHideCorners(context.cellIndex, effect.value);
      case 'e026': // Hide Edges
        return this.processHideEdges(context.cellIndex, effect.value);
        
      // Economy Effects
      case 'e041': // Bonus Bank
        return this.processBonusBank(context.winningLine, effect.value);
      case 'e043': // Even Up
        return this.processEvenUp(context.winningLine, effect.value);
      case 'e044': // Odd Up
        return this.processOddUp(context.winningLine, effect.value);
      case 'e045': // First Line Boost
        return this.processFirstLineBoost();
      case 'e048': // No Center Gift
        return this.processNoCenterGift(effect.value);
      case 'e049': // Corner Collector
        return this.processCornerCollector(effect.value);
        
      default:
        return 0;
    }
  }
  
  // Scoring Effects Implementation
  private processCenterBoost(winningLine?: number[], value: number = 5): number {
    if (!winningLine || !winningLine.includes(4)) return 0;
    return value;
  }
  
  private processCornerBonus(winningLine?: number[], value: number = 2): number {
    if (!winningLine) return 0;
    const corners = [0, 2, 6, 8];
    const cornerCount = winningLine.filter(cell => corners.includes(cell)).length;
    return cornerCount * value;
  }
  
  private processEdgeBonus(winningLine?: number[], value: number = 1): number {
    if (!winningLine) return 0;
    const edges = [1, 3, 5, 7];
    const edgeCount = winningLine.filter(cell => edges.includes(cell)).length;
    return edgeCount * value;
  }
  
  private processComboCounter(value: number = 3): number {
    const newCombo = this.gameState.comboCount + 1;
    this.gameState.updateEffectState({ ...this.gameState.effectState });
    return newCombo * value;
  }
  
  private processDiagonalDoubler(winningLine?: number[]): number {
    if (!winningLine) return 0;
    const diagonals = [[0, 4, 8], [2, 4, 6]];
    const isDiagonal = diagonals.some(diag => 
      diag.every(cell => winningLine.includes(cell))
    );
    return isDiagonal ? 2 : 1; // Return multiplier
  }
  
  private processRowRunner(winningLine?: number[], value: number = 4): number {
    if (!winningLine) return 0;
    const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    const isRow = rows.some(row => 
      row.every(cell => winningLine.includes(cell))
    );
    return isRow ? value : 0;
  }
  
  private processColumnClimber(winningLine?: number[], value: number = 4): number {
    if (!winningLine) return 0;
    const columns = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
    const isColumn = columns.some(col => 
      col.every(cell => winningLine.includes(cell))
    );
    return isColumn ? value : 0;
  }
  
  private processTripleCherry(value: number = 2): number {
    return this.gameState.linesCompleted === 3 ? value : 1; // Return multiplier
  }
  
  private processPerfectFill(value: number = 8): number {
    const isFull = this.gameState.board.every(cell => cell !== null);
    return isFull ? value : 0;
  }
  
  private processQuickStart(cellIndex?: number, value: number = 6): number {
    if (cellIndex === 4 && this.gameState.moveCount === 1) {
      return value;
    }
    return 0;
  }
  
  // Placement Effects Implementation
  private processLuckyCorner(): number {
    if (this.gameState.moveCount === 0) {
      const corners = [0, 2, 6, 8];
      const emptyCorners = corners.filter(c => this.gameState.board[c] === null);
      if (emptyCorners.length > 0) {
        const randomCorner = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        this.gameState.makeMove(randomCorner);
        return 1;
      }
    }
    return 0;
  }
  
  private processFreeCenter(): number {
    if (this.gameState.moveCount === 0 && this.gameState.board[4] === null) {
      this.gameState.makeMove(4);
      return 1;
    }
    return 0;
  }
  
  private processEdgeMagnet(winningLine?: number[], value: number = 3): number {
    if (winningLine && this.gameState.moveCount === 1) {
      const edges = [1, 3, 5, 7];
      const hasEdge = winningLine.some(cell => edges.includes(cell));
      return hasEdge ? value : 0;
    }
    return 0;
  }
  
  private processCornerMagnet(winningLine?: number[], value: number = 3): number {
    if (winningLine && this.gameState.moveCount === 1) {
      const corners = [0, 2, 6, 8];
      const hasCorner = winningLine.some(cell => corners.includes(cell));
      return hasCorner ? value : 0;
    }
    return 0;
  }
  
  // Memory Effects Implementation
  private processMemoryMark(): number {
    if (this.gameState.effectState.memoryCell === null) {
      const emptyCells = this.gameState.board
        .map((cell, index) => cell === null ? index : -1)
        .filter(index => index !== -1);
      
      if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.gameState.updateEffectState({ 
          ...this.gameState.effectState,
          memoryCell: randomCell,
          hiddenCells: [randomCell]
        });
      }
    }
    return 0;
  }
  
  private processFlashPath(): number {
    // Flash a winning line for 1 second
    const lines = getWinningLines();
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    
    // Trigger visual flash (would be handled in component)
    setTimeout(() => {
      this.gameState.updateEffectState({
        ...this.gameState.effectState
      });
    }, 1000);
    
    return 0;
  }
  
  private processHideCorners(cellIndex?: number, value: number = 3): number {
    const corners = [0, 2, 6, 8];
    
    if (this.gameState.effectState.hiddenCells.length === 0) {
      this.gameState.updateEffectState({
        ...this.gameState.effectState,
        hiddenCells: corners
      });
    }
    
    if (cellIndex !== undefined && corners.includes(cellIndex)) {
      return value;
    }
    
    return 0;
  }
  
  private processHideEdges(cellIndex?: number, value: number = 3): number {
    const edges = [1, 3, 5, 7];
    
    if (this.gameState.effectState.hiddenCells.length === 0) {
      this.gameState.updateEffectState({
        ...this.gameState.effectState,
        hiddenCells: edges
      });
    }
    
    if (cellIndex !== undefined && edges.includes(cellIndex)) {
      return value;
    }
    
    return 0;
  }
  
  // Economy Effects Implementation
  private processBonusBank(winningLine?: number[], value: number = 2): number {
    return winningLine ? value : 0;
  }
  
  private processEvenUp(winningLine?: number[], value: number = 5): number {
    if (!winningLine) return 0;
    const allEven = winningLine.every(cell => cell % 2 === 0);
    return allEven ? value : 0;
  }
  
  private processOddUp(winningLine?: number[], value: number = 5): number {
    if (!winningLine) return 0;
    const allOdd = winningLine.every(cell => cell % 2 === 1);
    return allOdd ? value : 0;
  }
  
  private processFirstLineBoost(): number {
    return this.gameState.linesCompleted === 1 ? 2 : 1; // Return multiplier
  }
  
  private processNoCenterGift(value: number = 8): number {
    return !this.gameState.usedCenter ? value : 0;
  }
  
  private processCornerCollector(value: number = 10): number {
    const corners = [0, 2, 6, 8];
    const allCornersFilled = corners.every(corner => this.gameState.board[corner] !== null);
    return allCornersFilled ? value : 0;
  }
}
