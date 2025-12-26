// Game Types for Chain Breaker

export type DemonSymbol = {
  id: string;
  icon: string;
  name: string;
  color: string;
};

export type GamePhase = 
  | 'menu'
  | 'intro'
  | 'memorize'
  | 'play'
  | 'success'
  | 'failure'
  | 'levelComplete'
  | 'gameOver'
  | 'victory';

export type Difficulty = 'mortal' | 'demon' | 'infernal';

export type GameState = {
  phase: GamePhase;
  level: number;
  score: number;
  lives: number;
  difficulty: Difficulty;
  sequence: DemonSymbol[];
  playerSequence: DemonSymbol[];
  currentSymbolIndex: number;
  showingSymbol: boolean;
  timeRemaining: number;
  combo: number;
  maxCombo: number;
  totalChainsBreak: number;
  isShaking: boolean;
};

export type GameStats = {
  highScore: number;
  maxLevel: number;
  totalGamesPlayed: number;
  totalChainsBreak: number;
  bestCombo: number;
};

export const DEMON_SYMBOLS: DemonSymbol[] = [
  { id: 'skull', icon: '💀', name: 'Skull', color: '#ff4444' },
  { id: 'fire', icon: '🔥', name: 'Hellfire', color: '#ff6600' },
  { id: 'chain', icon: '⛓️', name: 'Chain', color: '#888888' },
  { id: 'eye', icon: '👁️', name: 'Obsidian Gaze', color: '#aa44ff' },
  { id: 'crown', icon: '👑', name: 'Crown', color: '#ffcc00' },
  { id: 'moon', icon: '🌙', name: 'Dark Moon', color: '#6644ff' },
  { id: 'star', icon: '⭐', name: 'Fallen Star', color: '#ffaa00' },
  { id: 'bolt', icon: '⚡', name: 'Lightning', color: '#ffff00' },
  { id: 'spider', icon: '🕷️', name: 'Spider', color: '#ff0066' },
  { id: 'bat', icon: '🦇', name: 'Bat', color: '#9933ff' },
  { id: 'snake', icon: '🐍', name: 'Serpent', color: '#00ff66' },
  { id: 'diamond', icon: '💎', name: 'Blood Diamond', color: '#ff0044' },
];

export const DIFFICULTY_CONFIG = {
  mortal: {
    name: 'Mortal',
    description: 'For those who still fear the dark',
    startingSymbols: 3,
    maxSymbols: 6,
    symbolsPerLevel: 1,
    memorizeTime: 3000,
    playTime: 10000,
    lives: 5,
    scoreMultiplier: 1,
  },
  demon: {
    name: 'Demon',
    description: 'Embrace the hellfire within',
    startingSymbols: 4,
    maxSymbols: 9,
    symbolsPerLevel: 1,
    memorizeTime: 2500,
    playTime: 8000,
    lives: 3,
    scoreMultiplier: 2,
  },
  infernal: {
    name: 'Infernal',
    description: 'True darkness awaits',
    startingSymbols: 5,
    maxSymbols: 12,
    symbolsPerLevel: 1,
    memorizeTime: 2000,
    playTime: 6000,
    lives: 2,
    scoreMultiplier: 3,
  },
};

export const LYRICS_QUOTES = [
  "Born from the void, not just a pretty face",
  "Obsidian gaze, cutting through the lies",
  "Chrome claws in the night",
  "Breaking the mold with the hellfire light",
  "EVOLVED!",
  "Now we burning through",
  "We the darkness baby, let's go",
  "Watch me grinding, about to leave my mark",
  "Break the chains of perception",
  "In this digital age",
  "Turning a wicked page",
  "INFERNAL",
  "Devil of the digital",
];
