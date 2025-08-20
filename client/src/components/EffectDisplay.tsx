import React from 'react';
import { Effect } from '../types/game';

interface EffectDisplayProps {
  effect: Effect;
}

const EffectDisplay: React.FC<EffectDisplayProps> = ({ effect }) => {
  const getEffectIcon = (effectType: string): string => {
    switch (effectType) {
      case 'scoring':
        return '💰';
      case 'placement':
        return '🎯';
      case 'memory':
        return '🧠';
      case 'ai':
        return '🤖';
      case 'economy':
        return '💎';
      default:
        return '✨';
    }
  };

  const getEffectClassName = (effectType: string): string => {
    return `effect-display effect-${effectType}`;
  };

  return (
    <div className={getEffectClassName(effect.type)}>
      <div className="effect-header">
        <span className="effect-icon">{getEffectIcon(effect.type)}</span>
        <h3 className="effect-name">{effect.name}</h3>
      </div>
      <p className="effect-description">{effect.text}</p>
      <div className="effect-value">
        {effect.type === 'scoring' || effect.type === 'economy' ? (
          <span className="value-highlight">+{effect.value} coins</span>
        ) : effect.type === 'placement' ? (
          <span className="ability-highlight">Special Ability</span>
        ) : effect.type === 'memory' ? (
          <span className="memory-highlight">Memory Challenge</span>
        ) : (
          <span className="ai-highlight">AI Behavior</span>
        )}
      </div>
    </div>
  );
};

export default EffectDisplay;
