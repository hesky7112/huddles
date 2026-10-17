import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../context/HuddleContext';
import { ViewMode } from '../types';
import {
  Home,
  Plus,
  Radio,
  Headphones,
  FolderGit2,
  Grid,
  Settings,
  Sun,
  Moon,
  Search
} from 'lucide-react';

export const NavigationRail: React.FC = () => {
  const { currentView, goToView, inCall, theme, setTheme, setCommandPaletteOpen } = useHuddle();
  const railRef = useRef<HTMLElement>(null);
  const indRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<{ [key in ViewMode]?: HTMLButtonElement | null }>({});

  // Slide and morph active indicator behind the active button
  useEffect(() => {
    const updateIndicator = () => {
      const activeBtn = btnRefs.current[currentView];
      const rail = railRef.current;
      const ind = indRef.current;

      if (activeBtn && rail && ind) {
        const railRect = rail.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();

        gsap.to(ind, {
          x: btnRect.left - railRect.left,
          y: btnRect.top - railRect.top,
          width: btnRect.width,
          height: btnRect.height,
          duration: 0.45,
          ease: 'back.out(1.4)'
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentView]);

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; showLiveBadge?: boolean }[] = [
    { id: 'welcome', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'start', label: 'Start Room', icon: <Plus className="w-5 h-5" /> },
    {
      id: 'live',
      label: 'Live Stage',
      icon: <Radio className="w-5 h-5" />,
      showLiveBadge: inCall
    },
    { id: 'podcasts', label: 'Podcasts', icon: <Headphones className="w-5 h-5" /> },
    { id: 'library', label: 'Recordings', icon: <FolderGit2 className="w-5 h-5" /> },
    { id: 'hub', label: 'Hub & Voting', icon: <Grid className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'oled' ? 'light' : 'oled');
  };

  return (
    <nav
      ref={railRef}
      className="relative flex md:flex-col items-center justify-between md:justify-start gap-1 sm:gap-2 px-1.5 py-1 sm:px-2.5 sm:py-2 md:py-4 md:px-0 md:w-[76px] w-full shrink-0 border-t md:border-t-0 md:border-r border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-xl z-30 transition-colors md:pb-4"
    >
      {/* Moving active indicator pill */}
      <div
        ref={indRef}
        className="absolute top-0 left-0 bg-[var(--tx)] rounded-2xl pointer-events-none z-0"
        style={{ width: 44, height: 44 }}
      />

      {/* Brand Logo (desktop) */}
      <div
        onClick={() => goToView('welcome')}
        className="hidden md:grid w-11 h-11 rounded-2xl bg-[var(--acc)] text-[var(--acc-ink)] place-items-center font-extrabold text-xl mb-1 cursor-pointer select-none shadow-md hover:scale-105 transition-transform"
      >
        h
      </div>

      {/* Quick Search / Command Palette shortcut (desktop) */}
      <button
        onClick={() => setCommandPaletteOpen(true)}
        title="Quick Search & Command Palette (Cmd+K)"
        className="hidden md:grid w-10 h-10 rounded-xl bg-[var(--s1)] border border-[var(--line)] place-items-center text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s2)] transition-colors mb-2"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Navigation Buttons */}
      <div className="flex md:flex-col items-center justify-around md:justify-start w-full gap-0.5 sm:gap-1.5 relative z-10 overflow-x-auto md:overflow-x-visible scrollbar-none">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              ref={(el) => {
                btnRefs.current[item.id] = el;
              }}
              onClick={() => goToView(item.id)}
              title={item.label}
              className={`group relative flex md:flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl transition-all duration-200 shrink-0 ${
                isActive
                  ? 'text-[var(--bg)]'
                  : 'text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s1)]'
              }`}
            >
              <span className="scale-90 sm:scale-100">{item.icon}</span>

              {/* Pulsing live badge for live calls */}
              {item.showLiveBadge && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#ff3d57] border-2 border-[var(--bg)] animate-live-pulse" />
              )}

              {/* Desktop hover tooltip */}
              <span className="hidden md:block absolute left-16 bg-[var(--tx)] text-[var(--bg)] px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none -translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-lg">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="hidden md:block flex-1" />

      {/* Theme Toggle Button */}
      <div className="relative z-10 flex items-center shrink-0">
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'oled' ? 'Light' : 'OLED Black'} mode`}
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-2xl grid place-items-center text-[var(--mut)] hover:text-[var(--tx)] hover:bg-[var(--s1)] transition-colors"
        >
          {theme === 'oled' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>
    </nav>
  );
};
