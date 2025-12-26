import { Heart, Zap, Clock, Flame } from 'lucide-react';
import type { GameState } from '../../types/game';
import { DIFFICULTY_CONFIG } from '../../types/game';

interface GameHUDProps {
  state: GameState;
}

export function GameHUD({ state }: GameHUDProps) {
  const config = DIFFICULTY_CONFIG[state.difficulty];
  const timeProgress = (state.timeRemaining / config.playTime) * 100;
  const isCritical = state.timeRemaining < 3000 && state.phase === 'play';

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Top row - Score, Level, Lives */}
      <div className="flex justify-between items-center mb-4 px-2">
        {/* Score */}
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-hellfire" />
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Score</span>
            <span className="text-xl font-bold infernal-text font-['Orbitron']">
              {state.score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Level */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Level</span>
          <span className="text-2xl font-bold chrome-text font-['Orbitron']">
            {state.level}
          </span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Lives</span>
            <div className="flex gap-1">
              {Array.from({ length: config.lives }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-5 h-5 transition-all duration-300 ${
                    i < state.lives
                      ? 'text-red-500 fill-red-500 scale-100'
                      : 'text-muted-foreground/30 scale-75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      {state.phase === 'play' && (
        <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full progress-hellfire transition-all duration-100 ${
              isCritical ? 'animate-pulse' : ''
            }`}
            style={{ width: `${timeProgress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-xs font-bold font-['Orbitron'] ${
                isCritical ? 'timer-critical' : 'text-foreground/80'
              }`}
            >
              {Math.ceil(state.timeRemaining / 1000)}s
            </span>
          </div>
        </div>
      )}

      {/* Combo display */}
      {state.combo > 1 && state.phase === 'play' && (
        <div className="flex justify-center items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-yellow-500 font-['Orbitron'] score-pop">
            {state.combo}x COMBO!
          </span>
        </div>
      )}

      {/* Phase indicator */}
      <div className="flex justify-center mb-4">
        <div
          className={`
            px-4 py-1 rounded-full
            text-xs font-bold uppercase tracking-widest
            font-['Orbitron']
            ${state.phase === 'memorize' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50' : ''}
            ${state.phase === 'play' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : ''}
          `}
        >
          {state.phase === 'memorize' && (
            <span className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              MEMORIZE
            </span>
          )}
          {state.phase === 'play' && (
            <span className="flex items-center gap-2">
              <Zap className="w-3 h-3" />
              BREAK THE CHAINS
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatsDisplayProps {
  score: number;
  level: number;
  combo: number;
  chainsBreak: number;
}

export function StatsDisplay({ score, level, combo, chainsBreak }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-lg">
      <StatCard label="Score" value={score.toLocaleString()} icon="🔥" />
      <StatCard label="Level" value={level.toString()} icon="⭐" />
      <StatCard label="Best Combo" value={`${combo}x`} icon="⚡" />
      <StatCard label="Chains Broken" value={chainsBreak.toString()} icon="⛓️" />
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="symbol-card rounded-lg p-3 flex flex-col items-center">
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold font-['Orbitron'] infernal-text">{value}</span>
    </div>
  );
}
