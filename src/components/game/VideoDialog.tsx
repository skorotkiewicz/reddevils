import { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export function VideoDialog({ isOpen, onClose, videoUrl, title = "Red Devil's Reign" }: VideoDialogProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Extract video ID from YouTube URL
  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : '';
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[100] flex items-center justify-center p-4
        transition-all duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={`
          relative w-full max-w-4xl
          bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f]
          rounded-2xl overflow-hidden
          border border-red-500/30
          shadow-[0_0_60px_rgba(255,26,26,0.3)]
          transition-all duration-300
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-500/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <h3 className="font-['Orbitron'] font-bold text-lg infernal-text">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                The song that inspired this game
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="
              p-2 rounded-lg
              bg-red-500/10 hover:bg-red-500/20
              text-red-400 hover:text-red-300
              transition-all duration-200
              hover:scale-110
            "
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gradient-to-t from-black/50 to-transparent">
          <p className="text-center text-sm text-muted-foreground italic">
            "Born from the void, not just a pretty face"
          </p>
        </div>
      </div>
    </div>
  );
}

interface VideoTriggerButtonProps {
  onClick: () => void;
  className?: string;
}

export function VideoTriggerButton({ onClick, className = '' }: VideoTriggerButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        flex items-center gap-2
        px-4 py-2
        bg-gradient-to-r from-red-900/30 to-red-800/20
        hover:from-red-800/40 hover:to-red-700/30
        border border-red-500/30 hover:border-red-400/50
        rounded-full
        transition-all duration-300
        hover:scale-105
        hover:shadow-[0_0_20px_rgba(255,68,68,0.3)]
        ${className}
      `}
    >
      <div className="
        w-8 h-8
        flex items-center justify-center
        bg-red-500/20 group-hover:bg-red-500/40
        rounded-full
        transition-all duration-300
      ">
        <Play className="w-4 h-4 text-red-400 fill-red-400" />
      </div>
      <div className="text-left">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Inspired by
        </p>
        <p className="text-sm font-['Orbitron'] infernal-text font-medium">
          Red Devil's Reign
        </p>
      </div>
      <span className="text-lg ml-1">🔥</span>
    </button>
  );
}
