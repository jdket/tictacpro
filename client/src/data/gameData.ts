// Game data based on the provided JSON structure
export const gameData = {
  "effects": [
    { "id":"e001","name":"Center Boost","type":"scoring","text":"4-in-a-row lines through center give +3000 pts","value":3000 },
    { "id":"e002","name":"Corner Bonus","type":"scoring","text":"+2000 pts per corner used in a line","value":2000 },
    { "id":"e003","name":"Edge Bonus","type":"scoring","text":"+1000 pts per edge used in a line","value":1000 },
    { "id":"e004","name":"Combo Counter","type":"scoring","text":"Each line this level raises a combo, each next line +2000 pts","value":2000 },
    { "id":"e005","name":"Diagonal Doubler","type":"scoring","text":"Diagonal 4-in-a-row lines pay x2","value":2 },
    { "id":"e006","name":"Row Runner","type":"scoring","text":"Horizontal 4-in-a-row lines +3000 pts","value":3000 },
    { "id":"e007","name":"Column Climber","type":"scoring","text":"Vertical 4-in-a-row lines +3000 pts","value":3000 },
    { "id":"e008","name":"Triple Cherry","type":"scoring","text":"If you make 3 four-in-a-row lines this level, final payout x2","value":2 },
    { "id":"e009","name":"Perfect Fill","type":"scoring","text":"If the board fills this level, +3000 pts","value":3000 },
    { "id":"e010","name":"Quick Start","type":"scoring","text":"If your first move is center, +3000 pts","value":3000 },

    { "id":"e011","name":"Speed Bonus","type":"scoring","text":"First 3 moves this level give +1000 pts each","value":1000 },
    { "id":"e012","name":"Fast Corner","type":"scoring","text":"Corner placements give +2000 pts","value":2000 },
    { "id":"e013","name":"Multi Strike","type":"scoring","text":"Each line after the first this level gives +500 extra pts","value":500 },
    { "id":"e014","name":"Line Streak","type":"scoring","text":"If you score 2 lines in a row, +3000 pts bonus","value":3000 },
    { "id":"e015","name":"Center Power","type":"scoring","text":"Any line using center cell gives +2000 pts","value":2000 },
    { "id":"e016","name":"Edge Master","type":"scoring","text":"Lines using 3+ edge cells give +3000 pts","value":3000 },
    { "id":"e017","name":"Edge Magnet","type":"scoring","text":"Your first move on an edge gives +3000 pts if it creates a line","value":3000 },
    { "id":"e018","name":"Corner Magnet","type":"scoring","text":"Your first move on a corner gives +3000 pts if it creates a line","value":3000 },
    { "id":"e019","name":"Middle Master","type":"scoring","text":"Lines going through the middle row give +3000 pts","value":3000 },
    { "id":"e020","name":"Board Control","type":"scoring","text":"Each empty cell when you score gives +200 pts","value":200 },

    { "id":"e021","name":"Memory Challenge","type":"memory","text":"Remember where you placed - no visual hints this level","value":1 },
    { "id":"e022","name":"Quick Peek","type":"memory","text":"Shows one winning path at start, then it's hidden","value":1 },
    { "id":"e023","name":"AI Helper","type":"memory","text":"AI shows where it might play next","value":1 },
    { "id":"e024","name":"Last Move","type":"memory","text":"Remember your last move location","value":1 },
    { "id":"e025","name":"Corner Memory","type":"memory","text":"Corner spots are hidden, remember them for +3000 pts","value":3000 },
    { "id":"e026","name":"Edge Memory","type":"memory","text":"Edge spots are hidden, remember them for +3000 pts","value":3000 },
    { "id":"e027","name":"Think Fast","type":"memory","text":"Board changes quickly, plan your moves","value":1 },
    { "id":"e028","name":"Move Memory","type":"memory","text":"Remember your last 3 moves for +3000 pts","value":3000 },
    { "id":"e029","name":"Mirror Game","type":"memory","text":"See the opposite side of your last move","value":1 },
    { "id":"e030","name":"Line Counter","type":"memory","text":"Count how many in a row you have","value":1 },

    { "id":"e031","name":"O Drift","type":"ai","text":"AI prefers edges this level","value":1 },
    { "id":"e032","name":"O Corner Habit","type":"ai","text":"AI prefers corners this level","value":1 },
    { "id":"e033","name":"O Avoid Center","type":"ai","text":"AI will not pick center unless forced","value":1 },
    { "id":"e034","name":"O Slow","type":"ai","text":"AI move is delayed by 500 ms for planning","value":500 },
    { "id":"e035","name":"O Repeat","type":"ai","text":"AI tries to play near its last O","value":1 },
    { "id":"e036","name":"O Scatter","type":"ai","text":"AI avoids cells next to your last X","value":1 },
    { "id":"e037","name":"O Fairness","type":"ai","text":"If you have 2 in a row, AI avoids blocking if any other cell exists","value":1 },
    { "id":"e038","name":"O Mirror","type":"ai","text":"AI mirrors your last move if open","value":1 },
    { "id":"e039","name":"O Center Rush","type":"ai","text":"AI tries to take center if open on its first chance","value":1 },
    { "id":"e040","name":"O Edge Rush","type":"ai","text":"AI prefers edge on first placement","value":1 },

    { "id":"e041","name":"Bonus Bank","type":"economy","text":"Each line gives +2000 pts extra this level","value":2000 },
    { "id":"e042","name":"Streak Saver","type":"economy","text":"If you score in 2 turns in a row, +3000 pts extra","value":3000 },
    { "id":"e043","name":"Top Half","type":"economy","text":"Lines in the top half of the board give +2000 pts","value":2000 },
    { "id":"e044","name":"Bottom Half","type":"economy","text":"Lines in the bottom half of the board give +2000 pts","value":2000 },
    { "id":"e045","name":"First Line Boost","type":"economy","text":"Your first line this level pays x2","value":2 },
    { "id":"e046","name":"Last Line Boost","type":"economy","text":"Your last line before fill pays x2","value":2 },
    { "id":"e047","name":"Two Line Gift","type":"economy","text":"If you get exactly 2 lines this level, +3000 pts","value":3000 },
    { "id":"e048","name":"No Center Gift","type":"economy","text":"If you never use center, +3000 pts","value":3000 },
    { "id":"e049","name":"Corner Collector","type":"economy","text":"If all 4 corners are filled by end, +3000 pts","value":3000 },
    { "id":"e050","name":"Saver","type":"economy","text":"Adds +10% pts to end of game total","value":0.10 }
  ],
  "obstacles": [
    { "id":"o001","name":"Locked Center","text":"Center starts blocked by a rock","rule":"cell 4 blocked" },
    { "id":"o002","name":"Locked Corner","text":"One random corner is blocked","rule":"one of 0,2,6,8 blocked" },
    { "id":"o003","name":"Locked Edge","text":"One random edge is blocked","rule":"one of 1,3,5,7 blocked" },
    { "id":"o004","name":"Ice Tile","text":"A random cell cannot be changed once used","rule":"first mark on that cell becomes frozen" },
    { "id":"o005","name":"Fog Tile","text":"A random cell is hidden until touched","rule":"conceal until player taps" },
    { "id":"o006","name":"Bounce Tile","text":"A random cell moves your X to a neighbor","rule":"on place, redirect to adjacent empty" },
    { "id":"o007","name":"Swap Tile","text":"A random cell swaps X and O if both are adjacent","rule":"on place, swap nearest O if found" },
    { "id":"o008","name":"Slow Reveal","text":"Board starts dim, lights up cells one per turn","rule":"unlock order queue" },
    { "id":"o009","name":"No Repeat Row","text":"You cannot place on the same row twice in a row","rule":"enforce row cooldown 1 turn" },
    { "id":"o010","name":"No Repeat Column","text":"You cannot place on the same column twice in a row","rule":"enforce column cooldown 1 turn" },
    { "id":"o011","name":"Wind","text":"After AI plays, one random empty cell becomes blocked","rule":"block 1 empty each turn" },
    { "id":"o012","name":"Gravity","text":"Your X falls to the nearest cell toward the bottom of its column","rule":"snap to lowest empty in column" },
    { "id":"o013","name":"Mirror Board","text":"Your placement also marks the mirrored cell as preview only","rule":"show ghost mark, no score" },
    { "id":"o014","name":"Sticky O","text":"An O cannot be removed by effects this level","rule":"ignore remove O actions" },
    { "id":"o015","name":"Slippery Edge","text":"Edge cells cannot start a new line","rule":"only count if edge is part of a larger line" },
    { "id":"o016","name":"Time Blink","text":"Cells flash off for 250 ms after AI moves","rule":"brief concealment" },
    { "id":"o017","name":"Double O Chance","text":"Small chance AI places 2 O once per level","rule":"one time 20 percent chance" },
    { "id":"o018","name":"Center Tax","text":"Placing on center removes 2000 pts from this level payout","rule":"level penalty on center use" },
    { "id":"o019","name":"Edge Tax","text":"Placing on edges removes 1000 pts from this level payout","rule":"level penalty on edge use" },
    { "id":"o020","name":"Corner Tax","text":"Placing on corners removes 1000 pts from this level payout","rule":"level penalty on corner use" },
    { "id":"o021","name":"Memory Fog","text":"3 random tiles become dimmed - they show ? when played but count normally","rule":"dims 3 tiles, shows ? for content" }
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
