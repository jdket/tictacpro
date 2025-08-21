import React from 'react';
import { Effect, Obstacle } from '../types/game';

interface EffectDisplayProps {
  effect: Effect | null;
  obstacle: Obstacle | null;
}

const EffectDisplay: React.FC<EffectDisplayProps> = ({ effect, obstacle }) => {
  return (
    <div className="effects-display">
      {/* Positive Effect Window */}
      <div className="effect-window positive-effect-window">
        <div className="effect-header positive-header">
          <h4>Active Effect</h4>
        </div>
        <div className="effect-content">
          {effect ? (
            <>
              <div className="effect-name">{effect.name}</div>
              <div className="effect-text">{effect.text}</div>
            </>
          ) : (
            <div className="no-effect">No effect active</div>
          )}
        </div>
      </div>

      {/* Negative Effect Window */}
      <div className="effect-window negative-effect-window">
        <div className="effect-header negative-header">
          <h4>Active Obstacle</h4>
        </div>
        <div className="effect-content">
          {obstacle ? (
            <>
              <div className="effect-name">{obstacle.name}</div>
              <div className="effect-text">{obstacle.text}</div>
            </>
          ) : (
            <div className="no-effect">No obstacle active</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EffectDisplay;