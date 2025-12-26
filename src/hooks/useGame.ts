import { useState, useCallback, useEffect, useRef } from 'react';
import type {
  GameState,
  GameStats,
  DemonSymbol,
  Difficulty,
} from '../types/game';
import {
  DEMON_SYMBOLS,
  DIFFICULTY_CONFIG,
} from '../types/game';

const STORAGE_KEY = 'chainbreaker_stats';

const getInitialStats = (): GameStats => {
  if (typeof window === 'undefined') {
    return {
      highScore: 0,
      maxLevel: 0,
      totalGamesPlayed: 0,
      totalChainsBreak: 0,
      bestCombo: 0,
    };
  }
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    highScore: 0,
    maxLevel: 0,
    totalGamesPlayed: 0,
    totalChainsBreak: 0,
    bestCombo: 0,
  };
};

const saveStats = (stats: GameStats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

const generateSequence = (length: number, availableSymbols: DemonSymbol[]): DemonSymbol[] => {
  const sequence: DemonSymbol[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableSymbols.length);
    sequence.push(availableSymbols[randomIndex]);
  }
  return sequence;
};

const getSymbolCountForLevel = (level: number, difficulty: Difficulty): number => {
  const config = DIFFICULTY_CONFIG[difficulty];
  const count = config.startingSymbols + Math.floor((level - 1) * config.symbolsPerLevel);
  return Math.min(count, config.maxSymbols);
};

const getAvailableSymbols = (level: number): DemonSymbol[] => {
  // Start with fewer symbols and add more as levels progress
  const baseCount = 4;
  const additionalPerLevel = 1;
  const count = Math.min(baseCount + Math.floor((level - 1) / 2) * additionalPerLevel, DEMON_SYMBOLS.length);
  return DEMON_SYMBOLS.slice(0, count);
};

