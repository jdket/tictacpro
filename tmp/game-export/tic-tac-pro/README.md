# TicTacPro

An advanced Tic-Tac-Toe game that reimagines the classic strategy game with dynamic gameplay mechanics, intelligent game systems, and progressive challenge modes.

## Features

- **5x5 Board**: Expanded gameplay area for more strategic depth
- **24 Effects**: Positive gameplay modifiers that enhance scoring and gameplay
- **9 Obstacles**: Challenging penalties that test strategic thinking
- **10 Progressive Levels**: Increasing difficulty with effect combinations
- **Scoring System**: 1000 points per line, 500 bonus for multiple lines
- **Wild Cells**: Special tiles that count for both players but cannot be played on
- **Dimmed Tiles**: Memory challenge tiles that show question marks when played
- **AI Opponent**: Intelligent computer player with adaptive behavior
- **Audio System**: Click sounds and background music
- **Child-Friendly Design**: Simple, clear interface with static boards

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **UI Components**: Radix UI primitives
- **Audio**: Web Audio API
- **State Management**: React hooks + Zustand
- **Database**: Drizzle ORM + PostgreSQL (Neon)

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and navigate to the local server address**

## Game Rules

### Basic Gameplay
- Players take turns placing X and O on a 5x5 board
- Goal is to create 4-in-a-row lines (horizontal, vertical, or diagonal)
- Each line scores 1000 points, with 500 bonus for multiple lines

### Special Tiles
- **Wild Cells (★)**: Count for both players in scoring, cannot be played on
- **Dimmed Tiles**: Show "?" when played on, used for memory-based effects

### Effects & Obstacles
- **Effects**: Positive modifiers that boost scoring (e.g., Center Boost, Corner Bonus)
- **Obstacles**: Penalties that reduce scores or benefit opponent (e.g., Edge Tax, Wild Penalty)

### Level Progression
- 10 levels total
- Each level introduces new effects/obstacles
- Effects appear every level, obstacles every 2nd level
- Maximum bonus caps at +3000 points per effect

## Project Architecture

### Frontend (`/client`)
- **Components**: React components for UI elements
- **Hooks**: Custom hooks for game logic and effects
- **Stores**: Zustand stores for state management
- **Utils**: Helper functions and game utilities
- **Types**: TypeScript type definitions

### Backend (`/server`)
- **Routes**: API endpoints for game data
- **Storage**: Data persistence layer
- **Middleware**: Request handling and validation

### Shared (`/shared`)
- **Schema**: Common data structures and validation

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Files
- `client/src/hooks/useGameLogic.tsx` - Main game logic
- `client/src/hooks/useNewEffects.tsx` - Effect system
- `client/src/hooks/useNewObstacles.tsx` - Obstacle system
- `client/src/data/gameData.ts` - Game configuration data
- `client/src/utils/gameUtils.ts` - Core game utilities

## Audio Assets

- **Click Sound**: Mouse click sound for tile placement
- **Background Music**: "Pixel Dreams" soundtrack
- **Sound Controls**: Independent volume controls for effects and music

## Future Enhancements

- Additional effects and obstacles
- Multiplayer support
- Tournament mode
- Custom board sizes
- Theme customization
- Save/load game states

## License

This project is part of the Learn For Fun Games collection.