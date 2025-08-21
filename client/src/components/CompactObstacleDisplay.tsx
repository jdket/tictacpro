import React from 'react';
import { Obstacle } from '../types/game';

interface CompactObstacleDisplayProps {
  obstacle: Obstacle;
}

const CompactObstacleDisplay: React.FC<CompactObstacleDisplayProps> = ({ obstacle }) => {
  return (
    <div className="compact-obstacle-display bad-effect">
      <div className="compact-obstacle-header">
        <span className="compact-obstacle-name">{obstacle.name}</span>
      </div>
      <div className="compact-obstacle-text">{obstacle.text}</div>
    </div>
  );
};

export default CompactObstacleDisplay;