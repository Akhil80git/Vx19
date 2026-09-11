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
  ChevronRight,
  Edit2,
  FolderPlus,
  Sparkles
} from 'lucide-react';

interface ChatViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

const DEFAULT_INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_welcome',
    text: 'Yeh aapka personal Self-Chat & Scratchpad hai. Yahan aap apne prompts, ideas, code snippets ya todo points likh kar save kar sakte hain. Har message ek alag box me dikhega aur use cross (X) se delete kiya ja sakta hai.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export const ChatView: React.FC<ChatViewProps> = ({
  project,
  onUpdateProject
}) => {
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
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState('');

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
      // If it's the last session, just clear its messages
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
    const confirmed = window.confirm('Kya aap is pure chat ke saare messages ek saath delete karna chahte hain?');
    if (!confirmed) return;

    const updated = sessions.map(s => {
      if (s.id === activeSession.id) {
        return { ...s, messages: [], updatedAt: new Date().toISOString() };
      }
      return s;
    });

    saveSessions(updated);
  };

  // Send a new message box
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputMessage.trim();
    if (!clean) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      text: clean,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = sessions.map(s => {
      if (s.id === activeSession.id) {
        // Auto-update title if it's the first message and title is default
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

  // Delete a single message box (the cross "X" requested by user)
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

  // Copy message text
  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 1500);
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

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col h-[calc(100vh-4.5rem)] min-h-[500px] bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-150">
      
      {/* Top Header Bar with Three-Line Menu (Hamburger) and Actions */}
      <div className="h-12 border-b border-slate-800 bg-slate-950/80 px-3 flex items-center justify-between gap-3 shrink-0">
        
        {/* Left: Three-Line Menu Icon for History & Current Chat Title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistoryDrawer(true)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer flex items-center gap-1.5"
            title="Chat History & Saved Sessions (3-Line Icon)"
          >
            <Menu className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold hidden sm:inline">History</span>
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
                className="bg-slate-900 border border-emerald-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => handleSaveTitle(activeSession.id)}
                className="text-emerald-400 p-0.5"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => {
                setEditingTitleId(activeSession?.id || null);
                setTitleInput(activeSession?.title || '');
              }}
              className="group flex items-center gap-1.5 cursor-pointer hover:bg-slate-900/60 px-2 py-1 rounded-lg transition"
              title="Click to rename this chat"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-xs font-bold text-white truncate max-w-[200px]">
                {activeSession?.title || 'Self Chat'}
              </span>
              <Edit2 className="w-2.5 h-2.5 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
            </div>
          )}

          <span className="text-[11px] text-slate-500 hidden md:inline font-mono">
            ({activeSession?.messages?.length || 0} boxes)
          </span>
        </div>

        {/* Right: + New Chat & Delete Entire Chat */}
        <div className="flex items-center gap-2">
          {/* + New Chat Button */}
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="h-7 px-2.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
            title="Start a fresh new chat session"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* Delete entire chat button */}
          {activeSession && activeSession.messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearCurrentChat}
              className="h-7 px-2 bg-slate-900 hover:bg-red-950/60 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
              title="Is pure chat ke saare messages ek saath delete karein"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Messages Area: Full Width Message Boxes with Cross (X) Icon */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
        {(!activeSession || activeSession.messages.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
            <MessageSquare className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-sm font-medium text-slate-400">Yeh Chat khali hai</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Neeche diye gaye input box me apne self notes, commands, instructions ya ideas type karein.
            </p>
          </div>
        ) : (
          activeSession.messages.map((msg, index) => {
            const isCopied = copiedMsgId === msg.id;

            return (
              /* FULL WIDTH MESSAGE BOX with Cross (X) delete button */
              <div
                key={msg.id}
                className="group relative w-full bg-slate-950/90 hover:bg-slate-950 border border-slate-800 hover:border-slate-700/90 rounded-xl p-3 shadow-sm transition duration-150 text-slate-200"
              >
                {/* Header of the message box: Cross (X) on the LEFT, Copy on the RIGHT */}
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-900 text-[11px] text-slate-400">
                  {/* Left: Cross (X) Delete Icon & Timestamp */}
                  <div className="flex items-center gap-2">
                    {/* Cross (X) to delete this message box on the LEFT side */}
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-0.5 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition cursor-pointer"
                      title="Delete this message box"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-[10px] text-slate-500">{msg.timestamp}</span>
                    <span className="text-[10px] text-slate-600">#{index + 1}</span>
                  </div>

                  {/* Right: 1-Click Copy Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className={`p-1 rounded transition cursor-pointer ${
                        isCopied ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Copy text"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Message Content (Full Width) */}
                <div className="font-sans text-xs sm:text-sm text-slate-100 whitespace-pre-wrap break-words leading-relaxed select-text">
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Bar */}
      <div className="p-2.5 sm:p-3 bg-slate-950 border-t border-slate-800 shrink-0">
        <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kuchh bhi likhein (notes, prompts, thoughts)... Press Enter to send"
            rows={2}
            className="flex-1 w-full bg-slate-900 border border-slate-700/80 focus:border-emerald-500 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none transition"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-md shadow-emerald-950/40"
            title="Send Message Box"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 px-1">
          <span>Enter dabane se send hoga, Shift + Enter se nayi line</span>
          <span>Self-Chat • Safe locally & synced with project</span>
        </div>
      </div>

      {/* History Drawer (Opens when Three-Line Menu Icon is clicked) */}
      {showHistoryDrawer && (
        <div className="absolute inset-0 z-30 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setShowHistoryDrawer(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80%] h-full bg-slate-950 border-r border-slate-800 p-4 flex flex-col shadow-2xl z-40 animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Chat History</h3>
              </div>
              <button
                onClick={() => setShowHistoryDrawer(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* + New Chat in Drawer */}
            <div className="my-3">
              <button
                onClick={handleCreateNewChat}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-950/30"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nayi Chat Shuru Karein</span>
              </button>
            </div>

            {/* List of Saved Chat Sessions */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-1 mb-1">
                Saved Sessions ({sessions.length})
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
                    className={`group w-full p-2.5 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer ${
                      isActive
                        ? 'bg-slate-800/90 border-emerald-500/50 text-white'
                        : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {s.messages.length} messages
                        </p>
                      </div>
                    </div>

                    {/* Delete chat button in history */}
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition"
                        title="Delete this chat session"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
              Self-Chat Sessions • Persisted with Project
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
