import React from 'react';
import { Effect } from '../types/game';

interface CompactEffectDisplayProps {
  effect: Effect;
}

const CompactEffectDisplay: React.FC<CompactEffectDisplayProps> = ({ effect }) => {
  return (
    <div className="compact-effect-display good-effect">
      <div className="compact-effect-header">
        <span className="compact-effect-name">{effect.name}</span>
      </div>
      <div className="compact-effect-text">{effect.text}</div>
    </div>
  );
};

export default CompactEffectDisplay;