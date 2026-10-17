import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import { RoomPreset } from '../../types';
import {
  Radio,
  Play,
  Zap,
  PictureInPicture,
  Mic,
  ArrowRight
} from 'lucide-react';

const GRADIENTS = [
  'from-[#7c5cff] to-[#2be08f]',
  'from-[#ff8a57] to-[#c2185b]',
  'from-[#1fa2ff] to-[#12d8fa]',
  'from-[#f5576c] to-[#f093fb]',
  'from-[#11998e] to-[#38ef7d]',
  'from-[#fc4a1a] to-[#f7b733]'
];

const ROOMS_DATA: RoomPreset[] = [
  {
    id: 'r1',
    name: '#hotfix-war-room',
    topic: 'prod-4412 memory leak · 7 in room',
    branch: 'fix/prod-leak-4412',
    memberCount: 7,
    gradient: GRADIENTS[0],
    isLive: true
  },
  {
    id: 'r2',
    name: '#standup-sync',
    topic: 'Daily engineering sync · 12 in room',
    branch: 'main',
    memberCount: 12,
    gradient: GRADIENTS[1],
    isLive: true
  },
  {
    id: 'r3',
    name: '#design-crit',
    topic: 'Figma interactive critique · 5 in room',
    branch: 'feat/v2-components',
    memberCount: 5,
    gradient: GRADIENTS[2],
    isLive: true
  },
  {
    id: 'r4',
    name: '#arch-review',
    topic: 'RFC-19 Audio Engine & Pipeline · 9 in room',
    branch: 'feat/huddle-redesign',
    memberCount: 9,
    gradient: GRADIENTS[3],
    isLive: true
  },
  {
    id: 'r5',
    name: '#late-night-lofi',
    topic: 'Pair programming & ambient music · 4 in room',
    branch: 'exp/audio-spatial',
    memberCount: 4,
    gradient: GRADIENTS[4],
    isLive: true
  }
];

const STREAMS_DATA: RoomPreset[] = [
  {
    id: 's1',
    name: 'Shipping the redesign',
    topic: 'Amara is presenting code · 42 watching',
    branch: 'feat/huddle-redesign',
    memberCount: 42,
    gradient: GRADIENTS[5],
    isLive: true,
    presenter: 'Amara',
    presenterAction: 'Sharing screen'
  },
  {
    id: 's2',
    name: 'Debugging the render loop',
    topic: 'Kofi · 38 watching',
    branch: 'fix/render-cycle',
    memberCount: 38,
    gradient: GRADIENTS[0],
    isLive: true,
    presenter: 'Kofi'
  },
  {
    id: 's3',
    name: 'Code review: WebRTC pipeline',
    topic: 'Lena · 21 watching',
    branch: 'rfc/19-webrtc',
    memberCount: 21,
    gradient: GRADIENTS[1],
    isLive: true,
    presenter: 'Lena'
  },
  {
    id: 's4',
    name: 'Zero to deploy in 20 min',
    topic: 'Dev · 64 watching',
    branch: 'infra/cloud-run',
    memberCount: 64,
    gradient: GRADIENTS[2],
    isLive: true,
    presenter: 'Dev'
  }
];

const PRESETS = [
  'hotfix-war-room',
  'frontend-polish',
  'standup-sync',
  'architecture-review',
  'pair-programming'
];

