import React, { useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Maximize2 } from 'lucide-react';

export default function PhotoViewerModal({
  photo,
  onClose,
  onNext,
  onPrev,
  totalCount,
  currentIndex
}) {
  const touchStartX = useRef(0);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    },
    [onClose, onNext, onPrev]
  );

  const handleTouchStart = (e) => {
    if (e.touches[0]) touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches[0]) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (diff > 45 && onPrev) {
        onPrev();
      } else if (diff < -45 && onNext) {
        onNext();
      }
    }
  };

  useEffect(() => {
    if (!photo) return;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [photo, handleKeyDown]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 md:p-10 bg-midnight/92 backdrop-blur-2xl transition-all duration-300 touch-manipulation"
      onClick={onClose}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 bg-gradient-radial from-burgundy/20 via-transparent to-midnight/95 pointer-events-none" />

      {/* Main Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative max-w-5xl w-full max-h-[92dvh] flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-6 glass-panel-gold rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-champagne/30 shadow-2xl overflow-hidden touch-manipulation"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button with safe area offset */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-midnight/80 border border-champagne/30 text-champagne hover:text-cream hover:bg-burgundy/50 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer touch-manipulation"
          title="Close viewer (Esc)"
          aria-label="Close photo viewer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Previous Button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-midnight/80 border border-champagne/30 text-champagne hover:text-cream hover:bg-burgundy/60 flex items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer touch-manipulation"
            title="Previous photograph"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-midnight/80 border border-champagne/30 text-champagne hover:text-cream hover:bg-burgundy/60 flex items-center justify-center transition-all shadow-xl active:scale-95 cursor-pointer touch-manipulation"
            title="Next photograph"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Image Box */}
        <div className="relative flex-1 flex items-center justify-center max-h-[50vh] sm:max-h-[60vh] md:max-h-[82vh] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-midnight/40 border border-white/5">
          <img
            src={photo.src || photo.image}
            alt={photo.title || photo.caption || "Photograph of Indu"}
            className="max-h-[48vh] sm:max-h-[58vh] md:max-h-[80vh] w-auto max-w-full object-contain rounded-lg sm:rounded-xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>

        {/* Editorial Description Column */}
        <div className="w-full md:w-80 flex flex-col justify-between py-1 sm:py-2 px-1 text-left max-h-[30vh] sm:max-h-none overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-rose-soft/70 uppercase tracking-widest mb-1.5 sm:mb-3">
              <span className="flex items-center gap-1.5 font-sans text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5 text-champagne" />
                Editorial Portrait
              </span>
              {totalCount && (
                <span className="font-mono text-champagne/80 text-[11px] sm:text-xs">
                  {currentIndex + 1} / {totalCount}
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-gradient font-bold leading-tight mb-1 sm:mb-2">
              {photo.title || photo.caption}
            </h3>

            {photo.subtitle && (
              <p className="font-sans text-xs sm:text-sm text-cream/80 leading-relaxed mb-2 sm:mb-4">
                {photo.subtitle}
              </p>
            )}

            {photo.quote && (
              <blockquote className="font-serif italic text-xs sm:text-base text-champagne/90 border-l-2 border-rose/50 pl-2.5 sm:pl-3 py-1 my-2 sm:my-4 bg-rose/5 rounded-r-lg leading-relaxed">
                &ldquo;{photo.quote}&rdquo;
              </blockquote>
            )}

            {photo.note && (
              <p className="font-sans text-[11px] sm:text-xs text-rose-soft/90 leading-relaxed mt-2 sm:mt-3">
                {photo.note}
              </p>
            )}
          </div>

          <div className="pt-2 sm:pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-cream/50 mt-2 sm:mt-0">
            <span>Natural Photograph &bull; Unaltered</span>
            <span className="text-champagne/80 font-serif">The Induverse</span>
          </div>
        </div>
      </div>
    </div>
  );
}

