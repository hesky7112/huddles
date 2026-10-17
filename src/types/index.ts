export type ViewMode = 'welcome' | 'start' | 'live' | 'podcasts' | 'library' | 'hub' | 'settings';

export type HubTab = 'vote' | 'watch' | 'wallet' | 'book';

export interface Participant {
  id: string;
  name: string;
  avatarSeed: string;
  isSpeaking: boolean;
  isMuted?: boolean;
  isHost?: boolean;
  role?: string;
}

export interface PollOption {
  text: string;
  votes: number;
  image?: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  myVote?: number; // index of chosen option
  totalVotes: number;
  timeRemaining?: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  avatarSeed: string;
  timestamp: string;
  text?: string;
  imageUrl?: string;
  doc?: {
    name: string;
    size: string;
    ext: string;
  };
  poll?: Poll;
  isMe?: boolean;
}

export interface RoomPreset {
  id: string;
  name: string;
  topic: string;
  branch: string;
  memberCount: number;
  gradient: string;
  isLive?: boolean;
  presenter?: string;
  presenterAction?: string;
}

export interface BallotOption {
  text: string;
  votes: number;
}

export interface Ballot {
  id: string;
  question: string;
  options: BallotOption[];
  timeLeft: string;
  myVote?: number;
}

export interface PodcastChapter {
  time: string;
  title: string;
  seconds: number;
}

export interface PodcastEpisode {
  id: number;
  title: string;
  speaker: string;
  speakerRole: string;
  durationMinutes: number;
  price: number;
  isFree?: boolean;
  matchScore: number;
  category: 'architecture' | 'systems' | 'design' | 'founders' | 'performance';
  categoryLabel: string;
  synopsis: string;
  coverGradient: string;
  colorBg: string;
  coverImage: string;
  videoThumbnail: string;
  mediaType: 'audio' | 'video';
  videoResolution?: string;
  badge?: string;
  trendingRank?: number;
  progressMinutes?: number;
  chapters: PodcastChapter[];
  takeaways: string[];
}

export interface Expert {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  ratePer30Min: number;
  avatarSeed: string;
}

export interface Booking {
  id: string;
  expertName: string;
  dateStr: string;
  durationMinutes: number;
  price: number;
}

export interface WalletActivity {
  id: string;
  label: string;
  amount: number;
  timestamp: string;
}

export interface RecordingItem {
  id: string;
  roomName: string;
  topic: string;
  branch: string;
  dateStr: string;
  duration: string;
  hostName: string;
  participantsCount: number;
  summary: string;
  keyActionItems: string[];
  transcriptSnippet: string;
  tags: string[];
  colorBg: string;
  coverGradient: string;
  isPinned?: boolean;
}

export interface CurrentUser {
  name: string;
  avatarSeed: string;
  email?: string;
}
