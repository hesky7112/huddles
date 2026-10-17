import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ChevronDown,
  Radio
} from 'lucide-react';

const BG_SWATCHES = [
  { id: 'dark', color: '#17171c', label: 'Dark' },
  { id: 'slate', color: '#1d2530', label: 'Slate' },
  { id: 'violet', color: '#7c5cff', label: 'Violet' },
  { id: 'green', color: '#12b574', label: 'Emerald' },
  { id: 'warm', color: '#ff8a57', label: 'Warm' }
];

export const StartView: React.FC = () => {
  const {
    user,
    startCall,
    micOn,
    setMicOn,
    camOn,
    setCamOn,
    roomName: initialRoomName,
    roomTopic: initialTopic,
    linkedBranch: initialBranch
  } = useHuddle();

  // Form states
  const [roomNameInput, setRoomNameInput] = useState(initialRoomName || '#frontend-polish');
  const [topicInput, setTopicInput] = useState(initialTopic || 'Reviewing new motion tokens and components');
  const [branchInput, setBranchInput] = useState(initialBranch || 'feat/huddle-redesign');
  const [roomType, setRoomType] = useState<'open' | 'knock'>('open');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [previewBg, setPreviewBg] = useState(BG_SWATCHES[1].color);
  const [readMoreOpen, setReadMoreOpen] = useState(false);

  // Meter bar heights state
  const [meterBars, setMeterBars] = useState<number[]>(() => Array(20).fill(4));
  const accordionRef = useRef<HTMLDivElement>(null);
  const meterTickerRef = useRef<(() => void) | null>(null);

  // Read more accordion GSAP animation
  useEffect(() => {
    if (!accordionRef.current) return;
    if (readMoreOpen) {
      gsap.to(accordionRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out'
      });
    } else {
      gsap.to(accordionRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in'
      });
    }
  }, [readMoreOpen]);

  // Audio meter reactivity loop using GSAP ticker
  useEffect(() => {
    const onTick = () => {
      if (!micOn) {
        setMeterBars(Array(20).fill(4));
        return;
      }
      if (gsap.ticker.frame % 3 !== 0) return;
      const time = gsap.ticker.time;
      setMeterBars((prev) =>
        prev.map((_, i) => {
          const wave = Math.abs(Math.sin(time * 5 + i * 0.7));
          return 4 + wave * Math.random() * 24;
        })
      );
    };

    meterTickerRef.current = onTick;
    gsap.ticker.add(onTick);
    return () => {
      if (meterTickerRef.current) gsap.ticker.remove(meterTickerRef.current);
    };
  }, [micOn]);

  const handleStart = () => {
    startCall(roomNameInput, topicInput, branchInput);
  };

  const handleJoinWithCode = () => {
    if (!joinCodeInput.trim()) return;
    const clean = joinCodeInput.replace(/^.*\//, '');
    startCall(`#${clean}`, 'Joined via link/code', 'main');
  };

  return (
    <div className="py-4 sm:py-6 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-5 sm:space-y-7">
      {/* Header with Read More accordion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--tx)]">
              Ready when you are
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

        {/* Collapsible details panel */}
        <div
          ref={accordionRef}
          className="overflow-hidden opacity-0 h-0 transition-all text-sm text-[var(--mut)] leading-relaxed max-w-3xl"
        >
          <div className="pt-2 pb-1 bg-[var(--s1)] p-4 rounded-2xl border border-[var(--line)]">
            Check your camera and microphone, pick a preview backdrop, and name your room. Open rooms permit immediate entry from team members; knock-to-join requires host approval. Linking a git branch automatically displays PR diffs and real-time build status inside the room stage.
          </div>
        </div>
      </div>

      {/* Main Grid: Preview on Left, Setup on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
        {/* Left: Preview & Devices */}
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-2xl sm:rounded-[28px] p-4 sm:p-6 flex flex-col justify-between space-y-5 sm:space-y-6">
          {/* Visual stage preview box */}
          <div
            className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-500 shadow-inner border border-white/10"
            style={{ backgroundColor: previewBg }}
          >
            {/* Avatar with speaking ring */}
            <div className="relative grid place-items-center">
              <div
                className={`relative rounded-full p-2.5 transition-all duration-300 ${
                  micOn ? 'animate-speaking-ring' : ''
                }`}
              >
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                  {camOn ? (
                    <Avatar seed={user.avatarSeed} size={112} />
                  ) : (
                    <div className="w-full h-full bg-[var(--s2)] grid place-items-center text-white/50">
                      <VideoOff className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>

              {!micOn && (
                <span className="absolute bottom-2 right-2 bg-[#ff3d57] text-white p-1 rounded-full border-2 border-[var(--bg)] shadow-md">
                  <MicOff className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* Bottom Floating Preview Dock */}
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-xl">
              <button
                onClick={() => setMicOn((prev) => !prev)}
                className={`w-9 h-9 rounded-full grid place-items-center transition-transform hover:scale-110 ${
                  micOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#ff3d57] text-white'
                }`}
                title={micOn ? 'Mute' : 'Unmute'}
              >
                {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setCamOn((prev) => !prev)}
                className={`w-9 h-9 rounded-full grid place-items-center transition-transform hover:scale-110 ${
                  camOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#ff3d57] text-white'
                }`}
                title={camOn ? 'Turn camera off' : 'Turn camera on'}
              >
                {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              {/* Real-time Frequency Meter */}
              <div className="flex items-end gap-1 h-6 px-1.5">
                {meterBars.map((height, idx) => (
                  <span
                    key={idx}
                    className={`w-1 rounded-full bg-[var(--acc)] transition-all duration-75 ${idx >= 10 ? 'hidden sm:block' : ''}`}
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Color Swatches */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-[var(--mut)]">Preview background</span>
            <div className="flex items-center gap-2.5">
              {BG_SWATCHES.map((swatch) => (
                <button
                  key={swatch.id}
                  onClick={() => setPreviewBg(swatch.color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    previewBg === swatch.color ? 'border-[var(--acc)] scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.label}
                />
              ))}
            </div>
          </div>

          {/* Hardware Device Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Camera</label>
              <select className="w-full text-xs font-medium bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2.5 outline-none focus:border-[var(--acc)]">
                <option>FaceTime HD Camera</option>
                <option>OBS Virtual Cam</option>
                <option>External 4K Cam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Microphone</label>
              <select className="w-full text-xs font-medium bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2.5 outline-none focus:border-[var(--acc)]">
                <option>MacBook Pro Microphone</option>
                <option>USB Condenser Mic</option>
                <option>AirPods Pro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Speakers</label>
              <select className="w-full text-xs font-medium bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2.5 outline-none focus:border-[var(--acc)]">
                <option>Headphones (External)</option>
                <option>MacBook Built-in Speakers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Room Configuration */}
        <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Room name</label>
              <input
                type="text"
                value={roomNameInput}
                onChange={(e) => setRoomNameInput(e.target.value)}
                placeholder="#channel-name"
                className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--acc)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Topic / Agenda</label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="What are we solving today?"
                className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--acc)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Linked branch</label>
              <input
                type="text"
                value={branchInput}
                onChange={(e) => setBranchInput(e.target.value)}
                placeholder="feat/branch-name"
                className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-[var(--acc)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Access control</label>
              <div className="grid grid-cols-2 p-1 bg-[var(--bg)] border border-[var(--line)] rounded-xl">
                <button
                  type="button"
                  onClick={() => setRoomType('open')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    roomType === 'open' ? 'bg-[var(--tx)] text-[var(--bg)] shadow' : 'text-[var(--mut)]'
                  }`}
                >
                  Open to all
                </button>
                <button
                  type="button"
                  onClick={() => setRoomType('knock')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    roomType === 'knock' ? 'bg-[var(--tx)] text-[var(--bg)] shadow' : 'text-[var(--mut)]'
                  }`}
                >
                  Knock to join
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={handleStart}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-full font-bold bg-[var(--acc)] text-[var(--acc-ink)] hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg text-base"
            >
              <Radio className="w-5 h-5" />
              <span>Start instant huddle</span>
            </button>

            <div className="pt-2 border-t border-[var(--line)]">
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">
                Or join with room link or code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="huddle.app/r/xxxx or code"
                  className="flex-1 bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--acc)]"
                />
                <button
                  onClick={handleJoinWithCode}
                  className="px-4 py-2.5 rounded-xl bg-[var(--s2)] text-[var(--tx)] border border-[var(--line)] text-xs font-semibold hover:bg-[var(--tx)] hover:text-[var(--bg)] transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
