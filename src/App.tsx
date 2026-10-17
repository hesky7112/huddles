import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { HuddleProvider, useHuddle } from './context/HuddleContext';
import { NavigationRail } from './components/NavigationRail';
import { WelcomeView } from './components/views/WelcomeView';
import { StartView } from './components/views/StartView';
import { LiveRoomView } from './components/views/LiveRoomView';
import { PodcastsView } from './components/views/PodcastsView';
import { LibraryView } from './components/views/LibraryView';
import { HubView } from './components/views/HubView';
import { SettingsView } from './components/views/SettingsView';
import { FloatingMiniPlayer } from './components/FloatingMiniPlayer';
import { FloatingPodcastPlayer } from './components/FloatingPodcastPlayer';
import { SpotifyPlayerBar } from './components/SpotifyPlayerBar';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { CommandPalette } from './components/CommandPalette';

const AppContent: React.FC = () => {
  const { currentView } = useHuddle();
  const mainRef = useRef<HTMLElement>(null);

  // Smooth entrance transition on view change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
      );
    }
  }, [currentView]);

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-screen overflow-hidden bg-[var(--bg)] text-[var(--tx)]">
      {/* Navigation rail: on left for desktop, at bottom for mobile */}
      <NavigationRail />

      {/* Main View Area: clearance for bottom player only on podcasts page */}
      <main
        ref={mainRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden relative min-h-0 ${
          currentView === 'podcasts' ? 'md:pb-[92px] pb-[80px]' : 'md:pb-0 pb-6'
        }`}
      >
        {currentView === 'welcome' && <WelcomeView />}
        {currentView === 'start' && <StartView />}
        {currentView === 'live' && <LiveRoomView />}
        {currentView === 'podcasts' && <PodcastsView />}
        {currentView === 'library' && <LibraryView />}
        {currentView === 'hub' && <HubView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      {/* Persistent PiP Floating Mini-Player for active video calls */}
      <FloatingMiniPlayer />

      {/* Persistent Floating Mini-Player for podcast playback when outside podcasts page */}
      <FloatingPodcastPlayer />

      {/* Sleek Google-Standard Audio Player Bar (only visible on podcasts page) */}
      <SpotifyPlayerBar />

      {/* Onboarding, Auth, Command Palette, and Global Toast */}
      <OnboardingModal />
      <AuthModal />
      <CommandPalette />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <HuddleProvider>
      <AppContent />
    </HuddleProvider>
  );
}
