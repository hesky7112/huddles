import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../context/HuddleContext';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  X,
  Headphones
} from 'lucide-react';

export const FloatingPodcastPlayer: React.FC = () => {
  const {
    currentView,
    goToView,
    episodes,
    currentEpisodeIndex,
    isPodPlaying,
    podProgress,
    togglePodPlayback,
    seekPodBySeconds,
    inCall,
    hasStartedPodcast,
    podFloatingDismissed,
    setPodFloatingDismissed
  } = useHuddle();

  const containerRef = useRef<HTMLDivElement>(null);

  // Floating player appears ONLY when leaving the podcast page AND podcast has been started/played and not dismissed
  const isCallMiniVisible = inCall && currentView !== 'live';
  const isVisible =
    currentView !== 'podcasts' &&
    !podFloatingDismissed &&
    (isPodPlaying || (hasStartedPodcast && currentEpisodeIndex !== null));

  useEffect(() => {
    if (isVisible && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const activeEpisode =
    currentEpisodeIndex !== null ? episodes[currentEpisodeIndex] : episodes[0];

  const currentMinutes = Math.floor((activeEpisode.durationMinutes * podProgress) / 100);
  const currentSeconds = Math.floor(((activeEpisode.durationMinutes * podProgress * 60) / 100) % 60);
  const formattedCurrentTime = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
  const formattedTotalTime = `${activeEpisode.durationMinutes}:00`;

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPodPlaying) {
      togglePodPlayback();
    }
    setPodFloatingDismissed(true);
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToView('podcasts');
  };

  return (
    <div
      ref={containerRef}
      className={`fixed ${
        isCallMiniVisible ? 'bottom-[154px] sm:bottom-6' : 'bottom-20 md:bottom-6'
      } left-3 right-3 sm:left-6 sm:right-auto md:left-[92px] sm:w-84 max-w-[calc(100vw-24px)] z-40 bg-[var(--s1)]/95 backdrop-blur-xl border border-[var(--line)] shadow-2xl rounded-2xl p-3 flex items-center gap-2.5 sm:gap-3 transition-all hover:border-[var(--acc)] group select-none`}
    >
      {/* Cover artwork thumbnail with animated audio wave & click to open */}
      <div
        onClick={handleExpand}
        className="relative w-12 h-12 rounded-xl shrink-0 cursor-pointer overflow-hidden shadow-md group-hover:scale-105 transition-transform bg-[var(--s2)]"
        title="Open in Podcasts page"
      >
        {activeEpisode.coverImage && (
          <img
            src={activeEpisode.coverImage}
            alt={activeEpisode.title}
            className="w-full h-full object-cover"
          />
        )}
        {isPodPlaying ? (
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center gap-0.5 pb-2">
            <span className="w-1 bg-[var(--acc)] rounded-full h-4 animate-bounce" />
            <span className="w-1 bg-[var(--acc)] rounded-full h-2 animate-pulse" />
            <span className="w-1 bg-[var(--acc)] rounded-full h-5 animate-bounce" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/30 grid place-items-center text-white">
            <Headphones className="w-5 h-5 opacity-90" />
          </div>
        )}
      </div>

      {/* Episode Title & Progress info */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={handleExpand}
        title="Open in Podcasts page"
      >
        <p className="text-xs font-bold truncate text-[var(--tx)] hover:text-[var(--acc)] transition-colors">
          {activeEpisode.title}
        </p>
        <p className="text-[11px] text-[var(--mut)] truncate mt-0.5">
          {activeEpisode.speaker} · <span className="tabular-nums font-mono">{formattedCurrentTime}</span> / {formattedTotalTime}
        </p>
      </div>

      {/* Control Buttons (Google standard styling) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            seekPodBySeconds(-15);
          }}
          title="Rewind 15 seconds"
          className="w-7 h-7 rounded-full bg-[var(--s2)] hover:bg-[var(--line)] text-[var(--tx)] grid place-items-center transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePodPlayback();
          }}
          title={isPodPlaying ? 'Pause' : 'Play'}
          className="w-8 h-8 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          {isPodPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={handleExpand}
          title="Expand to Full Podcast Player"
          className="w-7 h-7 rounded-full bg-[var(--s2)] hover:bg-[var(--line)] text-[var(--mut)] hover:text-[var(--tx)] grid place-items-center transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDismiss}
          title="Close player"
          className="w-7 h-7 rounded-full bg-[var(--s2)] hover:bg-[#ff3d57] text-[var(--mut)] hover:text-white grid place-items-center transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Micro progress line at bottom of floating card */}
      <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--line)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--acc)] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, podProgress))}%` }}
        />
      </div>
    </div>
  );
};
