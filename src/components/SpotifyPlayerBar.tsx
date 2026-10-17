import React, { useState } from 'react';
import { useHuddle } from '../context/HuddleContext';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Heart,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2
} from 'lucide-react';

export const SpotifyPlayerBar: React.FC = () => {
  const {
    currentView,
    episodes,
    currentEpisodeIndex,
    isPodPlaying,
    podProgress,
    setPodProgress,
    podSpeed,
    setPodSpeed,
    myListIds,
    toggleMyList,
    setPodDetailModalId,
    togglePodPlayback,
    seekPodBySeconds,
    isSubscribed,
    unlockedEpisodeIds,
    showToast
  } = useHuddle();

  const [volume, setVolume] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // The pinned play bar ONLY appears on the podcasts page!
  // When leaving the podcasts page, it floats via FloatingPodcastPlayer.
  if (currentView !== 'podcasts') return null;

  const activeEpisode =
    currentEpisodeIndex !== null ? episodes[currentEpisodeIndex] : episodes[0];

  const isUnlocked = isSubscribed || unlockedEpisodeIds.includes(activeEpisode?.id);
  const isSaved = myListIds.includes(activeEpisode?.id);

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(podSpeed) + 1) % speeds.length;
    setPodSpeed(speeds[nextIdx]);
    showToast(`Speed: ${speeds[nextIdx]}x`);
  };

  const currentMinutes = Math.floor((activeEpisode.durationMinutes * podProgress) / 100);
  const currentSeconds = Math.floor(((activeEpisode.durationMinutes * podProgress * 60) / 100) % 60);
  const formattedCurrentTime = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
  const formattedTotalTime = `${activeEpisode.durationMinutes}:00`;

  return (
    <footer
      className="fixed bottom-[58px] md:bottom-0 md:left-[76px] left-0 right-0 z-40 bg-[var(--s1)]/95 backdrop-blur-2xl border-t border-[var(--line)] px-3 sm:px-4 md:px-8 h-[66px] sm:h-[72px] md:h-[86px] flex items-center justify-between select-none shadow-[0_-8px_32px_rgba(0,0,0,0.36)] transition-all"
    >
      {/* Mobile Top Hairline Progress Bar */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-[2.5px] bg-[var(--line)] overflow-hidden">
        <div
          className="h-full bg-[var(--acc)] transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, podProgress))}%` }}
        />
      </div>

      {/* LEFT: Google-standard Episode Info & Artwork */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 md:flex-initial md:max-w-[30%] pr-2">
        <div
          onClick={() => setPodDetailModalId(activeEpisode.id)}
          className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-xl shrink-0 cursor-pointer overflow-hidden shadow-md group hover:scale-105 transition-transform bg-[var(--s2)]"
          title="View episode chapters and notes"
        >
          {activeEpisode.coverImage && (
            <img
              src={activeEpisode.coverImage}
              alt={activeEpisode.title}
              className="w-full h-full object-cover"
            />
          )}
          {isPodPlaying ? (
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center gap-0.5 pb-1.5 md:pb-2">
              <span className="w-1 bg-[var(--acc)] rounded-full h-3 md:h-4 animate-bounce" />
              <span className="w-1 bg-[var(--acc)] rounded-full h-1.5 md:h-2 animate-pulse" />
              <span className="w-1 bg-[var(--acc)] rounded-full h-3.5 md:h-5 animate-bounce" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity text-white">
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-0.5" />
            </div>
          )}
        </div>

        <div
          className="min-w-0 flex flex-col justify-center cursor-pointer"
          onClick={() => setPodDetailModalId(activeEpisode.id)}
        >
          <span className="font-semibold text-xs md:text-sm text-[var(--tx)] truncate hover:text-[var(--acc)] transition-colors">
            {activeEpisode.title}
          </span>

          <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-[var(--mut)] truncate">
            <span className="truncate">{activeEpisode.speaker}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline truncate text-[10px] lowercase font-mono px-1.5 py-0.2 rounded bg-[var(--s2)] text-[var(--tx)] border border-[var(--line)]">
              {(activeEpisode.categoryLabel || 'tech').toLowerCase()}
            </span>
            <span className="md:hidden font-mono text-[var(--mut)]">· {formattedCurrentTime}</span>
            {!isUnlocked && (
              <span className="text-amber-400 font-medium text-[10px]">· Preview</span>
            )}
          </div>
        </div>

        {/* Favorite / Bookmark */}
        <button
          onClick={() => toggleMyList(activeEpisode.id)}
          className={`hidden sm:grid w-8 h-8 rounded-full place-items-center transition-all shrink-0 hover:bg-[var(--s2)] ${
            isSaved ? 'text-[var(--acc)]' : 'text-[var(--mut)] hover:text-[var(--tx)]'
          }`}
          title={isSaved ? 'In My List' : 'Save to My List'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* MOBILE-ONLY COMPACT CONTROLS */}
      <div className="flex md:hidden items-center gap-1.5 shrink-0">
        <button
          onClick={() => seekPodBySeconds(-10)}
          className="w-8 h-8 rounded-full grid place-items-center text-[var(--mut)] hover:text-[var(--tx)] active:bg-[var(--s2)] transition-colors"
          title="Rewind 10 seconds"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={togglePodPlayback}
          className="w-10 h-10 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center active:scale-95 transition-all shadow-md shrink-0"
          title={isPodPlaying ? 'Pause' : 'Play'}
        >
          {isPodPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setPodDetailModalId(activeEpisode.id)}
          className="w-8 h-8 rounded-full grid place-items-center text-[var(--mut)] hover:text-[var(--tx)] active:bg-[var(--s2)] transition-colors"
          title="Open Details & Chapters"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* DESKTOP CENTER: Google-Standard Playback Controls & Material Scrubber */}
      <div className="hidden md:flex flex-1 max-w-xl flex-col items-center justify-center gap-1.5 px-3">
        {/* Buttons Row */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => seekPodBySeconds(-10)}
            className="w-8 h-8 rounded-full grid place-items-center text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s2)] transition-colors"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePodPlayback}
            className="w-11 h-11 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
            title={isPodPlaying ? 'Pause' : 'Play'}
          >
            {isPodPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => seekPodBySeconds(30)}
            className="w-8 h-8 rounded-full grid place-items-center text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s2)] transition-colors"
            title="Fast forward 30 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Scrubber Timeline (Google Material 3 design) */}
        <div className="w-full flex items-center gap-3">
          <span className="text-[11px] font-mono text-[var(--mut)] tabular-nums shrink-0">
            {formattedCurrentTime}
          </span>

          <div className="relative flex-1 flex items-center group cursor-pointer py-1">
            <input
              type="range"
              min="0"
              max="100"
              value={podProgress}
              onChange={(e) => setPodProgress(Number(e.target.value))}
              className="w-full accent-[var(--acc)] h-1.5 bg-[var(--line)] rounded-lg cursor-pointer transition-all"
            />
          </div>

          <span className="text-[11px] font-mono text-[var(--mut)] tabular-nums shrink-0">
            {formattedTotalTime}
          </span>
        </div>
      </div>

      {/* DESKTOP RIGHT: Speed chip, Chapters & Volume (Google standard) */}
      <div className="hidden md:flex items-center gap-3 lg:gap-4 shrink-0 justify-end min-w-[20%] md:min-w-[25%]">
        {/* Speed Chip */}
        <button
          onClick={cycleSpeed}
          className="px-2.5 py-1 rounded-full bg-[var(--s2)] border border-[var(--line)] text-[11px] font-mono font-semibold text-[var(--tx)] hover:bg-[var(--line)] hover:border-[var(--acc)] transition-all"
          title="Change playback speed"
        >
          {podSpeed}x
        </button>

        {/* Chapters & Notes Drawer Trigger */}
        <button
          onClick={() => setPodDetailModalId(activeEpisode.id)}
          className="w-8 h-8 rounded-full text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s2)] grid place-items-center transition-colors"
          title="Episode Chapters & Key Takeaways"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume Slider */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-full grid place-items-center text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s2)] transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 xl:w-24 accent-[var(--acc)] h-1 bg-[var(--line)] rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};
