import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../context/HuddleContext';
import { Avatar } from '../utils/avatar';
import { Mic, MicOff, Video, VideoOff, Maximize2, PhoneOff } from 'lucide-react';

export const FloatingMiniPlayer: React.FC = () => {
  const {
    inCall,
    currentView,
    goToView,
    roomName,
    callDuration,
    participants,
    activeSpeakerId,
    micOn,
    setMicOn,
    camOn,
    setCamOn,
    leaveCall
  } = useHuddle();

  const containerRef = useRef<HTMLDivElement>(null);

  // Animate mini-player in when not in 'live' view and inCall
  const isVisible = inCall && currentView !== 'live';

  useEffect(() => {
    if (isVisible && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.4)' }
      );
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeSpeaker =
    activeSpeakerId === 'me'
      ? { name: 'You', avatarSeed: 'You' }
      : participants.find((p) => p.id === activeSpeakerId) || participants[0];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-80 max-w-[calc(100vw-24px)] z-40 bg-[var(--s1)]/95 backdrop-blur-md border border-[var(--line)] shadow-2xl rounded-2xl p-3 flex items-center gap-2.5 sm:gap-3 transition-all hover:border-[var(--acc)] group select-none"
    >
      {/* Active speaker avatar with speaking pulse */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--acc)] ring-2 ring-[var(--acc)]/30 animate-pulse">
          <Avatar seed={activeSpeaker?.avatarSeed || 'You'} size={48} />
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[var(--acc)] rounded-full border-2 border-[var(--s1)]" />
      </div>

      {/* Room Details & Speaking info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => goToView('live')}>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ff3d57] animate-live-pulse" />
          <p className="text-xs font-bold truncate text-[var(--tx)]">{roomName}</p>
        </div>
        <p className="text-[11px] text-[var(--mut)] truncate">
          {activeSpeaker?.name} is speaking · <span className="tabular-nums font-mono">{formatTime(callDuration)}</span>
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setMicOn((prev) => !prev)}
          title={micOn ? 'Mute Mic' : 'Unmute Mic'}
          className={`w-8 h-8 rounded-full grid place-items-center transition-colors ${
            micOn ? 'bg-[var(--s2)] text-[var(--tx)] hover:bg-[var(--line)]' : 'bg-[#ff3d57] text-white'
          }`}
        >
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setCamOn((prev) => !prev)}
          title={camOn ? 'Turn Camera Off' : 'Turn Camera On'}
          className={`w-8 h-8 rounded-full grid place-items-center transition-colors ${
            camOn ? 'bg-[var(--s2)] text-[var(--tx)] hover:bg-[var(--line)]' : 'bg-[#ff3d57] text-white'
          }`}
        >
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => goToView('live')}
          title="Expand to Full Stage"
          className="w-8 h-8 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center hover:scale-105 transition-transform"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={leaveCall}
          title="Leave Call"
          className="w-8 h-8 rounded-full bg-[var(--s2)] hover:bg-[#ff3d57] text-[var(--mut)] hover:text-white grid place-items-center transition-colors"
        >
          <PhoneOff className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
