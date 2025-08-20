import React from 'react';

interface ScoreDisplayProps {
  score: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="score-display">
      <div className="score-section">
        <span className="score-label">Score</span>
        <span className="score-value">{score}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;
