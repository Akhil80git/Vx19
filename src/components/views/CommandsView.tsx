import React, { useState, useEffect, useRef } from 'react';
import { Project, CommandItem } from '../../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  X,
  Box,
  Database,
  Folder,
  Layers,
  Cloud,
  RefreshCw,
  Save,
  Palette,
  GitBranch,
  Code2
} from 'lucide-react';

interface CommandsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

const DEFAULT_CATEGORIES = ['npm', 'db', 'folder', 'git', 'docker', 'dev'];

// Distinct, subtle ("feeke") color palettes for each category
export function getCategoryStyle(cat: string) {
  const c = (cat || '').toLowerCase().trim();
  switch (c) {
    case 'npm':
      return {
        pill: 'bg-rose-950/30 text-rose-300 border-rose-900/40 hover:bg-rose-950/60',
        active: 'bg-rose-950/90 text-rose-200 border-rose-500/80 shadow-xs shadow-rose-950/60 ring-1 ring-rose-500/50',
        badge: 'bg-rose-950/40 text-rose-300 border-rose-800/50',
      };
    case 'db':
      return {
        pill: 'bg-amber-950/30 text-amber-300 border-amber-900/40 hover:bg-amber-950/60',
        active: 'bg-amber-950/90 text-amber-200 border-amber-500/80 shadow-xs shadow-amber-950/60 ring-1 ring-amber-500/50',
        badge: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
      };
    case 'folder':
      return {
        pill: 'bg-blue-950/30 text-blue-300 border-blue-900/40 hover:bg-blue-950/60',
        active: 'bg-blue-950/90 text-blue-200 border-blue-500/80 shadow-xs shadow-blue-950/60 ring-1 ring-blue-500/50',
        badge: 'bg-blue-950/40 text-blue-300 border-blue-800/50',
      };
    case 'git':
      return {
        pill: 'bg-orange-950/30 text-orange-300 border-orange-900/40 hover:bg-orange-950/60',
        active: 'bg-orange-950/90 text-orange-200 border-orange-500/80 shadow-xs shadow-orange-950/60 ring-1 ring-orange-500/50',
        badge: 'bg-orange-950/40 text-orange-300 border-orange-800/50',
      };
    case 'docker':
      return {
        pill: 'bg-sky-950/30 text-sky-300 border-sky-900/40 hover:bg-sky-950/60',
        active: 'bg-sky-950/90 text-sky-200 border-sky-500/80 shadow-xs shadow-sky-950/60 ring-1 ring-sky-500/50',
        badge: 'bg-sky-950/40 text-sky-300 border-sky-800/50',
      };
    case 'dev':
      return {
        pill: 'bg-purple-950/30 text-purple-300 border-purple-900/40 hover:bg-purple-950/60',
        active: 'bg-purple-950/90 text-purple-200 border-purple-500/80 shadow-xs shadow-purple-950/60 ring-1 ring-purple-500/50',
        badge: 'bg-purple-950/40 text-purple-300 border-purple-800/50',
      };
    case 'dependencies':
      return {
        pill: 'bg-emerald-950/30 text-emerald-300 border-emerald-900/40 hover:bg-emerald-950/60',
        active: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-xs shadow-emerald-950/60 ring-1 ring-emerald-500/50',
        badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
      };
    default: {
      const hues = [
        {
          pill: 'bg-teal-950/30 text-teal-300 border-teal-900/40 hover:bg-teal-950/60',
          active: 'bg-teal-950/90 text-teal-200 border-teal-500/80 ring-1 ring-teal-500/50',
          badge: 'bg-teal-950/40 text-teal-300 border-teal-800/50',
        },
        {
          pill: 'bg-indigo-950/30 text-indigo-300 border-indigo-900/40 hover:bg-indigo-950/60',
          active: 'bg-indigo-950/90 text-indigo-200 border-indigo-500/80 ring-1 ring-indigo-500/50',
          badge: 'bg-indigo-950/40 text-indigo-300 border-indigo-800/50',
        },
        {
          pill: 'bg-fuchsia-950/30 text-fuchsia-300 border-fuchsia-900/40 hover:bg-fuchsia-950/60',
          active: 'bg-fuchsia-950/90 text-fuchsia-200 border-fuchsia-500/80 ring-1 ring-fuchsia-500/50',
          badge: 'bg-fuchsia-950/40 text-fuchsia-300 border-fuchsia-800/50',
        }
      ];
      let hash = 0;
      for (let i = 0; i < c.length; i++) hash = c.charCodeAt(i) + ((hash << 5) - hash);
      return hues[Math.abs(hash) % hues.length];
    }
  }
}

