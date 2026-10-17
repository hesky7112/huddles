import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import {
  Play,
  Pause,
  Plus,
  Check,
  Info,
  ChevronDown,
  Sparkles,
  X,
  Search,
  TrendingUp,
  Clock,
  Bookmark,
  Video,
  Headphones,
  Maximize2,
  Volume2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'all episodes' },
  { id: 'video', label: 'video podcasts 🎬' },
  { id: 'audio', label: 'audio podcasts 🎙️' },
  { id: 'my-list', label: 'my list' },
  { id: 'architecture', label: 'architecture' },
  { id: 'systems', label: 'distributed systems' },
  { id: 'design', label: 'design craft' },
  { id: 'founders', label: 'founders' }
];

export const PodcastsView: React.FC = () => {
  const {
    episodes,
    currentEpisodeIndex,
    isPodPlaying,
    podProgress,
    setPodProgress,
    myListIds,
    toggleMyList,
    podDetailModalId,
    setPodDetailModalId,
    playEpisode,
    togglePodPlayback,
    showToast
  } = useHuddle();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [spotlightMode, setSpotlightMode] = useState<'video' | 'cover'>('video');
  const [modalMediaMode, setModalMediaMode] = useState<'video' | 'audio'>('video');

  const containerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  const featuredEpisode = episodes[0];
  const detailEp = episodes.find((e) => e.id === podDetailModalId);

  // Accordion animation matching SettingsView
  useEffect(() => {
    if (!accordionRef.current) return;
    if (aboutOpen) {
      gsap.to(accordionRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
      });
    } else {
      gsap.to(accordionRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in'
      });
    }
  }, [aboutOpen]);

  // Entrance animations for content cards
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.podcast-card'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeCategory, searchQuery]);

  // Filter episodes
  const filteredEpisodes = episodes.filter((ep) => {
    let matchesCategory = true;
    if (activeCategory === 'my-list') {
      matchesCategory = myListIds.includes(ep.id);
    } else if (activeCategory === 'video') {
      matchesCategory = ep.mediaType === 'video';
    } else if (activeCategory === 'audio') {
      matchesCategory = ep.mediaType === 'audio';
    } else if (activeCategory === 'all') {
      matchesCategory = true;
    } else {
      matchesCategory = ep.category === activeCategory;
    }

    const matchesSearch =
      !searchQuery.trim() ||
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      ref={containerRef}
      className="py-4 sm:py-6 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-7 select-none pb-20 md:pb-12"
    >
      {/* 1. HEADER (Matches clean SettingsView layout) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--tx)]">
              Podcasts
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mut)] mt-1">
              High-signal audio and video podcasts recorded by engineering leads.
            </p>
          </div>

          <button
            onClick={() => setAboutOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[var(--line)] text-xs sm:text-sm font-semibold text-[var(--tx)] hover:bg-[var(--s2)] transition-colors shrink-0"
          >
            <span>{aboutOpen ? 'Show less' : 'About podcasts'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                aboutOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Collapsible Info Accordion */}
        <div
          ref={accordionRef}
          className="overflow-hidden opacity-0 h-0 transition-all text-sm text-[var(--mut)] leading-relaxed max-w-3xl"
        >
          <div className="bg-[var(--s1)] p-4 rounded-2xl border border-[var(--line)]">
            Stream full in-studio video podcasts and spatial audio discussions. Toggle between video and audio modes, inspect interactive chapter timelines, and smoothly transition playback into background floating mode when working across other views.
          </div>
        </div>
      </div>

      {/* 2. FEATURED SPOTLIGHT CARD (Rich Colored Card with Cover Image & Video Thumbnail) */}
      {featuredEpisode && activeCategory === 'all' && !searchQuery.trim() && (
        <div
          className="podcast-card relative rounded-2xl sm:rounded-[28px] overflow-hidden p-5 sm:p-7 text-white shadow-xl transition-all border border-black/10 dark:border-white/20 isolate"
          style={{ backgroundColor: featuredEpisode.colorBg }}
        >
          {/* Background Multi-stop Vignette preserving vibrant, uniform color */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${featuredEpisode.coverGradient} opacity-95 -z-10`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/60 -z-10" />

          <div className="flex flex-col lg:flex-row gap-5 lg:gap-7 items-start lg:items-center">
            {/* Visual Media Showcase (Toggle between Video Thumbnail and Cover Image) */}
            <div className="relative w-full sm:w-80 lg:w-72 h-48 sm:h-52 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/20 group">
              <img
                src={
                  spotlightMode === 'video'
                    ? featuredEpisode.videoThumbnail
                    : featuredEpisode.coverImage
                }
                alt={featuredEpisode.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Media Format Badge & Resolution */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                <span className="flex items-center gap-1.5 text-[10px] font-bold lowercase tracking-normal text-white bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow">
                  <Video className="w-3 h-3 text-[var(--acc)]" />
                  video podcast
                </span>
                <span className="text-[10px] font-mono font-bold bg-black/60 text-white/90 px-2 py-0.5 rounded border border-white/10">
                  {featuredEpisode.videoResolution || '4K 60fps'}
                </span>
              </div>

              {/* Center Play Overlay */}
              <div
                onClick={() => {
                  if (currentEpisodeIndex === featuredEpisode.id && isPodPlaying) {
                    togglePodPlayback();
                  } else {
                    playEpisode(featuredEpisode.id);
                  }
                }}
                className="absolute inset-0 bg-black/35 grid place-items-center cursor-pointer group-hover:bg-black/25 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-white text-black grid place-items-center shadow-2xl group-hover:scale-110 active:scale-95 transition-all">
                  {currentEpisodeIndex === featuredEpisode.id && isPodPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-1" />
                  )}
                </div>
              </div>

              {/* Bottom Mode Switcher Bar */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpotlightMode('video');
                    }}
                    className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      spotlightMode === 'video' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Video
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSpotlightMode('cover');
                    }}
                    className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                      spotlightMode === 'cover' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Cover
                  </button>
                </div>
                <span className="font-mono text-white/80">{featuredEpisode.durationMinutes} min</span>
              </div>
            </div>

            {/* Featured Details */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold lowercase tracking-normal px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white">
                  #{featuredEpisode.categoryLabel.toLowerCase()}
                </span>
                <span className="text-xs font-semibold text-white/90">
                  {featuredEpisode.matchScore}% match · {featuredEpisode.speakerRole}
                </span>
              </div>

              <h3
                onClick={() => setPodDetailModalId(featuredEpisode.id)}
                className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white hover:text-[var(--acc)] cursor-pointer transition-colors leading-tight drop-shadow-md"
              >
                {featuredEpisode.title}
              </h3>

              <p className="text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2 sm:line-clamp-3">
                {featuredEpisode.synopsis}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-white/90">
                <Avatar seed={featuredEpisode.speaker} size={22} />
                <span className="font-semibold">{featuredEpisode.speaker}</span>
                <span className="opacity-75">· Host & Guest Session</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    if (currentEpisodeIndex === featuredEpisode.id && isPodPlaying) {
                      togglePodPlayback();
                    } else {
                      playEpisode(featuredEpisode.id);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs sm:text-sm font-bold hover:bg-neutral-200 active:scale-95 transition-all shadow-lg"
                >
                  {currentEpisodeIndex === featuredEpisode.id && isPodPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Watch & Listen</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setPodDetailModalId(featuredEpisode.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold hover:bg-black/60 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>Video player & chapters</span>
                </button>

                <button
                  onClick={() => toggleMyList(featuredEpisode.id)}
                  className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white grid place-items-center hover:bg-black/65 active:scale-95 transition-all"
                  title={myListIds.includes(featuredEpisode.id) ? 'Remove from My List' : 'Add to My List'}
                >
                  {myListIds.includes(featuredEpisode.id) ? (
                    <Check className="w-4 h-4 text-[var(--acc)]" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CATEGORY PILLS & SEARCH BAR (Clean, unified toolbar) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isActive
                      ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)] shadow-sm'
                      : 'bg-[var(--s1)] text-[var(--mut)] border-[var(--line)] hover:text-[var(--tx)] hover:bg-[var(--s2)]'
                  }`}
                >
                  {cat.label}
                  {cat.id === 'my-list' && myListIds.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] text-[10px] font-bold">
                      {myListIds.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mut)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audio & video podcasts..."
              className="w-full bg-[var(--s1)] border border-[var(--line)] text-[var(--tx)] placeholder:text-[var(--mut)] rounded-full pl-9 pr-8 py-1.5 text-xs outline-none focus:border-[var(--acc)] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--mut)] hover:text-[var(--tx)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. TOP TRENDING (Vibrant Colored Cards with Cover Art & Video Badges) */}
      {activeCategory === 'all' && !searchQuery.trim() && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[var(--acc)]" />
            <h3 className="font-bold text-base text-[var(--tx)]">Top Trending</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {episodes.slice(0, 3).map((ep, idx) => {
              const rank = idx + 1;
              const isSaved = myListIds.includes(ep.id);
              const isPlayingThis = currentEpisodeIndex === ep.id && isPodPlaying;
              const isVideo = ep.mediaType === 'video';

              return (
                <div
                  key={ep.id}
                  className="podcast-card group relative rounded-2xl sm:rounded-[28px] overflow-hidden p-5 text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between h-full min-h-[320px] isolate border border-black/10 dark:border-white/20 shadow-lg space-y-4"
                  style={{ backgroundColor: ep.colorBg }}
                >
                  {/* Background Multi-stop Vignette preserving rich, uniform color */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${ep.coverGradient} opacity-95 -z-10`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/60 -z-10" />

                  <div className="space-y-3">
                    {/* Top Row: Rank circle, Lowercase tag, and Duration */}
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        {/* Number circle badge */}
                        <div className="w-7 h-7 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white font-black text-xs grid place-items-center group-hover:border-[var(--acc)] group-hover:text-[var(--acc)] transition-colors shadow">
                          {rank}
                        </div>
                        <span className="text-[10px] font-bold lowercase tracking-normal text-white/95 bg-black/45 backdrop-blur-md border border-white/15 px-2.5 py-0.5 rounded-full">
                          #{ep.categoryLabel.toLowerCase()}
                        </span>
                      </div>

                      <span className="text-xs font-mono text-white/90 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                        <Clock className="w-3 h-3" />
                        {ep.durationMinutes}m
                      </span>
                    </div>

                    {/* Media Thumbnail with Video / Audio Badge */}
                    <div
                      onClick={() => setPodDetailModalId(ep.id)}
                      className="relative w-full h-36 rounded-xl overflow-hidden shadow-lg border border-white/15 group/thumb"
                    >
                      <img
                        src={isVideo ? ep.videoThumbnail : ep.coverImage}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />

                      {/* Format Badge overlay */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-bold lowercase text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                        {isVideo ? (
                          <>
                            <Video className="w-2.5 h-2.5 text-[var(--acc)]" />
                            <span>video podcast</span>
                          </>
                        ) : (
                          <>
                            <Headphones className="w-2.5 h-2.5 text-[var(--acc)]" />
                            <span>audio podcast</span>
                          </>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                        {ep.videoResolution || 'HD'}
                      </div>

                      {/* Play hover button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlayingThis) {
                            togglePodPlayback();
                          } else {
                            playEpisode(ep.id);
                          }
                        }}
                        className="absolute inset-0 bg-black/30 grid place-items-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-black grid place-items-center shadow-xl hover:scale-110 active:scale-95 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Title & Speaker */}
                    <div>
                      <h4
                        onClick={() => setPodDetailModalId(ep.id)}
                        className="font-extrabold text-sm sm:text-base text-white hover:text-[var(--acc)] cursor-pointer transition-colors leading-snug line-clamp-2 drop-shadow-sm"
                      >
                        {ep.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/85">
                        <Avatar seed={ep.speaker} size={18} />
                        <span className="truncate">{ep.speaker}</span>
                        <span className="text-[10px] opacity-75">· {ep.speakerRole}</span>
                      </div>
                    </div>

                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {ep.synopsis}
                    </p>
                  </div>

                  {/* Bottom Action Row with consistent alignment */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/20 z-10 mt-auto">
                    <button
                      onClick={() => {
                        if (isPlayingThis) {
                          togglePodPlayback();
                        } else {
                          playEpisode(ep.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[var(--acc)] hover:text-black active:scale-95 transition-all shadow"
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>{isVideo ? 'Watch' : 'Listen'}</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleMyList(ep.id)}
                        className={`w-8 h-8 rounded-full border border-white/20 grid place-items-center transition-colors ${
                          isSaved ? 'text-[var(--acc)] bg-black/60' : 'text-white/80 hover:text-white hover:bg-black/40'
                        }`}
                        title={isSaved ? 'Remove from My List' : 'Save to My List'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setPodDetailModalId(ep.id)}
                        className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-black/40 grid place-items-center transition-colors"
                        title="Chapters & Notes"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. ALL EPISODES GRID (Rich Colored Cards with Media Thumbnails) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[var(--tx)]">
            {activeCategory === 'my-list'
              ? 'Saved in My List'
              : activeCategory === 'video'
              ? 'Video Podcasts'
              : activeCategory === 'audio'
              ? 'Audio Podcasts'
              : searchQuery.trim()
              ? `Results for "${searchQuery}"`
              : 'All Podcasts & Episodes'}
          </h3>
          <span className="text-xs font-mono text-[var(--mut)]">
            {filteredEpisodes.length} {filteredEpisodes.length === 1 ? 'episode' : 'episodes'}
          </span>
        </div>

        {filteredEpisodes.length === 0 ? (
          <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-[var(--tx)]">No episodes found</p>
            <p className="text-xs text-[var(--mut)]">
              {activeCategory === 'my-list'
                ? 'You have not added any episodes to your list yet.'
                : 'Try adjusting your search query or selecting a different format or category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEpisodes.map((ep) => {
              const isSaved = myListIds.includes(ep.id);
              const isPlayingThis = currentEpisodeIndex === ep.id && isPodPlaying;
              const hasProgress = !!ep.progressMinutes;
              const pct = Math.round(((ep.progressMinutes || 0) / ep.durationMinutes) * 100);
              const isVideo = ep.mediaType === 'video';

              return (
                <div
                  key={ep.id}
                  className="podcast-card group relative rounded-2xl sm:rounded-[28px] overflow-hidden p-5 text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between h-full min-h-[320px] isolate border border-black/10 dark:border-white/20 shadow-lg space-y-4"
                  style={{ backgroundColor: ep.colorBg }}
                >
                  {/* Background Multi-stop Vignette preserving rich, uniform color */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${ep.coverGradient} opacity-95 -z-10`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/60 -z-10" />

                  <div className="space-y-3">
                    {/* Header line: Tag in lowercase and duration */}
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold lowercase tracking-normal text-white/95 bg-black/45 backdrop-blur-md border border-white/15 px-2.5 py-0.5 rounded-full">
                        #{ep.categoryLabel.toLowerCase()}
                      </span>
                      <span className="text-xs font-mono text-white/90 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                        <Clock className="w-3 h-3" />
                        {ep.durationMinutes}m
                      </span>
                    </div>

                    {/* Media Thumbnail with Video / Audio Badge */}
                    <div
                      onClick={() => setPodDetailModalId(ep.id)}
                      className="relative w-full h-36 rounded-xl overflow-hidden shadow-lg border border-white/15 group/thumb"
                    >
                      <img
                        src={isVideo ? ep.videoThumbnail : ep.coverImage}
                        alt={ep.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />

                      {/* Format Badge overlay */}
                      <div className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-bold lowercase text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/15">
                        {isVideo ? (
                          <>
                            <Video className="w-2.5 h-2.5 text-[var(--acc)]" />
                            <span>video podcast</span>
                          </>
                        ) : (
                          <>
                            <Headphones className="w-2.5 h-2.5 text-[var(--acc)]" />
                            <span>audio podcast</span>
                          </>
                        )}
                      </div>

                      <div className="absolute top-2 right-2 text-[9px] font-mono text-white/90 bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                        {ep.videoResolution || 'HD'}
                      </div>

                      {/* Play hover button */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlayingThis) {
                            togglePodPlayback();
                          } else {
                            playEpisode(ep.id);
                          }
                        }}
                        className="absolute inset-0 bg-black/30 grid place-items-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      >
                        <div className="w-10 h-10 rounded-full bg-white text-black grid place-items-center shadow-xl hover:scale-110 active:scale-95 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Title & Speaker */}
                    <div>
                      <h4
                        onClick={() => setPodDetailModalId(ep.id)}
                        className="font-extrabold text-sm sm:text-base text-white hover:text-[var(--acc)] cursor-pointer transition-colors leading-snug line-clamp-2 drop-shadow-sm"
                      >
                        {ep.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/85">
                        <Avatar seed={ep.speaker} size={18} />
                        <span className="truncate">{ep.speaker}</span>
                        <span className="text-[10px] opacity-75">· {ep.speakerRole}</span>
                      </div>
                    </div>

                    <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                      {ep.synopsis}
                    </p>

                    {/* Progress track if previously started */}
                    {hasProgress && (
                      <div className="space-y-1">
                        <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="bg-[var(--acc)] h-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-white/70 font-mono">
                          {ep.durationMinutes - (ep.progressMinutes || 0)}m remaining ({pct}%)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Row with consistent alignment */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/20 z-10 mt-auto">
                    <button
                      onClick={() => {
                        if (isPlayingThis) {
                          togglePodPlayback();
                        } else {
                          playEpisode(ep.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-[var(--acc)] hover:text-black active:scale-95 transition-all shadow"
                    >
                      {isPlayingThis ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          <span>{isVideo ? 'Watch' : 'Listen'}</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleMyList(ep.id)}
                        className={`w-8 h-8 rounded-full border border-white/20 grid place-items-center transition-colors ${
                          isSaved ? 'text-[var(--acc)] bg-black/60' : 'text-white/80 hover:text-white hover:bg-black/40'
                        }`}
                        title={isSaved ? 'Remove from My List' : 'Save to My List'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setPodDetailModalId(ep.id)}
                        className="w-8 h-8 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-black/40 grid place-items-center transition-colors"
                        title="Chapters & Notes"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. EPISODE DETAIL MODAL (Interactive Video & Audio Player) */}
      {detailEp && (
        <div
          onClick={() => setPodDetailModalId(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-2xl relative space-y-0 my-auto max-h-[94vh] overflow-y-auto"
          >
            {/* Interactive Player Stage: Video vs Audio */}
            <div className="relative bg-black aspect-video max-h-[380px] w-full flex items-center justify-center overflow-hidden">
              <img
                src={
                  modalMediaMode === 'video'
                    ? detailEp.videoThumbnail
                    : detailEp.coverImage
                }
                alt={detailEp.title}
                className="w-full h-full object-cover opacity-85"
              />

              {/* Close Button */}
              <button
                onClick={() => setPodDetailModalId(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/90 transition-colors shadow-lg z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Bar on Player */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
                <span className="flex items-center gap-1.5 text-xs font-bold lowercase tracking-normal bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                  {modalMediaMode === 'video' ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-[var(--acc)]" />
                      <span>video feed</span>
                    </>
                  ) : (
                    <>
                      <Headphones className="w-3.5 h-3.5 text-[var(--acc)]" />
                      <span>spatial audio</span>
                    </>
                  )}
                </span>
                <span className="text-xs font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  {detailEp.videoResolution || '4K 60fps'}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <button
                onClick={() => {
                  playEpisode(detailEp.id);
                  if (!isPodPlaying) togglePodPlayback();
                }}
                className="w-16 h-16 rounded-full bg-white/90 text-black grid place-items-center hover:scale-110 active:scale-95 transition-all shadow-2xl z-20"
              >
                {currentEpisodeIndex === detailEp.id && isPodPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              {/* Bottom Video Controls Scrubber */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/70 to-transparent z-20 space-y-2">
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newPct = Math.round((clickX / rect.width) * 100);
                    setPodProgress(Math.max(0, Math.min(100, newPct)));
                  }}
                  className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden cursor-pointer hover:h-2 transition-all"
                >
                  <div
                    className="bg-[var(--acc)] h-full transition-all"
                    style={{ width: `${currentEpisodeIndex === detailEp.id ? podProgress : 28}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]">
                      {Math.floor((detailEp.durationMinutes * podProgress) / 100)}:00 / {detailEp.durationMinutes}:00
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mode Switcher */}
                    <div className="flex items-center p-0.5 bg-black/50 border border-white/20 rounded-full text-[10px]">
                      <button
                        onClick={() => setModalMediaMode('video')}
                        className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                          modalMediaMode === 'video' ? 'bg-white text-black' : 'text-white/80'
                        }`}
                      >
                        Video
                      </button>
                      <button
                        onClick={() => setModalMediaMode('audio')}
                        className={`px-2 py-0.5 rounded-full font-semibold transition-colors ${
                          modalMediaMode === 'audio' ? 'bg-white text-black' : 'text-white/80'
                        }`}
                      >
                        Audio
                      </button>
                    </div>

                    <button
                      onClick={() => showToast('Full-screen video player activated')}
                      className="p-1 rounded hover:bg-white/20 text-white"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body Info */}
            <div className="p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold lowercase tracking-normal px-2.5 py-0.5 rounded-full bg-[var(--s2)] border border-[var(--line)] text-[var(--tx)]">
                    #{detailEp.categoryLabel.toLowerCase()}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--tx)] mt-1.5 leading-snug">
                    {detailEp.title}
                  </h3>
                  <p className="text-xs text-[var(--mut)] mt-0.5">
                    {detailEp.speaker} · {detailEp.speakerRole}
                  </p>
                </div>

                <button
                  onClick={() => toggleMyList(detailEp.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--line)] bg-[var(--s2)] text-xs font-semibold text-[var(--tx)] hover:bg-[var(--line)] transition-colors self-start sm:self-auto shrink-0"
                >
                  {myListIds.includes(detailEp.id) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--acc)]" />
                      <span>In My List</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to List</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[var(--tx)] mb-1">Episode Synopsis</h5>
                <p className="text-xs sm:text-sm text-[var(--mut)] leading-relaxed">{detailEp.synopsis}</p>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[var(--tx)] mb-1.5">Key Takeaways</h5>
                <ul className="space-y-1.5">
                  {detailEp.takeaways.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[var(--mut)] leading-relaxed">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--acc)] shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-bold text-[var(--tx)] mb-1.5">Interactive Chapters</h5>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {detailEp.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playEpisode(detailEp.id);
                        setPodProgress(Math.round((ch.seconds / (detailEp.durationMinutes * 60)) * 100));
                        showToast(`Jumped to chapter: ${ch.title}`);
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--s2)] border border-[var(--line)] hover:border-[var(--acc)] text-left text-xs transition-colors group"
                    >
                      <span className="font-semibold text-[var(--tx)] group-hover:text-[var(--acc)] transition-colors truncate pr-2">
                        {ch.title}
                      </span>
                      <span className="font-mono text-[var(--mut)] shrink-0">{ch.time}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
