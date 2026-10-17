import React, { useState } from 'react';
import { useHuddle } from '../context/HuddleContext';
import { X } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authOpen, setAuthOpen, loginUser } = useHuddle();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!authOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please provide your name.');
      return;
    }

    loginUser(name.trim() || email.split('@')[0], email.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 w-full max-w-sm space-y-5 shadow-2xl relative">
        <button
          onClick={() => setAuthOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--s2)] text-[var(--tx)] grid place-items-center hover:bg-[var(--line)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[var(--acc)] text-[var(--acc-ink)] font-extrabold text-2xl grid place-items-center mx-auto mb-3">
            h
          </div>
          <h3 className="font-extrabold text-xl text-[var(--tx)]">
            {mode === 'signin' ? 'Welcome back' : 'Join Huddles'}
          </h3>
          <p className="text-xs text-[var(--mut)]">Sign in to vote, pay, tip, and book consultations.</p>
        </div>

        {/* Mode switcher */}
        <div className="grid grid-cols-2 p-1 bg-[var(--bg)] border border-[var(--line)] rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'signin' ? 'bg-[var(--tx)] text-[var(--bg)] shadow' : 'text-[var(--mut)]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'signup' ? 'bg-[var(--tx)] text-[var(--bg)] shadow' : 'text-[var(--mut)]'
            }`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[var(--acc)]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Work email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.dev"
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>

          {error && <p className="text-xs text-[#ff3d57] font-semibold">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAuthOpen(false)}
              className="flex-1 py-2.5 rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--mut)] hover:bg-[var(--s2)] transition-colors"
            >
              Not now
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-102 transition-transform shadow-md"
            >
              {mode === 'signin' ? 'Sign in' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
