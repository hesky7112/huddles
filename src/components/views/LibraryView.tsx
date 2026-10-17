import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import {
  Play,
  Pause,
  Download,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  LayoutGrid,
  List,
  Pin,
  ChevronDown,
  X,
  FileText,
  GitBranch,
  Sparkles
} from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'all sessions' },
  { id: 'pinned', label: 'pinned' },
  { id: 'rfc', label: 'architecture & rfcs' },
  { id: 'hotfix', label: 'incidents & hotfixes' },
  { id: 'design', label: 'design reviews' }
];

export const LibraryView: React.FC = () => {
  const { recordings, startCall, showToast } = useHuddle();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedRecId, setSelectedRecId] = useState<string>(recordings[0]?.id || '');
  const [isPlayingSim, setIsPlayingSim] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(35);
  const [readMoreOpen, setReadMoreOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Accordion GSAP animation matching SettingsView
  useEffect(() => {
    if (!accordionRef.current) return;
    if (readMoreOpen) {
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
  }, [readMoreOpen]);

  // Entrance animations for cards
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.querySelectorAll('.recording-card'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeFilter, searchQuery, viewMode]);

  // Video/audio playback simulation ticker
  useEffect(() => {
    if (!isPlayingSim) return;
    const interval = setInterval(() => {
      setSimProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 450);
    return () => clearInterval(interval);
  }, [isPlayingSim]);

  const selectedRecording =
    recordings.find((r) => r.id === selectedRecId) || recordings[0];

  const filteredRecordings = recordings.filter((r) => {
    const matchesQuery =
      r.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pinned') return r.isPinned;
    if (activeFilter === 'rfc') return r.tags.some((t) => t.toLowerCase().includes('rfc'));
    if (activeFilter === 'hotfix') return r.tags.some((t) => t.toLowerCase().includes('hotfix'));
    if (activeFilter === 'design') return r.tags.some((t) => t.toLowerCase().includes('design'));
    return true;
  });

  const handleExportNotes = () => {
    if (!selectedRecording) return;
    const markdown = `# ${selectedRecording.roomName} — Session Notes
**Topic**: ${selectedRecording.topic}
**Date**: ${selectedRecording.dateStr}
**Host**: ${selectedRecording.hostName}
**Duration**: ${selectedRecording.duration}
**Linked Branch**: ${selectedRecording.branch}

## Summary
${selectedRecording.summary}

## Action Items
${selectedRecording.keyActionItems.map((item) => `- [ ] ${item}`).join('\n')}

## Transcript Excerpt
> ${selectedRecording.transcriptSnippet}
`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRecording.roomName.replace('#', '')}-notes.md`;
    a.click();
    showToast('Session notes exported to Markdown');
  };

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
              Recordings & Archive
            </h2>
            <p className="text-xs sm:text-sm text-[var(--mut)] mt-1">
              Archived collaborative huddles, AI executive summaries, and searchable transcripts.
            </p>
          </div>

          <button
            onClick={() => setReadMoreOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[var(--line)] text-xs sm:text-sm font-semibold text-[var(--tx)] hover:bg-[var(--s2)] transition-colors shrink-0"
          >
            <span>{readMoreOpen ? 'Show less' : 'About recordings'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                readMoreOpen ? 'rotate-180' : ''
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
            Every huddle session is automatically archived with zero overhead. Access complete high-fidelity playback simulations, AI-generated summary bullet points, verified action checklists, and searchable transcripts linked directly to git repositories.
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS & TOOLBAR (Clean, unified toolbar matching Settings & Podcasts) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category / Topic Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTERS.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isActive
                      ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)] shadow-sm'
                      : 'bg-[var(--s1)] text-[var(--mut)] border-[var(--line)] hover:text-[var(--tx)] hover:bg-[var(--s2)]'
                  }`}
                >
                  {f.id === 'pinned' && <Pin className="w-3 h-3 inline mr-1 fill-current" />}
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search Box & View Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--mut)] pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions or tags..."
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

            <div className="flex items-center p-1 bg-[var(--s1)] border border-[var(--line)] rounded-full shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--tx)] text-[var(--bg)] shadow-sm'
                    : 'text-[var(--mut)] hover:text-[var(--tx)]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[var(--tx)] text-[var(--bg)] shadow-sm'
                    : 'text-[var(--mut)] hover:text-[var(--tx)]'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SECTION: CLEAN COLORED CARDS GRID / TABLE */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRecordings.map((rec) => {
            const isSelected = selectedRecId === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecId(rec.id)}
                className={`recording-card group relative rounded-2xl sm:rounded-[28px] overflow-hidden p-5 text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col justify-between min-h-[220px] isolate border ${
                  isSelected ? 'border-white shadow-2xl ring-2 ring-[var(--acc)]/40' : 'border-black/10 dark:border-white/15 hover:border-black/20 dark:hover:border-white/40 shadow-md'
                }`}
                style={{ backgroundColor: rec.colorBg }}
              >
                {/* Background Multi-stop Vignette preserving rich color */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${rec.coverGradient} opacity-90 -z-10`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent -z-10" />

                {/* Top Row: Room Name, Pinned Badge & Duration */}
                <div className="flex items-start justify-between gap-2 z-10">
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      {rec.isPinned && (
                        <Pin className="w-3.5 h-3.5 fill-current text-white/90 shrink-0" />
                      )}
                      <h3 className="font-extrabold text-base sm:text-lg tracking-tight leading-snug drop-shadow-md truncate">
                        {rec.roomName}
                      </h3>
                    </div>
                    <p className="text-xs text-white/85 font-medium line-clamp-2 leading-relaxed">
                      {rec.topic}
                    </p>
                  </div>

                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white shrink-0">
                    {rec.duration}
                  </span>
                </div>

                {/* Middle: Lowercase Tags & Git Branch Chips */}
                <div className="flex flex-wrap items-center gap-1.5 my-3 z-10">
                  {rec.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold lowercase tracking-normal px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10"
                    >
                      #{t.toLowerCase()}
                    </span>
                  ))}
                  <span className="text-[10px] font-mono text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                    <GitBranch className="w-2.5 h-2.5" />
                    {rec.branch}
                  </span>
                </div>

                {/* Bottom Row Meta: Host Avatar, Date, and Sleek Play Button */}
                <div className="flex items-center justify-between text-xs text-white/90 pt-3 border-t border-white/15 z-10">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar seed={rec.hostName} size={22} />
                    <span className="font-semibold truncate max-w-[120px]">{rec.hostName}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">· {rec.dateStr}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRecId(rec.id);
                      setIsPlayingSim(true);
                      showToast(`Playing simulation for ${rec.roomName}`);
                    }}
                    className="w-8 h-8 rounded-full bg-white text-black hover:bg-[var(--acc)] hover:text-[var(--acc-ink)] grid place-items-center shadow-lg transition-all hover:scale-110 active:scale-95 shrink-0"
                    title="Play recording session"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE / TRACKLIST VIEW (Clean layout with color swatches) */
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-none">
            <div className="min-w-[620px] sm:min-w-0">
              <div className="grid grid-cols-12 gap-3 px-5 py-3 border-b border-[var(--line)] text-[11px] font-bold text-[var(--mut)] uppercase tracking-wider">
                <span className="col-span-1">#</span>
                <span className="col-span-5">Session & Topic</span>
                <span className="col-span-3">Host & Branch</span>
                <span className="col-span-2">Date</span>
                <span className="col-span-1 text-right">Duration</span>
              </div>

              <div className="divide-y divide-[var(--line)]">
                {filteredRecordings.map((rec, idx) => {
                  const isSelected = selectedRecId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onClick={() => setSelectedRecId(rec.id)}
                      className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center text-xs cursor-pointer transition-colors group ${
                        isSelected ? 'bg-[var(--s2)] font-semibold' : 'hover:bg-[var(--s2)]/60'
                      }`}
                    >
                      {/* Index / Play on hover */}
                      <div className="col-span-1 text-[var(--mut)] font-mono">
                        <span className="group-hover:hidden">{idx + 1}</span>
                        <Play className="w-3.5 h-3.5 hidden group-hover:block text-[var(--acc)] fill-current" />
                      </div>

                      {/* Color Swatch & Session Info */}
                      <div className="col-span-5 flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl shrink-0 shadow-sm"
                          style={{ backgroundColor: rec.colorBg }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--tx)] truncate">{rec.roomName}</p>
                          <p className="text-[11px] text-[var(--mut)] truncate">{rec.topic}</p>
                        </div>
                      </div>

                      {/* Host & Branch */}
                      <div className="col-span-3 flex items-center gap-2 text-[var(--mut)] min-w-0">
                        <Avatar seed={rec.hostName} size={20} />
                        <span className="truncate text-[var(--tx)]">{rec.hostName}</span>
                        <span className="font-mono text-[10px] text-[var(--acc)] truncate">
                          · {rec.branch}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 text-[var(--mut)] text-[11px] truncate">
                        {rec.dateStr}
                      </div>

                      {/* Duration */}
                      <div className="col-span-1 text-right font-mono text-[var(--mut)] text-[11px]">
                        {rec.duration}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SELECTED RECORDING INSPECTOR (Clean card design matching SettingsView) */}
      {selectedRecording && (
        <div className="podcast-card bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] overflow-hidden shadow-sm space-y-0">
          {/* Header Banner with Card's Color Gradient */}
          <div
            className={`p-5 sm:p-7 bg-gradient-to-tr ${selectedRecording.coverGradient} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative isolate`}
          >
            <div className="space-y-1.5 relative z-10 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold lowercase tracking-normal bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full w-fit">
                  archived session
                </span>
                <span className="text-xs font-mono opacity-85">branch {selectedRecording.branch}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                {selectedRecording.roomName}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs opacity-90 font-medium">
                <span>{selectedRecording.topic}</span>
                <span>·</span>
                <span>Hosted by {selectedRecording.hostName}</span>
                <span>·</span>
                <span>{selectedRecording.dateStr}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 relative z-10 shrink-0">
              <button
                onClick={() => setIsPlayingSim(!isPlayingSim)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] text-xs sm:text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow"
                title={isPlayingSim ? 'Pause Playback' : 'Play Session'}
              >
                {isPlayingSim ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Play Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={handleExportNotes}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-semibold hover:bg-black/60 transition-colors"
                title="Export session notes as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Notes (.md)</span>
              </button>

              <button
                onClick={() =>
                  startCall(selectedRecording.roomName, selectedRecording.topic, selectedRecording.branch)
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors shadow"
                title="Re-open Live Room"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Re-open Room</span>
              </button>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent -z-10" />
          </div>

          {/* Inspector Body Details (Structured matching SettingsView cards) */}
          <div className="p-5 sm:p-7 space-y-5">
            {/* Playback Simulation Scrubber */}
            <div className="bg-[var(--bg)] border border-[var(--line)] p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--mut)]">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recorded Audio Stream
                </span>
                <span className="font-semibold text-[var(--tx)]">
                  {isPlayingSim ? 'Streaming in sync' : 'Paused'}
                </span>
                <span>{selectedRecording.duration}</span>
              </div>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPct = Math.round((clickX / rect.width) * 100);
                  setSimProgress(Math.max(0, Math.min(100, newPct)));
                }}
                className="w-full bg-[var(--s2)] h-2 rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="bg-[var(--acc)] h-full transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--tx)]">
                <Sparkles className="w-3.5 h-3.5 text-[var(--acc)]" />
                <span>Executive AI Summary</span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-xs sm:text-sm text-[var(--tx)] leading-relaxed">
                {selectedRecording.summary}
              </div>
            </div>

            {/* Action Items Checklist */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[var(--tx)]">Action Items & Deliverables</h4>
              <div className="space-y-2">
                {selectedRecording.keyActionItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--tx)]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--acc)] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Transcript Snippet */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--tx)]">
                <FileText className="w-3.5 h-3.5 text-[var(--mut)]" />
                <span>Searchable Audio Transcript Snippet</span>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--mut)] leading-relaxed">
                &ldquo;{selectedRecording.transcriptSnippet}&rdquo;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
