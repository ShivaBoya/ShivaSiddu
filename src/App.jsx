import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroLoader from './components/IntroLoader';
import ParticleBackground from './components/ParticleBackground';
import CustomCursor from './components/CustomCursor';
import MusicController from './components/MusicController';
import SceneNavigation from './components/SceneNavigation';
import PhotoViewerModal from './components/PhotoViewerModal';
import CinematicTransitionOverlay from './components/CinematicTransitionOverlay';

import Scene01Encounter from './scenes/Scene01Encounter';
import Scene02Universe from './scenes/Scene02Universe';
import Scene03InduGallery from './scenes/Scene03InduGallery';
import Scene04Memories from './scenes/Scene04Memories';
import Scene05Garden from './scenes/Scene05Garden';
import Scene06BirthdayCake from './scenes/Scene06BirthdayCake';
import Scene07FinalLetter from './scenes/Scene07FinalLetter';

import { useAudio } from './hooks/useAudio';
import { useCountdown } from './hooks/useCountdown';
import { useReducedMotion } from './hooks/useReducedMotion';
import { INDU_GALLERY } from './data/memories';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState(null);

  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [customPhotoModal, setCustomPhotoModal] = useState(null);

  const audioState = useAudio();
  const countdown = useCountdown();
  const prefersReducedMotion = useReducedMotion();

  // Browser History integration (popstate back/forward support)
  useEffect(() => {
    window.history.replaceState({ scene: 0 }, '');

    const handlePopState = (e) => {
      if (e.state && typeof e.state.scene === 'number') {
        setActiveSceneIndex(e.state.scene);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Pause audio and heavy animations when phone screen locked or tab hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && audioState.isPlaying) {
        audioState.togglePlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [audioState.isPlaying, audioState.togglePlay]);

  // Centralized Scene Transition Orchestrator
  const navigateToScene = useCallback(
    (targetIndex, type) => {
      if (isTransitioning) return; // Prevent double-clicks

      setIsTransitioning(true);
      setTransitionType(type);

      const switchDelay = prefersReducedMotion ? 350 : 650;
      const finishDelay = prefersReducedMotion ? 750 : 1350;

      // Switch active scene under the transition veil
      setTimeout(() => {
        setActiveSceneIndex(targetIndex);
        window.history.pushState({ scene: targetIndex }, '');
      }, switchDelay);

      // Finish transition and restore interactive state
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionType(null);
      }, finishDelay);
    },
    [isTransitioning, prefersReducedMotion]
  );

  // Scene-by-Scene Curiosity Transitions
  const handleEnterUniverse = () => {
    if (!audioState.hasStarted) {
      audioState.startMusic();
    }
    navigateToScene(1, 'rose-burst');
  };

  const handleGalaxyToGallery = () => {
    navigateToScene(2, 'cosmic-zoom');
  };

  const handleGalleryToMemories = () => {
    navigateToScene(3, 'photo-converge');
  };

  const handleMemoriesToGarden = () => {
    navigateToScene(4, 'page-turn-petals');
  };

  const handleGardenToBirthday = () => {
    navigateToScene(5, 'butterfly-lights');
  };

  const handleBirthdayToLetter = () => {
    navigateToScene(6, 'candle-darkness-gold');
  };

  const handleRestartJourney = () => {
    navigateToScene(0, 'rose-burst');
  };

  const handlePreviousScene = () => {
    if (activeSceneIndex > 0) {
      navigateToScene(activeSceneIndex - 1, 'page-turn-petals');
    }
  };

  // Full-screen Gallery Lightbox
  const handleOpenGalleryPhoto = (index) => {
    setActivePhotoIndex(index);
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev + 1) % INDU_GALLERY.length);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((prev) => (prev - 1 + INDU_GALLERY.length) % INDU_GALLERY.length);
    }
  };

  const currentPhotoData =
    activePhotoIndex !== null ? INDU_GALLERY[activePhotoIndex] : customPhotoModal;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-midnight text-cream select-none">
      {/* Initial Luxury Preloader */}
      {isLoading && <IntroLoader onComplete={() => setIsLoading(false)} />}

      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Scene-Aware Atmospheric Particles & Stardust */}
      <ParticleBackground activeSceneIndex={activeSceneIndex} intensity={0.85} />

      {/* Discreet Header Navigation & Live Countdown */}
      <SceneNavigation
        activeSceneIndex={activeSceneIndex}
        onPreviousScene={handlePreviousScene}
        countdown={countdown}
        isTransitioning={isTransitioning}
      />

      {/* Floating Audio Soundtrack Controller */}
      <MusicController audioState={audioState} />

      {/* Unique Cinematic Transition Overlay */}
      <CinematicTransitionOverlay
        isTransitioning={isTransitioning}
        transitionType={transitionType}
      />

      {/* SINGLE FULL-SCREEN SCENE CONTAINER (Only one scene at a time) */}
      <main className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {activeSceneIndex === 0 && (
            <motion.div
              key="scene-01"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene01Encounter
                onEnterUniverse={handleEnterUniverse}
                isTransitioning={isTransitioning}
              />
            </motion.div>
          )}

          {activeSceneIndex === 1 && (
            <motion.div
              key="scene-02"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene02Universe
                onNextScene={handleGalaxyToGallery}
                isTransitioning={isTransitioning}
              />
            </motion.div>
          )}

          {activeSceneIndex === 2 && (
            <motion.div
              key="scene-03"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene03InduGallery
                onOpenPhoto={handleOpenGalleryPhoto}
                playMemorySfx={audioState.playMemorySfx}
                onNextScene={handleGalleryToMemories}
                isTransitioning={isTransitioning}
              />
            </motion.div>
          )}

          {activeSceneIndex === 3 && (
            <motion.div
              key="scene-04"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene04Memories
                onOpenPhotoModal={setCustomPhotoModal}
                playMemorySfx={audioState.playMemorySfx}
                onNextScene={handleMemoriesToGarden}
                isTransitioning={isTransitioning}
              />
            </motion.div>
          )}

          {activeSceneIndex === 4 && (
            <motion.div
              key="scene-05"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene05Garden
                playFlowerSfx={audioState.playFlowerSfx}
                onNextScene={handleGardenToBirthday}
                isTransitioning={isTransitioning}
              />
            </motion.div>
          )}

          {activeSceneIndex === 5 && (
            <motion.div
              key="scene-06"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene06BirthdayCake
                onNextScene={handleBirthdayToLetter}
                playCandleSfx={audioState.playCandleSfx}
                isTransitioning={isTransitioning}
              />
            </motion.div>
          )}

          {activeSceneIndex === 6 && (
            <motion.div
              key="scene-07"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <Scene07FinalLetter
                onRestart={handleRestartJourney}
                onOpenPhotoModal={setCustomPhotoModal}
                playRevealSfx={audioState.playRevealSfx}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Full-screen Photo Lightbox Modal */}
      {currentPhotoData && (
        <PhotoViewerModal
          photo={currentPhotoData}
          onClose={() => {
            setActivePhotoIndex(null);
            setCustomPhotoModal(null);
          }}
          onNext={activePhotoIndex !== null ? handleNextPhoto : null}
          onPrev={activePhotoIndex !== null ? handlePrevPhoto : null}
          totalCount={activePhotoIndex !== null ? INDU_GALLERY.length : null}
          currentIndex={activePhotoIndex !== null ? activePhotoIndex : 0}
        />
      )}
    </div>
  );
}
