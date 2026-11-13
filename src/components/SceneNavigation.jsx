import React from 'react';
import { Sparkles, Calendar, Heart, ArrowLeft } from 'lucide-react';

export const SCENES_METADATA = [
  { id: 'scene-encounter', number: '01', title: 'The First Encounter' },
  { id: 'scene-universe', number: '02', title: 'The Induverse' },
  { id: 'scene-gallery', number: '03', title: 'The Beauty of Indu' },
  { id: 'scene-memories', number: '04', title: 'Little Memories' },
  { id: 'scene-garden', number: '05', title: 'A Garden for Indu' },
  { id: 'scene-birthday', number: '06', title: 'The Celebration' },
  { id: 'scene-letter', number: '07', title: 'The Final Letter' }
];

export default function SceneNavigation({
  activeSceneIndex,
  onPreviousScene,
  countdown,
  isTransitioning
}) {
  const { days, hours, minutes, seconds, isBirthday } = countdown;
  const currentSceneNumber = String(activeSceneIndex + 1).padStart(2, '0');
  const totalScenesNumber = String(SCENES_METADATA.length).padStart(2, '0');

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-2.5 sm:px-6 md:px-8 pt-[max(0.6rem,env(safe-area-inset-top))] pb-2 flex items-center justify-between pointer-events-none select-none max-w-full overflow-hidden">
      {/* Brand & Discreet Back Button */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-3 shrink-0">
        {activeSceneIndex > 0 && (
          <button
            onClick={onPreviousScene}
            disabled={isTransitioning}
            className="w-9 h-9 sm:w-8 sm:h-8 rounded-full glass-panel flex items-center justify-center border border-champagne/30 text-champagne hover:text-cream hover:border-champagne transition-all shadow-md active:scale-95 group touch-manipulation cursor-pointer"
            title="Return to previous scene"
            aria-label="Return to previous scene"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-burgundy via-rose to-champagne flex items-center justify-center p-[1px] shadow-glow-rose shrink-0">
            <div className="w-full h-full rounded-full bg-midnight flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-champagne" />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-xs sm:text-sm md:text-base font-bold tracking-wider sm:tracking-widest text-gold-gradient uppercase leading-none">
              The Induverse
            </h1>
            <p className="text-[9px] text-rose-soft/70 font-sans tracking-wider hidden sm:block mt-0.5">
              For Indu &bull; Shiva
            </p>
          </div>
        </div>
      </div>

      {/* Center Subtle Scene Indicator (e.g. 02 / 07) */}
      {activeSceneIndex > 0 && (
        <div className="pointer-events-auto glass-pill px-2.5 sm:px-3.5 py-1 rounded-full border border-champagne/20 shadow-md flex items-center gap-1.5 shrink-0">
          <span className="font-serif text-[11px] sm:text-xs md:text-sm font-semibold tracking-widest text-champagne font-mono">
            {currentSceneNumber} <span className="text-rose-soft/60">/</span> {totalScenesNumber}
          </span>
          <span className="text-[10px] uppercase font-sans tracking-wider text-rose-soft/80 hidden md:inline border-l border-white/10 pl-2">
            {SCENES_METADATA[activeSceneIndex].title}
          </span>
        </div>
      )}

      {/* Live Countdown Badge to Dec 1, 2026 */}
      <div className="pointer-events-auto glass-panel rounded-full px-2.5 sm:px-3.5 py-1 sm:py-1.5 flex items-center gap-1.5 border border-champagne/20 shadow-lg shrink-0">
        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose animate-pulse shrink-0" />
        {isBirthday ? (
          <span className="font-serif text-[11px] sm:text-xs md:text-sm text-champagne font-semibold tracking-wide flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose fill-rose animate-bounce" />
            Happy Birthday, Indu!
          </span>
        ) : (
          <div className="flex items-center gap-1 text-[10px] sm:text-xs font-sans tracking-wider">
            <span className="text-rose-soft/80 hidden md:inline">Birthday in:</span>
            {/* Full countdown on sm+ screens */}
            <span className="font-mono text-champagne font-semibold hidden xs:inline">
              {days}d : {hours.toString().padStart(2, '0')}h : {minutes.toString().padStart(2, '0')}m : {seconds.toString().padStart(2, '0')}s
            </span>
            {/* Ultra-compact countdown on <380px screens */}
            <span className="font-mono text-champagne font-semibold xs:hidden">
              {days}d {hours}h
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
