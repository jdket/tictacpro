import React from 'react';
import { Effect, Obstacle } from '../types/game';

interface ActiveEffectsDisplayProps {
  currentEffect: Effect | null;
  currentObstacle: Obstacle | null;
}

const ActiveEffectsDisplay: React.FC<ActiveEffectsDisplayProps> = ({ 
  currentEffect, 
  currentObstacle 
}) => {
  return (
    <div className="active-effects-container">
      {/* Current Effect Window */}
      <div className="current-effect-window">
        {currentEffect ? (
          <div className="effect-card good-effect">
            <h4>{currentEffect.name}</h4>
            <p>{currentEffect.text}</p>
          </div>
        ) : (
          <div className="effect-card no-effect">
            <h4>No Active Effect</h4>
            <p>No special effect this level</p>
          </div>
        )}
      </div>

      {/* Current Obstacle Window */}
      <div className="current-obstacle-window">
        {currentObstacle ? (
          <div className="effect-card bad-effect">
            <h4>{currentObstacle.name}</h4>
            <p>{currentObstacle.text}</p>
          </div>
        ) : (
          <div className="effect-card no-effect">
            <h4>No Active Obstacle</h4>
            <p>No obstacle this level</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveEffectsDisplay;