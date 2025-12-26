import { Flame, Zap, Trophy, RotateCcw, Home } from 'lucide-react';
import { Button } from '../ui/button';
import type { GameStats, Difficulty } from '../../types/game';
import { DIFFICULTY_CONFIG, LYRICS_QUOTES } from '../../types/game';
import { GlitchText, HellFireText, ChromeText, RandomQuote } from './Effects';
import { VideoDialog, VideoTriggerButton } from './VideoDialog';
import { useState, useEffect } from 'react';

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=XW_KfxrV42s';

interface MainMenuProps {
  stats: GameStats;
  onStartGame: (difficulty: Difficulty) => void;
}

export function MainMenu({ stats, onStartGame }: MainMenuProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('demon');
  const [showStats, setShowStats] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Orbitron'] mb-2">
          <GlitchText subtle>
            <HellFireText>CHAIN</HellFireText>
          </GlitchText>
          <br />
          <ChromeText>BREAKER</ChromeText>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base mt-4">
          Break the chains of perception in this digital age
        </p>
      </div>

      {/* Red Devil's Reign - Video Button */}
      <div className="mb-8">
        <VideoTriggerButton onClick={() => setShowVideoDialog(true)} />
      </div>

      {/* Video Dialog */}
      <VideoDialog
        isOpen={showVideoDialog}
        onClose={() => setShowVideoDialog(false)}
        videoUrl={YOUTUBE_VIDEO_URL}
        title="Red Devil's Reign"
      />

      {/* Difficulty Selection */}
      <div className="w-full max-w-md mb-8">
        <p className="text-center text-sm text-muted-foreground mb-4 uppercase tracking-wider">
          Choose Your Path
        </p>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
            const config = DIFFICULTY_CONFIG[diff];
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`
                  symbol-card rounded-lg p-4 transition-all duration-300
                  ${isSelected ? 'selected ring-2 ring-hellfire' : ''}
                `}
              >
                <div className="text-2xl mb-2">
                  {diff === 'mortal' && '💀'}
                  {diff === 'demon' && '👹'}
                  {diff === 'infernal' && '👑'}
                </div>
                <div className="font-bold font-['Orbitron'] text-sm">
                  {config.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {config.lives} ❤️
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3 italic">
          {DIFFICULTY_CONFIG[selectedDifficulty].description}
        </p>
      </div>

      {/* Start Button */}
      <Button
        onClick={() => onStartGame(selectedDifficulty)}
        className="btn-hellfire text-lg font-bold font-['Orbitron'] px-8 py-6 rounded-xl pulse-glow"
      >
        <Flame className="w-5 h-5 mr-2" />
        ENTER THE VOID
      </Button>

      {/* Stats Toggle */}
      <button
        onClick={() => setShowStats(!showStats)}
        className="mt-6 text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        <Trophy className="w-4 h-4 inline mr-2" />
        {showStats ? 'Hide Stats' : 'View Stats'}
      </button>

      {/* Stats Panel */}
      {showStats && (
        <div className="mt-4 symbol-card rounded-xl p-6 w-full max-w-sm">
          <h3 className="text-center font-bold font-['Orbitron'] mb-4 text-lg">
            Your Legacy
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold infernal-text">{stats.highScore.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">High Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold chrome-text">{stats.maxLevel}</div>
              <div className="text-xs text-muted-foreground">Max Level</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{stats.bestCombo}x</div>
              <div className="text-xs text-muted-foreground">Best Combo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.totalChainsBreak}</div>
              <div className="text-xs text-muted-foreground">Chains Broken</div>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Games Played: {stats.totalGamesPlayed}
          </div>
        </div>
      )}

      {/* Random quote */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <RandomQuote className="text-xs" />
      </div>
    </div>
  );
}

interface IntroScreenProps {
  level: number;
  difficulty: Difficulty;
}

export function IntroScreen({ level, difficulty }: IntroScreenProps) {
  const quote = LYRICS_QUOTES[Math.floor(Math.random() * LYRICS_QUOTES.length)];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
      <div className="text-center">
        <div className="text-6xl mb-4 floating">
          {level === 1 ? '👹' : '⛓️'}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-['Orbitron'] mb-4 evolved-text">
          LEVEL {level}
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          {DIFFICULTY_CONFIG[difficulty].name} Mode
        </p>
        <p className="text-sm italic text-muted-foreground">
          "{quote}"
        </p>
      </div>
    </div>
  );
}

