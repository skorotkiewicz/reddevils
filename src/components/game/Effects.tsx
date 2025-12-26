import { LYRICS_QUOTES } from '../../types/game';

interface FireParticlesProps {
  count?: number;
}

export function FireParticles({ count = 20 }: FireParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 5 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="fire-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ScanlineOverlay() {
  return <div className="scanlines" />;
}

export function NoiseOverlay() {
  return <div className="noise-overlay" />;
}

export function GridOverlay() {
  return <div className="fixed inset-0 grid-overlay pointer-events-none z-0 opacity-30" />;
}

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}

export function GlitchText({ children, className = '', subtle = false }: GlitchTextProps) {
  return (
    <span className={`${subtle ? 'glitch-text-subtle' : 'glitch-text'} ${className}`}>
      {children}
    </span>
  );
}

interface RandomQuoteProps {
  className?: string;
}

export function RandomQuote({ className = '' }: RandomQuoteProps) {
  const quote = LYRICS_QUOTES[Math.floor(Math.random() * LYRICS_QUOTES.length)];
  return (
    <p className={`text-muted-foreground italic text-sm ${className}`}>
      "{quote}"
    </p>
  );
}

interface HellFireTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HellFireText({ children, className = '' }: HellFireTextProps) {
  return (
    <span className={`infernal-text font-bold ${className}`}>
      {children}
    </span>
  );
}

interface ChromeTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ChromeText({ children, className = '' }: ChromeTextProps) {
  return (
    <span className={`chrome-text font-bold ${className}`}>
      {children}
    </span>
  );
}
