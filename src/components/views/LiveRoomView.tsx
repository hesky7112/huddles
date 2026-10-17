import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useHuddle } from '../../context/HuddleContext';
import { Avatar } from '../../utils/avatar';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  PhoneOff,
  MessageSquare,
  Minimize2,
  Paperclip,
  Send,
  Image as ImageIcon,
  FileText,
  BarChart2,
  X,
  GitBranch,
  ChevronDown
} from 'lucide-react';

export const LiveRoomView: React.FC = () => {
  const {
    roomName,
    linkedBranch,
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
    user
  } = useHuddle();

  const [messageInput, setMessageInput] = useState('');
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [pollCreatorOpen, setPollCreatorOpen] = useState(false);
  const [readMoreOpen, setReadMoreOpen] = useState(false);

  // Poll Creator state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([
    { text: 'Dynamic Glow Mesh', image: '' },
    { text: 'Minimal Typographic Mono', image: '' },
    { text: 'Interactive Spatial Canvas', image: '' }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileImageRef = useRef<HTMLInputElement>(null);
  const fileDocRef = useRef<HTMLInputElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Read more accordion GSAP animation
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

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    sendMessage(messageInput);
    setMessageInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      sendImage(url);
    }
    e.target.value = '';
    setAttachmentMenuOpen(false);
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
          : Math.max(1, Math.round(file.size / 1024)) + ' KB';
      sendDoc(file.name, sizeStr);
    }
    e.target.value = '';
    setAttachmentMenuOpen(false);
  };

  const handleCreatePoll = () => {
    const validOptions = pollOptions.filter((o) => o.text.trim());
    if (!pollQuestion.trim() || validOptions.length < 2) return;
    sendPoll(pollQuestion, validOptions);
    setPollQuestion('');
    setPollCreatorOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-54px)] md:h-screen overflow-hidden p-2.5 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
      {/* Top Header Bar */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2 sm:gap-3 bg-[var(--s1)] border border-[var(--line)] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Live indicator badge */}
            <span className="flex items-center gap-1.5 bg-[#ff3d57] text-white text-[10px] sm:text-[11px] font-extrabold uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-pulse" />
              <span>LIVE</span>
            </span>

            {/* Room Name */}
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-[var(--tx)] truncate">{roomName}</h2>

            {/* Linked Git branch */}
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-[var(--s2)] text-[var(--mut)] border border-[var(--line)]">
              <GitBranch className="w-3.5 h-3.5 text-[var(--acc)]" />
              <span>{linkedBranch}</span>
            </div>

            {/* Running Call Timer */}
            <span className="hidden md:inline-block font-mono text-xs tabular-nums text-[var(--mut)]">
              {formatDuration(callDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReadMoreOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--tx)] hover:bg-[var(--s2)] transition-colors"
            >
              <span>{readMoreOpen ? 'Less' : 'Agenda'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${readMoreOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
                chatOpen
                  ? 'bg-[var(--tx)] text-[var(--bg)] border-[var(--tx)]'
                  : 'bg-[var(--s2)] text-[var(--tx)] border-[var(--line)] hover:border-[var(--tx)]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={togglePiP}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--s2)] border border-[var(--line)] text-xs font-semibold text-[var(--tx)] hover:bg-[var(--line)] transition-colors"
              title="Minimize to floating window"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Minimize</span>
            </button>
          </div>
        </div>

        {/* Read More Agenda details panel */}
        <div
          ref={accordionRef}
          className="overflow-hidden opacity-0 h-0 transition-all text-xs md:text-sm text-[var(--mut)] max-w-4xl"
        >
          <div className="bg-[var(--s1)] p-3.5 rounded-2xl border border-[var(--line)] space-y-1">
            <p className="font-semibold text-[var(--tx)]">Architecture Review Agenda: RFC-19 Stage & Audio Engine</p>
            <p>
              1. Review real-time speaker ring synchronization. 2. Verify hardware mute microphone release. 3. Test interactive poll responses and image lightbox. Linked to branch <code>{linkedBranch}</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Main Stage Grid: Video/Screen tiles + Chat sidebar */}
      <div className="flex-1 flex gap-4 min-h-0 relative">
        {/* Stage Presentation & Participant Tiles */}
        <div className="flex-1 flex flex-col justify-between min-h-0 relative bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-4 overflow-hidden shadow-sm">
          {/* Tiles Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 overflow-y-auto pb-20 min-h-0">
            {/* Screen Share Tile (Spans 2 columns on desktop) */}
            <div className="col-span-2 row-span-1 md:row-span-2 bg-[#090d12] border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="font-mono text-xs md:text-sm leading-relaxed text-emerald-200/90 select-text overflow-x-auto">
                <div className="text-emerald-400/70 mb-1">// feat/huddle-redesign — active screen stream</div>
                <div>
                  <span className="text-[var(--acc)] font-bold">export function</span>{' '}
                  <span className="text-white font-bold">HuddleRoom</span>() {'{'}
                </div>
                <div className="pl-4">
                  <span className="text-[var(--vio)]">const</span> [speaking] ={' '}
                  <span className="text-cyan-400">useSpeakers</span>();
                </div>
                <div className="pl-4">
                  <span className="text-[var(--vio)]">const</span> [audioStream] ={' '}
                  <span className="text-cyan-400">useHardwareAudio</span>();
                </div>
                <div className="pl-4">
                  <span className="text-[var(--acc)]">return</span> &lt;
                  <span className="text-yellow-400">Stage</span> ring={'{'}speaking{'}'} latency={'{'}&quot;38ms&quot;{'}'} /&gt;;
                </div>
                <div>{'}'}</div>
              </div>

              {/* Presenter Name badge */}
              <div className="flex items-center gap-2 mt-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full w-fit border border-white/10 text-xs font-semibold text-white">
                <Monitor className="w-3.5 h-3.5 text-[var(--acc)]" />
                <span>Amara is presenting</span>
              </div>
            </div>

            {/* Participant Tiles */}
            {participants.slice(0, 5).map((participant) => {
              const isSpeaking = activeSpeakerId === participant.id;
              return (
                <div
                  key={participant.id}
                  className={`relative rounded-2xl bg-[var(--s2)] border transition-all duration-300 flex flex-col items-center justify-center p-4 min-h-[140px] overflow-hidden ${
                    isSpeaking
                      ? 'border-[var(--acc)] shadow-[0_0_15px_rgba(43,224,143,0.25)] scale-[1.02]'
                      : 'border-[var(--line)]'
                  }`}
                >
                  <div
                    className={`relative rounded-full p-2 transition-transform duration-300 ${
                      isSpeaking ? 'animate-speaking-ring' : ''
                    }`}
                  >
                    <Avatar seed={participant.avatarSeed} size={72} />
                  </div>

                  {/* Name badge */}
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                    {participant.isMuted && <MicOff className="w-3 h-3 text-[#ff3d57]" />}
                    <span>{participant.name}</span>
                  </div>
                </div>
              );
            })}

            {/* User Tile */}
            <div
              className={`relative rounded-2xl bg-[var(--s2)] border transition-all duration-300 flex flex-col items-center justify-center p-4 min-h-[140px] overflow-hidden ${
                activeSpeakerId === 'me'
                  ? 'border-[var(--acc)] shadow-[0_0_15px_rgba(43,224,143,0.25)] scale-[1.02]'
                  : 'border-[var(--line)]'
              }`}
            >
              <div
                className={`relative rounded-full p-2 transition-transform duration-300 ${
                  activeSpeakerId === 'me' ? 'animate-speaking-ring' : ''
                }`}
              >
                {camOn ? (
                  <Avatar seed={user.avatarSeed} size={72} />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full bg-[var(--s1)] grid place-items-center text-[var(--mut)]">
                    <VideoOff className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                {!micOn && <MicOff className="w-3 h-3 text-[#ff3d57]" />}
                <span>You</span>
              </div>
            </div>
          </div>

          {/* Floating Call Dock */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-3 bg-[var(--bg)]/95 backdrop-blur-xl border border-[var(--line)] px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full shadow-2xl z-20 max-w-[calc(100%-20px)]">
            {/* Mic Toggle with physical hardware off indicator */}
            <button
              onClick={() => setMicOn((prev) => !prev)}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full grid place-items-center transition-transform hover:scale-110 active:scale-95 shrink-0 ${
                micOn ? 'bg-[var(--s2)] text-[var(--tx)]' : 'bg-[#ff3d57] text-white'
              }`}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              {micOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Cam Toggle */}
            <button
              onClick={() => setCamOn((prev) => !prev)}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full grid place-items-center transition-transform hover:scale-110 active:scale-95 shrink-0 ${
                camOn ? 'bg-[var(--s2)] text-[var(--tx)]' : 'bg-[#ff3d57] text-white'
              }`}
              title={camOn ? 'Turn camera off' : 'Turn camera on'}
            >
              {camOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={() => setScreenSharing((prev) => !prev)}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full grid place-items-center transition-transform hover:scale-110 active:scale-95 shrink-0 ${
                screenSharing
                  ? 'bg-[var(--acc)] text-[var(--acc-ink)]'
                  : 'bg-[var(--s2)] text-[var(--tx)]'
              }`}
              title="Share Screen"
            >
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Raise Hand */}
            <button
              onClick={() => setHandRaised((prev) => !prev)}
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full grid place-items-center transition-transform hover:scale-110 active:scale-95 shrink-0 ${
                handRaised
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-[var(--s2)] text-[var(--tx)]'
              }`}
              title="Raise Hand"
            >
              <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* End Call button */}
            <button
              onClick={leaveCall}
              className="px-3 sm:px-5 h-9 sm:h-11 rounded-full bg-[#ff3d57] hover:bg-rose-600 text-white font-bold flex items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shrink-0"
              title="Leave Room"
            >
              <PhoneOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>

        {/* Room Chat Side Panel */}
        <div
          className={`${
            chatOpen ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 bg-[var(--s1)] border border-[var(--line)] rounded-[28px] p-4 min-h-0 absolute md:relative inset-0 md:inset-auto z-30 shadow-xl`}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-3">
            <div>
              <h3 className="font-bold text-sm text-[var(--tx)]">Room chat</h3>
              <p className="text-[11px] text-[var(--mut)]">9 members active</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="md:hidden w-8 h-8 rounded-full bg-[var(--s2)] grid place-items-center text-[var(--tx)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 text-xs ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className="shrink-0 mt-0.5">
                  <Avatar seed={msg.avatarSeed} size={30} />
                </div>

                <div className={`space-y-1 max-w-[82%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`flex items-center gap-1.5 text-[11px] ${
                      msg.isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="font-bold text-[var(--tx)]">{msg.senderName}</span>
                    <span className="text-[10px] text-[var(--mut)]">{msg.timestamp}</span>
                  </div>

                  {/* Text bubble */}
                  {msg.text && (
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed break-words ${
                        msg.isMe
                          ? 'bg-[var(--acc)] text-[var(--acc-ink)] rounded-tr-none font-medium'
                          : 'bg-[var(--s2)] text-[var(--tx)] rounded-tl-none border border-[var(--line)]'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Image attachment */}
                  {msg.imageUrl && (
                    <div
                      onClick={() => setLightboxImage(msg.imageUrl || null)}
                      className="cursor-zoom-in rounded-2xl overflow-hidden border border-[var(--line)] hover:opacity-90 transition-opacity"
                    >
                      <img src={msg.imageUrl} alt="Attachment" className="max-w-full rounded-2xl object-cover" />
                    </div>
                  )}

                  {/* Document attachment */}
                  {msg.doc && (
                    <div className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--line)] p-2.5 rounded-2xl">
                      <div className="w-9 h-9 rounded-xl bg-[var(--vio)] text-white grid place-items-center font-bold text-[10px] shrink-0">
                        {msg.doc.ext}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[var(--tx)] text-xs truncate">{msg.doc.name}</p>
                        <p className="text-[10px] text-[var(--mut)]">{msg.doc.size}</p>
                      </div>
                    </div>
                  )}

                  {/* Interactive Poll */}
                  {msg.poll && (
                    <div className="bg-[var(--bg)] border border-[var(--line)] p-3 rounded-2xl space-y-2.5">
                      <p className="font-bold text-[var(--tx)] text-xs">{msg.poll.question}</p>

                      <div className="space-y-2">
                        {msg.poll.options.map((opt, optIdx) => {
                          const isVoted = msg.poll?.myVote === optIdx;
                          const total = msg.poll?.totalVotes || 1;
                          const pct = Math.round((opt.votes / (total || 1)) * 100);

                          return (
                            <button
                              key={optIdx}
                              onClick={() => votePoll(msg.id, optIdx)}
                              className={`relative w-full text-left p-2.5 rounded-xl border text-xs font-semibold overflow-hidden transition-all flex items-center justify-between ${
                                isVoted
                                  ? 'border-[var(--acc)] bg-[var(--s1)]'
                                  : 'border-[var(--line)] bg-[var(--s2)] hover:border-[var(--tx)]/40'
                              }`}
                            >
                              {/* Background percentage progress bar */}
                              <div
                                className="absolute inset-y-0 left-0 bg-[var(--acc)]/20 transition-all duration-500 ease-out z-0"
                                style={{ width: `${pct}%` }}
                              />
                              <span className="relative z-10 truncate pr-2 text-[var(--tx)]">{opt.text}</span>
                              <span className="relative z-10 font-mono text-[11px] font-bold text-[var(--acc)]">
                                {pct}%
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-[var(--mut)] flex items-center justify-between pt-1">
                        <span>{msg.poll.totalVotes} votes cast</span>
                        <span>Tap option to vote</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[var(--mut)] italic pt-1">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--mut)] animate-typing-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--mut)] animate-typing-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--mut)] animate-typing-3" />
                </span>
                <span>Someone is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="relative pt-3 border-t border-[var(--line)]">
            {/* Attachment popover menu */}
            {attachmentMenuOpen && (
              <div className="absolute bottom-14 left-0 bg-[var(--s1)] border border-[var(--line)] rounded-2xl p-2 shadow-2xl z-20 space-y-1 w-44">
                <button
                  onClick={() => fileImageRef.current?.click()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--s2)] text-[var(--tx)] transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-[var(--acc)]" />
                  <span>Send Photo</span>
                </button>

                <button
                  onClick={() => fileDocRef.current?.click()}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--s2)] text-[var(--tx)] transition-colors"
                >
                  <FileText className="w-4 h-4 text-[var(--vio)]" />
                  <span>Send Document</span>
                </button>

                <button
                  onClick={() => {
                    setPollCreatorOpen(true);
                    setAttachmentMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--s2)] text-[var(--tx)] transition-colors"
                >
                  <BarChart2 className="w-4 h-4 text-[var(--warm)]" />
                  <span>Create Poll</span>
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                className="w-10 h-10 rounded-full bg-[var(--s2)] text-[var(--tx)] grid place-items-center shrink-0 hover:bg-[var(--line)] transition-colors"
                title="Attach file or poll"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message the room..."
                className="flex-1 bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-full px-4 py-2.5 text-xs outline-none focus:border-[var(--acc)] transition-colors"
              />

              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="w-10 h-10 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] grid place-items-center shrink-0 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden file inputs */}
            <input
              type="file"
              ref={fileImageRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <input type="file" ref={fileDocRef} onChange={handleDocUpload} className="hidden" />
          </div>

          {/* Interactive Poll Creator Drawer */}
          {pollCreatorOpen && (
            <div className="absolute inset-0 bg-[var(--s1)] rounded-[28px] p-5 flex flex-col justify-between z-30 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
                <h4 className="font-bold text-sm text-[var(--tx)]">New room poll</h4>
                <button
                  onClick={() => setPollCreatorOpen(false)}
                  className="w-7 h-7 rounded-full bg-[var(--s2)] grid place-items-center text-[var(--tx)]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                <div>
                  <label className="block text-xs font-semibold text-[var(--mut)] mb-1">Question</label>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Ask the room..."
                    className="w-full bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[var(--mut)]">Options</label>
                  {pollOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...pollOptions];
                          updated[idx].text = e.target.value;
                          setPollOptions(updated);
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-[var(--bg)] border border-[var(--line)] text-[var(--tx)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--acc)]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreatePoll}
                disabled={!pollQuestion.trim()}
                className="w-full py-3 rounded-full bg-[var(--acc)] text-[var(--acc-ink)] font-bold text-xs hover:scale-102 transition-transform disabled:opacity-50"
              >
                Send poll to room
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox full-screen viewer */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
        >
          <img
            src={lightboxImage}
            alt="Enlarged"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};
