import React from 'react';
import { Obstacle } from '../types/game';

interface ObstacleDisplayProps {
  obstacle: Obstacle;
}

const ObstacleDisplay: React.FC<ObstacleDisplayProps> = ({ obstacle }) => {
  const getObstacleIcon = (obstacleId: string): string => {
    if (obstacleId.startsWith('o001') || obstacleId.startsWith('o002') || obstacleId.startsWith('o003')) {
      return '🗿'; // Locked tiles
    } else if (obstacleId === 'o004') {
      return '❄️'; // Ice tile
    } else if (obstacleId === 'o005') {
      return '🌫️'; // Fog tile
    } else if (obstacleId === 'o006') {
      return '↗️'; // Bounce tile
    } else if (obstacleId === 'o007') {
      return '🔄'; // Swap tile
    } else if (obstacleId === 'o008') {
      return '🔍'; // Slow reveal
    } else if (obstacleId === 'o009' || obstacleId === 'o010') {
      return '🚫'; // No repeat
    } else if (obstacleId === 'o011') {
      return '💨'; // Wind
    } else if (obstacleId === 'o012') {
      return '⬇️'; // Gravity
    } else if (obstacleId === 'o013') {
      return '👻'; // Mirror board
    } else if (obstacleId === 'o014') {
      return '🔒'; // Sticky O
    } else if (obstacleId === 'o015') {
      return '🧊'; // Slippery edge
    } else if (obstacleId === 'o016') {
      return '⚡'; // Time blink
    } else if (obstacleId === 'o017') {
      return '👥'; // Double O
    } else if (obstacleId.includes('Tax')) {
      return '💸'; // Tax obstacles
    }
    return '⚠️';
  };

  return (
    <div className="obstacle-display">
      <div className="obstacle-header">
        <span className="obstacle-icon">{getObstacleIcon(obstacle.id)}</span>
        <h3 className="obstacle-name">{obstacle.name}</h3>
      </div>
      <p className="obstacle-description">{obstacle.text}</p>
      <div className="obstacle-rule">
        <span className="rule-label">Rule:</span>
        <span className="rule-text">{obstacle.rule}</span>
      </div>
    </div>
  );
};

export default ObstacleDisplay;
