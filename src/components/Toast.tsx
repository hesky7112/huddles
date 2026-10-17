import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../context/HuddleContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useHuddle();
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastMessage && toastRef.current) {
      gsap.fromTo(
        toastRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' }
      );
    }
  }, [toastMessage]);

  if (!toastMessage) return null;

  return (
    <div
      ref={toastRef}
      className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[var(--tx)] text-[var(--bg)] px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl pointer-events-none select-none flex items-center gap-2 border border-black/10 max-w-[calc(100vw-32px)]"
    >
      <span className="w-2 h-2 rounded-full bg-[var(--acc)] shrink-0" />
      <span className="truncate">{toastMessage}</span>
    </div>
  );
};
