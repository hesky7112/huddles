import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ViewMode,
  HubTab,
  Participant,
  ChatMessage,
  Ballot,
  PodcastEpisode,
  Expert,
  Booking,
  WalletActivity,
  CurrentUser,
  RecordingItem
} from '../types';

interface HuddleContextType {
  // Navigation
  currentView: ViewMode;
  goToView: (view: ViewMode) => void;
  hubTab: HubTab;
  setHubTab: (tab: HubTab) => void;

  // Theme & Appearance
  theme: 'oled' | 'light';
  setTheme: (theme: 'oled' | 'light') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  showOutlines: boolean;
  setShowOutlines: (val: boolean | ((p: boolean) => boolean)) => void;

  // Profile & User
  user: CurrentUser;
  setUser: React.Dispatch<React.SetStateAction<CurrentUser>>;
  shuffleAvatar: () => void;

  // Call & Stage state
  inCall: boolean;
  isPiP: boolean;
  setIsPiP: (val: boolean) => void;
  roomName: string;
  setRoomName: (name: string) => void;
  roomTopic: string;
  setRoomTopic: (topic: string) => void;
  linkedBranch: string;
  setLinkedBranch: (branch: string) => void;
  callDuration: number;
  participants: Participant[];
  activeSpeakerId: string;
  micOn: boolean;
  setMicOn: (val: boolean | ((prev: boolean) => boolean)) => void;
  camOn: boolean;
  setCamOn: (val: boolean | ((prev: boolean) => boolean)) => void;
  screenSharing: boolean;
  setScreenSharing: (val: boolean | ((prev: boolean) => boolean)) => void;
  handRaised: boolean;
  setHandRaised: (val: boolean | ((prev: boolean) => boolean)) => void;
  startCall: (name?: string, topic?: string, branch?: string) => void;
  leaveCall: () => void;
  togglePiP: () => void;

  // Chat
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  sendImage: (url: string) => void;
  sendDoc: (name: string, size: string) => void;
  sendPoll: (question: string, options: { text: string; image?: string }[]) => void;
  votePoll: (messageId: string, optionIndex: number) => void;
  isTyping: boolean;
  chatOpen: boolean;
  setChatOpen: (val: boolean) => void;
  lightboxImage: string | null;
  setLightboxImage: (url: string | null) => void;

  // Hub - Voting
  ballots: Ballot[];
  voteBallot: (ballotId: string, optionIdx: number) => void;
  createBallot: (question: string, options: string[]) => void;

  // Hub - Watch Party
  watchPlaying: boolean;
  setWatchPlaying: (val: boolean | ((prev: boolean) => boolean)) => void;
  watchProgress: number;
  setWatchProgress: (val: number) => void;
  watchReactions: { id: string; emoji: string; left: number }[];
  addWatchReaction: (emoji: string) => void;

  // Hub - Wallet
  balance: number;
  discount: number;
  walletHistory: WalletActivity[];
  redeemVoucher: (code: string) => boolean;
  sendGift: (to: string, message: string, amount: number) => boolean;
  tipHost: (hostName: string, amount: number) => boolean;

  // Podcasts (Netflix-style flagship)
  episodes: PodcastEpisode[];
  isSubscribed: boolean;
  unlockedEpisodeIds: number[];
  currentEpisodeIndex: number | null;
  isPodPlaying: boolean;
  podProgress: number;
  setPodProgress: React.Dispatch<React.SetStateAction<number>>;
  podSpeed: number;
  setPodSpeed: (s: number) => void;
  myListIds: number[];
  toggleMyList: (id: number) => void;
  podDetailModalId: number | null;
  setPodDetailModalId: (id: number | null) => void;
  subscribePodcast: () => boolean;
  unlockEpisode: (id: number) => boolean;
  playEpisode: (id: number) => void;
  togglePodPlayback: () => void;
  seekPodBySeconds: (sec: number) => void;
  hasStartedPodcast: boolean;
  podFloatingDismissed: boolean;
  setPodFloatingDismissed: (val: boolean) => void;

  // Recordings / Library
  recordings: RecordingItem[];
  selectedRecording: RecordingItem | null;
  setSelectedRecording: (rec: RecordingItem | null) => void;

  // Hub - Consultations
  experts: Expert[];
  bookings: Booking[];
  bookExpert: (expertName: string, dateStr: string, durationMin: number, price: number) => boolean;
  joinConsultationRoom: (expertName: string) => void;

  // Auth
  authOpen: boolean;
  setAuthOpen: (val: boolean) => void;
  requireAuth: (action: () => void) => void;
  loginUser: (name: string, email: string) => void;
  logoutUser: () => void;

  // Onboarding
  onboardingOpen: boolean;
  setOnboardingOpen: (val: boolean) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (val: boolean) => void;