export const useGame = () => {
  const [stats, setStats] = useState<GameStats>(getInitialStats);
  const [state, setState] = useState<GameState>({
    phase: 'menu',
    level: 1,
    score: 0,
    lives: 3,
    difficulty: 'demon',
    sequence: [],
    playerSequence: [],
    currentSymbolIndex: 0,
    showingSymbol: false,
    timeRemaining: 0,
    combo: 0,
    maxCombo: 0,
    totalChainsBreak: 0,
    isShaking: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const symbolTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (symbolTimerRef.current) {
      clearTimeout(symbolTimerRef.current);
      symbolTimerRef.current = null;
    }
  }, []);

  // Start a new game
  const startGame = useCallback((difficulty: Difficulty) => {
    clearTimers();
    const config = DIFFICULTY_CONFIG[difficulty];
    const availableSymbols = getAvailableSymbols(1);
    const sequence = generateSequence(config.startingSymbols, availableSymbols);
    
    setStats(prev => {
      const updated = { ...prev, totalGamesPlayed: prev.totalGamesPlayed + 1 };
      saveStats(updated);
      return updated;
    });

    setState({
      phase: 'intro',
      level: 1,
      score: 0,
      lives: config.lives,
      difficulty,
      sequence,
      playerSequence: [],
      currentSymbolIndex: 0,
      showingSymbol: false,
      timeRemaining: config.memorizeTime,
      combo: 0,
      maxCombo: 0,
      totalChainsBreak: 0,
      isShaking: false,
    });

    // Show intro for 2 seconds, then start memorize phase
    setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'memorize' }));
    }, 2000);
  }, [clearTimers]);

  // Handle memorize phase symbol display
  useEffect(() => {
    if (state.phase === 'memorize') {
      const config = DIFFICULTY_CONFIG[state.difficulty];
      const displayTime = config.memorizeTime / state.sequence.length;
      
      let currentIndex = 0;
      setState(prev => ({ ...prev, currentSymbolIndex: 0, showingSymbol: true }));

      const showNextSymbol = () => {
        currentIndex++;
        if (currentIndex < state.sequence.length) {
          setState(prev => ({ ...prev, currentSymbolIndex: currentIndex, showingSymbol: true }));
        } else {
          // Done showing sequence, start play phase
          setState(prev => ({
            ...prev,
            phase: 'play',
            currentSymbolIndex: 0,
            showingSymbol: false,
            timeRemaining: config.playTime,
          }));
        }
      };

      symbolTimerRef.current = setInterval(showNextSymbol, displayTime);

      return () => {
        if (symbolTimerRef.current) {
          clearInterval(symbolTimerRef.current);
        }
      };
    }
  }, [state.phase, state.difficulty, state.sequence.length]);

  // Handle play phase timer
  useEffect(() => {
    if (state.phase === 'play' && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 100;
          if (newTime <= 0) {
            // Time's up - game over or lose life
            if (prev.lives <= 1) {
              return { ...prev, phase: 'gameOver', timeRemaining: 0 };
            }
            return {
              ...prev,
              phase: 'failure',
              lives: prev.lives - 1,
              timeRemaining: 0,
              combo: 0,
              isShaking: true,
            };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 100);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [state.phase]);

  // Handle symbol selection
  const selectSymbol = useCallback((symbol: DemonSymbol) => {
    if (state.phase !== 'play') return;

    const expectedSymbol = state.sequence[state.playerSequence.length];
    const isCorrect = symbol.id === expectedSymbol.id;

    if (isCorrect) {
      const newPlayerSequence = [...state.playerSequence, symbol];
      const newCombo = state.combo + 1;
      const config = DIFFICULTY_CONFIG[state.difficulty];
      const baseScore = 100 * config.scoreMultiplier;
      const comboBonus = Math.floor(newCombo * 10 * config.scoreMultiplier);
      const scoreGain = baseScore + comboBonus;

      setState(prev => ({
        ...prev,
        playerSequence: newPlayerSequence,
        score: prev.score + scoreGain,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        totalChainsBreak: prev.totalChainsBreak + 1,
      }));

      // Check if sequence is complete
      if (newPlayerSequence.length === state.sequence.length) {
        clearTimers();
        setState(prev => ({ ...prev, phase: 'levelComplete' }));
      }
    } else {
      // Wrong symbol
      setState(prev => {
        if (prev.lives <= 1) {
          return { ...prev, phase: 'gameOver', combo: 0, isShaking: true };
        }
        return {
          ...prev,
          lives: prev.lives - 1,
          combo: 0,
          isShaking: true,
          playerSequence: [],
          phase: 'failure',
        };
      });
    }
  }, [state.phase, state.sequence, state.playerSequence, state.combo, state.difficulty, clearTimers]);

  // Stop shaking after animation
  useEffect(() => {
    if (state.isShaking) {
      const timeout = setTimeout(() => {
        setState(prev => ({ ...prev, isShaking: false }));
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [state.isShaking]);

  // Advance to next level
  const nextLevel = useCallback(() => {
    clearTimers();
    const newLevel = state.level + 1;
    const config = DIFFICULTY_CONFIG[state.difficulty];
    const symbolCount = getSymbolCountForLevel(newLevel, state.difficulty);
    const availableSymbols = getAvailableSymbols(newLevel);
    const sequence = generateSequence(symbolCount, availableSymbols);

    // Check for victory (level 10)
    if (newLevel > 10) {
      setState(prev => ({ ...prev, phase: 'victory' }));
      return;
    }

    setState(prev => ({
      ...prev,
      phase: 'memorize',
      level: newLevel,
      sequence,
      playerSequence: [],
      currentSymbolIndex: 0,
      showingSymbol: false,
      timeRemaining: config.memorizeTime,
    }));
  }, [state.level, state.difficulty, clearTimers]);

  // Retry after failure
  const retryLevel = useCallback(() => {
    clearTimers();
    const config = DIFFICULTY_CONFIG[state.difficulty];
    
    setState(prev => ({
      ...prev,
      phase: 'memorize',
      playerSequence: [],
      currentSymbolIndex: 0,
      showingSymbol: false,
      timeRemaining: config.memorizeTime,
      isShaking: false,
    }));
  }, [state.difficulty, clearTimers]);

  // Return to menu
  const returnToMenu = useCallback(() => {
    clearTimers();
    
    // Update stats
    setStats(prev => {
      const updated = {
        ...prev,
        highScore: Math.max(prev.highScore, state.score),
        maxLevel: Math.max(prev.maxLevel, state.level),
        totalChainsBreak: prev.totalChainsBreak + state.totalChainsBreak,
        bestCombo: Math.max(prev.bestCombo, state.maxCombo),
      };
      saveStats(updated);
      return updated;
    });

    setState({
      phase: 'menu',
      level: 1,
      score: 0,
      lives: 3,
      difficulty: state.difficulty,
      sequence: [],
      playerSequence: [],
      currentSymbolIndex: 0,
      showingSymbol: false,
      timeRemaining: 0,
      combo: 0,
      maxCombo: 0,
      totalChainsBreak: 0,
      isShaking: false,
    });
  }, [state.score, state.level, state.totalChainsBreak, state.maxCombo, state.difficulty, clearTimers]);

  // Get available symbols for current level
  const availableSymbols = getAvailableSymbols(state.level);

  return {
    state,
    stats,
    availableSymbols,
    startGame,
    selectSymbol,
    nextLevel,
    retryLevel,
    returnToMenu,
  };
};
