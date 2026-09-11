import React, { useState, useEffect, useRef } from 'react';
import { Project, ChatSession, ChatMessage } from '../../types';
import { 
  Menu, 
  Plus, 
  Trash2, 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Clock, 
  Edit2,
  Sparkles,
  Pin,
  Search,
  Download,
  Terminal,
  FileText,
  Lightbulb,
  CheckSquare,
  Bug,
  Code,
  Share2,
  Bookmark
} from 'lucide-react';

interface ChatViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  theme?: 'dark' | 'light';
}

const DEFAULT_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    text: 'Yeh aapka personal Self-Chat & Scratchpad hai. Yahan aap apne prompts, ideas, code snippets ya todo points likh kar save kar sakte hain. Har message ek attractive box me dikhega aur use cross (X) se delete kiya ja sakta hai.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tag: 'note'
  }
];

// Quick tags with aesthetic colors
const QUICK_TAGS = [
  { id: 'idea', label: 'Idea', icon: Lightbulb, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  { id: 'code', label: 'Code', icon: Code, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'note', label: 'Note', icon: FileText, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'task', label: 'Task', icon: CheckSquare, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' },
  { id: 'bug', label: 'Bug', icon: Bug, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
];

export const ChatView: React.FC<ChatViewProps> = ({
  project,
  onUpdateProject,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (project.chatSessions && project.chatSessions.length > 0) {
      return project.chatSessions;
    }
    return [
      {
        id: 'session_' + Date.now(),
        title: 'Notes & Ideas',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: DEFAULT_INITIAL_MESSAGES
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    if (project.chatSessions && project.chatSessions.length > 0) {
      return project.chatSessions[0].id;
    }
    return sessions[0]?.id || 'session_default';
  });

  const [inputMessage, setInputMessage] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('note');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync state if project prop updates
  useEffect(() => {
    if (project.chatSessions && project.chatSessions.length > 0) {
      setSessions(project.chatSessions);
      if (!project.chatSessions.some(s => s.id === activeSessionId)) {
        setActiveSessionId(project.chatSessions[0].id);
      }
    }
  }, [project.id, project.chatSessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages?.length]);

  // Helper to persist sessions to project
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    onUpdateProject({
      ...project,
      chatSessions: updatedSessions,
      updatedAt: new Date().toISOString()
    });
  };

  // Create a New Chat Session
  const handleCreateNewChat = () => {
    const newSessionNumber = sessions.length + 1;
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      title: `Chat ${newSessionNumber}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };

    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newSession.id);
    setShowHistoryDrawer(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Delete an entire chat session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      const updated = sessions.map(s => (s.id === sessionId ? { ...s, messages: [] } : s));
      saveSessions(updated);
      return;
    }

    const remaining = sessions.filter(s => s.id !== sessionId);
    saveSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0].id);
    }
  };

  // Delete all messages in the CURRENT chat
  const handleClearCurrentChat = () => {
    if (!activeSession || activeSession.messages.length === 0) return;
    const confirmed = window.confirm('Kya aap is chat ke saare messages ek saath delete karna chahte hain?');
    if (!confirmed) return;

    const updated = sessions.map(s => {
      if (s.id === activeSession.id) {
        return { ...s, messages: [], updatedAt: new Date().toISOString() };
      }
      return s;
    });

    saveSessions(updated);
  };

  // Detect tag from message text or manual tag
  const detectTag = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.startsWith('idea:') || lower.includes('idea ') || lower.startsWith('💡')) return 'idea';
    if (lower.startsWith('code:') || lower.includes('```') || lower.startsWith('const ') || lower.startsWith('npm ') || lower.startsWith('git ')) return 'code';
    if (lower.startsWith('todo:') || lower.startsWith('task:') || lower.startsWith('📌') || lower.startsWith('[ ]')) return 'task';
    if (lower.startsWith('bug:') || lower.startsWith('fix:') || lower.startsWith('error:')) return 'bug';
    return selectedTag || 'note';
  };

  // Send a new message box
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputMessage.trim();
    if (!clean) return;

    const tag = detectTag(clean);

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      text: clean,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tag,
      isPinned: false
    };

    const updated = sessions.map(s => {
      if (s.id === activeSession.id) {
        const isDefaultTitle = s.title.startsWith('Chat ') || s.title === 'Notes & Ideas';
        const newTitle = isDefaultTitle && s.messages.length === 0
          ? clean.slice(0, 24) + (clean.length > 24 ? '...' : '')
          : s.title;

        return {
          ...s,
          title: newTitle,
          messages: [...s.messages, newMsg],
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    saveSessions(updated);
    setInputMessage('');
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  // Handle Enter key (send on Enter, newline on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Delete a single message box (the cross "X")
  const handleDeleteMessage = (msgId: string) => {
    const updated = sessions.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          messages: s.messages.filter(m => m.id !== msgId),
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    saveSessions(updated);
  };

  // Toggle Pin message
  const handleTogglePin = (msgId: string) => {
    const updated = sessions.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          messages: s.messages.map(m => m.id === msgId ? { ...m, isPinned: !m.isPinned } : m),
          updatedAt: new Date().toISOString()
        };
      }
      return s;
    });

    saveSessions(updated);
  };

  // Copy single message text
  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  // Export / Copy all messages as formatted markdown
  const handleExportAll = () => {
    if (!activeSession || activeSession.messages.length === 0) return;
    const formatted = activeSession.messages.map((m, i) => {
      return `### #${i + 1} [${m.timestamp}] (${m.tag || 'note'})\n${m.text}\n`;
    }).join('\n---\n\n');

    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Rename Session title
  const handleSaveTitle = (sessionId: string) => {
    if (!titleInput.trim()) {
      setEditingTitleId(null);
      return;
    }
    const updated = sessions.map(s => 
      s.id === sessionId ? { ...s, title: titleInput.trim() } : s
    );
    saveSessions(updated);
    setEditingTitleId(null);
  };

  // Filter messages based on search query
  const displayMessages = (activeSession?.messages || []).filter(msg => {
    if (!searchQuery.trim()) return true;
    return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Sort pinned to top if desired
  const sortedMessages = [...displayMessages].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  // Helper to render message body (detects code blocks)
  const renderMessageContent = (text: string) => {
    const isCode = text.includes('```') || 
      text.startsWith('npm ') || 
      text.startsWith('git ') || 
      text.startsWith('docker ') || 
      text.startsWith('const ') || 
      text.startsWith('function ') ||
      text.startsWith('import ');

    if (text.includes('```')) {
      const parts = text.split('```');
      return (
        <div className="space-y-2">
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <div key={i} className="relative my-2 p-3 bg-slate-950/90 border border-slate-800/80 rounded-xl font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto shadow-inner">
                  <div className="absolute right-2 top-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(part.trim())}
                      className="p-1 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition"
                      title="Copy Code"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <pre className="select-all">{part.trim()}</pre>
                </div>
              );
            }
            return part.trim() ? (
              <p key={i} className="whitespace-pre-wrap leading-relaxed">{part}</p>
            ) : null;
          })}
        </div>
      );
    }

    if (isCode) {
      return (
        <div className="relative p-2.5 bg-slate-950/90 border border-slate-800/80 rounded-xl font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto shadow-inner select-all">
          <pre>{text}</pre>
        </div>
      );
    }

    return (
      <div className={`whitespace-pre-wrap break-words leading-relaxed select-text ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
        {text}
      </div>
    );
  };

  return (
    <div className={`relative w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-4.5rem)] min-h-[550px] ${
      isLight 
        ? 'bg-gradient-to-b from-white to-slate-50 border-slate-200 shadow-lg text-slate-800' 
        : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 shadow-2xl text-slate-100'
    } border rounded-2xl overflow-hidden animate-in fade-in duration-150`}>
      
      {/* Top Header Bar: Modern, Stylish with glowing accents */}
      <div className={`h-14 border-b ${
        isLight ? 'border-slate-200 bg-white/95' : 'border-slate-800/80 bg-slate-950/90'
      } backdrop-blur-md px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 z-10`}>
        
        {/* Left: History Button, Title & Active indicator */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
            } border transition cursor-pointer flex items-center gap-1.5 shadow-xs`}
            title="Chat History & Saved Sessions"
          >
            <Menu className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold hidden sm:inline">Sessions</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'}`}>
              {sessions.length}
            </span>
          </button>

          {/* Active Chat Title (Click to rename) */}
          {editingTitleId === activeSession?.id ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={() => handleSaveTitle(activeSession.id)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(activeSession.id)}
                autoFocus
                className={`${isLight ? 'bg-white border-emerald-500 text-slate-900' : 'bg-slate-900 border-emerald-500 text-white'} border rounded-xl px-2.5 py-1 text-xs focus:outline-none shadow-xs font-medium`}
              />
              <button
                onClick={() => handleSaveTitle(activeSession.id)}
                className="text-emerald-500 p-1 hover:bg-emerald-500/10 rounded-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => {
                setEditingTitleId(activeSession?.id || null);
                setTitleInput(activeSession?.title || '');
              }}
              className={`group flex items-center gap-2 cursor-pointer ${
                isLight ? 'hover:bg-slate-100' : 'hover:bg-slate-800/80'
              } px-2.5 py-1 rounded-xl transition border border-transparent hover:border-slate-700/30`}
              title="Click to rename this chat session"
            >
              <div className="relative flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <span className={`text-xs sm:text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'} truncate max-w-[150px] sm:max-w-[260px]`}>
                {activeSession?.title || 'Notes & Ideas'}
              </span>
              <Edit2 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
            </div>
          )}
        </div>

        {/* Right Actions: Search Filter, Export, Clear, + New Chat */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search Toggle */}
          {showSearch ? (
            <div className="flex items-center gap-1 bg-slate-950/60 border border-emerald-500/50 rounded-xl px-2 py-0.5 animate-in fade-in duration-100">
              <Search className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boxes..."
                autoFocus
                className="w-24 sm:w-36 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className={`p-1.5 rounded-xl ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              } transition cursor-pointer`}
              title="Search messages in this chat"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Export / Copy All */}
          {activeSession && activeSession.messages.length > 0 && (
            <button
              type="button"
              onClick={handleExportAll}
              className={`h-8 px-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border ${
                isLight 
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
              } shadow-xs`}
              title="Copy entire chat to clipboard"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copiedAll ? 'Copied All!' : 'Export'}</span>
            </button>
          )}

          {/* Clear Current Chat */}
          {activeSession && activeSession.messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearCurrentChat}
              className={`h-8 px-2 rounded-xl text-xs font-medium flex items-center gap-1 transition cursor-pointer border ${
                isLight 
                  ? 'bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border-slate-200 hover:border-red-200' 
                  : 'bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 border-slate-800 hover:border-red-500/30'
              }`}
              title="Clear all messages from this session"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
            </button>
          )}

          {/* + New Chat Button with Emerald Accent */}
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="h-8 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-950/30 shrink-0"
            title="Start a fresh new chat session"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Messages Area: Attractive Box Design with Dynamic Width & Polished Elevation */}
      <div className={`flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col items-start space-y-3.5 ${
        isLight ? 'bg-slate-50/70' : 'bg-slate-950/40'
      }`}>
        {(!activeSession || activeSession.messages.length === 0) ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">
              <Sparkles className="w-8 h-8 mx-auto" />
            </div>
            <h4 className={`text-base font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
              Yeh Chat Session Khali Hai
            </h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Neeche diye gaye input box me apne prompts, command notes, ideas ya tasks likhein. Har message ek khoobsurat card me save hoga!
            </p>
            {/* Starter Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 max-w-md">
              {QUICK_TAGS.map(tag => {
                const IconComponent = tag.icon;
                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setInputMessage(`${tag.label}: `);
                      setSelectedTag(tag.id);
                      textareaRef.current?.focus();
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
                      isLight 
                        ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700' 
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 text-emerald-500" />
                    <span>+ Add {tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          sortedMessages.map((msg, index) => {
            const isCopied = copiedMsgId === msg.id;
            const tagObj = QUICK_TAGS.find(t => t.id === msg.tag) || QUICK_TAGS[2]; // Default to note
            const TagIcon = tagObj.icon;

            return (
              /* ATTRACTIVE BOX DESIGN (Requested by User) */
              <div
                key={msg.id}
                className={`group relative w-fit min-w-[240px] sm:min-w-[320px] max-w-[96%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 transition duration-200 border ${
                  msg.isPinned
                    ? isLight
                      ? 'bg-amber-50/80 border-amber-300/80 shadow-md ring-1 ring-amber-400/40 text-slate-900'
                      : 'bg-gradient-to-br from-slate-900 to-amber-950/20 border-amber-500/40 shadow-xl ring-1 ring-amber-500/20 text-slate-100'
                    : isLight
                    ? 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-sm hover:shadow-md'
                    : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700/80 text-slate-100 shadow-md hover:shadow-lg'
                }`}
              >
                {/* Header of the Message Card: Cross (X) on LEFT, Tag, Timestamp, Pin, and Copy on RIGHT */}
                <div className={`flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b ${
                  isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/70 text-slate-400'
                } text-[11px]`}>
                  
                  {/* Left Side: Cross (X) delete button + Tag pill + Index */}
                  <div className="flex items-center gap-2">
                    {/* Delete Cross (X) with smooth hover red pill */}
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className={`p-1 rounded-lg transition cursor-pointer ${
                        isLight 
                          ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' 
                          : 'text-slate-500 hover:text-red-400 hover:bg-red-950/60'
                      }`}
                      title="Delete this message box"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Tag badge with icon & color */}
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold flex items-center gap-1 font-mono uppercase tracking-wider ${tagObj.color}`}>
                      <TagIcon className="w-3 h-3" />
                      <span>{tagObj.label}</span>
                    </span>

                    {/* Index sequence number */}
                    <span className="text-[10px] font-mono text-slate-400">#{index + 1}</span>

                    {/* Timestamp */}
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-2.5 h-2.5" />
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Right Side: Pin toggle and 1-Click Copy */}
                  <div className="flex items-center gap-1">
                    {/* Pin button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePin(msg.id)}
                      className={`p-1 rounded-lg transition cursor-pointer ${
                        msg.isPinned
                          ? 'text-amber-400 bg-amber-400/10'
                          : isLight
                          ? 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                          : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                      }`}
                      title={msg.isPinned ? 'Unpin message' : 'Pin message to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${msg.isPinned ? 'fill-amber-400' : ''}`} />
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className={`p-1 rounded-lg transition cursor-pointer ${
                        isCopied 
                          ? 'text-emerald-500 bg-emerald-50' 
                          : isLight 
                            ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Copy text"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Message Content: Clean typography & smart code formatting */}
                <div className="text-xs sm:text-sm">
                  {renderMessageContent(msg.text)}
                </div>

                {/* Bottom Card Footer: Character count & subtle status */}
                <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity font-mono">
                  <span>{msg.text.length} chars • {msg.text.trim().split(/\s+/).length} words</span>
                  {msg.isPinned && <span className="text-amber-400 font-semibold">★ Pinned</span>}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Bar: Sleek Floating Container with Quick Tag Chips */}
      <div className={`p-3 sm:p-4 border-t ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950/95 border-slate-800'
      } shrink-0 space-y-2.5`}>
        
        {/* Quick Starter / Tag Chips row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium shrink-0 mr-1">Tag:</span>
          {QUICK_TAGS.map(tag => {
            const isSelected = selectedTag === tag.id;
            const Icon = tag.icon;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTag(tag.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition cursor-pointer shrink-0 border ${
                  isSelected 
                    ? tag.color + ' ring-1 ring-emerald-500/40 font-semibold shadow-xs'
                    : isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200' 
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Form with modern focus styling */}
        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
          <div className={`flex-1 relative rounded-2xl border transition-all ${
            isLight 
              ? 'bg-white border-slate-300 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-xs' 
              : 'bg-slate-900/90 border-slate-700/80 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-inner'
          }`}>
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type your ${selectedTag} here... Press Enter to send, Shift + Enter for new line`}
              rows={2}
              className={`w-full bg-transparent p-3 text-xs sm:text-sm focus:outline-none resize-none leading-relaxed ${
                isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="h-12 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-30 text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md shadow-emerald-950/40"
            title="Send Message Box"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
          <span>Enter ↵ to send • Shift + Enter for newline</span>
          <span>{activeSession?.messages?.length || 0} boxes in this session</span>
        </div>
      </div>

      {/* History Drawer: Sleek and Beautiful */}
      {showHistoryDrawer && (
        <div className="absolute inset-0 z-30 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setShowHistoryDrawer(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className={`relative w-80 max-w-[85%] h-full ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
          } border-r p-4 flex flex-col shadow-2xl z-40 animate-in slide-in-from-left duration-200`}>
            
            {/* Drawer Header */}
            <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-emerald-500" />
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Saved Sessions</h3>
              </div>
              <button
                onClick={() => setShowHistoryDrawer(false)}
                className={`p-1.5 rounded-lg ${isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* + New Chat in Drawer */}
            <div className="my-3">
              <button
                onClick={handleCreateNewChat}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nayi Chat Shuru Karein</span>
              </button>
            </div>

            {/* List of Saved Chat Sessions */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1">
                Sessions ({sessions.length})
              </p>

              {sessions.map((s) => {
                const isActive = s.id === activeSession?.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSessionId(s.id);
                      setShowHistoryDrawer(false);
                    }}
                    className={`group w-full p-3 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer ${
                      isActive
                        ? isLight
                          ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 font-semibold shadow-xs'
                          : 'bg-slate-900 border-emerald-500/60 text-white shadow-md'
                        : isLight
                          ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {s.messages.length} messages
                        </p>
                      </div>
                    </div>

                    {/* Delete chat button in history */}
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className={`opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 rounded-lg ${isLight ? 'hover:bg-slate-200' : 'hover:bg-slate-800'} transition`}
                        title="Delete this chat session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer note */}
            <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'} text-[10px] text-slate-400 text-center font-mono`}>
              Saved Sessions • Synced with Project
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