  // Settings
  noiseSuppression: boolean;
  setNoiseSuppression: (val: boolean | ((p: boolean) => boolean)) => void;
  echoCancellation: boolean;
  setEchoCancellation: (val: boolean | ((p: boolean) => boolean)) => void;
  mirrorCam: boolean;
  setMirrorCam: (val: boolean | ((p: boolean) => boolean)) => void;
  hardwareMute: boolean;
  setHardwareMute: (val: boolean | ((p: boolean) => boolean)) => void;
  notifMentions: boolean;
  setNotifMentions: (val: boolean | ((p: boolean) => boolean)) => void;
  notifInvites: boolean;
  setNotifInvites: (val: boolean | ((p: boolean) => boolean)) => void;
  notifSounds: boolean;
  setNotifSounds: (val: boolean | ((p: boolean) => boolean)) => void;
  allowAttachments: boolean;
  setAllowAttachments: (val: boolean | ((p: boolean) => boolean)) => void;
  allowPolls: boolean;
  setAllowPolls: (val: boolean | ((p: boolean) => boolean)) => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean | ((p: boolean) => boolean)) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const HuddleContext = createContext<HuddleContextType | null>(null);

const DEFAULT_PEOPLE = ['Amara', 'Kofi', 'Lena', 'Dev', 'Zuri', 'Mateo', 'Noor', 'Ife', 'Sam'];