interface LevelCompleteProps {
  level: number;
  score: number;
  combo: number;
  onContinue: () => void;
}

export function LevelComplete({ level, score, combo, onContinue }: LevelCompleteProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 level-complete-overlay flex items-center justify-center z-50 px-4">
      <div className={`text-center transition-all duration-500 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <div className="text-6xl mb-4">⛓️‍💥</div>
        <h2 className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-2">
          <HellFireText>CHAINS BROKEN!</HellFireText>
        </h2>
        <p className="text-xl chrome-text font-bold mb-6">Level {level} Complete</p>
        
        <div className="flex gap-6 justify-center mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold infernal-text">{score.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">{combo}x</div>
            <div className="text-xs text-muted-foreground">Max Combo</div>
          </div>
        </div>

        <Button
          onClick={onContinue}
          className="btn-hellfire font-bold font-['Orbitron'] px-8 py-4 rounded-xl"
        >
          <Zap className="w-5 h-5 mr-2" />
          CONTINUE
        </Button>
      </div>
    </div>
  );
}

interface FailureScreenProps {
  lives: number;
  onRetry: () => void;
  onQuit: () => void;
}

export function FailureScreen({ lives, onRetry, onQuit }: FailureScreenProps) {
  return (
    <div className="fixed inset-0 level-complete-overlay flex items-center justify-center z-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4 shake">💀</div>
        <h2 className="text-3xl font-bold font-['Orbitron'] mb-2 text-red-500">
          CHAIN UNBROKEN
        </h2>
        <p className="text-muted-foreground mb-6">
          {lives} {lives === 1 ? 'life' : 'lives'} remaining
        </p>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRetry}
            className="btn-hellfire font-bold font-['Orbitron'] px-6 py-3 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            RETRY
          </Button>
          <Button
            onClick={onQuit}
            variant="outline"
            className="font-['Orbitron'] px-6 py-3 rounded-xl border-muted-foreground/50"
          >
            <Home className="w-4 h-4 mr-2" />
            QUIT
          </Button>
        </div>
      </div>
    </div>
  );
}

interface GameOverProps {
  score: number;
  level: number;
  maxCombo: number;
  chainsBreak: number;
  isVictory?: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

export function GameOver({
  score,
  level,
  maxCombo,
  chainsBreak,
  isVictory = false,
  onRestart,
  onMenu,
}: GameOverProps) {
  return (
    <div className="fixed inset-0 level-complete-overlay flex items-center justify-center z-50 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">
          {isVictory ? '👑' : '💀'}
        </div>
        <h2 className={`text-4xl font-bold font-['Orbitron'] mb-2 ${isVictory ? 'evolved-text' : 'text-red-500'}`}>
          {isVictory ? 'EVOLVED!' : 'GAME OVER'}
        </h2>
        {isVictory && (
          <p className="text-lg chrome-text mb-4">
            Devil of the Digital
          </p>
        )}
        <p className="text-muted-foreground mb-8 italic text-sm">
          {isVictory
            ? '"We the darkness baby, let\'s go"'
            : '"Watch me grinding, about to leave my mark"'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="symbol-card rounded-lg p-4">
            <div className="text-2xl font-bold infernal-text">{score.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Final Score</div>
          </div>
          <div className="symbol-card rounded-lg p-4">
            <div className="text-2xl font-bold chrome-text">{level}</div>
            <div className="text-xs text-muted-foreground">Level Reached</div>
          </div>
          <div className="symbol-card rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-500">{maxCombo}x</div>
            <div className="text-xs text-muted-foreground">Best Combo</div>
          </div>
          <div className="symbol-card rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{chainsBreak}</div>
            <div className="text-xs text-muted-foreground">Chains Broken</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={onRestart}
            className="btn-hellfire font-bold font-['Orbitron'] px-6 py-3 rounded-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            PLAY AGAIN
          </Button>
          <Button
            onClick={onMenu}
            variant="outline"
            className="font-['Orbitron'] px-6 py-3 rounded-xl border-muted-foreground/50"
          >
            <Home className="w-4 h-4 mr-2" />
            MENU
          </Button>
        </div>
      </div>
    </div>
  );
}
