import React, { useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { validateAllEffectsAndObstacles } from '../utils/effectTestUtils';
import { useAudio } from '../lib/stores/useAudio';
import GameBoard from './GameBoard';
import DualScoreDisplay from './DualScoreDisplay';
import LevelDisplay from './LevelDisplay';
import { VolumeX, Volume2, Music } from 'lucide-react';

const TicTacPro: React.FC = () => {
  const {
    gameState,
    startGame,
    nextLevel,
    makeMove,
    setGhostPreview,
    useSpecialAbility
  } = useGameLogic();
  
  const { setClickSound, setBackgroundMusic, isMuted, isMusicMuted, toggleMute, toggleMusicMute, playMusic } = useAudio();

  const handleCellClick = (cellIndex: number) => {
    if (gameState.phase === 'playing') {
      makeMove(cellIndex);
    }
  };

  const handleCellHover = (cellIndex: number | null) => {
    setGhostPreview(cellIndex);
  };

  useEffect(() => {
    // Validate all effects and obstacles logic
    const validation = validateAllEffectsAndObstacles();
    console.log('Effect/Obstacle validation completed:', validation);
    
    // Load click sound
    const clickAudio = new Audio('/sounds/click.mp3');
    clickAudio.volume = 0.5;
    setClickSound(clickAudio);

    // Load background music
    const musicAudio = new Audio('/sounds/soundtrack.mp3');
    musicAudio.loop = true;
    musicAudio.volume = 0.3;
    setBackgroundMusic(musicAudio);
    
    // Start playing music after a short delay
    setTimeout(() => {
      playMusic();
    }, 1000);
  }, [setClickSound, setBackgroundMusic, playMusic]);

  return (
    <div className="tic-tac-pro">
      {/* Sound buttons - always visible in upper right */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={toggleMute}
          className="bg-white/90 hover:bg-white border border-gray-300 rounded-lg p-2 shadow-lg transition-colors"
          title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          onClick={toggleMusicMute}
          className="bg-white/90 hover:bg-white border border-gray-300 rounded-lg p-2 shadow-lg transition-colors"
          title={isMusicMuted ? "Unmute Music" : "Mute Music"}
        >
          {isMusicMuted ? <VolumeX size={20} /> : <Music size={20} />}
        </button>
      </div>
      {gameState.phase === 'menu' && !gameState.showLevelPreview && (
        <div className="menu-screen">
          <h1>TicTacPro</h1>
          <p>A new approach to a classic game with over 30 random effects</p>
          <button onClick={startGame} className="start-button">
            Start Game
          </button>
        </div>
      )}

      {gameState.phase === 'menu' && gameState.showLevelPreview && (
        <div className="level-preview-screen">
          <h2>NEXT ROUND</h2>
          <div className="level-info">
            <LevelDisplay level={gameState.currentLevel} />
          </div>
          <div className="effects-preview">
            {gameState.nextLevelEffects.map((effect, index) => (
              <div key={index} className="effect-preview good-effect">
                <h3>{effect.name}</h3>
                <p>{effect.text}</p>
              </div>
            ))}
            {gameState.nextLevelObstacles.map((obstacle, index) => (
              <div key={index} className="effect-preview bad-effect">
                <h3>{obstacle.name}</h3>
                <p>{obstacle.text}</p>
              </div>
            ))}
          </div>
          <button onClick={startGame} className="start-button">
            Start Level
          </button>
        </div>
      )}

      {gameState.phase === 'playing' && (
        <div className="game-area">
          <div className="game-layout">
            <div className="level-section">
              <LevelDisplay level={gameState.currentLevel} />
            </div>
            
            <div className="score-section">
              <DualScoreDisplay 
                playerScore={gameState.score} 
                opponentScore={gameState.opponentScore} 
              />
            </div>
            
            <div></div> {/* Empty space for grid balance */}
          </div>

          <div className="board-section">
            <GameBoard
              board={gameState.board}
              onCellClick={handleCellClick}
              onCellHover={handleCellHover}
              winningLine={gameState.winningLine}
              ghostPreview={gameState.ghostPreview}
              effectState={gameState.effectState}
              showingFlash={gameState.showingFlash}
              boardBlinking={gameState.boardBlinking}
            />
          </div>
        </div>
      )}

      {gameState.phase === 'level_complete' && (
        <div className="level-complete-screen">
          <h2>Level {gameState.currentLevel} Complete!</h2>
          <div className="round-scores">
            <p>Your Score: {gameState.score}</p>
            <p>Opponent Score: {gameState.opponentScore}</p>
          </div>
          {gameState.currentLevel < 10 ? (
            <button onClick={nextLevel} className="next-level-button">
              Next Level
            </button>
          ) : (
            <div className="game-complete">
              <h2>Game Complete!</h2>
              <div className="final-scores">
                <p>Final Score: {gameState.score}</p>
                <p>Opponent Final Score: {gameState.opponentScore}</p>
              </div>
              <button onClick={startGame} className="restart-button">
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TicTacPro;
