import React from 'react';

interface DualScoreDisplayProps {
  playerScore: number;
  opponentScore: number;
}

const DualScoreDisplay: React.FC<DualScoreDisplayProps> = ({ playerScore, opponentScore }) => {
  return (
    <div className="dual-score-display">
      <div className="score-section-player">
        <span className="score-label">Score</span>
        <span className="score-value">{playerScore.toLocaleString()}</span>
      </div>
      <div className="score-section-opponent">
        <span className="score-label">Opponent Score</span>
        <span className="score-value">{opponentScore.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default DualScoreDisplay;