import React from 'react';
import { GameState } from '../types/game';

interface GameUIProps {
  gameState: GameState;
  useSpecialAbility: (abilityType: string, cellIndex?: number) => boolean;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, useSpecialAbility }) => {
  // Simplified UI - no complex stats or abilities shown during gameplay
  // Effects are now shown in the level preview screen
  return null;
};

export default GameUI;