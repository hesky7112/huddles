import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import { HubTab } from '../../types';
import {
  Vote,
  Play,
  Wallet,
  Calendar,
  Pause,
  ChevronDown
} from 'lucide-react';

const TABS: { id: HubTab; label: string; icon: React.ReactNode }[] = [
  { id: 'vote', label: 'Vote', icon: <Vote className="w-4 h-4" /> },
  { id: 'watch', label: 'Watch party', icon: <Play className="w-4 h-4" /> },
  { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
  { id: 'book', label: 'Consult', icon: <Calendar className="w-4 h-4" /> }
];

export const HubView: React.FC = () => {
  const {
    hubTab,
    setHubTab,
    user,
    ballots,
    voteBallot,
    createBallot,
    watchPlaying,
    setWatchPlaying,
    watchProgress,
    setWatchProgress,
    watchReactions,
    addWatchReaction,
    balance,
    discount,
    walletHistory,
    redeemVoucher,
    sendGift,
    tipHost,
    experts,
    bookings,
    bookExpert,
    joinConsultationRoom,
    requireAuth,
    showToast
  } = useHuddle();

  const [readMoreOpen, setReadMoreOpen] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Accordion GSAP animation
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

  // Tab content animation on change
  const tabContentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tabContentRef.current) {
      gsap.fromTo(
        tabContentRef.current.children,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [hubTab]);

  return (
    <div className="py-4 sm:py-6 px-3.5 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-5 sm:space-y-6">
      {/* Hub Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--tx)]">
              Do more together
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {!user.email && (
              <button
                onClick={() => requireAuth(() => {})}
                className="px-4 py-2 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] text-xs font-bold shadow-md hover:scale-105 transition-transform"
              >
                Sign in
              </button>
            )}

            <button
              onClick={() => setReadMoreOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--tx)] hover:bg-[var(--s2)] transition-colors"
            >
              <span>{readMoreOpen ? 'Show less' : 'Read more'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${readMoreOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Read More accordion panel */}
        <div
          ref={accordionRef}
          className="overflow-hidden opacity-0 h-0 transition-all text-sm text-[var(--mut)] leading-relaxed max-w-3xl"
        >
          <div className="bg-[var(--s1)] p-4 rounded-2xl border border-[var(--line)]">
            Vote on architecture decisions, host synchronized watch parties, reward teammates with custom gift cards and tips, and book 1-on-1 expert technical consultations.
          </div>
        </div>
      </div>

      {/* Hub Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = hubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setHubTab(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)] shadow-md'
                  : 'bg-[var(--s1)] text-[var(--mut)] border-[var(--line)] hover:text-[var(--tx)] hover:bg-[var(--s2)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div ref={tabContentRef}>
        {hubTab === 'vote' && <VotePanel ballots={ballots} onVote={voteBallot} onCreate={createBallot} />}
        {hubTab === 'watch' && (
          <WatchPartyPanel
            playing={watchPlaying}
            setPlaying={setWatchPlaying}
            progress={watchProgress}
            setProgress={setWatchProgress}
            reactions={watchReactions}
            onReaction={addWatchReaction}
            onInvite={() => showToast('Watch party invite link copied!')}
          />
        )}
        {hubTab === 'wallet' && (
          <WalletPanel
            balance={balance}
            discount={discount}
            history={walletHistory}
            onRedeem={redeemVoucher}
            onSendGift={sendGift}
            onTip={tipHost}
          />
        )}
        {hubTab === 'book' && (
          <ConsultationsPanel
            experts={experts}
            bookings={bookings}
            onBook={bookExpert}
            onJoinRoom={joinConsultationRoom}
          />
        )}
      </div>
    </div>
  );
};

// ==========================================
// 1. VOTE TAB
// ==========================================
interface VotePanelProps {
  ballots: any[];
  onVote: (id: string, idx: number) => void;
  onCreate: (q: string, opts: string[]) => void;
}

const VotePanel: React.FC<VotePanelProps> = ({ ballots, onVote, onCreate }) => {
  const [question, setQuestion] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');

  const handleCreate = () => {
    const options = [opt1, opt2, opt3].filter((o) => o.trim());
    if (!question.trim() || options.length < 2) return;
    onCreate(question, options);
    setQuestion('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {ballots.map((ballot) => {
        const total = ballot.options.reduce((a: number, b: any) => a + b.votes, 0) || 1;
        return (
          <div key={ballot.id} className="bg-[var(--s1)] border border-[var(--line)] rounded-[24px] p-6 space-y-4">
            <div>
              <h3 className="font-bold text-base text-[var(--tx)]">{ballot.question}</h3>
              <p className="text-xs text-[var(--mut)] mt-1">{ballot.timeLeft} · One verified vote per team member</p>
            </div>

            <div className="space-y-2.5">
              {ballot.options.map((opt: any, idx: number) => {
                const pct = Math.round((opt.votes / total) * 100);
                const isSelected = ballot.myVote === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => onVote(ballot.id, idx)}
                    className={`relative w-full text-left p-3 rounded-xl border text-xs font-semibold overflow-hidden transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[var(--acc)] bg-[var(--s2)]'
                        : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--tx)]/40'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-[var(--acc)]/25 transition-all duration-500 ease-out z-0"
                      style={{ width: `${pct}%` }}
                    />
                    <span className="relative z-10 text-[var(--tx)]">{opt.text}</span>
                    <span className="relative z-10 font-mono text-[var(--acc)] font-bold">{pct}%</span>
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] text-[var(--mut)] flex items-center justify-between pt-1">
              <span>{total} total votes</span>
              {ballot.myVote !== undefined && <span className="text-[var(--acc)] font-bold">Vote recorded ✓</span>}
            </div>
          </div>
        );
      })}

      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[24px] p-6 space-y-4 lg:col-span-2">
        <h3 className="font-bold text-base text-[var(--tx)]">Open a new ballot</h3>
        <div>
          <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Question / Decision</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What should the team decide?"
            className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-3 text-xs outline-none focus:border-[var(--acc)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Option 1</label>
            <input
              type="text"
              value={opt1}
              onChange={(e) => setOpt1(e.target.value)}
              placeholder="e.g. Yes"
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Option 2</label>
            <input
              type="text"
              value={opt2}
              onChange={(e) => setOpt2(e.target.value)}
              placeholder="e.g. No"
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Option 3 (optional)</label>
            <input
              type="text"
              value={opt3}
              onChange={(e) => setOpt3(e.target.value)}
              placeholder="e.g. Needs more testing"
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="px-6 py-3 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-105 active:scale-95 transition-transform"
        >
          Open ballot for team
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 2. WATCH PARTY TAB
// ==========================================
interface WatchPartyProps {
  playing: boolean;
  setPlaying: (v: boolean | ((p: boolean) => boolean)) => void;
  progress: number;
  setProgress: (v: number) => void;
  reactions: { id: string; emoji: string; left: number }[];
  onReaction: (emoji: string) => void;
  onInvite: () => void;
}

const WatchPartyPanel: React.FC<WatchPartyProps> = ({
  playing,
  setPlaying,
  progress,
  setProgress,
  reactions,
  onReaction,
  onInvite
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = progress;
    let lastStamp = performance.now();

    const render = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;

      if (playing) {
        localTime = (localTime + dt) % 600;
        setProgress(Math.floor(localTime));
      }

      const w = canvas.width;
      const h = canvas.height;

      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, `hsl(${(localTime * 10) % 360}, 75%, 28%)`);
      grad.addColorStop(1, `hsl(${(localTime * 10 + 90) % 360}, 75%, 12%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const cx = w * 0.5 + Math.cos(localTime * 0.5 + i) * 280;
        const cy = h * 0.5 + Math.sin(localTime * 0.7 + i * 1.5) * 120;
        ctx.arc(cx, cy, 50 + i * 16, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(localTime * 10 + i * 45) % 360}, 85%, 65%, 0.16)`;
        ctx.fill();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 36px Inter, sans-serif';
      ctx.fillText('Launch Day Architecture Keynote', 44, h - 80);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '500 18px Inter, sans-serif';
      ctx.fillText(playing ? 'Streaming in sync for 9 participants' : 'Paused by room host', 44, h - 45);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playing]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-6">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
        <canvas ref={canvasRef} width={960} height={540} className="w-full h-full block" />

        {reactions.map((r) => (
          <span
            key={r.id}
            className="absolute bottom-6 text-3xl pointer-events-none animate-bounce"
            style={{ left: `${r.left}%` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-12 h-12 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center hover:scale-105 active:scale-95 transition-all shadow-md shrink-0"
        >
          {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <input
          type="range"
          min="0"
          max="600"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="flex-1 accent-[var(--acc)] h-1.5 bg-[var(--s2)] rounded-lg cursor-pointer"
        />

        <span className="font-mono text-xs tabular-nums text-[var(--mut)] shrink-0">
          {formatTime(progress)} / 10:00
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--line)]">
        <div className="flex items-center gap-2">
          {['🔥', '😂', '👏', '❤️'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReaction(emoji)}
              className="w-11 h-11 rounded-full bg-[var(--s2)] text-xl grid place-items-center hover:scale-125 active:scale-95 transition-transform border border-[var(--line)]"
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['Amara', 'Kofi', 'Lena', 'Dev'].map((name) => (
              <Avatar key={name} seed={name} size={30} className="border-2 border-[var(--s1)]" />
            ))}
          </div>

          <span className="text-xs text-[var(--mut)] font-semibold">9 watching together</span>

          <button
            onClick={onInvite}
            className="px-4 py-2 rounded-full bg-[var(--s2)] text-[var(--tx)] border border-[var(--line)] text-xs font-semibold hover:bg-[var(--tx)] hover:text-[var(--bg)] transition-colors"
          >
            Copy invite link
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. WALLET & GIFTS TAB
// ==========================================
interface WalletProps {
  balance: number;
  discount: number;
  history: any[];
  onRedeem: (code: string) => boolean;
  onSendGift: (to: string, msg: string, amount: number) => boolean;
  onTip: (host: string, amount: number) => boolean;
}

const WalletPanel: React.FC<WalletProps> = ({ balance, discount, history, onRedeem, onSendGift, onTip }) => {
  const [voucherInput, setVoucherInput] = useState('');
  const [giftTo, setGiftTo] = useState('Amara');
  const [giftMsg, setGiftMsg] = useState('Thanks for the awesome architecture session!');
  const [giftAmount, setGiftAmount] = useState(10);

  const [tipHostName, setTipHostName] = useState('Amara');
  const [tipAmount, setTipAmount] = useState(5);

  const giftCardRef = useRef<HTMLDivElement>(null);

  const handleRedeem = () => {
    if (!voucherInput.trim()) return;
    onRedeem(voucherInput);
    setVoucherInput('');
  };

  const handleSendGift = () => {
    const success = onSendGift(giftTo, giftMsg, giftAmount);
    if (success && giftCardRef.current) {
      gsap.fromTo(
        giftCardRef.current,
        { scale: 0.95, rotate: -2 },
        { scale: 1, rotate: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
      );
    }
  };

  const handleTip = () => {
    onTip(tipHostName, tipAmount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-6">
        <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-[#5b45e6] to-[#0a8a57] shadow-xl space-y-2">
          <span className="text-xs font-semibold opacity-80 uppercase tracking-wider">Available Credit</span>
          <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight">${balance.toFixed(2)}</h3>
          <p className="text-xs opacity-90">
            {discount > 0 ? `${discount * 100}% discount coupon active on all purchases` : 'No active coupon applied'}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--mut)] mb-1.5">Redeem coupon or promo code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="HUDDLE10, WELCOME or SAVE20"
              className="flex-1 bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--acc)] uppercase"
            />
            <button
              onClick={handleRedeem}
              className="px-5 py-2.5 rounded-xl bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-105 transition-transform"
            >
              Redeem
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-[var(--mut)]">Available promos</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { code: 'HUDDLE10', label: '$10 voucher' },
              { code: 'WELCOME', label: '$5 welcome' },
              { code: 'SAVE20', label: '20% off all' }
            ].map((p) => (
              <button
                key={p.code}
                onClick={() => onRedeem(p.code)}
                className="p-2.5 rounded-xl border border-dashed border-[var(--line)] text-left hover:border-[var(--acc)] bg-[var(--bg)] transition-colors"
              >
                <p className="font-mono font-bold text-xs text-[var(--acc)]">{p.code}</p>
                <p className="text-[10px] text-[var(--mut)]">{p.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-4">
        <h3 className="font-bold text-base text-[var(--tx)]">Send a gift to teammate</h3>

        <div
          ref={giftCardRef}
          className="rounded-2xl p-5 text-white bg-gradient-to-br from-[#ff8a57] to-[#c2185b] shadow-lg flex items-center gap-4"
        >
          <Avatar seed={giftTo || 'gift'} size={52} className="border-2 border-white/30" />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Gift Card</span>
            <h4 className="font-bold text-sm truncate">For {giftTo || 'a teammate'}</h4>
            <p className="text-xs opacity-90 italic truncate">&ldquo;{giftMsg}&rdquo;</p>
            <p className="text-lg font-extrabold mt-1">${giftAmount}.00</p>
          </div>
        </div>

        <div className="flex gap-2">
          {[10, 25, 50].map((amt) => (
            <button
              key={amt}
              onClick={() => setGiftAmount(amt)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                giftAmount === amt
                  ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)]'
                  : 'bg-[var(--bg)] text-[var(--tx)] border-[var(--line)]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Recipient name</label>
            <input
              type="text"
              value={giftTo}
              onChange={(e) => setGiftTo(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Message note</label>
            <input
              type="text"
              value={giftMsg}
              onChange={(e) => setGiftMsg(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
            />
          </div>
        </div>

        <button
          onClick={handleSendGift}
          className="w-full py-3 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-102 transition-transform shadow-md"
        >
          Send ${giftAmount}.00 Gift
        </button>
      </div>

      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-4">
        <h3 className="font-bold text-base text-[var(--tx)]">Tip a room host</h3>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['Amara', 'Kofi', 'Lena', 'Dev'].map((host) => (
            <button
              key={host}
              onClick={() => setTipHostName(host)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                tipHostName === host
                  ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)]'
                  : 'bg-[var(--bg)] text-[var(--tx)] border-[var(--line)]'
              }`}
            >
              <Avatar seed={host} size={22} />
              <span>{host}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {[1, 5, 10, 20].map((amt) => (
            <button
              key={amt}
              onClick={() => setTipAmount(amt)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                tipAmount === amt
                  ? 'bg-[var(--acc)] text-[var(--acc-ink)] border-[var(--acc)]'
                  : 'bg-[var(--bg)] text-[var(--tx)] border-[var(--line)]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        <button
          onClick={handleTip}
          className="w-full py-3 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-102 transition-transform shadow-md"
        >
          Tip {tipHostName} ${tipAmount}.00
        </button>
      </div>

      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-4">
        <h3 className="font-bold text-base text-[var(--tx)]">Activity history</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {history.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs"
            >
              <div>
                <p className="font-bold text-[var(--tx)]">{act.label}</p>
                <p className="text-[10px] text-[var(--mut)]">{act.timestamp}</p>
              </div>
              <span
                className={`font-mono font-bold ${act.amount > 0 ? 'text-[var(--acc)]' : 'text-rose-400'}`}
              >
                {act.amount > 0 ? `+$${act.amount.toFixed(2)}` : `-$${Math.abs(act.amount).toFixed(2)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. CONSULTATIONS TAB
// ==========================================
interface ConsultationsProps {
  experts: any[];
  bookings: any[];
  onBook: (name: string, dateStr: string, dur: number, price: number) => boolean;
  onJoinRoom: (expertName: string) => void;
}

const ConsultationsPanel: React.FC<ConsultationsProps> = ({ experts, bookings, onBook, onJoinRoom }) => {
  const [selectedExpertIdx, setSelectedExpertIdx] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('14:30');
  const [durationMin, setDurationMin] = useState(30);

  const days = [...Array(5)].map((_, i) =>
    new Date(Date.now() + (i + 1) * 86400000).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  );

  const SLOTS = ['09:30', '11:00', '13:00', '14:30', '16:00', '17:30'];

  const expert = experts[selectedExpertIdx];
  const multiplier = durationMin / 30;
  const totalPrice = expert.ratePer30Min * multiplier;

  const handleBook = () => {
    if (!selectedSlot) return;
    const dateStr = `${days[selectedDayIdx]} · ${selectedSlot}`;
    onBook(expert.name, dateStr, durationMin, totalPrice);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-4">
        <h3 className="font-bold text-base text-[var(--tx)]">Choose an engineering expert</h3>

        <div className="space-y-3">
          {experts.map((exp, idx) => {
            const isSelected = selectedExpertIdx === idx;
            return (
              <button
                key={exp.id}
                onClick={() => setSelectedExpertIdx(idx)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-colors ${
                  isSelected
                    ? 'border-[var(--acc)] bg-[var(--s2)]'
                    : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--tx)]/30'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar seed={exp.avatarSeed} size={48} />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[var(--tx)]">{exp.name}</h4>
                    <p className="text-[11px] text-[var(--mut)] truncate">{exp.specialty}</p>
                    <span className="text-[10px] text-amber-400 font-bold">★ {exp.rating} rating</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-xs text-[var(--tx)]">${exp.ratePer30Min}</span>
                  <span className="text-[10px] text-[var(--mut)] block">/ 30 min</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="font-bold text-base text-[var(--tx)]">Pick date & time slot</h3>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((day, idx) => (
              <button
                key={day}
                onClick={() => setSelectedDayIdx(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors ${
                  selectedDayIdx === idx
                    ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)] font-bold'
                    : 'bg-[var(--bg)] text-[var(--mut)] border-[var(--line)]'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  selectedSlot === slot
                    ? 'bg-[var(--acc)] text-[var(--acc-ink)] border-[var(--acc)] font-bold'
                    : 'bg-[var(--bg)] text-[var(--tx)] border-[var(--line)] hover:border-[var(--acc)]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Session length</label>
            <div className="grid grid-cols-2 p-1 bg-[var(--bg)] border border-[var(--line)] rounded-xl">
              <button
                onClick={() => setDurationMin(30)}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  durationMin === 30 ? 'bg-[var(--tx)] text-[var(--bg)]' : 'text-[var(--mut)]'
                }`}
              >
                30 Minutes
              </button>
              <button
                onClick={() => setDurationMin(60)}
                className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
                  durationMin === 60 ? 'bg-[var(--tx)] text-[var(--bg)]' : 'text-[var(--mut)]'
                }`}
              >
                60 Minutes
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleBook}
          className="w-full py-3.5 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-102 transition-transform shadow-lg"
        >
          Book & Pay ${totalPrice.toFixed(2)}
        </button>
      </div>

      <div className="bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-6 space-y-4 lg:col-span-2">
        <h3 className="font-bold text-base text-[var(--tx)]">Your consultations</h3>

        <div className="space-y-2">
          {bookings.length === 0 ? (
            <p className="text-xs text-[var(--mut)] italic">No consultations scheduled yet.</p>
          ) : (
            bookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-xs"
              >
                <div>
                  <h4 className="font-bold text-[var(--tx)]">{b.expertName}</h4>
                  <p className="text-[11px] text-[var(--mut)]">
                    {b.dateStr} · {b.durationMinutes} min · ${b.price}
                  </p>
                </div>

                <button
                  onClick={() => onJoinRoom(b.expertName)}
                  className="px-4 py-2 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-105 transition-transform"
                >
                  Join room
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
