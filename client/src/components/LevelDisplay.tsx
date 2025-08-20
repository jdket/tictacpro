import React from 'react';

interface LevelDisplayProps {
  level: number;
}

const LevelDisplay: React.FC<LevelDisplayProps> = ({ level }) => {
  const getProgressPercentage = (): number => {
    return (level / 10) * 100;
  };

  return (
    <div className="level-display">
      <div className="level-info">
        <span className="level-label">Level</span>
        <span className="level-number">{level}</span>
        <span className="level-max">/10</span>
      </div>
      <div className="level-progress">
        <div 
          className="level-progress-bar"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
    </div>
  );
};

export default LevelDisplay;
