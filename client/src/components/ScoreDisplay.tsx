import React from 'react';

interface ScoreDisplayProps {
  totalCoins: number;
  levelCoins: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ totalCoins, levelCoins }) => {
  return (
    <div className="score-display">
      <div className="score-section">
        <span className="score-label">Total Coins</span>
        <span className="score-value total-coins">{totalCoins}</span>
      </div>
      <div className="score-section">
        <span className="score-label">Level Coins</span>
        <span className="score-value level-coins">+{levelCoins}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;
