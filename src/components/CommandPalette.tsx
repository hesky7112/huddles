import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../context/HuddleContext';
import { ViewMode } from '../types';
import {
  Search,
  Radio,
  Headphones,
  FolderGit2,
  Settings,
  Grid,
  Home,
  Plus,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sun,
  Moon,
  X
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    goToView,
    startCall,
    playEpisode,
    episodes,
    recordings,
    micOn,
    setMicOn,
    camOn,
    setCamOn,
    theme,
    setTheme,
    showOutlines,
    setShowOutlines,
    showToast
  } = useHuddle();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { scale: 0.96, opacity: 0, y: -10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }
    }
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Items compilation
  const navigationItems = [
    {
      id: 'nav-home',
      label: 'Go to Home & Discovery',
      category: 'Navigation',
      icon: <Home className="w-4 h-4 text-emerald-400" />,
      action: () => goToView('welcome')
    },
    {
      id: 'nav-start',
      label: 'Go to Green Room & Start Huddle',
      category: 'Navigation',
      icon: <Plus className="w-4 h-4 text-emerald-400" />,
      action: () => goToView('start')
    },
    {
      id: 'nav-live',
      label: 'Jump into Live Collaborative Stage',
      category: 'Navigation',
      icon: <Radio className="w-4 h-4 text-rose-500" />,
      action: () => goToView('live')
    },
    {
      id: 'nav-podcasts',
      label: 'Browse Netflix-style Engineering Podcasts',
      category: 'Navigation',
      icon: <Headphones className="w-4 h-4 text-violet-400" />,
      action: () => goToView('podcasts')
    },
    {
      id: 'nav-library',
      label: 'View Session Recordings & AI Transcripts',
      category: 'Navigation',
      icon: <FolderGit2 className="w-4 h-4 text-sky-400" />,
      action: () => goToView('library')
    },
    {
      id: 'nav-hub',
      label: 'Go to Hub, Team Ballots & Consultations',
      category: 'Navigation',
      icon: <Grid className="w-4 h-4 text-amber-400" />,
      action: () => goToView('hub')
    },
    {
      id: 'nav-settings',
      label: 'Open Settings & Preferences',
      category: 'Navigation',
      icon: <Settings className="w-4 h-4 text-neutral-400" />,
      action: () => goToView('settings')
    }
  ];

  const quickActionItems = [
    {
      id: 'act-mic',
      label: micOn ? 'Mute Microphone (Hardware Kill)' : 'Unmute Microphone',
      category: 'Quick Actions',
      icon: micOn ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setMicOn((p) => !p);
        showToast(micOn ? 'Microphone muted' : 'Microphone active');
      }
    },
    {
      id: 'act-cam',
      label: camOn ? 'Turn Video Camera Off' : 'Turn Video Camera On',
      category: 'Quick Actions',
      icon: camOn ? <VideoOff className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4 text-emerald-400" />,
      action: () => {
        setCamOn((p) => !p);
        showToast(camOn ? 'Camera turned off' : 'Camera active');
      }
    },
    {
      id: 'act-theme',
      label: `Switch Theme to ${theme === 'oled' ? 'Warm Light' : 'OLED Black'}`,
      category: 'Quick Actions',
      icon: theme === 'oled' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />,
      action: () => {
        setTheme(theme === 'oled' ? 'light' : 'oled');
        showToast(`Switched to ${theme === 'oled' ? 'Light' : 'OLED Black'} mode`);
      }
    },
    {
      id: 'act-outlines',
      label: showOutlines ? 'Disable Borders & Outlines' : 'Enable Crisp Outlines',
      category: 'Quick Actions',
      icon: <Settings className="w-4 h-4 text-cyan-400" />,
      action: () => {
        setShowOutlines((p) => !p);
        showToast(showOutlines ? 'Outlines disabled' : 'Outlines enabled');
      }
    }
  ];

  const podcastItems = episodes.map((ep) => ({
    id: `pod-${ep.id}`,
    label: `Play Podcast: ${ep.title} (${ep.speaker})`,
    category: 'Podcasts',
    icon: <Headphones className="w-4 h-4 text-violet-400" />,
    action: () => {
      goToView('podcasts');
      playEpisode(ep.id);
    }
  }));

  const recordingItems = recordings.map((rec) => ({
    id: `rec-${rec.id}`,
    label: `Recording: ${rec.roomName} — ${rec.topic}`,
    category: 'Recordings',
    icon: <FolderGit2 className="w-4 h-4 text-sky-400" />,
    action: () => {
      goToView('library');
    }
  }));

  const allItems = [...navigationItems, ...quickActionItems, ...podcastItems, ...recordingItems];

  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((p) => (p + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((p) => (p - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        selected.action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[75vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[var(--line)]">
          <Search className="w-5 h-5 text-[var(--mut)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, room, podcast, or recording..."
            className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--tx)] outline-none placeholder:text-[var(--mut)]"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="w-7 h-7 rounded-full bg-[var(--s2)] text-[var(--mut)] hover:text-[var(--tx)] grid place-items-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--mut)]">
              No matching commands or rooms found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? 'bg-[var(--tx)] text-[var(--bg)] font-semibold'
                      : 'text-[var(--tx)] hover:bg-[var(--s2)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                      isSelected
                        ? 'bg-[var(--bg)] text-[var(--tx)]'
                        : 'bg-[var(--bg)] text-[var(--mut)] border border-[var(--line)]'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="hidden sm:flex px-5 py-2.5 bg-[var(--s2)] border-t border-[var(--line)] items-center justify-between text-[11px] text-[var(--mut)]">
          <span>Navigate with ↑ ↓ · Select with ↵</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
