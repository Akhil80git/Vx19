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
  Search, 
  Star, 
  Sparkles, 
  Code2, 
  Share2, 
  Play
} from 'lucide-react';

interface CommandsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  theme?: 'dark' | 'light';
}

const DEFAULT_CATEGORIES = ['npm', 'db', 'folder', 'git', 'docker', 'dev'];

// Distinct, subtle pastel color palettes for each category in Dark and Light mode
export function getCategoryStyle(cat: string, isLight: boolean = false) {
  const c = (cat || '').toLowerCase().trim();
  if (isLight) {
    switch (c) {
      case 'npm':
        return {
          pill: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
          active: 'bg-rose-100 text-rose-900 border-rose-400 ring-1 ring-rose-400/50 shadow-xs font-semibold',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          borderHover: 'hover:border-rose-300'
        };
      case 'db':
        return {
          pill: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
          active: 'bg-amber-100 text-amber-900 border-amber-400 ring-1 ring-amber-400/50 shadow-xs font-semibold',
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          borderHover: 'hover:border-amber-300'
        };
      case 'folder':
        return {
          pill: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          active: 'bg-blue-100 text-blue-900 border-blue-400 ring-1 ring-blue-400/50 shadow-xs font-semibold',
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          borderHover: 'hover:border-blue-300'
        };
      case 'git':
        return {
          pill: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
          active: 'bg-orange-100 text-orange-900 border-orange-400 ring-1 ring-orange-400/50 shadow-xs font-semibold',
          badge: 'bg-orange-50 text-orange-700 border-orange-200',
          dot: 'bg-orange-500',
          borderHover: 'hover:border-orange-300'
        };
      case 'docker':
        return {
          pill: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
          active: 'bg-sky-100 text-sky-900 border-sky-400 ring-1 ring-sky-400/50 shadow-xs font-semibold',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
          borderHover: 'hover:border-sky-300'
        };
      case 'dev':
        return {
          pill: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
          active: 'bg-purple-100 text-purple-900 border-purple-400 ring-1 ring-purple-400/50 shadow-xs font-semibold',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-500',
          borderHover: 'hover:border-purple-300'
        };
      case 'dependencies':
        return {
          pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          active: 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-1 ring-emerald-400/50 shadow-xs font-semibold',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          borderHover: 'hover:border-emerald-300'
        };
      default: {
        return {
          pill: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
          active: 'bg-teal-100 text-teal-900 border-teal-400 ring-1 ring-teal-400/50 shadow-xs font-semibold',
          badge: 'bg-teal-50 text-teal-700 border-teal-200',
          dot: 'bg-teal-500',
          borderHover: 'hover:border-teal-300'
        };
      }
    }
  }

  // Dark Mode colors
  switch (c) {
    case 'npm':
      return {
        pill: 'bg-rose-950/30 text-rose-300 border-rose-900/40 hover:bg-rose-950/60',
        active: 'bg-rose-950/90 text-rose-200 border-rose-500/80 shadow-xs shadow-rose-950/60 ring-1 ring-rose-500/50 font-semibold',
        badge: 'bg-rose-950/40 text-rose-300 border-rose-800/50',
        dot: 'bg-rose-400',
        borderHover: 'hover:border-rose-500/40'
      };
    case 'db':
      return {
        pill: 'bg-amber-950/30 text-amber-300 border-amber-900/40 hover:bg-amber-950/60',
        active: 'bg-amber-950/90 text-amber-200 border-amber-500/80 shadow-xs shadow-amber-950/60 ring-1 ring-amber-500/50 font-semibold',
        badge: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
        dot: 'bg-amber-400',
        borderHover: 'hover:border-amber-500/40'
      };
    case 'folder':
      return {
        pill: 'bg-blue-950/30 text-blue-300 border-blue-900/40 hover:bg-blue-950/60',
        active: 'bg-blue-950/90 text-blue-200 border-blue-500/80 shadow-xs shadow-blue-950/60 ring-1 ring-blue-500/50 font-semibold',
        badge: 'bg-blue-950/40 text-blue-300 border-blue-800/50',
        dot: 'bg-blue-400',
        borderHover: 'hover:border-blue-500/40'
      };
    case 'git':
      return {
        pill: 'bg-orange-950/30 text-orange-300 border-orange-900/40 hover:bg-orange-950/60',
        active: 'bg-orange-950/90 text-orange-200 border-orange-500/80 shadow-xs shadow-orange-950/60 ring-1 ring-orange-500/50 font-semibold',
        badge: 'bg-orange-950/40 text-orange-300 border-orange-800/50',
        dot: 'bg-orange-400',
        borderHover: 'hover:border-orange-500/40'
      };
    case 'docker':
      return {
        pill: 'bg-sky-950/30 text-sky-300 border-sky-900/40 hover:bg-sky-950/60',
        active: 'bg-sky-950/90 text-sky-200 border-sky-500/80 shadow-xs shadow-sky-950/60 ring-1 ring-sky-500/50 font-semibold',
        badge: 'bg-sky-950/40 text-sky-300 border-sky-800/50',
        dot: 'bg-sky-400',
        borderHover: 'hover:border-sky-500/40'
      };
    case 'dev':
      return {
        pill: 'bg-purple-950/30 text-purple-300 border-purple-900/40 hover:bg-purple-950/60',
        active: 'bg-purple-950/90 text-purple-200 border-purple-500/80 shadow-xs shadow-purple-950/60 ring-1 ring-purple-500/50 font-semibold',
        badge: 'bg-purple-950/40 text-purple-300 border-purple-800/50',
        dot: 'bg-purple-400',
        borderHover: 'hover:border-purple-500/40'
      };
    case 'dependencies':
      return {
        pill: 'bg-emerald-950/30 text-emerald-300 border-emerald-900/40 hover:bg-emerald-950/60',
        active: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-xs shadow-emerald-950/60 ring-1 ring-emerald-500/50 font-semibold',
        badge: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
        dot: 'bg-emerald-400',
        borderHover: 'hover:border-emerald-500/40'
      };
    default: {
      return {
        pill: 'bg-teal-950/30 text-teal-300 border-teal-900/40 hover:bg-teal-950/60',
        active: 'bg-teal-950/90 text-teal-200 border-teal-500/80 ring-1 ring-teal-500/50 font-semibold',
        badge: 'bg-teal-950/40 text-teal-300 border-teal-800/50',
        dot: 'bg-teal-400',
        borderHover: 'hover:border-teal-500/40'
      };
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Command text color preference
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

  // Direct In-Place Edit of Command Text
  const handleCommandChange = (id: string, updatedCmd: string) => {
    const updated = commands.map(c => (c.id === id ? { ...c, cmd: updatedCmd } : c));
    setCommands(updated);
    setDirtyCmdIds(prev => new Set(prev).add(id));
  };

  // Direct In-Place Edit of Command Comment
  const handleCommentChange = (id: string, updatedComment: string) => {
    const updated = commands.map(c => 
      c.id === id ? { ...c, description: updatedComment } : c
    );
    setCommands(updated);
    setDirtyCmdIds(prev => new Set(prev).add(id));
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = commands.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    );
    setCommands(updated);
    handleSyncToDatabase(updated);
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
      description: newCmdComment.trim(),
      isFavorite: false
    };

    const updated = [...commands, newItem];
    setCommands(updated);
    setNewCmdText('');
    setNewCmdComment('');

    handleSyncToDatabase(updated);

    if (newCmdTextareaRef.current) {
      newCmdTextareaRef.current.style.height = 'auto';
      newCmdTextareaRef.current.focus();
    }
  };

  // Filter commands by Category, Search Query, and Favorites
  const filteredCommands = commands.filter(c => {
    if (showFavoritesOnly && !c.isFavorite) return false;
    if (activeCategory !== 'all' && (c.category || '').toLowerCase() !== activeCategory.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCmd = c.cmd.toLowerCase().includes(q);
      const matchDesc = (c.description || '').toLowerCase().includes(q);
      const matchCat = (c.category || '').toLowerCase().includes(q);
      return matchCmd || matchDesc || matchCat;
    }
    return true;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'npm':
        return <Box className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'db':
        return <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'folder':
        return <Folder className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'docker':
        return <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    }
  };

  const hasUnsavedChanges = dirtyCmdIds.size > 0;
  const currentSelectedColorOpt = COMMAND_COLOR_OPTIONS.find(c => c.id === cmdColorId) || COMMAND_COLOR_OPTIONS[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-3.5 select-none animate-in fade-in duration-150 pb-12">
      
      {/* Top Bar: Direct Category + Button, Category Pills, Search, Color, Sync & Export */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b ${
        isLight ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        
        {/* Category Filter Pills and + Button */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 flex-nowrap no-scrollbar">
          
          {/* Add Category Button */}
          {showAddCat ? (
            <form onSubmit={handleAddCategory} className={`flex items-center gap-1 ${
              isLight ? 'bg-white border-emerald-500' : 'bg-slate-900 border-emerald-500/60'
            } border rounded-xl px-2.5 py-1 shadow-xs shrink-0`}>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name..."
                autoFocus
                className={`w-28 sm:w-36 bg-transparent text-xs ${
                  isLight ? 'text-slate-900 placeholder-slate-400' : 'text-white placeholder-slate-500'
                } focus:outline-none font-mono`}
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
              className={`h-8 px-2.5 ${
                isLight ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/50 text-emerald-300'
              } border rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0 shadow-xs`}
              title="Add New Category"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Category</span>
            </button>
          )}

          {/* All Filter Tab */}
          <button
            onClick={() => { setActiveCategory('all'); setShowFavoritesOnly(false); }}
            className={`h-8 px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              activeCategory === 'all' && !showFavoritesOnly
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-950/20 font-semibold'
                : isLight
                ? 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>All</span>
            <span className="text-[10px] opacity-75 font-mono">({commands.length})</span>
          </button>

          {/* Starred / Favorites Filter */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`h-8 px-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
              showFavoritesOnly
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                : isLight
                ? 'bg-white text-slate-600 hover:text-amber-600 border-slate-200'
                : 'bg-slate-900 text-slate-400 hover:text-amber-300 border-slate-800'
            }`}
            title="Show Starred / Favorites only"
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950' : 'text-amber-400'}`} />
            <span>Starred</span>
          </button>

          {/* Dynamic Category Tabs */}
          {categories.map((cat) => {
            const count = commands.filter(c => (c.category || '').toLowerCase() === cat.toLowerCase()).length;
            const isActive = activeCategory === cat && !showFavoritesOnly;
            const style = getCategoryStyle(cat, isLight);

            return (
              <div
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowFavoritesOnly(false); }}
                className={`group h-8 px-3 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                  isActive ? style.active : style.pill
                }`}
              >
                {getCategoryIcon(cat)}
                <span className="uppercase font-mono text-[11px] tracking-wide">{cat}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>

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

          {/* Command Color Setting Button */}
          <button
            type="button"
            onClick={() => setShowColorPicker(true)}
            className={`h-8 px-2.5 ${
              isLight 
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700' 
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-200'
            } border rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs`}
            title="Command Text Color Chunein"
          >
            <Palette className={`w-3.5 h-3.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`} />
            <span className={`w-2.5 h-2.5 rounded-full ${currentSelectedColorOpt.bg} ring-1 ring-black/20`} />
            <span className="text-[11px] font-mono font-semibold">Color</span>
          </button>
        </div>

        {/* Right Side: Search Box, Sync Button, Copy Script */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Real-time Search Box */}
          <div className={`relative flex items-center ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'
          } border rounded-xl px-2.5 py-1 text-xs shadow-xs focus-within:border-emerald-500`}>
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands..."
              className="w-32 sm:w-44 bg-transparent text-xs focus:outline-none placeholder-slate-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sync Button: Commits all pending edits to Database */}
          <button
            onClick={() => handleSyncToDatabase()}
            disabled={isSyncing}
            className={`h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs ${
              hasUnsavedChanges
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40 animate-pulse'
                : syncSuccess
                ? 'bg-emerald-600 text-white'
                : isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
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
              className={`h-8 px-2.5 ${
                isLight 
                  ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              } border rounded-xl text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer shadow-xs`}
              title="Copy all commands as bash script"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
              <span className="hidden sm:inline">{copiedAll ? 'Copied!' : 'Script'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Commands List: Terminal-Chic Cards with Traffic Lights, Clean Prompts, and Docstrings */}
      <div className="flex flex-col items-start space-y-3 w-full">
        {filteredCommands.length === 0 && (
          <div className={`w-full py-12 text-center text-xs border rounded-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-500 shadow-xs' : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
          }`}>
            <Terminal className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm mb-1">Koi command nahi mili</p>
            <p className="text-slate-400 max-w-sm mx-auto">
              Neeche diye gaye terminal input box me nayi command type karein aur Enter dabayein.
            </p>
          </div>
        )}

        {filteredCommands.map((item) => {
          const isCopied = copiedId === item.id;
          const isDirty = dirtyCmdIds.has(item.id);
          const cmdLength = item.cmd.length;
          const commentLength = (item.description || '').length;
          const maxLen = Math.max(cmdLength, commentLength);
          const dynamicCh = Math.min(84, Math.max(20, maxLen + 4));
          const catStyle = getCategoryStyle(item.category || 'npm', isLight);

          return (
            /* ATTRACTIVE TERMINAL CARD DESIGN */
            <div
              key={item.id}
              className={`group relative w-fit min-w-[280px] sm:min-w-[380px] max-w-full flex flex-col gap-2 p-3.5 sm:p-4 border rounded-2xl transition duration-150 ${
                isDirty
                  ? isLight 
                    ? 'bg-amber-50/70 border-amber-400 ring-1 ring-amber-400/40 shadow-sm'
                    : 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/30 shadow-md'
                  : isLight
                  ? 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs hover:shadow-sm'
                  : 'bg-slate-900/90 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700/80 text-slate-100 shadow-md hover:shadow-lg'
              }`}
            >
              {/* Card Header: Traffic Light Dots, Category Badge, Favorite Star, and Action Buttons */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-dashed border-slate-200/60 dark:border-slate-800/60 text-xs">
                
                {/* Left: Terminal Traffic Light Dots + Category Badge */}
                <div className="flex items-center gap-2">
                  {/* macOS-style traffic light window dots */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shrink-0" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shrink-0" />
                  </div>

                  {/* Category Badge */}
                  <span className={`px-2 py-0.5 border text-[10px] font-mono uppercase rounded-md font-semibold flex items-center gap-1 ${catStyle.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                    {item.category || 'npm'}
                  </span>
                </div>

                {/* Right: Star (Favorite), Copy, Save if dirty, and Trash Delete */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Favorite Toggle Star */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(item.id, e)}
                    className={`p-1 rounded-lg transition cursor-pointer ${
                      item.isFavorite
                        ? 'text-amber-400 bg-amber-400/10'
                        : isLight
                        ? 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
                        : 'text-slate-500 hover:text-amber-400 hover:bg-slate-800'
                    }`}
                    title={item.isFavorite ? 'Remove from favorites' : 'Star this command'}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* 1-Click Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.cmd)}
                    className={`h-6 px-2 rounded-lg text-[11px] font-medium flex items-center gap-1 transition cursor-pointer ${
                      isCopied 
                        ? 'text-emerald-600 bg-emerald-100/90 font-bold' 
                        : isLight
                        ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                        : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700'
                    }`}
                    title="Copy command to clipboard"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  {/* Save Button (when dirty) */}
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => handleSaveSingleCommand(item.id)}
                      className="h-6 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs animate-in fade-in"
                      title="Save this edit (Ctrl + Enter)"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                  )}

                  {/* Delete Trash Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCommand(item.id)}
                    className={`p-1 rounded-lg ${
                      isLight ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                    } transition cursor-pointer`}
                    title="Delete command"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body: Command Line & Docstring */}
              <div
                className="flex flex-col min-w-0 pt-0.5"
                style={{
                  width: `${dynamicCh}ch`,
                  maxWidth: '100%',
                }}
              >
                {/* Command Prompt Line */}
                <div className="flex items-start gap-2">
                  <span className={`${isLight ? 'text-slate-400' : 'text-slate-600'} font-mono select-none text-base font-bold shrink-0 self-start mt-0.5`}>
                    $
                  </span>
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

                {/* Comment / Docstring Note Line */}
                <div className="flex items-start gap-1.5 pl-4 mt-1.5">
                  <span className={`${isLight ? 'text-slate-400' : 'text-slate-600'} font-mono text-[11px] select-none shrink-0 mt-0.5`}>
                    #
                  </span>
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
                    placeholder="add a description or explanation (optional)..."
                    className={`w-full bg-transparent text-xs italic ${
                      isLight 
                        ? 'text-slate-500 focus:text-slate-800 placeholder-slate-400' 
                        : 'text-slate-400 focus:text-slate-200 placeholder-slate-600'
                    } focus:outline-none resize-none overflow-hidden leading-relaxed py-0`}
                    style={{ height: 'auto', minHeight: '18px' }}
                    ref={(el) => {
                      if (el) autoResize(el);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Bottom Input: Attractive Terminal Prompt Widget */}
        <form
          onSubmit={handleAddNewCommand}
          className={`w-fit min-w-[280px] sm:min-w-[420px] max-w-full flex flex-col gap-2 p-3.5 sm:p-4 border rounded-2xl text-xs transition duration-150 ${
            isLight 
              ? 'bg-white border-emerald-500/50 hover:border-emerald-500 text-slate-900 shadow-sm' 
              : 'bg-slate-950 border-emerald-500/40 hover:border-emerald-500 text-slate-100 shadow-inner'
          }`}
        >
          {/* Top of Add Prompt: Terminal header */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-dashed border-emerald-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-mono text-xs font-bold text-emerald-500 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>New Command</span>
              </span>
            </div>

            {/* Category Dropdown Selector for New Command */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Category:</span>
              <select
                value={activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')}
                onChange={(e) => setActiveCategory(e.target.value)}
                className={`text-[11px] rounded-lg px-2 py-0.5 font-mono uppercase font-bold focus:outline-none border cursor-pointer ${
                  isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-900 text-emerald-400 border-slate-700'
                }`}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Terminal Input Body */}
          <div
            className="flex flex-col min-w-0 pt-0.5"
            style={{
              width: `${Math.min(84, Math.max(28, Math.max(newCmdText.length, newCmdComment.length) + 4))}ch`,
              maxWidth: '100%',
            }}
          >
            {/* Command Textarea */}
            <div className="flex items-start gap-2">
              <span className="text-emerald-500 font-mono select-none text-base font-bold shrink-0 self-start mt-0.5">$</span>
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
                placeholder="Nayi command likhein (e.g. npm install, git commit)..."
                className={`w-full bg-transparent ${activeCmdColorClass} font-mono text-sm sm:text-base font-bold focus:outline-none ${
                  isLight ? 'placeholder-slate-400' : 'placeholder-slate-600'
                } resize-none overflow-hidden leading-snug tracking-tight py-0`}
                style={{ height: 'auto', minHeight: '24px' }}
              />
            </div>

            {/* Comment / Docstring Textarea */}
            <div className="flex items-start gap-1.5 pl-4 mt-1.5">
              <span className={`${isLight ? 'text-slate-400' : 'text-slate-600'} font-mono text-[11px] select-none shrink-0 mt-0.5`}>#</span>
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
                placeholder="is command ka use / description (optional)..."
                className={`w-full bg-transparent text-xs italic ${
                  isLight ? 'text-slate-500 focus:text-slate-800 placeholder-slate-400' : 'text-slate-400 focus:text-slate-200 placeholder-slate-600'
                } focus:outline-none resize-none overflow-hidden leading-relaxed py-0`}
                style={{ height: 'auto', minHeight: '18px' }}
              />
            </div>
          </div>

          {/* Bottom Action Line: Submit button & Helper hint */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-mono">
              Press Enter ↵ to save command instantly
            </span>
            <button
              type="submit"
              disabled={!newCmdText.trim()}
              className="h-7 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Command</span>
            </button>
          </div>
        </form>
      </div>

      {/* COLOR PICKER MODAL */}
      {showColorPicker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
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
