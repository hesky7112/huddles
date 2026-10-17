import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import {
  Shuffle,
  ChevronDown,
  Play
} from 'lucide-react';

const ACCENT_COLORS = [
  { hex: '#2be08f', name: 'Emerald' },
  { hex: '#8f7bff', name: 'Violet' },
  { hex: '#ff8a57', name: 'Orange' },
  { hex: '#3db8ff', name: 'Sky' },
  { hex: '#ff5c9d', name: 'Pink' }
];

export const SettingsView: React.FC = () => {
  const {
    user,
    setUser,
    shuffleAvatar,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    showOutlines,
    setShowOutlines,
    noiseSuppression,
    setNoiseSuppression,
    echoCancellation,
    setEchoCancellation,
    mirrorCam,
    setMirrorCam,
    hardwareMute,
    setHardwareMute,
    notifMentions,
    setNotifMentions,
    notifInvites,
    setNotifInvites,
    notifSounds,
    setNotifSounds,
    allowAttachments,
    setAllowAttachments,
    allowPolls,
    setAllowPolls,
    reduceMotion,
    setReduceMotion,
    setOnboardingOpen
  } = useHuddle();

  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const avatarWrapperRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Accordion animation
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

  const handleShuffleAvatar = () => {
    shuffleAvatar();
    if (avatarWrapperRef.current) {
      gsap.fromTo(
        avatarWrapperRef.current,
        { rotate: -25, scale: 0.8 },
        { rotate: 0, scale: 1, duration: 0.55, ease: 'back.out(2)' }
      );
    }
  };

  const ToggleRow: React.FC<{
    label: string;
    sublabel: string;
    checked: boolean;
    onChange: () => void;
  }> = ({ label, sublabel, checked, onChange }) => (
    <label className="flex items-center justify-between py-3 border-t border-[var(--line)] cursor-pointer select-none">
      <div className="pr-4">
        <p className="font-bold text-xs text-[var(--tx)]">{label}</p>
        <p className="text-[11px] text-[var(--mut)]">{sublabel}</p>
      </div>
      <div
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
          checked ? 'bg-[var(--acc)]' : 'bg-[var(--s2)] border border-[var(--line)]'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 absolute top-0.5 left-0.5 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );

  return (
    <div className="py-4 sm:py-6 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-5 sm:space-y-7">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--tx)]">
              Make it yours
            </h2>
          </div>

          <button
            onClick={() => setReadMoreOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border border-[var(--line)] text-xs sm:text-sm font-semibold text-[var(--tx)] hover:bg-[var(--s2)] transition-colors shrink-0"
          >
            <span>{readMoreOpen ? 'Show less' : 'Read more'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${readMoreOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Accordion */}
        <div
          ref={accordionRef}
          className="overflow-hidden opacity-0 h-0 transition-all text-sm text-[var(--mut)] leading-relaxed max-w-3xl"
        >
          <div className="bg-[var(--s1)] p-4 rounded-2xl border border-[var(--line)]">
            Changes apply instantly on this device. Audio and video choices are remembered for your next huddle session, and hardware mute physically shuts down the microphone driver when muted.
          </div>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Profile */}
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-base text-[var(--tx)]">Profile</h3>

          <div className="flex items-center gap-3 sm:gap-4">
            <div ref={avatarWrapperRef} className="shrink-0">
              <Avatar seed={user.avatarSeed} size={64} />
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <div>
                <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Display name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)] font-medium"
                />
              </div>

              <button
                onClick={handleShuffleAvatar}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--s2)] border border-[var(--line)] text-xs font-semibold text-[var(--tx)] hover:bg-[var(--tx)] hover:text-[var(--bg)] transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle avatar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Appearance & Accent Color */}
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] p-4 sm:p-6 space-y-4">
          <h3 className="font-bold text-base text-[var(--tx)]">Appearance</h3>

          {/* Theme switcher */}
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Theme mode</label>
            <div className="grid grid-cols-2 p-1 bg-[var(--bg)] border border-[var(--line)] rounded-xl">
              <button
                type="button"
                onClick={() => setTheme('oled')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  theme === 'oled' ? 'bg-[var(--tx)] text-[var(--bg)] shadow' : 'text-[var(--mut)]'
                }`}
              >
                OLED black
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  theme === 'light' ? 'bg-[var(--tx)] text-[var(--bg)] shadow' : 'text-[var(--mut)]'
                }`}
              >
                Warm light
              </button>
            </div>
          </div>

          {/* Accent Color Swatches */}
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-2">Accent colour</label>
            <div className="flex items-center gap-3">
              {ACCENT_COLORS.map((col) => (
                <button
                  key={col.hex}
                  onClick={() => setAccentColor(col.hex)}
                  className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                    accentColor === col.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>
          </div>

          {/* Outlines Toggle */}
          <div className="pt-1">
            <ToggleRow
              label="Borders & outlines"
              sublabel="Display crisp border outlines around cards, panels, and controls"
              checked={showOutlines}
              onChange={() => setShowOutlines(!showOutlines)}
            />
          </div>
        </div>

        {/* Audio & Video Controls */}
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] p-4 sm:p-6">
          <h3 className="font-bold text-base text-[var(--tx)] mb-2">Audio & video</h3>
          <div className="divide-y-0">
            <ToggleRow
              label="Noise suppression"
              sublabel="Deep neural filtering for typing and ambient fan noise"
              checked={noiseSuppression}
              onChange={() => setNoiseSuppression(!noiseSuppression)}
            />
            <ToggleRow
              label="Echo cancellation"
              sublabel="Stops feedback loops in open conference rooms"
              checked={echoCancellation}
              onChange={() => setEchoCancellation(!echoCancellation)}
            />
            <ToggleRow
              label="Mirror camera"
              sublabel="Flips selfie preview horizontally"
              checked={mirrorCam}
              onChange={() => setMirrorCam(!mirrorCam)}
            />
            <ToggleRow
              label="Hardware mute"
              sublabel="Releases physical microphone device handle when muted"
              checked={hardwareMute}
              onChange={() => setHardwareMute(!hardwareMute)}
            />
          </div>
        </div>

        {/* Notifications & Privacy */}
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[var(--tx)] mb-2">Notifications & Privacy</h3>
            <ToggleRow
              label="Mentions & polls"
              sublabel="Send desktop notifications for active room polls and @mentions"
              checked={notifMentions}
              onChange={() => setNotifMentions(!notifMentions)}
            />
            <ToggleRow
              label="Room invites"
              sublabel="Alert when teammates initiate or knock on rooms"
              checked={notifInvites}
              onChange={() => setNotifInvites(!notifInvites)}
            />
            <ToggleRow
              label="Sound chimes"
              sublabel="Play chime sound when members join or leave"
              checked={notifSounds}
              onChange={() => setNotifSounds(!notifSounds)}
            />
            <ToggleRow
              label="Reduce motion"
              sublabel="Calmer, near-instant animations across views"
              checked={reduceMotion}
              onChange={() => setReduceMotion(!reduceMotion)}
            />
          </div>

          <div className="pt-4 mt-2 border-t border-[var(--line)]">
            <button
              onClick={() => setOnboardingOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--s2)] text-[var(--tx)] border border-[var(--line)] text-xs font-semibold hover:bg-[var(--tx)] hover:text-[var(--bg)] transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Replay onboarding tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
