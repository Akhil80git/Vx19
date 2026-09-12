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
  theme?: 'dark' | 'light';
}

const DEFAULT_CATEGORIES = ['npm', 'db', 'folder', 'git', 'docker', 'dev'];

// Distinct, subtle ("feeke") color palettes for each category in Dark and Light mode
export function getCategoryStyle(cat: string, isLight: boolean = false) {
  const c = (cat || '').toLowerCase().trim();
  if (isLight) {
    switch (c) {
      case 'npm':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
          active: 'bg-rose-100 text-rose-900 border-rose-400 ring-1 ring-rose-400/50 shadow-xs',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
        };
      case 'db':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
          active: 'bg-amber-100 text-amber-900 border-amber-400 ring-1 ring-amber-400/50 shadow-xs',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'folder':
        return {
          pill: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          active: 'bg-blue-100 text-blue-900 border-blue-400 ring-1 ring-blue-400/50 shadow-xs',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'git':
        return {
          pill: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
          active: 'bg-orange-100 text-orange-900 border-orange-400 ring-1 ring-orange-400/50 shadow-xs',
          badge: 'bg-orange-50 text-orange-700 border-orange-200',
        };
      case 'docker':
        return {
          pill: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
          active: 'bg-sky-100 text-sky-900 border-sky-400 ring-1 ring-sky-400/50 shadow-xs',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'dev':
        return {
          pill: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
          active: 'bg-purple-100 text-purple-900 border-purple-400 ring-1 ring-purple-400/50 shadow-xs',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'dependencies':
        return {
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          active: 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xs',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      default: {
        const hues = [
          {
            pill: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
            active: 'bg-teal-100 text-teal-900 border-teal-400 ring-1 ring-teal-400/50 shadow-xs',
            badge: 'bg-teal-50 text-teal-700 border-teal-200',
          },
          {
            pill: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
            active: 'bg-indigo-100 text-indigo-900 border-indigo-400 ring-1 ring-indigo-400/50 shadow-xs',
            badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          },
          {
            pill: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 hover:bg-fuchsia-100',
            active: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-400 ring-1 ring-fuchsia-400/50 shadow-xs',
            badge: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
          }
        ];
        let hash = 0;
        for (let i = 0; i < c.length; i++) hash = c.charCodeAt(i) + ((hash << 5) - hash);
        return hues[Math.abs(hash) % hues.length];
      }
    }
  }

  // Dark Mode colors
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

export interface CommandColorOption {
  id: string;
  label: string;
  darkText: string;
  lightText: string;
  bg: string;
}

// Command text color presets with high-contrast pairs for Dark and Light mode
export const COMMAND_COLOR_OPTIONS: CommandColorOption[] = [
  { id: 'cyan', label: 'Cyan', darkText: 'text-cyan-300', lightText: 'text-cyan-700', bg: 'bg-cyan-500' },
  { id: 'emerald', label: 'Green', darkText: 'text-emerald-300', lightText: 'text-emerald-700', bg: 'bg-emerald-500' },
  { id: 'amber', label: 'Gold/Yellow', darkText: 'text-amber-300', lightText: 'text-amber-700', bg: 'bg-amber-500' },
  { id: 'sky', label: 'Sky Blue', darkText: 'text-sky-300', lightText: 'text-sky-700', bg: 'bg-sky-500' },
  { id: 'rose', label: 'Rose Pink', darkText: 'text-rose-300', lightText: 'text-rose-700', bg: 'bg-rose-500' },
  { id: 'violet', label: 'Violet', darkText: 'text-violet-300', lightText: 'text-violet-700', bg: 'bg-violet-500' },
  { id: 'orange', label: 'Orange', darkText: 'text-orange-300', lightText: 'text-orange-700', bg: 'bg-orange-500' },
  { id: 'mono', label: 'High Contrast', darkText: 'text-slate-100', lightText: 'text-slate-900', bg: 'bg-slate-500' },
];

export function getActiveCommandColorClass(colorId: string, isLight: boolean): string {
  let normalized = (colorId || '').toLowerCase();
  if (normalized.includes('cyan')) normalized = 'cyan';
  else if (normalized.includes('emerald') || normalized.includes('green')) normalized = 'emerald';
  else if (normalized.includes('amber') || normalized.includes('yellow')) normalized = 'amber';
  else if (normalized.includes('sky')) normalized = 'sky';
  else if (normalized.includes('rose') || normalized.includes('pink')) normalized = 'rose';
  else if (normalized.includes('violet') || normalized.includes('purple')) normalized = 'violet';
  else if (normalized.includes('orange')) normalized = 'orange';
  else if (normalized.includes('mono') || normalized.includes('slate') || normalized.includes('white')) normalized = 'mono';
  else normalized = 'cyan';

  const match = COMMAND_COLOR_OPTIONS.find(c => c.id === normalized) || COMMAND_COLOR_OPTIONS[0];
  return isLight ? match.lightText : match.darkText;
}

export const CommandsView: React.FC<CommandsViewProps> = ({
  project,
  onUpdateProject,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

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
  const [cmdColorId, setCmdColorId] = useState<string>(() => {
    const saved = localStorage.getItem('commands_custom_color_id') || localStorage.getItem('commands_custom_color') || 'cyan';
    if (saved.includes('cyan')) return 'cyan';
    if (saved.includes('emerald') || saved.includes('green')) return 'emerald';
    if (saved.includes('amber') || saved.includes('yellow')) return 'amber';
    if (saved.includes('sky')) return 'sky';
    if (saved.includes('rose') || saved.includes('pink')) return 'rose';
    if (saved.includes('violet') || saved.includes('purple')) return 'violet';
    if (saved.includes('orange')) return 'orange';
    if (saved.includes('mono') || saved.includes('slate') || saved.includes('white')) return 'mono';
    return saved;
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Active command color class computed from theme & choice
  const activeCmdColorClass = getActiveCommandColorClass(cmdColorId, isLight);

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
  const currentSelectedColorOpt = COMMAND_COLOR_OPTIONS.find(c => c.id === cmdColorId) || COMMAND_COLOR_OPTIONS[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-2 select-none animate-in fade-in duration-150">
      
      {/* Top Bar: Direct Category + Button, Category Pills, Color button, Sync Button & Copy Script */}
      <div className={`flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b ${isLight ? 'border-slate-300' : 'border-slate-800/80'} text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}>
        
        {/* Left Side: + Category Button & Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
          
          {/* Direct + Icon Button to Add Category */}
          {showAddCat ? (
            <form onSubmit={handleAddCategory} className={`flex items-center gap-1 ${isLight ? 'bg-white border-emerald-500' : 'bg-slate-900 border-emerald-500/50'} border rounded-lg px-2 py-0.5 shadow-xs`}>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name (npm, db, etc)..."
                autoFocus
                className={`w-32 bg-transparent text-xs ${isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'} focus:outline-none font-mono`}
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="text-emerald-500 hover:text-emerald-600 disabled:opacity-40 p-0.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => { setShowAddCat(false); setNewCatName(''); }}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddCat(true)}
              className={`h-7 px-2.5 ${isLight ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-emerald-950/70 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300'} border rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0 shadow-xs`}
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
                : isLight
                ? 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50'
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
            const style = getCategoryStyle(cat, isLight);

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
                    className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition ml-0.5 p-0.5 cursor-pointer"
                    title={`Delete category "${cat}"`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Command Color Setting Button right next to categories */}
          <button
            type="button"
            onClick={() => setShowColorPicker(true)}
            className={`h-7 px-2.5 ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' 
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200'
            } border rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs`}
            title="Command Text Color Chunein (Ek saath sabhi commands change honge)"
          >
            <Palette className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`w-2.5 h-2.5 rounded-full ${currentSelectedColorOpt.bg} ring-1 ring-black/20`} />
            <span className="text-[11px] font-mono font-semibold">Color</span>
          </button>
        </div>

        {/* Right Side: Sync Button, Copy Script */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sync Button: Commits all pending edits to Database */}
          <button
            onClick={() => handleSyncToDatabase()}
            disabled={isSyncing}
            className={`h-7 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              hasUnsavedChanges
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 animate-pulse'
                : syncSuccess
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
            title="Database me changes sync karein"
          >
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
            ) : syncSuccess ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Cloud className={`w-3.5 h-3.5 ${hasUnsavedChanges ? 'text-amber-200' : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
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
              className={`h-7 px-2.5 ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              } border rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs`}
              title="Copy all commands as bash script"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAll ? 'Copied!' : 'Copy Script'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Commands List: Dynamic-width rows with [Copy] [Category] [$ Command / # Comment] [Actions] */}
      <div className="flex flex-col items-start space-y-2 w-full">
        {filteredCommands.length === 0 && (
          <div className={`w-full py-8 text-center text-xs border border-dashed rounded-xl ${isLight ? 'bg-white/60 border-slate-300 text-slate-500' : 'border-slate-800/80 text-slate-500'}`}>
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
          const catStyle = getCategoryStyle(item.category || 'npm', isLight);

          return (
            <div
              key={item.id}
              className={`group relative w-full sm:w-fit max-w-full flex flex-col sm:flex-row items-stretch sm:items-start gap-2 sm:gap-2.5 p-2.5 border rounded-xl transition duration-100 shadow-xs ${
                isLight
                  ? isDirty
                    ? 'bg-amber-50/60 border-amber-400'
                    : 'bg-white hover:bg-slate-50/90 border-slate-200 hover:border-slate-300 text-slate-900'
                  : isDirty
                    ? 'border-amber-500/60 bg-slate-900'
                    : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700/80 text-slate-100'
              }`}
            >
              {/* MOBILE ONLY: Top Header Bar (Category, Copy, Save, Delete) */}
              <div className="flex sm:hidden items-center justify-between w-full pb-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md font-semibold ${catStyle.badge}`}>
                    {item.category || 'npm'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.cmd)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 transition cursor-pointer ${
                      isCopied 
                        ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80 font-semibold' 
                        : isLight
                        ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => handleSaveSingleCommand(item.id)}
                      className="h-6 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
                      title="Save edit"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteCommand(item.id)}
                    className={`p-1 ${isLight ? 'text-slate-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'} rounded cursor-pointer`}
                    title="Delete command"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* DESKTOP ONLY: Left Copy Button & Category Badge */}
              <div className="hidden sm:flex items-center gap-2 shrink-0 self-start mt-0.5">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.cmd)}
                  className={`p-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                    isCopied 
                      ? 'text-emerald-500 bg-emerald-100/80' 
                      : isLight
                      ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Copy command"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md shrink-0 ${catStyle.badge}`}>
                  {item.category || 'npm'}
                </span>
              </div>

              {/* Command & Comment Column: Full width on mobile, dynamicCh on desktop */}
              <div
                className="flex flex-col min-w-0 w-full sm:w-auto"
                style={{
                  width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : `${dynamicCh}ch`,
                  maxWidth: '100%',
                }}
              >
                {/* Command: Bada Large Font, Customizable Color */}
                <div className="flex items-start gap-1.5 w-full">
                  <span className={`${isLight ? 'text-slate-400' : 'text-slate-600'} font-mono select-none text-base font-bold shrink-0 self-start mt-0.5`}>$</span>
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
                    className={`w-full bg-transparent ${activeCmdColorClass} font-mono text-sm sm:text-base font-bold focus:outline-none resize-none overflow-hidden leading-snug tracking-tight py-0`}
                    style={{ height: 'auto', minHeight: '24px' }}
                    ref={(el) => {
                      if (el) autoResize(el);
                    }}
                  />
                </div>

                {/* Comment: Jitne se command shuru hui theek usi ke neeche, bahut feeka & small */}
                <div className="flex items-start gap-1 pl-3 sm:pl-3.5 mt-0.5 w-full">
                  <span className={`${isLight ? 'text-slate-400' : 'text-slate-700'} font-mono text-[11px] select-none shrink-0 mt-0.5`}>#</span>
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
                    className={`w-full bg-transparent text-xs italic ${
                      isLight 
                        ? 'text-slate-500 focus:text-slate-800 placeholder-slate-400' 
                        : 'text-slate-500 focus:text-slate-300 placeholder-slate-700/80'
                    } focus:outline-none resize-none overflow-hidden leading-relaxed py-0`}
                    style={{ height: 'auto', minHeight: '18px' }}
                    ref={(el) => {
                      if (el) autoResize(el);
                    }}
                  />
                </div>
              </div>

              {/* DESKTOP ONLY: Right: Save Button (if dirty) + Delete Trash Icon */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0 self-start mt-1 ml-1">
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
                  className={`p-1 ${isLight ? 'text-slate-400 hover:text-red-500' : 'text-slate-600 hover:text-red-400'} opacity-30 group-hover:opacity-80 hover:!opacity-100 transition-opacity rounded cursor-pointer`}
                  title="Delete command"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Live Bottom Input Box: Stacked on mobile, dynamic-width row on desktop */}
        <form
          onSubmit={handleAddNewCommand}
          className={`w-full sm:w-fit max-w-full flex flex-col sm:flex-row items-stretch sm:items-start gap-2 sm:gap-2.5 p-2.5 ${
            isLight 
              ? 'bg-white border-dashed border-emerald-500/60 hover:border-emerald-500 text-slate-900 shadow-sm' 
              : 'bg-slate-950/90 border-dashed border-emerald-500/40 hover:border-emerald-500 text-slate-100 shadow-inner'
          } border rounded-xl text-xs transition duration-150`}
        >
          {/* MOBILE ONLY: Top bar with category and Add button */}
          <div className="flex sm:hidden items-center justify-between w-full pb-1.5 border-b border-dashed border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="p-0.5 text-emerald-500">
                <Plus className="w-3.5 h-3.5" />
              </span>
              <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md font-semibold ${getCategoryStyle(activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm'), isLight).badge}`}>
                {activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')}
              </span>
            </div>

            <button
              type="submit"
              disabled={!newCmdText.trim()}
              className="h-6 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add Command</span>
            </button>
          </div>

          {/* DESKTOP ONLY: Left Plus icon & Category Badge */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 self-start mt-0.5">
            <span className="p-1 text-emerald-500 shrink-0 self-start mt-0.5">
              <Plus className="w-3.5 h-3.5" />
            </span>

            <span className={`self-start mt-1 px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md shrink-0 ${getCategoryStyle(activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm'), isLight).badge}`}>
              {activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')}
            </span>
          </div>

          {/* Command & Comment Inputs: Full width on mobile */}
          <div
            className="flex flex-col min-w-0 w-full sm:w-auto"
            style={{
              width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : `${Math.min(78, Math.max(24, Math.max(newCmdText.length, newCmdComment.length) + 4))}ch`,
              maxWidth: '100%',
            }}
          >
            <div className="flex items-start gap-1.5 w-full">
              <span className={`${isLight ? 'text-slate-400' : 'text-slate-600'} font-mono select-none text-base font-bold shrink-0 self-start mt-0.5`}>$</span>
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
                className={`w-full bg-transparent ${activeCmdColorClass} font-mono text-sm sm:text-base font-bold focus:outline-none ${isLight ? 'placeholder-slate-400' : 'placeholder-slate-600'} resize-none overflow-hidden leading-snug tracking-tight py-0`}
                style={{ height: 'auto', minHeight: '24px' }}
              />
            </div>

            <div className="flex items-start gap-1 pl-3 sm:pl-3.5 mt-0.5 w-full">
              <span className={`${isLight ? 'text-slate-400' : 'text-slate-700'} font-mono text-[11px] select-none shrink-0 mt-0.5`}>#</span>
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
                className={`w-full bg-transparent text-xs italic ${
                  isLight 
                    ? 'text-slate-500 focus:text-slate-800 placeholder-slate-400' 
                    : 'text-slate-500 focus:text-slate-300 placeholder-slate-700/80'
                } focus:outline-none resize-none overflow-hidden leading-relaxed py-0`}
                style={{ height: 'auto', minHeight: '18px' }}
              />
            </div>
          </div>

          {/* DESKTOP ONLY: Add button */}
          <button
            type="submit"
            disabled={!newCmdText.trim()}
            className="hidden sm:flex h-7 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-lg text-xs font-semibold items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0 self-start mt-0.5 ml-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* COLOR PICKER MODAL: Never clipped by any parent overflow container */}
      {showColorPicker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          onClick={() => setShowColorPicker(false)}
        >
          <div 
            className={`relative w-80 max-w-full p-4 rounded-2xl shadow-2xl border ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
            } animate-in zoom-in-95 duration-150`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between pb-2.5 mb-3 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <Palette className={`w-4 h-4 ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span className="text-sm font-bold">Commands Text Color</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowColorPicker(false)} 
                className={`p-1 rounded-lg ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400 hover:text-white'} cursor-pointer`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className={`text-xs mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Color chunein — ek saath sabhi commands ka font color update ho jayega:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {COMMAND_COLOR_OPTIONS.map((opt) => {
                const isSelected = cmdColorId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setCmdColorId(opt.id);
                      localStorage.setItem('commands_custom_color_id', opt.id);
                      setShowColorPicker(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer border ${
                      isSelected 
                        ? isLight 
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 text-emerald-900 shadow-xs' 
                          : 'bg-slate-800 border-emerald-400 ring-2 ring-emerald-500/50 text-white shadow-xs'
                        : isLight 
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800' 
                          : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${opt.bg} shrink-0 ring-1 ring-black/20`} />
                    <span className={`font-bold ${isLight ? opt.lightText : opt.darkText}`}>{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className={`mt-3 pt-2 text-[11px] border-t ${isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
              * Note: Category badges aur comments ke feeke colors safe rahenge.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
