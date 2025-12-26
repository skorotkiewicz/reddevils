import type { DemonSymbol } from '../../types/game';

interface SymbolCardProps {
  symbol: DemonSymbol;
  onClick?: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled?: boolean;
  showReveal?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SymbolCard({
  symbol,
  onClick,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  disabled = false,
  showReveal = false,
  size = 'md',
}: SymbolCardProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 md:w-24 md:h-24 text-3xl md:text-4xl',
    lg: 'w-28 h-28 md:w-32 md:h-32 text-4xl md:text-5xl',
  };

  const stateClasses = isCorrect
    ? 'correct'
    : isIncorrect
    ? 'incorrect'
    : isSelected
    ? 'selected'
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        symbol-card
        ${sizeClasses[size]}
        ${stateClasses}
        ${disabled ? 'disabled opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${showReveal ? 'symbol-reveal' : ''}
        rounded-xl
        flex items-center justify-center
        transition-all duration-300
        relative
        overflow-hidden
      `}
      style={{
        '--symbol-color': symbol.color,
      } as React.CSSProperties}
    >
      {/* Inner glow based on symbol color */}
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${symbol.color}, transparent 70%)`,
        }}
      />
      
      {/* Symbol */}
      <span
        className="demon-symbol relative z-10 select-none"
        style={{ color: symbol.color }}
      >
        {symbol.icon}
      </span>
    </button>
  );
}

interface SymbolGridProps {
  symbols: DemonSymbol[];
  onSelect: (symbol: DemonSymbol) => void;
  selectedSymbols?: DemonSymbol[];
  disabled?: boolean;
}

export function SymbolGrid({
  symbols,
  onSelect,
  selectedSymbols = [],
  disabled = false,
}: SymbolGridProps) {
  const gridCols = symbols.length <= 4 ? 4 : symbols.length <= 6 ? 3 : 4;
  
  return (
    <div
      className={`grid gap-3 md:gap-4 justify-center`}
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        maxWidth: `${gridCols * 100 + (gridCols - 1) * 16}px`,
      }}
    >
      {symbols.map((symbol, index) => {
        const isSelected = selectedSymbols.some(s => s.id === symbol.id);
        return (
          <SymbolCard
            key={`${symbol.id}-${index}`}
            symbol={symbol}
            onClick={() => onSelect(symbol)}
            isSelected={isSelected}
            disabled={disabled}
            size="md"
          />
        );
      })}
    </div>
  );
}

interface SequenceDisplayProps {
  sequence: DemonSymbol[];
  currentIndex: number;
  showAll?: boolean;
}

export function SequenceDisplay({
  sequence,
  currentIndex,
  showAll = false,
}: SequenceDisplayProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center items-center">
      {sequence.map((symbol, index) => {
        const isActive = showAll || index === currentIndex;
        const isPast = index < currentIndex;
        
        return (
          <div
            key={`seq-${symbol.id}-${index}`}
            className={`
              transition-all duration-300
              ${isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-30'}
              ${isPast && !showAll ? 'grayscale' : ''}
            `}
          >
            <SymbolCard
              symbol={symbol}
              disabled
              showReveal={index === currentIndex && !showAll}
              size="lg"
            />
          </div>
        );
      })}
    </div>
  );
}

interface PlayerProgressProps {
  sequence: DemonSymbol[];
  playerSequence: DemonSymbol[];
}

export function PlayerProgress({
  sequence,
  playerSequence,
}: PlayerProgressProps) {
  return (
    <div className="flex gap-2 justify-center items-center">
      {sequence.map((symbol, index) => {
        const playerSymbol = playerSequence[index];
        const isComplete = index < playerSequence.length;
        const isCorrect = playerSymbol?.id === symbol.id;
        
        return (
          <div
            key={`progress-${index}`}
            className={`
              w-8 h-8 md:w-10 md:h-10
              rounded-lg
              border-2
              flex items-center justify-center
              transition-all duration-300
              ${isComplete
                ? isCorrect
                  ? 'border-green-500 bg-green-500/20 chain-break'
                  : 'border-red-500 bg-red-500/20'
                : 'border-muted-foreground/30 bg-muted/20'
              }
            `}
          >
            {isComplete && (
              <span className="text-lg" style={{ color: playerSymbol?.color }}>
                {playerSymbol?.icon}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
