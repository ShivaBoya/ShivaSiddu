import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Music } from 'lucide-react';

export default function MusicController({ audioState }) {
  const { isPlaying, volume, setVolume, isMuted, togglePlay, toggleMute, hasStarted } = audioState;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-2.5 sm:right-6 sm:bottom-6 z-40 flex items-center gap-2 touch-manipulation">
      {/* Expanded Controls Card */}
      {isExpanded && (
        <div className="glass-panel rounded-2xl p-2.5 sm:p-3 px-3 sm:px-4 flex items-center gap-3 sm:gap-4 text-xs tracking-wider animate-fadeIn border border-rose/30 shadow-2xl backdrop-blur-xl absolute bottom-14 right-0 max-w-[85vw] sm:max-w-none">
          <div className="flex flex-col">
            <span className="font-serif text-champagne text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose shrink-0" />
              The Induverse Soundtrack
            </span>
            <span className="text-rose-soft/70 text-[10px] sm:text-[11px] font-sans">
              Ethereal Ambient Piano & Cosmic Pads
            </span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10 shrink-0">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                if (isMuted) toggleMute();
                setVolume(parseFloat(e.target.value));
              }}
              className="w-16 sm:w-24 h-1.5 accent-rose bg-white/20 rounded-lg appearance-none cursor-pointer"
              title="Volume"
            />
          </div>
        </div>
      )}

      {/* Main Pill Button */}
      <div className="glass-panel-gold rounded-full p-1 sm:p-1.5 pr-2 sm:pr-3.5 flex items-center gap-1.5 sm:gap-2 border border-champagne/30 shadow-glow-gold hover:border-champagne/60 transition-all duration-300">
        <button
          onClick={togglePlay}
          className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-burgundy to-rose flex items-center justify-center text-cream shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          title={isPlaying ? "Pause soundtrack" : "Play soundtrack"}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-cream" /> : <Play className="w-4 h-4 fill-cream ml-0.5" />}
        </button>

        {/* Dancing Audio Equalizer Visualizer */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 py-1 px-1 text-left group cursor-pointer"
          title="Toggle music settings"
        >
          <div className="flex items-end gap-0.5 h-4 w-4 sm:w-5">
            <span
              className={`w-0.5 bg-champagne rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite]' : 'h-1'
              }`}
              style={{ height: isPlaying ? '14px' : '3px' }}
            />
            <span
              className={`w-0.5 bg-rose rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite_0.2s]' : 'h-2'
              }`}
              style={{ height: isPlaying ? '16px' : '6px' }}
            />
            <span
              className={`w-0.5 bg-champagne rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite_0.4s]' : 'h-1'
              }`}
              style={{ height: isPlaying ? '10px' : '3px' }}
            />
            <span
              className={`w-0.5 bg-rose rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite_0.1s]' : 'h-1.5'
              }`}
              style={{ height: isPlaying ? '12px' : '4px' }}
            />
          </div>

          <span className="hidden md:inline font-sans text-[11px] text-champagne/90 tracking-widest uppercase font-medium pl-1 group-hover:text-cream">
            {isPlaying ? 'Soundtrack On' : hasStarted ? 'Soundtrack Paused' : 'Play Music'}
          </span>
        </button>

        <button
          onClick={toggleMute}
          className="text-rose-soft/70 hover:text-champagne transition-colors p-1.5 cursor-pointer shrink-0"
          title={isMuted ? "Unmute" : "Mute"}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