export const WelcomeView: React.FC = () => {
  const { goToView, startCall } = useHuddle();
  const heroRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gentle ambient floating animation for hero mesh blobs
    if (blob1Ref.current && blob2Ref.current) {
      gsap.to(blob1Ref.current, {
        x: '+=30',
        y: '-=20',
        scale: 1.1,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
      gsap.to(blob2Ref.current, {
        x: '-=25',
        y: '+=25',
        scale: 0.95,
        duration: 5.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }

    if (contentRef.current) {
      gsap.from(contentRef.current.querySelectorAll('.stagger-card'), {
        y: 25,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'power3.out'
      });
    }
  }, []);

  const handleCardClick = (room: RoomPreset) => {
    // Smooth transition into the room
    startCall(room.name, room.topic, room.branch);
  };

  return (
    <div ref={contentRef} className="py-4 sm:py-6 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-9">
      {/* Hero Banner */}
      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-14 bg-[var(--s1)] border border-[var(--line)] shadow-xl isolate"
      >
        {/* Animated Glow Blobs */}
        <div
          ref={blob1Ref}
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[var(--acc)] opacity-35 filter blur-[70px] pointer-events-none -z-10"
        />
        <div
          ref={blob2Ref}
          className="absolute right-36 -bottom-24 w-72 h-72 rounded-full bg-[var(--vio)] opacity-35 filter blur-[70px] pointer-events-none -z-10"
        />

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.02] sm:leading-[0.98] max-w-2xl text-[var(--tx)] mb-3 sm:mb-4">
          Calls that{' '}
          <em className="not-italic bg-gradient-to-r from-[var(--acc)] via-[#41e8ad] to-[var(--vio)] bg-clip-text text-transparent">
            follow you.
          </em>
        </h1>

        <p className="text-[var(--mut)] text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-6 sm:mb-8">
          Drop into a room, stream your screen, and keep building. Your huddle floats with you across the whole app, with zero interruptions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-3.5">
          <button
            onClick={() => goToView('start')}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold bg-[var(--acc)] text-[var(--acc-ink)] hover:scale-105 active:scale-95 transition-all shadow-lg w-full sm:w-auto"
          >
            <Radio className="w-5 h-5" />
            <span>Start a huddle</span>
          </button>

          <button
            onClick={() => goToView('live')}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold bg-[var(--s2)] text-[var(--tx)] border border-[var(--line)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
          >
            <Play className="w-4 h-4" />
            <span>Peek at a live room</span>
          </button>
        </div>
      </div>

      {/* 3 Key Feature Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stagger-card bg-[var(--s1)] border border-[var(--line)] rounded-[22px] p-6 hover:border-[var(--acc)]/40 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-[var(--s2)] text-[var(--acc)] grid place-items-center mb-4">
            <PictureInPicture className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[var(--tx)] text-base mb-1.5">Floating mini-player</h3>
          <p className="text-sm text-[var(--mut)] leading-relaxed">
            Minimize your live call and keep collaborating while navigating documentation, votes, and maps.
          </p>
        </div>

        <div className="stagger-card bg-[var(--s1)] border border-[var(--line)] rounded-[22px] p-6 hover:border-[var(--acc)]/40 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-[var(--s2)] text-[var(--acc)] grid place-items-center mb-4">
            <Mic className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[var(--tx)] text-base mb-1.5">Real hardware mute</h3>
          <p className="text-sm text-[var(--mut)] leading-relaxed">
            Zero fake mutes. When muted, your audio stream is physically released at the driver layer.
          </p>
        </div>

        <div className="stagger-card bg-[var(--s1)] border border-[var(--line)] rounded-[22px] p-6 hover:border-[var(--acc)]/40 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-[var(--s2)] text-[var(--acc)] grid place-items-center mb-4">
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[var(--tx)] text-base mb-1.5">One-tap expand or leave</h3>
          <p className="text-sm text-[var(--mut)] leading-relaxed">
            Return to the full collaborative stage with a single tap, or exit instantly with no confirmation traps.
          </p>
        </div>
      </div>

      {/* Live Now Carousel */}
      <div className="space-y-3.5">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#ff3d57] animate-live-pulse" />
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--tx)]">Live now</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-none -mx-4 px-4 md:-mx-8 md:px-8">
          {ROOMS_DATA.map((room, idx) => (
            <div
              key={room.id}
              onClick={() => handleCardClick(room)}
              className={`stagger-card group relative flex-none w-[210px] sm:w-[240px] h-[280px] sm:h-[310px] rounded-[22px] p-5 overflow-hidden flex flex-col justify-end bg-gradient-to-br ${room.gradient} text-white cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl select-none`}
            >
              {/* Overlay gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-0" />

              {/* Live Pill */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-[#ff3d57] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-pulse" />
                <span>LIVE</span>
              </div>

              {/* Hover play button */}
              <div className="absolute right-4 bottom-4 z-20 w-11 h-11 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>

              {/* Card Meta */}
              <div className="relative z-10 space-y-1">
                <h3 className="font-bold text-lg leading-snug">{room.name}</h3>
                <p className="text-xs text-white/80 line-clamp-1">{room.topic}</p>

                {/* Avatar stack */}
                <div className="flex items-center pt-2">
                  {[0, 1, 2, 3].map((avIdx) => {
                    const seed = ['Amara', 'Kofi', 'Lena', 'Dev', 'Zuri'][(idx + avIdx) % 5];
                    return (
                      <div
                        key={avIdx}
                        className="-ml-2 first:ml-0 rounded-full border-2 border-black/50 overflow-hidden"
                      >
                        <Avatar seed={seed} size={28} />
                      </div>
                    );
                  })}
                  <span className="text-[11px] text-white/70 ml-2 font-medium">+{room.memberCount} in room</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streams For You Carousel */}
      <div className="space-y-3.5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--tx)]">Streams for you</h2>

        <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-none -mx-4 px-4 md:-mx-8 md:px-8">
          {STREAMS_DATA.map((stream, idx) => (
            <div
              key={stream.id}
              onClick={() => handleCardClick(stream)}
              className={`stagger-card group relative flex-none w-[260px] sm:w-[320px] h-[190px] sm:h-[210px] rounded-[22px] p-5 overflow-hidden flex flex-col justify-end bg-gradient-to-br ${stream.gradient} text-white cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl select-none`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent z-0" />

              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--acc)] animate-pulse" />
                <span>Screen Share</span>
              </div>

              <div className="absolute right-4 bottom-4 z-20 w-10 h-10 rounded-full bg-white text-black grid place-items-center shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className="font-bold text-lg leading-snug">{stream.name}</h3>
                <p className="text-xs text-white/80">{stream.topic}</p>

                <div className="flex items-center gap-2 pt-2">
                  <Avatar seed={stream.presenter || 'Dev'} size={24} />
                  <span className="text-xs font-semibold text-white/90">{stream.presenter}</span>
                  <span className="text-[11px] text-white/60">· branch {stream.branch}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Chips */}
      <div className="space-y-3.5 pb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--tx)]">Quick launch</h2>

        <div className="flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                startCall(`#${preset}`, `Ad-hoc sync for ${preset}`, `feat/${preset}`);
              }}
              className="stagger-card inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--s1)] border border-[var(--line)] text-sm font-semibold text-[var(--tx)] hover:bg-[var(--tx)] hover:text-[var(--bg)] transition-all active:scale-95 shadow-sm"
            >
              <Zap className="w-4 h-4 text-[var(--acc)]" />
              <span>#{preset}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
