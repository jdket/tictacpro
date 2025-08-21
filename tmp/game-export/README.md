# Learn For Fun Games

A collection of educational and entertaining games built with modern web technologies.

## Games

### TicTacPro
**Location:** `/tic-tac-pro/`
**Type:** Strategy/Puzzle Game
**Technology:** React + TypeScript + Express.js

An enhanced Tic-Tac-Toe game featuring:
- 5x5 board gameplay
- 24 refined effects and 9 obstacles
- Progressive level system (10 levels)
- Dynamic scoring with bonuses
- AI opponent
- Special game mechanics (wild cells, dimmed tiles)
- Sound effects and background music
- Child-friendly design

**How to run:**
```bash
cd tic-tac-pro
npm install
npm run dev
```

## Project Structure

Each game is stored in its own directory with:
- Complete source code
- README with setup instructions
- Assets (audio, images, etc.)
- Documentation

## Adding New Games

When adding new games, create a new directory following this pattern:
```
/game-name/
├── README.md          # Game-specific documentation
├── package.json       # Dependencies
├── client/           # Frontend code
├── server/           # Backend code (if needed)
├── assets/           # Game assets
└── docs/             # Additional documentation
```

Update this main README.md to include the new game in the Games section.