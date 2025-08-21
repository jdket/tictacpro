# Overview

TicTacPro is an enhanced Tic-Tac-Toe game built with React, TypeScript, and Express.js. It features 24 refined effects and 9 obstacles that modify gameplay mechanics across 10 progressive levels. The game uses a simplified, child-friendly design with static boards, dimmed tiles showing question marks, and wild cells that count for both players. Players earn points by completing 4-in-a-row lines on a 5x5 board, with effects providing scoring bonuses and obstacles applying penalties or opponent benefits.

The project is now in a clean, production-ready state suitable for GitHub commit with complete audio system, dual sound controls, and all temporary/agent preparation files removed.

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
- **State management** using React hooks with simplified game state tracking
- **Effect system** with 24 refined gameplay modifiers categorized by type (scoring, memory, wild)
- **Obstacle system** with 9 penalty-based challenges that apply taxes and opponent benefits
- **AI system** with basic behavior patterns
- **Level progression** system with increasing difficulty and point-based scoring
- **Child-friendly design** with static boards, dimmed tiles, and wild cells

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