// Command text color presets
export const COMMAND_COLOR_OPTIONS = [
  { id: 'cyan', label: 'Cyan', class: 'text-cyan-300', bg: 'bg-cyan-400' },
  { id: 'emerald', label: 'Green', class: 'text-emerald-300', bg: 'bg-emerald-400' },
  { id: 'amber', label: 'Yellow', class: 'text-amber-300', bg: 'bg-amber-400' },
  { id: 'sky', label: 'Sky Blue', class: 'text-sky-300', bg: 'bg-sky-400' },
  { id: 'rose', label: 'Rose Pink', class: 'text-rose-300', bg: 'bg-rose-400' },
  { id: 'violet', label: 'Violet', class: 'text-violet-300', bg: 'bg-violet-400' },
  { id: 'orange', label: 'Orange', class: 'text-orange-300', bg: 'bg-orange-400' },
  { id: 'white', label: 'White', class: 'text-slate-100', bg: 'bg-slate-100' },
];

export const CommandsView: React.FC<CommandsViewProps> = ({
  project,
  onUpdateProject
}) => {
  // Local working copy of commands so typing does NOT trigger DB writes on every keystroke
  const [commands, setCommands] = useState<CommandItem[]>(project.commands || []);
  
  // Track IDs of commands that have been modified locally but not yet committed
  const [dirtyCmdIds, setDirtyCmdIds] = useState<Set<string>>(new Set());
  
  // Categories state
  const [categories, setCategories] = useState<string[]>(() => {
    const existing = project.commandCategories && project.commandCategories.length > 0 
      ? project.commandCategories 
      : DEFAULT_CATEGORIES;
    const fromCmds = (project.commands || []).map(c => c.category).filter(Boolean);
    return Array.from(new Set([...existing, ...fromCmds]));
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Command text color preference (applies to all commands simultaneously)
  const [cmdColor, setCmdColor] = useState<string>(() => {
    return localStorage.getItem('commands_custom_color') || 'text-cyan-300';
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  // New Category input toggle
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Quick live new command input at the bottom
  const [newCmdText, setNewCmdText] = useState('');
  const [newCmdComment, setNewCmdComment] = useState('');
  const newCmdTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize helper for textareas
  const autoResize = (target: HTMLTextAreaElement) => {
    target.style.height = 'auto';
    target.style.height = `${Math.max(28, target.scrollHeight)}px`;
  };

  // Sync from props ONLY when external project.commands change and we aren't actively editing dirty items
  useEffect(() => {
    if (dirtyCmdIds.size === 0) {
      setCommands(project.commands || []);
    }
    if (project.commandCategories && project.commandCategories.length > 0) {
      const fromCmds = (project.commands || []).map(c => c.category).filter(Boolean);
      setCategories(Array.from(new Set([...project.commandCategories, ...fromCmds])));
    }
  }, [project.id, project.commands, project.commandCategories]);

  // Master Sync to Database (Persist to Firestore / Parent)
  const handleSyncToDatabase = (updatedCommandsList?: CommandItem[]) => {
    setIsSyncing(true);
    const toSave = updatedCommandsList || commands;

    onUpdateProject({
      ...project,
      commands: toSave,
      commandCategories: categories,
      updatedAt: new Date().toISOString()
    });

    setDirtyCmdIds(new Set());
    setIsSyncing(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2000);
  };

  // Save a single command row's edits to the database
  const handleSaveSingleCommand = (id: string) => {
    const updatedDirty = new Set(dirtyCmdIds);
    updatedDirty.delete(id);
    setDirtyCmdIds(updatedDirty);

    onUpdateProject({
      ...project,
      commands: commands,
      commandCategories: categories,
      updatedAt: new Date().toISOString()
    });

    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 1500);
  };

  // Direct In-Place Edit of Command Text (NO DB calls on keystroke!)
  const handleCommandChange = (id: string, updatedCmd: string) => {
    const updated = commands.map(c => (c.id === id ? { ...c, cmd: updatedCmd } : c));
    setCommands(updated);
    setDirtyCmdIds(prev => new Set(prev).add(id));
  };

  // Direct In-Place Edit of Command Comment (NO DB calls on keystroke!)
  const handleCommentChange = (id: string, updatedComment: string) => {
    const updated = commands.map(c => 
      c.id === id ? { ...c, description: updatedComment } : c
    );
    setCommands(updated);
    setDirtyCmdIds(prev => new Set(prev).add(id));
  };

  // Copy single command
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Copy all commands as bash script
  const handleCopyAll = () => {
    if (commands.length === 0) return;
    const grouped: Record<string, CommandItem[]> = {};
    commands.forEach(c => {
      const cat = c.category || 'general';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(c);
    });

    let script = `#!/usr/bin/env bash\n# CLI Setup Commands for ${project.title}\n\n`;
    for (const cat in grouped) {
      script += `# ===================== [${cat.toUpperCase()}] =====================\n`;
      grouped[cat].forEach(c => {
        if (c.description) {
          script += `# ${c.description}\n`;
        }
        script += `${c.cmd}\n`;
      });
      script += `\n`;
    }

    navigator.clipboard.writeText(script);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  // Add new Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;

    if (!categories.includes(cleanName)) {
      const updated = [...categories, cleanName];
      setCategories(updated);
      setActiveCategory(cleanName);
      onUpdateProject({
        ...project,
        commandCategories: updated,
        updatedAt: new Date().toISOString()
      });
    } else {
      setActiveCategory(cleanName);
    }
    setNewCatName('');
    setShowAddCat(false);
  };

  // Delete Category
  const handleDeleteCategory = (catToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedCats = categories.filter(c => c !== catToDelete);
    setCategories(updatedCats);
    if (activeCategory === catToDelete) {
      setActiveCategory('all');
    }
    onUpdateProject({
      ...project,
      commandCategories: updatedCats,
      updatedAt: new Date().toISOString()
    });
  };

  // Delete single command
  const handleDeleteCommand = (id: string) => {
    const updated = commands.filter(c => c.id !== id);
    setCommands(updated);
    const updatedDirty = new Set(dirtyCmdIds);
    updatedDirty.delete(id);
    setDirtyCmdIds(updatedDirty);

    // Save deletion to DB
    handleSyncToDatabase(updated);
  };

  // Add new Command row
  const handleAddNewCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newCmdText.trim()) return;

    const targetCat = activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm');

    const newItem: CommandItem = {
      id: 'cmd_' + Date.now(),
      cmd: newCmdText.trim(),
      category: targetCat,
      description: newCmdComment.trim()
    };

    const updated = [...commands, newItem];
    setCommands(updated);
    setNewCmdText('');
    setNewCmdComment('');

    // Persist new command immediately
    handleSyncToDatabase(updated);

    if (newCmdTextareaRef.current) {
      newCmdTextareaRef.current.style.height = 'auto';
      newCmdTextareaRef.current.focus();
    }
  };

  const filteredCommands = activeCategory === 'all'
    ? commands
    : commands.filter(c => (c.category || '').toLowerCase() === activeCategory.toLowerCase());

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'npm':
        return <Box className="w-3 h-3 text-red-400" />;
      case 'db':
        return <Database className="w-3 h-3 text-amber-400" />;
      case 'folder':
        return <Folder className="w-3 h-3 text-blue-400" />;
      case 'docker':
        return <Layers className="w-3 h-3 text-cyan-400" />;
      default:
        return <Terminal className="w-3 h-3 text-emerald-400" />;
    }
  };

  const hasUnsavedChanges = dirtyCmdIds.size > 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-1.5 select-none animate-in fade-in duration-150">
      
      {/* Top Bar: Direct Category + Button, Category Pills, Sync Button & Copy Script */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Left Side: + Category Button & Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
          
          {/* Direct + Icon Button to Add Category */}
          {showAddCat ? (
            <form onSubmit={handleAddCategory} className="flex items-center gap-1 bg-slate-900 border border-emerald-500/50 rounded-lg px-2 py-0.5">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name (npm, db, etc)..."
                autoFocus
                className="w-32 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="text-emerald-400 hover:text-emerald-300 disabled:opacity-40 p-0.5"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => { setShowAddCat(false); setNewCatName(''); }}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddCat(true)}
              className="h-7 px-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
              title="Add New Category"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Category</span>
            </button>
          )}

          {/* All Filter Tab */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>All</span>
            <span className="text-[10px] opacity-75 font-mono">({commands.length})</span>
          </button>

          {/* Dynamic Category Tabs with Feeke (subtle pastel) distinct colors */}
          {categories.map((cat) => {
            const count = commands.filter(c => (c.category || '').toLowerCase() === cat.toLowerCase()).length;
            const isActive = activeCategory === cat;
            const style = getCategoryStyle(cat);

            return (
              <div
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                  isActive ? style.active : style.pill
                }`}
              >
                {getCategoryIcon(cat)}
                <span className="uppercase font-mono text-[11px] tracking-wide">{cat}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>

                {/* Subtle delete category cross */}
                {cat !== 'npm' && cat !== 'db' && (
                  <button
                    onClick={(e) => handleDeleteCategory(cat, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition ml-0.5 p-0.5"
                    title={`Delete category "${cat}"`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Command Color Setting Dropdown right next to categories! */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="h-7 px-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Command Text Color Chunein (Ek saath sabhi commands change honge)"
            >
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span className={`w-2.5 h-2.5 rounded-full ${COMMAND_COLOR_OPTIONS.find(c => c.class === cmdColor)?.bg || 'bg-cyan-400'}`} />
              <span className="hidden sm:inline text-[11px] font-mono">Color</span>
            </button>

            {showColorPicker && (
              <div className="absolute left-0 mt-1.5 p-2.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 w-56 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>Command Color</span>
                  <button 
                    type="button" 
                    onClick={() => setShowColorPicker(false)} 
                    className="text-slate-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {COMMAND_COLOR_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setCmdColor(opt.class);
                        localStorage.setItem('commands_custom_color', opt.class);
                        setShowColorPicker(false);
                      }}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-mono transition text-left cursor-pointer ${
                        cmdColor === opt.class ? 'bg-slate-800 font-bold ring-1 ring-emerald-500/50' : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${opt.bg} shrink-0`} />
                      <span className={`${opt.class} text-[11px]`}>{opt.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 leading-tight">
                  * Sabhi commands ka color ek saath badal jayega. Comment aur category par asar nahi hoga.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Sync Button, Copy Script */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sync Button: Commits all pending edits to Database */}
          <button
            onClick={() => handleSyncToDatabase()}
            disabled={isSyncing}
            className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40 animate-pulse'
                : syncSuccess
                ? 'bg-emerald-600/90 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
            title="Database me changes sync karein"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : syncSuccess ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <Cloud className={`w-3.5 h-3.5 ${hasUnsavedChanges ? 'text-amber-200' : 'text-slate-400'}`} />
            )}
            <span>
              {isSyncing 
                ? 'Syncing...' 
                : syncSuccess 
                ? 'Synced ✓' 
                : hasUnsavedChanges 
                ? `Sync (${dirtyCmdIds.size})` 
                : 'Sync'}
            </span>
          </button>

          {/* Copy Script */}
          {commands.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="h-7 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Copy all commands as bash script"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAll ? 'Copied!' : 'Copy Script'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Commands List: Dynamic-width rows with [Copy] [Category] [$ Command / # Comment] [Actions] */}
      <div className="flex flex-col items-start space-y-2 w-full">
        {filteredCommands.length === 0 && (
          <div className="w-full py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-xl">
            Abhi koi command nahi hai. Neeche diye gaye box me command likhein aur Enter dabayein.
          </div>
        )}

        {filteredCommands.map((item) => {
          const isCopied = copiedId === item.id;
          const isDirty = dirtyCmdIds.has(item.id);
          const cmdLength = item.cmd.length;
          const commentLength = (item.description || '').length;
          const maxLen = Math.max(cmdLength, commentLength);
          const dynamicCh = Math.min(78, Math.max(16, maxLen + 3));
          const catStyle = getCategoryStyle(item.category || 'npm');

          return (
            <div
              key={item.id}
              className={`group relative w-fit max-w-full flex items-start gap-2.5 p-2.5 bg-slate-900/90 hover:bg-slate-900 border rounded-xl transition duration-100 shadow-xs ${
                isDirty 
                  ? 'border-amber-500/60 bg-slate-900' 
                  : 'border-slate-800/90 hover:border-slate-700/80'
              }`}
            >
              {/* 1. Left: Copy Icon Button */}
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.cmd)}
                className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer self-start mt-0.5 ${
                  isCopied ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Copy command"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* 2. Bagal mai Name (Category badge: NPM, DB, etc. with distinct feeka color) */}
              <span className={`self-start mt-1 px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md shrink-0 ${catStyle.badge}`}>
                {item.category || 'npm'}
              </span>

              {/* 3. Command & Comment Column */}
              <div
                className="flex flex-col min-w-0"
                style={{
                  width: `${dynamicCh}ch`,
                  maxWidth: '100%',
                }}
              >
                {/* Command: Bada Large Font, Customizable Color */}
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-600 font-mono select-none text-base font-bold shrink-0 self-start mt-0.5">$</span>
                  <textarea
                    value={item.cmd}
                    rows={1}
                    onChange={(e) => {
                      handleCommandChange(item.id, e.target.value);
                      autoResize(e.target);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSaveSingleCommand(item.id);
                      }
                    }}
                    placeholder="Command string..."
                    className={`w-full bg-transparent ${cmdColor} font-mono text-base font-bold focus:outline-none resize-none overflow-hidden leading-snug tracking-tight py-0`}
                    style={{ height: 'auto', minHeight: '24px' }}
                    ref={(el) => {
                      if (el) autoResize(el);
                    }}
                  />
                </div>

                {/* Comment: Jitne se command shuru hui theek usi ke neeche, bahut feeka & small */}
                <div className="flex items-start gap-1 pl-3.5 mt-0.5">
                  <span className="text-slate-700 font-mono text-[11px] select-none shrink-0 mt-0.5">#</span>
                  <textarea
                    rows={1}
                    value={item.description || ''}
                    onChange={(e) => {
                      handleCommentChange(item.id, e.target.value);
                      autoResize(e.target);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        handleSaveSingleCommand(item.id);
                      }
                    }}
                    placeholder="comment / note (optional)..."
                    className="w-full bg-transparent text-xs italic text-slate-500 focus:text-slate-300 placeholder-slate-700/80 focus:outline-none resize-none overflow-hidden leading-relaxed py-0"
                    style={{ height: 'auto', minHeight: '18px' }}
                    ref={(el) => {
                      if (el) autoResize(el);
                    }}
                  />
                </div>
              </div>

              {/* 4. Right: Save Button (if dirty) + Delete Trash Icon */}
              <div className="flex items-center gap-1.5 shrink-0 self-start mt-1 ml-1">
                {isDirty && (
                  <button
                    type="button"
                    onClick={() => handleSaveSingleCommand(item.id)}
                    className="h-6 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs animate-in fade-in"
                    title="Save this edit (Ctrl + Enter)"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteCommand(item.id)}
                  className="p-1 text-slate-600 hover:text-red-400 opacity-20 group-hover:opacity-80 hover:!opacity-100 transition-opacity rounded cursor-pointer"
                  title="Delete command"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Live Bottom Input Box: Dynamic-width matching the exact same row structure */}
        <form
          onSubmit={handleAddNewCommand}
          className="w-fit max-w-full flex items-start gap-2.5 p-2.5 bg-slate-950/90 border border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl text-xs transition duration-150 shadow-inner"
        >
          <span className="p-1 text-emerald-400 shrink-0 self-start mt-0.5">
            <Plus className="w-3.5 h-3.5" />
          </span>

          <span className={`self-start mt-1 px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md shrink-0 ${getCategoryStyle(activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')).badge}`}>
            {activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')}
          </span>

          <div
            className="flex flex-col min-w-0"
            style={{
              width: `${Math.min(78, Math.max(24, Math.max(newCmdText.length, newCmdComment.length) + 4))}ch`,
              maxWidth: '100%',
            }}
          >
            <div className="flex items-start gap-1.5">
              <span className="text-slate-600 font-mono select-none text-base font-bold shrink-0 self-start mt-0.5">$</span>
              <textarea
                ref={newCmdTextareaRef}
                rows={1}
                value={newCmdText}
                onChange={(e) => {
                  setNewCmdText(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNewCommand();
                  }
                }}
                placeholder="Nayi command likhein..."
                className={`w-full bg-transparent ${cmdColor} font-mono text-base font-bold focus:outline-none placeholder-slate-600 resize-none overflow-hidden leading-snug tracking-tight py-0`}
                style={{ height: 'auto', minHeight: '24px' }}
              />
            </div>

            <div className="flex items-start gap-1 pl-3.5 mt-0.5">
              <span className="text-slate-700 font-mono text-[11px] select-none shrink-0 mt-0.5">#</span>
              <textarea
                rows={1}
                value={newCmdComment}
                onChange={(e) => {
                  setNewCmdComment(e.target.value);
                  autoResize(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddNewCommand();
                  }
                }}
                placeholder="comment / note (optional)..."
                className="w-full bg-transparent text-xs italic text-slate-500 focus:text-slate-300 placeholder-slate-700/80 focus:outline-none resize-none overflow-hidden leading-relaxed py-0"
                style={{ height: 'auto', minHeight: '18px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!newCmdText.trim()}
            className="h-7 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0 self-start mt-0.5 ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

    </div>
  );
};
