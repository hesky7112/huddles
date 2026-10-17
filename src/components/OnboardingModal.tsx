import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../context/HuddleContext';
import { Avatar } from '../utils/avatar';
import { Shuffle } from 'lucide-react';

const ACCENT_COLORS = ['#2be08f', '#8f7bff', '#ff8a57', '#3db8ff', '#ff5c9d'];

export const OnboardingModal: React.FC = () => {
  const {
    onboardingOpen,
    setOnboardingOpen,
    user,
    setUser,
    shuffleAvatar,
    theme,
    setTheme,
    accentColor,
    setAccentColor,
    goToView
  } = useHuddle();

  const [step, setStep] = useState(0);
  const [meterBars, setMeterBars] = useState<number[]>(() => Array(20).fill(6));
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Meter reactive ticker for step 3
  useEffect(() => {
    if (!onboardingOpen || step !== 3) return;
    const ticker = () => {
      if (gsap.ticker.frame % 3 !== 0) return;
      const t = gsap.ticker.time;
      setMeterBars((prev) =>
        prev.map((_, i) => 6 + Math.abs(Math.sin(t * 4 + i * 0.6)) * Math.random() * 55)
      );
    };
    gsap.ticker.add(ticker);
    return () => gsap.ticker.remove(ticker);
  }, [onboardingOpen, step]);

  // Animate step transitions
  useEffect(() => {
    if (bodyRef.current) {
      gsap.fromTo(
        bodyRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: 'power3.out' }
      );
    }
  }, [step]);

  if (!onboardingOpen) return null;

  const handleFinish = () => {
    try {
      localStorage.setItem('huddle_ob_done', 'true');
    } catch {
      // ignore
    }
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.35,
        onComplete: () => {
          setOnboardingOpen(false);
          goToView('welcome');
        }
      });
    } else {
      setOnboardingOpen(false);
      goToView('welcome');
    }
  };

  const stepsCount = 4;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[var(--bg)]/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-md text-center space-y-6">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {Array.from({ length: stepsCount }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'w-8 bg-[var(--acc)]' : 'w-4 bg-[var(--line)]'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div ref={bodyRef} className="space-y-5">
          {step === 0 && (
            <>
              <div className="w-20 h-20 rounded-3xl bg-[var(--acc)] text-[var(--acc-ink)] font-extrabold text-4xl grid place-items-center mx-auto shadow-2xl">
                h
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--tx)]">
                Welcome to{' '}
                <em className="not-italic bg-gradient-to-r from-[var(--acc)] to-[var(--vio)] bg-clip-text text-transparent">
                  Huddles
                </em>
              </h2>
              <p className="text-sm text-[var(--mut)] max-w-xs mx-auto leading-relaxed">
                Talk, stream your screen, vote and ship—all inside one persistent, floating room.
              </p>
            </>
          )}

          {step === 1 && (
            <>
              <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[var(--acc)] shadow-xl p-1">
                <Avatar seed={user.avatarSeed} size={104} />
              </div>
              <h2 className="text-2xl font-extrabold text-[var(--tx)]">Who is joining?</h2>
              <div className="text-left space-y-2 max-w-xs mx-auto">
                <label className="block text-xs font-semibold text-[var(--mut)]">Display name</label>
                <input
                  type="text"
                  value={user.name === 'You' ? '' : user.name}
                  onChange={(e) => setUser((p) => ({ ...p, name: e.target.value.trim() || 'You' }))}
                  placeholder="Your Name"
                  className="w-full bg-[var(--s1)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[var(--acc)]"
                />
              </div>
              <button
                onClick={shuffleAvatar}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--s2)] text-xs font-semibold text-[var(--tx)] hover:bg-[var(--line)] transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle avatar</span>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-extrabold text-[var(--tx)]">Pick your look</h2>
              <div className="grid grid-cols-2 p-1 bg-[var(--s1)] border border-[var(--line)] rounded-xl max-w-xs mx-auto">
                <button
                  onClick={() => setTheme('oled')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    theme === 'oled' ? 'bg-[var(--tx)] text-[var(--bg)]' : 'text-[var(--mut)]'
                  }`}
                >
                  OLED black
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                    theme === 'light' ? 'bg-[var(--tx)] text-[var(--bg)]' : 'text-[var(--mut)]'
                  }`}
                >
                  Warm light
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-[var(--mut)]">Accent colour</span>
                <div className="flex items-center justify-center gap-3">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                        accentColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-extrabold text-[var(--tx)]">Test your microphone</h2>
              {/* Frequency audio meter */}
              <div className="flex items-end justify-center gap-1.5 h-20 py-2">
                {meterBars.map((height, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 rounded-full bg-[var(--acc)] transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
              <p className="text-xs text-[var(--mut)] max-w-xs mx-auto">
                Your microphone and video preview stay local until you decide to join a room.
              </p>
            </>
          )}
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--line)]">
          <button
            onClick={() => setStep((p) => Math.max(0, p - 1))}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold text-[var(--mut)] hover:text-[var(--tx)] transition-colors ${
              step === 0 ? 'invisible' : 'visible'
            }`}
          >
            Back
          </button>

          <button
            onClick={() => {
              if (step < stepsCount - 1) {
                setStep((p) => p + 1);
              } else {
                handleFinish();
              }
            }}
            className="px-6 py-2.5 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {step === stepsCount - 1 ? "Let's go" : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
