# TicTacPro - Complete Game Package

This package contains the complete TicTacPro game - an enhanced 5x5 Tic-Tac-Toe with 24 effects, 9 obstacles, and progressive gameplay.

## Quick Start

1. **Install Node.js** (version 16 or higher)
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the game:**
   ```bash
   npm run dev
   ```
4. **Open your browser** to the displayed local address (usually http://localhost:5173)

## Game Features

- **5x5 Board**: Enhanced gameplay with strategic depth
- **24 Effects**: Positive gameplay modifiers (Center Boost, Corner Bonus, etc.)
- **9 Obstacles**: Challenging penalties (Edge Tax, Wild Penalty, etc.)
- **10 Progressive Levels**: Increasing difficulty
- **AI Opponent**: Intelligent computer player
- **Audio System**: Click sounds + "Pixel Dreams" soundtrack
- **Special Tiles**: Wild cells (★) and dimmed tiles (?)
- **Scoring System**: 1000 points per line, 500 bonus for multiple lines

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Game logic
│   │   ├── lib/stores/     # State management
│   │   ├── data/           # Game configuration
│   │   └── utils/          # Helper functions
│   └── public/sounds/      # Audio files
├── server/                 # Express.js backend
├── shared/                 # Shared utilities
├── package.json            # Dependencies
└── README.md              # Detailed documentation

```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript  
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Database**: Drizzle ORM + PostgreSQL

## Game Controls

- **Click tiles** to place your X
- **Speaker button** (top right): Toggle sound effects
- **Music button** (top right): Toggle background music

## Troubleshooting

- **Port already in use**: The game will automatically find an available port
- **Audio not playing**: Click the speaker/music buttons to unmute
- **Build errors**: Run `npm install` to ensure all dependencies are installed

## For Developers

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Support

This is a complete, standalone game package. All source code, assets, and documentation are included.