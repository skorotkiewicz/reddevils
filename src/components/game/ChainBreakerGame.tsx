import { useGame } from '../../hooks/useGame';
import { FireParticles, ScanlineOverlay, NoiseOverlay, GridOverlay } from './Effects';
import { SymbolGrid, SequenceDisplay, PlayerProgress } from './SymbolCard';
import { GameHUD } from './GameHUD';
import {
  MainMenu,
  IntroScreen,
  LevelComplete,
  FailureScreen,
  GameOver,
} from './Screens';

export function ChainBreakerGame() {
  const {
    state,
    stats,
    availableSymbols,
    startGame,
    selectSymbol,
    nextLevel,
    retryLevel,
    returnToMenu,
  } = useGame();

  return (
    <div className={`min-h-screen hellfire-bg relative overflow-hidden ${state.isShaking ? 'shake' : ''}`}>
      {/* Background effects */}
      <FireParticles count={15} />
      <GridOverlay />
      <NoiseOverlay />
      <ScanlineOverlay />

      {/* Main Menu */}
      {state.phase === 'menu' && (
        <MainMenu stats={stats} onStartGame={startGame} />
      )}

      {/* Intro Screen */}
      {state.phase === 'intro' && (
        <IntroScreen level={state.level} difficulty={state.difficulty} />
      )}

      {/* Game Play Area */}
      {(state.phase === 'memorize' || state.phase === 'play') && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
          {/* HUD */}
          <GameHUD state={state} />

          {/* Memorize Phase - Show Sequence */}
          {state.phase === 'memorize' && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-8">
                <p className="text-center text-sm text-muted-foreground mb-4 uppercase tracking-wider font-['Orbitron']">
                  Memorize the Sequence
                </p>
                <SequenceDisplay
                  sequence={state.sequence}
                  currentIndex={state.currentSymbolIndex}
                />
              </div>
            </div>
          )}

          {/* Play Phase - Select Symbols */}
          {state.phase === 'play' && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {/* Progress indicator */}
              <div className="mb-4">
                <p className="text-center text-sm text-muted-foreground mb-3 uppercase tracking-wider font-['Orbitron']">
                  Recreate the Sequence
                </p>
                <PlayerProgress
                  sequence={state.sequence}
                  playerSequence={state.playerSequence}
                />
              </div>

              {/* Symbol selection grid */}
              <SymbolGrid
                symbols={availableSymbols}
                onSelect={selectSymbol}
                selectedSymbols={state.playerSequence}
                disabled={false}
              />
            </div>
          )}
        </div>
      )}

      {/* Level Complete Overlay */}
      {state.phase === 'levelComplete' && (
        <LevelComplete
          level={state.level}
          score={state.score}
          combo={state.maxCombo}
          onContinue={nextLevel}
        />
      )}

      {/* Failure Screen */}
      {state.phase === 'failure' && (
        <FailureScreen
          lives={state.lives}
          onRetry={retryLevel}
          onQuit={returnToMenu}
        />
      )}

      {/* Game Over Screen */}
      {state.phase === 'gameOver' && (
        <GameOver
          score={state.score}
          level={state.level}
          maxCombo={state.maxCombo}
          chainsBreak={state.totalChainsBreak}
          isVictory={false}
          onRestart={() => startGame(state.difficulty)}
          onMenu={returnToMenu}
        />
      )}

      {/* Victory Screen */}
      {state.phase === 'victory' && (
        <GameOver
          score={state.score}
          level={state.level}
          maxCombo={state.maxCombo}
          chainsBreak={state.totalChainsBreak}
          isVictory={true}
          onRestart={() => startGame(state.difficulty)}
          onMenu={returnToMenu}
        />
      )}
    </div>
  );
}