export const HuddleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<ViewMode>('welcome');
  const [hubTab, setHubTab] = useState<HubTab>('vote');

  // Theme & Appearance
  const [theme, setThemeState] = useState<'oled' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('huddle_theme');
      if (saved === 'light' || saved === 'oled') return saved;
    } catch {
      // ignore
    }
    return 'oled';
  });
  const [accentColor, setAccentColorState] = useState<string>('#2be08f');
  const [showOutlines, setShowOutlines] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('huddle_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Profile & User
  const [user, setUser] = useState<CurrentUser>({
    name: 'You',
    avatarSeed: 'You',
    email: undefined
  });

  // Call & Stage state
  const [inCall, setInCall] = useState<boolean>(true);
  const [isPiP, setIsPiP] = useState<boolean>(false);
  const [roomName, setRoomName] = useState<string>('#architecture-review');
  const [roomTopic, setRoomTopic] = useState<string>('RFC-19 Architecture & Audio Engine');
  const [linkedBranch, setLinkedBranch] = useState<string>('feat/huddle-redesign');
  const [callDuration, setCallDuration] = useState<number>(142);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string>('0');

  const [micOn, setMicOn] = useState<boolean>(true);
  const [camOn, setCamOn] = useState<boolean>(true);
  const [screenSharing, setScreenSharing] = useState<boolean>(false);
  const [handRaised, setHandRaised] = useState<boolean>(false);

  // Settings
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [echoCancellation, setEchoCancellation] = useState(true);
  const [mirrorCam, setMirrorCam] = useState(true);
  const [hardwareMute, setHardwareMute] = useState(true);
  const [notifMentions, setNotifMentions] = useState(true);
  const [notifInvites, setNotifInvites] = useState(true);
  const [notifSounds, setNotifSounds] = useState(false);
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [allowPolls, setAllowPolls] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Command palette
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Auth
  const [authOpen, setAuthOpen] = useState(false);
  const authPendingCallbackRef = useRef<(() => void) | null>(null);

  const requireAuth = (action: () => void) => {
    if (user.email) {
      action();
    } else {
      authPendingCallbackRef.current = action;
      setAuthOpen(true);
    }
  };

  const loginUser = (name: string, email: string) => {
    setUser({
      name: name || email.split('@')[0],
      avatarSeed: email,
      email
    });
    setAuthOpen(false);
    showToast(`Signed in as ${name || email}`);
    if (authPendingCallbackRef.current) {
      const cb = authPendingCallbackRef.current;
      authPendingCallbackRef.current = null;
      cb();
    }
  };

  const logoutUser = () => {
    setUser({ name: 'You', avatarSeed: 'You', email: undefined });
    showToast('Signed out');
  };

  // Onboarding
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    try {
      return !localStorage.getItem('huddle_ob_done');
    } catch {
      return false;
    }
  });

  // Call participants
  const [participants] = useState<Participant[]>(() => {
    return DEFAULT_PEOPLE.map((p, i) => ({
      id: String(i),
      name: p,
      avatarSeed: p,
      isSpeaking: i === 0,
      isMuted: i % 4 === 1,
      isHost: i === 0,
      role: i === 0 ? 'Lead Architect' : 'Engineer'
    }));
  });

  // Simulate periodic speaker changes
  useEffect(() => {
    if (!inCall) return;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * (participants.length + 1));
      setActiveSpeakerId(randomIdx === participants.length ? 'me' : String(randomIdx));
    }, 2400);
    return () => clearInterval(interval);
  }, [inCall, participants.length]);

  // Duration counter
  useEffect(() => {
    if (!inCall) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [inCall]);

  // Global hotkey for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reduce motion listener
  useEffect(() => {
    gsap.globalTimeline.timeScale(reduceMotion ? 6 : 1);
  }, [reduceMotion]);

  // Apply theme & accent to document root
  const setTheme = (t: 'oled' | 'light') => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    if (t === 'light' && accentColor === '#2be08f') {
      document.documentElement.style.setProperty('--acc', '#0a8a57');
      document.documentElement.style.setProperty('--acc-ink', '#ffffff');
    } else if (t === 'oled' && accentColor === '#2be08f') {
      document.documentElement.style.setProperty('--acc', '#2be08f');
      document.documentElement.style.setProperty('--acc-ink', '#04140c');
    }
  };

  useEffect(() => {
    document.documentElement.dataset.outlines = showOutlines ? 'true' : 'false';
  }, [showOutlines]);

  const setAccentColor = (hex: string) => {
    setAccentColorState(hex);
    const n = parseInt(hex.replace('#', ''), 16);
    const lum = (n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
    document.documentElement.style.setProperty('--acc', hex);
    document.documentElement.style.setProperty('--acc-ink', lum > 145 ? '#04140c' : '#ffffff');
  };

  const shuffleAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(2, 8);
    setUser((prev) => ({ ...prev, avatarSeed: randomSeed }));
  };

  const goToView = (view: ViewMode) => {
    if (view === currentView) return;
    if (currentView === 'live' && inCall && view !== 'live') {
      setIsPiP(true);
    }
    if (view === 'live') {
      setIsPiP(false);
    }
    setCurrentView(view);
  };

  const startCall = (name?: string, topic?: string, branch?: string) => {
    if (name) setRoomName(name);
    if (topic) setRoomTopic(topic);
    if (branch) setLinkedBranch(branch);
    setInCall(true);
    setIsPiP(false);
    setCallDuration(0);
    setCurrentView('live');
    showToast(`Joined ${name || roomName}`);
  };

  const leaveCall = () => {
    setInCall(false);
    setIsPiP(false);
    showToast('Left huddle');
    setCurrentView('welcome');
  };

  const togglePiP = () => {
    if (currentView === 'live') {
      setIsPiP(true);
      setCurrentView('welcome');
    } else {
      setIsPiP(false);
      setCurrentView('live');
    }
  };

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      senderName: 'Kofi',
      avatarSeed: 'Kofi',
      timestamp: '10:14 AM',
      text: 'Pushed the ring animation and spatial audio pipeline! 🎉'
    },
    {
      id: 'm2',
      senderName: 'Lena',
      avatarSeed: 'Lena',
      timestamp: '10:15 AM',
      imageUrl: 'data:image/svg+xml,' + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180">
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7c5cff"/><stop offset="100%" stop-color="#2be08f"/></linearGradient></defs>
          <rect width="300" height="180" fill="url(#g)" rx="16"/>
          <circle cx="210" cy="65" r="40" fill="#ffffff" opacity="0.25"/>
          <rect x="40" y="110" width="140" height="18" rx="9" fill="#ffffff" opacity="0.6"/>
          <text x="40" y="70" fill="#ffffff" font-family="sans-serif" font-weight="700" font-size="18">RFC-19 Architecture</text>
        </svg>`
      )
    },
    {
      id: 'm3',
      senderName: 'Amara',
      avatarSeed: 'Amara',
      timestamp: '10:16 AM',
      doc: {
        name: 'RFC-19-audio-pipeline.pdf',
        size: '2.4 MB',
        ext: 'PDF'
      }
    },
    {
      id: 'm4',
      senderName: 'Dev',
      avatarSeed: 'Dev',
      timestamp: '10:17 AM',
      poll: {
        id: 'p1',
        question: 'Which lobby hero animation ships first?',
        totalVotes: 10,
        options: [
          { text: 'Dynamic Glow Mesh', votes: 5 },
          { text: 'Minimal Typographic Mono', votes: 3 },
          { text: 'Live Interactive Canvas Wall', votes: 2 }
        ]
      }
    }
  ]);

  const simulateTeammateReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const respondents = ['Lena', 'Kofi', 'Dev', 'Amara', 'Zuri'];
      const phrases = [
        'Great point, let’s merge that in! 🚀',
        'Looks super smooth, tested on mobile web too.',
        'Reviewing the PR right now.',
        'Can you share the Figma file link?',
        'Audio latency looks under 40ms now, huge win!'
      ];
      const name = respondents[Math.floor(Math.random() * respondents.length)];
      const text = phrases[Math.floor(Math.random() * phrases.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: 'reply-' + Date.now(),
          senderName: name,
          avatarSeed: name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text
        }
      ]);
    }, 1800);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      senderName: user.name,
      avatarSeed: user.avatarSeed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
      isMe: true
    };
    setMessages((prev) => [...prev, newMsg]);
    simulateTeammateReply();
  };

  const sendImage = (url: string) => {
    const newMsg: ChatMessage = {
      id: 'msg-img-' + Date.now(),
      senderName: user.name,
      avatarSeed: user.avatarSeed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: url,
      isMe: true
    };
    setMessages((prev) => [...prev, newMsg]);
    simulateTeammateReply();
  };

  const sendDoc = (name: string, size: string) => {
    const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
    const newMsg: ChatMessage = {
      id: 'msg-doc-' + Date.now(),
      senderName: user.name,
      avatarSeed: user.avatarSeed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      doc: { name, size, ext },
      isMe: true
    };
    setMessages((prev) => [...prev, newMsg]);
    simulateTeammateReply();
  };

  const sendPoll = (question: string, options: { text: string; image?: string }[]) => {
    const newMsg: ChatMessage = {
      id: 'msg-poll-' + Date.now(),
      senderName: user.name,
      avatarSeed: user.avatarSeed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      poll: {
        id: 'poll-' + Date.now(),
        question,
        totalVotes: 0,
        options: options.map((o) => ({ text: o.text, votes: 0, image: o.image }))
      }
    };
    setMessages((prev) => [...prev, newMsg]);
    showToast('Poll created');
  };

  const votePoll = (messageId: string, optionIndex: number) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.poll) return msg;
        const currentVote = msg.poll.myVote;
        const updatedOptions = [...msg.poll.options];

        if (currentVote === optionIndex) {
          updatedOptions[optionIndex].votes = Math.max(0, updatedOptions[optionIndex].votes - 1);
          return {
            ...msg,
            poll: {
              ...msg.poll,
              options: updatedOptions,
              myVote: undefined,
              totalVotes: Math.max(0, msg.poll.totalVotes - 1)
            }
          };
        }

        if (currentVote !== undefined) {
          updatedOptions[currentVote].votes = Math.max(0, updatedOptions[currentVote].votes - 1);
        }
        updatedOptions[optionIndex].votes += 1;
        const delta = currentVote === undefined ? 1 : 0;

        return {
          ...msg,
          poll: {
            ...msg.poll,
            options: updatedOptions,
            myVote: optionIndex,
            totalVotes: msg.poll.totalVotes + delta
          }
        };
      })
    );
  };

  // Hub - Voting Ballots
  const [ballots, setBallots] = useState<Ballot[]>([
    {
      id: 'b1',
      question: 'Adopt RFC-19 unified WebRTC + Huddle Engine?',
      options: [
        { text: 'Yes, merge to main', votes: 14 },
        { text: 'No, need benchmarks', votes: 3 },
        { text: 'Abstain', votes: 2 }
      ],
      timeLeft: '4 hours left'
    },
    {
      id: 'b2',
      question: 'Next Sprint focus priority',
      options: [
        { text: 'Hardware-level mic gate & noise filter', votes: 11 },
        { text: 'Multi-screen presentation grids', votes: 9 },
        { text: 'Spatial audio panning', votes: 6 }
      ],
      timeLeft: '1 day left'
    }
  ]);

  const voteBallot = (ballotId: string, optionIdx: number) => {
    requireAuth(() => {
      setBallots((prev) =>
        prev.map((b) => {
          if (b.id !== ballotId) return b;
          if (b.myVote !== undefined) {
            showToast('Vote already recorded for this ballot');
            return b;
          }
          const updated = [...b.options];
          updated[optionIdx].votes += 1;
          showToast('Vote recorded');
          return {
            ...b,
            options: updated,
            myVote: optionIdx
          };
        })
      );
    });
  };

  const createBallot = (question: string, options: string[]) => {
    requireAuth(() => {
      const newBallot: Ballot = {
        id: 'ballot-' + Date.now(),
        question,
        options: options.map((opt) => ({ text: opt, votes: 0 })),
        timeLeft: '24 hours left'
      };
      setBallots((prev) => [newBallot, ...prev]);
      showToast('New ballot opened for the team');
    });
  };

  // Hub - Watch party
  const [watchPlaying, setWatchPlaying] = useState<boolean>(true);
  const [watchProgress, setWatchProgress] = useState<number>(45);
  const [watchReactions, setWatchReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);

  const addWatchReaction = (emoji: string) => {
    const id = 'rx-' + Date.now() + Math.random();
    const left = 15 + Math.random() * 70;
    setWatchReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setWatchReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2200);
  };

  // Hub - Wallet
  const [balance, setBalance] = useState<number>(25.0);
  const [discount, setDiscount] = useState<number>(0);
  const [usedCodes, setUsedCodes] = useState<Set<string>>(new Set());
  const [walletHistory, setWalletHistory] = useState<WalletActivity[]>([
    { id: 'wh1', label: 'Initial credit', amount: 25.0, timestamp: 'Today' }
  ]);

  const redeemVoucher = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (usedCodes.has(clean)) {
      showToast('Voucher already redeemed');
      return false;
    }

    if (clean === 'HUDDLE10') {
      setBalance((prev) => prev + 10.0);
      setUsedCodes((prev) => new Set(prev).add(clean));
      setWalletHistory((prev) => [
        { id: 'w-' + Date.now(), label: 'Voucher HUDDLE10', amount: 10.0, timestamp: 'Just now' },
        ...prev
      ]);
      showToast('Redeemed $10.00 credit');
      return true;
    }
    if (clean === 'WELCOME') {
      setBalance((prev) => prev + 5.0);
      setUsedCodes((prev) => new Set(prev).add(clean));
      setWalletHistory((prev) => [
        { id: 'w-' + Date.now(), label: 'Welcome credit', amount: 5.0, timestamp: 'Just now' },
        ...prev
      ]);
      showToast('Redeemed $5.00 credit');
      return true;
    }
    if (clean === 'SAVE20') {
      setDiscount(0.2);
      showToast('20% discount coupon activated!');
      return true;
    }

    showToast('Invalid voucher code');
    return false;
  };

  const processPayment = (amount: number, label: string, noDiscount = false): boolean => {
    let finalAmount = amount;
    if (discount > 0 && !noDiscount) {
      finalAmount = +(amount * (1 - discount)).toFixed(2);
    }
    if (finalAmount > balance) {
      showToast(`Insufficient credit ($${balance.toFixed(2)} available). Redeem a voucher in Wallet!`);
      return false;
    }
    setBalance((prev) => +(prev - finalAmount).toFixed(2));
    setWalletHistory((prev) => [
      { id: 'w-' + Date.now(), label, amount: -finalAmount, timestamp: 'Just now' },
      ...prev
    ]);
    showToast(`${label} · Paid $${finalAmount.toFixed(2)}`);
    return true;
  };

  const sendGift = (to: string, message: string, amount: number): boolean => {
    let success = false;
    requireAuth(() => {
      success = processPayment(amount, `Gift to ${to || 'teammate'}`, true);
    });
    return success;
  };

  const tipHost = (hostName: string, amount: number): boolean => {
    let success = false;
    requireAuth(() => {
      success = processPayment(amount, `Tip to ${hostName}`, true);
    });
    return success;
  };

  // Podcasts (Flagship Netflix-style layout)
  const [episodes] = useState<PodcastEpisode[]>([
    {
      id: 0,
      title: 'Why Meetings Fail & Async Huddles Win',
      speaker: 'Dr. Amara Osei',
      speakerRole: 'VP of Engineering, ex-Cloudflare',
      durationMinutes: 44,
      price: 0,
      isFree: true,
      matchScore: 99,
      category: 'architecture',
      categoryLabel: 'System Architecture',
      synopsis: 'A deep-dive on the mathematics of context switching, why 60-minute calendars ruin deep work, and how ephemeral floating audio rooms create continuous serendipity.',
      coverGradient: 'from-[#1e1b4b] to-[#4338ca]',
      colorBg: '#1e1b4b',
      coverImage: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
      videoThumbnail: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoResolution: '4K 60fps',
      badge: 'POPULAR',
      trendingRank: 1,
      progressMinutes: 28,
      chapters: [
        { time: '00:00', title: 'The Cost of Calendar Fragmentation', seconds: 0 },
        { time: '12:15', title: 'Why Audio-First Beats Video Fatigue', seconds: 735 },
        { time: '24:40', title: 'Building Ephemeral WebRTC Pipelines', seconds: 1480 },
        { time: '38:10', title: 'Measuring Engineering Velocity', seconds: 2290 }
      ],
      takeaways: [
        'Context switching consumes 23 minutes on average per interruption.',
        'Audio-only huddles with persistent screen share reduce cognitive load by 48%.',
        'Spatial audio separation prevents vocal collision in large groups.'
      ]
    },
    {
      id: 1,
      title: 'Zero-Latency WebRTC & Spatial Mesh Networks',
      speaker: 'Kofi Mensah',
      speakerRole: 'Audio DSP Architect',
      durationMinutes: 36,
      price: 1.99,
      matchScore: 97,
      category: 'systems',
      categoryLabel: 'Distributed Audio',
      synopsis: 'Inside the raw packet architecture of peer-to-peer audio nodes. How WebAssembly and Web Audio work together to deliver 32ms glass-to-glass latency.',
      coverGradient: 'from-[#7c2d12] to-[#c2410c]',
      colorBg: '#7c2d12',
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      videoThumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoResolution: '1080p 60fps',
      badge: 'TECH DEEP DIVE',
      trendingRank: 2,
      progressMinutes: 14,
      chapters: [
        { time: '00:00', title: 'WebRTC P2P vs SFU Tradeoffs', seconds: 0 },
        { time: '10:30', title: 'Opus Codec Optimization & Bitrate Gates', seconds: 630 },
        { time: '22:15', title: 'Spatial Panning in 3D Coordinate Space', seconds: 1335 }
      ],
      takeaways: [
        'SFUs shine at >8 peers, but pure mesh delivers lowest jitter under 4.',
        'Adaptive bitrate gates prevent robotic voice artifacts on weak Wi-Fi.'
      ]
    },
    {
      id: 2,
      title: 'Crafting High-Taste Design Systems',
      speaker: 'Lena Park',
      speakerRole: 'Staff Design Engineer',
      durationMinutes: 48,
      price: 1.99,
      matchScore: 95,
      category: 'design',
      categoryLabel: 'Design Engineering',
      synopsis: 'Stop building generic corporate dashboards. Lena Park breaks down spring physics, zero-pill discipline, micro-typography, and high-fidelity transitions.',
      coverGradient: 'from-[#0c4a6e] to-[#0284c7]',
      colorBg: '#0c4a6e',
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      videoThumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932dede?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoResolution: '4K HDR',
      badge: 'DESIGN CRAFT',
      trendingRank: 3,
      chapters: [
        { time: '00:00', title: 'The Anti-AI Slop Manifesto', seconds: 0 },
        { time: '14:20', title: 'Spring Physics vs Standard Cubic Bezier', seconds: 860 },
        { time: '31:40', title: 'Design Token Contrast in OLED & Light Themes', seconds: 1900 }
      ],
      takeaways: [
        'Every micro-interaction must convey functional physics, not decorative lag.',
        'Theme tokens need mathematical luminance calculations for WCAG AAA contrast.'
      ]
    },
    {
      id: 3,
      title: 'The 4-Day Shipping Sprint: Myth vs Reality',
      speaker: 'Dev Rao',
      speakerRole: 'Startup CTO & Founder',
      durationMinutes: 29,
      price: 2.99,
      matchScore: 92,
      category: 'founders',
      categoryLabel: 'Shipping & Speed',
      synopsis: 'How a 6-person team shipped 4 production products in 3 months by banning standup meetings and replacing them with live huddle pairing rooms.',
      coverGradient: 'from-[#701a75] to-[#c026d3]',
      colorBg: '#701a75',
      coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80',
      videoThumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      mediaType: 'audio',
      videoResolution: 'Dolby Atmos',
      badge: 'FOUNDER STORY',
      trendingRank: 4,
      chapters: [
        { time: '00:00', title: 'Killing the Daily Standup Trap', seconds: 0 },
        { time: '08:50', title: 'Pair Programming in Floating Windows', seconds: 530 },
        { time: '19:40', title: 'Automated CI/CD with Git-Linked Rooms', seconds: 1180 }
      ],
      takeaways: [
        'Standup text bots waste time; 5-minute impromptu huddles unblock engineers instantly.',
        'Linking git branches directly to room stage cut PR review cycle by 65%.'
      ]
    },
    {
      id: 4,
      title: 'Founder Burnout & The Loneliness of Remote Teams',
      speaker: 'Zuri Bello',
      speakerRole: 'Executive Coach & Author',
      durationMinutes: 52,
      price: 2.99,
      matchScore: 94,
      category: 'founders',
      categoryLabel: 'Culture & Mental Health',
      synopsis: 'An unfiltered discussion with 3 technical founders on isolation, imposter syndrome, panic attacks during fundraises, and building genuine human connection in remote companies.',
      coverGradient: 'from-[#064e3b] to-[#059669]',
      colorBg: '#064e3b',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      videoThumbnail: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      videoResolution: '4K 60fps',
      badge: 'HONEST TALK',
      trendingRank: 5,
      chapters: [
        { time: '00:00', title: 'The Silent Isolation of Remote Tech', seconds: 0 },
        { time: '16:00', title: 'The Fallacy of Always-On Availability', seconds: 960 },
        { time: '34:20', title: 'Co-Working Lounges: Ambient Presence Without Pressure', seconds: 2060 }
      ],
      takeaways: [
        'Presence does not mean surveillance; ambient audio rooms simulate kitchen table work.',
        'Setting hardware boundaries prevents chronic insomnia.'
      ]
    },
    {
      id: 5,
      title: 'Compilers, Rust & WebAssembly Audio Engines',
      speaker: 'Mateo Rossi',
      speakerRole: 'Systems Hacker & Core Contributor',
      durationMinutes: 41,
      price: 1.99,
      matchScore: 91,
      category: 'systems',
      categoryLabel: 'Low-Level Systems',
      synopsis: 'Compiling Rust to WASM with SIMD instructions for real-time background noise subtraction in under 4ms on consumer laptops.',
      coverGradient: 'from-[#831843] to-[#e11d48]',
      colorBg: '#831843',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      videoThumbnail: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      mediaType: 'audio',
      videoResolution: 'Lossless 96kHz',
      badge: 'RUST & WASM',
      trendingRank: 6,
      chapters: [
        { time: '00:00', title: 'SIMD Acceleration on the Web', seconds: 0 },
        { time: '15:10', title: 'Memory Sharing Between AudioWorklet & Main Thread', seconds: 910 },
        { time: '29:50', title: 'Zero-Copy Ring Buffers in JavaScript', seconds: 1790 }
      ],
      takeaways: [
        'AudioWorklet thread isolation prevents audio stutter when DOM is busy.',
        'WASM SIMD 128-bit registers quadruple convolution filter throughput.'
      ]
    }
  ]);

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [unlockedEpisodeIds, setUnlockedEpisodeIds] = useState<number[]>([0]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState<number | null>(0);
  const [isPodPlaying, setIsPodPlaying] = useState<boolean>(false);
  const [hasStartedPodcast, setHasStartedPodcast] = useState<boolean>(false);
  const [podFloatingDismissed, setPodFloatingDismissed] = useState<boolean>(false);
  const [podProgress, setPodProgress] = useState<number>(28);
  const [podSpeed, setPodSpeed] = useState<number>(1);
  const [myListIds, setMyListIds] = useState<number[]>([0, 2]);
  const [podDetailModalId, setPodDetailModalId] = useState<number | null>(null);

  const toggleMyList = (id: number) => {
    setMyListIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from My List');
        return prev.filter((i) => i !== id);
      } else {
        showToast('Added to My List');
        return [...prev, id];
      }
    });
  };

  const subscribePodcast = (): boolean => {
    let success = false;
    requireAuth(() => {
      if (isSubscribed) {
        showToast('Already subscribed to Huddles Premium');
        return;
      }
      if (processPayment(4.99, 'Huddles Premium Subscription', false)) {
        setIsSubscribed(true);
        success = true;
      }
    });
    return success;
  };

  const unlockEpisode = (id: number): boolean => {
    let success = false;
    requireAuth(() => {
      if (isSubscribed || unlockedEpisodeIds.includes(id)) {
        showToast('Episode already unlocked');
        return;
      }
      const ep = episodes.find((e) => e.id === id);
      if (!ep) return;
      if (processPayment(ep.price, `Episode: ${ep.title}`, false)) {
        setUnlockedEpisodeIds((prev) => [...prev, id]);
        success = true;
      }
    });
    return success;
  };

  const playEpisode = (id: number) => {
    setCurrentEpisodeIndex(id);
    setIsPodPlaying(true);
    setHasStartedPodcast(true);
    setPodFloatingDismissed(false);
    const ep = episodes[id];
    setPodProgress(ep?.progressMinutes ? Math.round((ep.progressMinutes / ep.durationMinutes) * 100) : 0);
  };

  const togglePodPlayback = () => {
    setIsPodPlaying((prev) => {
      if (!prev) {
        setHasStartedPodcast(true);
        setPodFloatingDismissed(false);
      }
      return !prev;
    });
  };

  const seekPodBySeconds = (deltaSeconds: number) => {
    setPodProgress((prev) => Math.max(0, Math.min(100, prev + (deltaSeconds / 60))));
  };

  // Podcast progress ticker
  useEffect(() => {
    if (!isPodPlaying || currentEpisodeIndex === null) return;
    const interval = setInterval(() => {
      setPodProgress((prev) => {
        const ep = episodes[currentEpisodeIndex];
        const isUnlocked = isSubscribed || unlockedEpisodeIds.includes(ep.id);
        if (!isUnlocked && prev >= 30) {
          setIsPodPlaying(false);
          showToast('30s preview completed. Unlock to listen to the full episode.');
          return 30;
        }
        if (prev >= 100) {
          setIsPodPlaying(false);
          return 100;
        }
        return prev + 0.5 * podSpeed;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPodPlaying, currentEpisodeIndex, isSubscribed, unlockedEpisodeIds, episodes, podSpeed]);

  // Recordings / Past Sessions (Spotify-Inspired)
  const [recordings] = useState<RecordingItem[]>([
    {
      id: 'rec-1',
      roomName: '#architecture-review',
      topic: 'RFC-19 Stage & Audio Engine Specifications',
      branch: 'feat/huddle-redesign',
      dateStr: 'Yesterday at 3:30 PM',
      duration: '48m 22s',
      hostName: 'Dr. Amara Osei',
      participantsCount: 8,
      summary: 'Reviewed WebRTC packet flow, evaluated Opus dynamic bitrate gating, and confirmed hardware-level microphone release on mute. Merged PR #244 into staging.',
      keyActionItems: [
        'Benchmark Opus encoder on mobile Safari 17.4',
        'Add spatial panning slider in Green Room audio preview',
        'Finalize security audit for token generation endpoint'
      ],
      transcriptSnippet: "Amara: Let's ensure the driver level mute physically halts stream transmission. Kofi: Tested and verified; zero audio bytes leave the browser when muted.",
      tags: ['RFC-19', 'WebRTC', 'Audio Engine', 'Approved'],
      colorBg: '#E13300',
      coverGradient: 'from-[#E13300] to-[#BA5D07]',
      isPinned: true
    },
    {
      id: 'rec-2',
      roomName: '#hotfix-war-room',
      topic: 'prod-4412 Memory Leak in Canvas Render Loop',
      branch: 'fix/prod-leak-4412',
      dateStr: '2 days ago',
      duration: '1h 12m',
      hostName: 'Dev Rao',
      participantsCount: 6,
      summary: 'Identified uncollected requestAnimationFrame loop in background tab state. Added cancelAnimationFrame cleanup and verified flat memory graph under heap profiler.',
      keyActionItems: [
        'Deploy patch v2.4.1 to europe-west2 cloud run',
        'Add memory leak regression test in playwright suite'
      ],
      transcriptSnippet: "Dev: Memory is climbing 4MB per minute when tab is minimized. Lena: Found it! The watch party canvas ticker wasn't listening to visibilitychange.",
      tags: ['Hotfix', 'Memory Leak', 'Production'],
      colorBg: '#1E3264',
      coverGradient: 'from-[#1E3264] to-[#2E77D0]',
      isPinned: true
    },
    {
      id: 'rec-3',
      roomName: '#design-crit',
      topic: 'Figma Component Tokens & Micro-Interactions',
      branch: 'feat/v2-components',
      dateStr: 'Oct 14, 2026',
      duration: '35m 10s',
      hostName: 'Lena Park',
      participantsCount: 5,
      summary: 'Walked through new OLED vs Light theme tokens, agreed on zero-pill discipline for form buttons, and finalized spring physics timing curves for navigation rail.',
      keyActionItems: [
        'Export updated SVG icon set for navigation rail',
        'Check contrast ratios on secondary button states'
      ],
      transcriptSnippet: "Lena: Notice how the spring back.out(1.5) feels snappy without bouncing too aggressively. Amara: Love it, ships in the next build.",
      tags: ['Design', 'Motion', 'Tailwind', 'Design Tokens'],
      colorBg: '#E8115B',
      coverGradient: 'from-[#E8115B] to-[#BC59CF]'
    },
    {
      id: 'rec-4',
      roomName: '#standup-sync',
      topic: 'Daily Core Engine Standup & Blocker Clearing',
      branch: 'main',
      dateStr: 'Oct 13, 2026',
      duration: '18m 45s',
      hostName: 'Kofi Mensah',
      participantsCount: 11,
      summary: 'Quick sync on PR turnaround times, reviewed CI bundle size metrics, and unblocked WebRTC NAT traversal ICE server configuration.',
      keyActionItems: [
        'Rotate TURN server credentials in Secret Manager',
        'Verify audio packet loss thresholds'
      ],
      transcriptSnippet: "Kofi: Anyone seeing ICE timeouts in the EMEA cluster? Mateo: Patched in commit d4a8f.",
      tags: ['Standup', 'Core', 'Infrastructure'],
      colorBg: '#148A08',
      coverGradient: 'from-[#148A08] to-[#2BE08F]'
    },
    {
      id: 'rec-5',
      roomName: '#late-night-lofi',
      topic: 'Pairing Session: SIMD AudioWorklet Noise Gate',
      branch: 'feat/simd-audio',
      dateStr: 'Oct 11, 2026',
      duration: '2h 05m',
      hostName: 'Mateo Rossi',
      participantsCount: 4,
      summary: 'Wrote WASM SIMD assembly loop for real-time neural background fan suppression. Benchmarked processing time down to 2.1ms per audio block.',
      keyActionItems: [
        'Merge SIMD assembly module into wasm audio pipeline',
        'Test on low-tier mobile devices'
      ],
      transcriptSnippet: "Mateo: The 128-bit vector registers chew through the FFT in half a millisecond. Truly insane speed.",
      tags: ['WASM', 'SIMD', 'DSP', 'Noise Gate'],
      colorBg: '#503750',
      coverGradient: 'from-[#503750] to-[#8D67AB]'
    },
    {
      id: 'rec-6',
      roomName: '#security-audit',
      topic: 'E2EE Audio Token Cryptography & Zero-Knowledge Verification',
      branch: 'sec/e2ee-tokens',
      dateStr: 'Oct 09, 2026',
      duration: '52m 14s',
      hostName: 'Zuri Bello',
      participantsCount: 7,
      summary: 'Conducted threat modeling on WebRTC insertable streams, enforced AES-GCM 256 frame-level encryption, and verified zero-knowledge host room isolation.',
      keyActionItems: [
        'Publish public cryptographic audit paper',
        'Implement key ratcheting for room participants'
      ],
      transcriptSnippet: "Zuri: Even if an SFU is compromised, all payload audio packets are opaque ciphertext.",
      tags: ['Security', 'E2EE', 'Crypto', 'Compliance'],
      colorBg: '#27856A',
      coverGradient: 'from-[#27856A] to-[#12D8FA]'
    }
  ]);

  const [selectedRecording, setSelectedRecording] = useState<RecordingItem | null>(null);

  // Consultations
  const [experts] = useState<Expert[]>([
    { id: 1, name: 'Dr. Amara Osei', specialty: 'Distributed Systems & WebRTC Architecture', rating: 4.95, ratePer30Min: 60, avatarSeed: 'Amara' },
    { id: 2, name: 'Kofi Mensah', specialty: 'Product Strategy & Rapid Prototyping', rating: 4.92, ratePer30Min: 45, avatarSeed: 'Kofi' },
    { id: 3, name: 'Lena Park', specialty: 'Design Systems & Motion Engineering', rating: 4.98, ratePer30Min: 50, avatarSeed: 'Lena' }
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'bk-init',
      expertName: 'Dr. Amara Osei',
      dateStr: 'Tomorrow · 14:00',
      durationMinutes: 30,
      price: 60
    }
  ]);

  const bookExpert = (expertName: string, dateStr: string, durationMin: number, price: number): boolean => {
    let success = false;
    requireAuth(() => {
      if (processPayment(price, `Consultation with ${expertName}`, false)) {
        const newBooking: Booking = {
          id: 'bk-' + Date.now(),
          expertName,
          dateStr,
          durationMinutes: durationMin,
          price
        };
        setBookings((prev) => [newBooking, ...prev]);
        success = true;
      }
    });
    return success;
  };

  const joinConsultationRoom = (expertName: string) => {
    const slug = expertName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    startCall(`#consult-${slug}`, `Private consultation session with ${expertName}`, 'session/private');
  };

  return (
    <HuddleContext.Provider
      value={{
        currentView,
        goToView,
        hubTab,
        setHubTab,
        theme,
        setTheme,
        accentColor,
        setAccentColor,
        showOutlines,
        setShowOutlines,
        user,
        setUser,
        shuffleAvatar,
        inCall,
        isPiP,
        setIsPiP,
        roomName,
        setRoomName,
        roomTopic,
        setRoomTopic,
        linkedBranch,
        setLinkedBranch,
        callDuration,
        participants,
        activeSpeakerId,
        micOn,
        setMicOn,
        camOn,
        setCamOn,
        screenSharing,
        setScreenSharing,
        handRaised,
        setHandRaised,
        startCall,
        leaveCall,
        togglePiP,
        messages,
        sendMessage,
        sendImage,
        sendDoc,
        sendPoll,
        votePoll,
        isTyping,
        chatOpen,
        setChatOpen,
        lightboxImage,
        setLightboxImage,
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
        episodes,
        isSubscribed,
        unlockedEpisodeIds,
        currentEpisodeIndex,
        isPodPlaying,
        podProgress,
        setPodProgress,
        podSpeed,
        setPodSpeed,
        myListIds,
        toggleMyList,
        podDetailModalId,
        setPodDetailModalId,
        subscribePodcast,
        unlockEpisode,
        playEpisode,
        togglePodPlayback,
        seekPodBySeconds,
        hasStartedPodcast,
        podFloatingDismissed,
        setPodFloatingDismissed,
        recordings,
        selectedRecording,
        setSelectedRecording,
        experts,
        bookings,
        bookExpert,
        joinConsultationRoom,
        authOpen,
        setAuthOpen,
        requireAuth,
        loginUser,
        logoutUser,
        onboardingOpen,
        setOnboardingOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
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
        toastMessage,
        showToast
      }}
    >
      {children}
    </HuddleContext.Provider>
  );
};

export const useHuddle = () => {
  const context = useContext(HuddleContext);
  if (!context) {
    throw new Error('useHuddle must be used within a HuddleProvider');
  }
  return context;
};
