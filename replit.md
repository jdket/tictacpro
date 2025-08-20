# Overview

TicTacPro is an enhanced Tic-Tac-Toe game built with React, TypeScript, and Express.js. It features 50 different effects and 20 obstacles that modify gameplay mechanics across 10 progressive levels. The game includes advanced visual effects using Three.js, modern UI components with Radix UI, and a comprehensive game state management system. Players earn coins by completing lines, with various effects modifying scoring, placement rules, AI behavior, memory challenges, and economic mechanics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the main application
- **Vite** as the build tool and development server with hot module replacement
- **Three.js ecosystem** (@react-three/fiber, @react-three/drei, @react-three/postprocessing) for 3D graphics and visual effects
- **Tailwind CSS** for styling with custom CSS variables for theming
- **Radix UI** components for accessible, unstyled UI primitives
- **Custom hooks** for game logic, effects processing, and obstacle management
- **Component-based architecture** with clear separation between game logic, UI components, and visual effects

## Backend Architecture
- **Express.js** server with TypeScript
- **Memory-based storage** implementation with interface for future database integration
- **RESTful API structure** with `/api` prefix for all endpoints
- **Middleware** for request logging, error handling, and JSON parsing
- **Development/production** environment handling with Vite integration

## Game Logic Architecture
- **State management** using React hooks with complex game state tracking
- **Effect system** with 50+ different gameplay modifiers categorized by type (scoring, placement, memory, AI, economy)
- **Obstacle system** with 20+ gameplay challenges that modify board behavior
- **AI system** with configurable behavior patterns affected by obstacles and effects
- **Level progression** system with increasing difficulty and coin-based scoring

## Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with migrations support
- **Neon Database** integration via `@neondatabase/serverless`
- **Schema definition** in shared TypeScript files with Zod validation
- **Memory storage fallback** for development with interface-based design for easy database swapping

## Visual and Audio Systems
- **3D rendering** with Three.js for enhanced visual effects
- **GLSL shader support** via vite-plugin-glsl for custom visual effects
- **Asset management** for 3D models (.gltf, .glb) and audio files (.mp3, .ogg, .wav)
- **Responsive design** with mobile-first approach and touch interaction support

# External Dependencies

## Database and ORM
- **Neon Database** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database toolkit with PostgreSQL dialect
- **Drizzle Kit** - Database migration and schema management tools

## Frontend Libraries
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers and abstractions for React Three Fiber
- **React Three Postprocessing** - Post-processing effects for React Three Fiber
- **Radix UI** - Comprehensive set of accessible, unstyled UI components
- **TanStack React Query** - Data fetching and caching library
- **Class Variance Authority** - Utility for creating consistent component variants
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Development Tools
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **ESBuild** - Fast JavaScript bundler for production builds
- **PostCSS** - CSS processing with Autoprefixer
- **Replit Vite Plugin** - Runtime error modal for development

## Utility Libraries
- **Date-fns** - Date utility library
- **Clsx/Tailwind Merge** - Conditional CSS class utilities
- **Nanoid** - URL-safe unique ID generator
- **Zod** - TypeScript-first schema validation

## Audio and Graphics
- **GLSL shader support** - Custom visual effects
- **Web Audio API** - Audio processing and playback
- **Canvas API** - 2D graphics rendering
- **WebGL** - Hardware-accelerated 3D graphics via Three.js