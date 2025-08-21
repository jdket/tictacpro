// Game data based on the provided JSON structure
export const gameData = {
  "effects": [
    { "id":"e001","name":"Center Boost","type":"scoring","text":"4-in-a-row through center gives +3000 pts","value":3000 },
    { "id":"e002","name":"Corner Bonus","type":"scoring","text":"+2000 pts per corner in your 4-in-a-row","value":2000 },
    { "id":"e003","name":"Edge Bonus","type":"scoring","text":"+1000 pts per edge in your 4-in-a-row","value":1000 },
    { "id":"e004","name":"Combo Counter","type":"scoring","text":"Each additional 4-in-a-row after the first gives +1000 pts","value":1000 },
    { "id":"e005","name":"Diagonal Bonus","type":"scoring","text":"Any diagonal 4-in-a-row gives +2000 pts","value":2000 },
    { "id":"e006","name":"Row Runner","type":"scoring","text":"Any horizontal 4-in-a-row gives +2000 pts","value":2000 },
    { "id":"e007","name":"Column Climber","type":"scoring","text":"Any vertical 4-in-a-row gives +2000 pts","value":2000 },
    { "id":"e008","name":"Triple Cherry","type":"scoring","text":"If you score 3+ 4-in-a-rows this level, +3000 at end","value":3000 },
    { "id":"e009","name":"Quick Start","type":"scoring","text":"Your first move is center, +2000 pts","value":2000 },
    { "id":"e010","name":"Fast Corner","type":"scoring","text":"Corner placement that completes 4-in-a-row gives +1000 pts","value":1000 },
    { "id":"e011","name":"Line Streak","type":"scoring","text":"Scoring on two consecutive turns gives +2000 pts","value":2000 },
    { "id":"e012","name":"Middle Master","type":"scoring","text":"4-in-a-row fully on middle row or column gives +2000 pts","value":2000 },
    { "id":"e013","name":"Two Line Gift","type":"scoring","text":"Exactly 2 lines this level, +2000 pts","value":2000 },
    { "id":"e014","name":"Corner Collector","type":"scoring","text":"All 4 corners marked by level end, +3000 pts","value":3000 },
    { "id":"e015","name":"Top Focus","type":"scoring","text":"4-in-a-row fully in rows 0 or 1, +1000 pts","value":1000 },
    { "id":"e016","name":"Bottom Focus","type":"scoring","text":"4-in-a-row fully in rows 3 or 4, +1000 pts","value":1000 },
    { "id":"e017","name":"Memory Challenge","type":"memory","text":"Dim 5 tiles, Dimmed tiles give double score","value":2 },
    { "id":"e018","name":"Corner Memory","type":"memory","text":"Dim all 4 corners, Dimmed corner in 4-in-a-row gives +2000 pts","value":2000 },
    { "id":"e019","name":"Edge Memory","type":"memory","text":"Dim 4 edges, Dimmed edge in 4-in-a-row gives +1000 pts","value":1000 },
    { "id":"e020","name":"Wild Favor","type":"wild","text":"5 tiles become Wild, Wild tiles in 4-in-a-row give double score","value":2 },
    { "id":"e021","name":"Wild Corners","type":"wild","text":"2 corners become Wild, Wild corner in line gives +2000 pts","value":2000 },
    { "id":"e022","name":"Wild Edges","type":"wild","text":"3 edges become Wild, Wild edge in line gives +1000 pts","value":1000 },
    { "id":"e023","name":"Wild Collector","type":"wild","text":"3 tiles become Wild, use all 3 in different 4-in-a-rows for +3000 pts","value":3000 },
    { "id":"e024","name":"Wild Saver","type":"wild","text":"2 tiles become Wild, avoid Wild tiles all level for +2000 pts","value":2000 }
  ],
  "obstacles": [
    { "id":"o001","name":"Memory Drain","text":"Dim 5 tiles, Dimmed tiles give Opponent double score","rule":"dims 5 tiles, opponent benefits" },
    { "id":"o002","name":"Wild Drain","text":"5 tiles become Wild, Wild tiles in your 4-in-a-row give Opponent double score","rule":"5 wilds benefit opponent" },
    { "id":"o003","name":"Dim Penalty","text":"Dim 2 tiles, any 4-in-a-row next to Dimmed tiles loses 1000 pts","rule":"penalty for adjacent to dimmed" },
    { "id":"o004","name":"Wild Trap","text":"2 tiles become Wild, any 4-in-a-row next to Wild tiles loses 1000 pts","rule":"penalty for adjacent to wild" },
    { "id":"o005","name":"Dim Flood","text":"Dim 8 tiles at random","rule":"dims 8 random tiles" },
    { "id":"o006","name":"Wild Penalty","text":"5 tiles become Wild, Wild tiles in your line subtract 1000 pts","rule":"wild tiles subtract points" },
    { "id":"o007","name":"Edge Tax","text":"Any 4-in-a-row using at least one edge subtracts 1000 pts","rule":"edge penalty" },
    { "id":"o008","name":"Corner Tax","text":"Any 4-in-a-row using at least one corner subtracts 1000 pts","rule":"corner penalty" },
    { "id":"o009","name":"Center Tax","text":"Any 4-in-a-row using center subtracts 2000 pts","rule":"center penalty" }
  ]
};

export type Effect = typeof gameData.effects[0];
export type Obstacle = typeof gameData.obstacles[0];

// Helper functions for game data
export const getRandomEffect = (): Effect => {
  return gameData.effects[Math.floor(Math.random() * gameData.effects.length)];
};

export const getRandomObstacle = (): Obstacle => {
  return gameData.obstacles[Math.floor(Math.random() * gameData.obstacles.length)];
};

// Utility functions for game logic - moved to gameUtils.ts to avoid duplication

export const getCellType = (index: number): 'corner' | 'edge' | 'center' => {
  // For 5x5 board (indices 0-24)
  const row = Math.floor(index / 5);
  const col = index % 5;
  
  // Center is position (2,2) = index 12
  if (row === 2 && col === 2) return 'center';
  
  // Corners are (0,0), (0,4), (4,0), (4,4) = indices 0, 4, 20, 24
  if ((row === 0 || row === 4) && (col === 0 || col === 4)) return 'corner';
  
  // Everything else is edge
  return 'edge';
};
