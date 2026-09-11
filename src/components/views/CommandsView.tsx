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
  Save
} from 'lucide-react';

interface CommandsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

const DEFAULT_CATEGORIES = ['npm', 'db', 'folder', 'git', 'docker', 'dev'];

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
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-800/80 text-xs">
        
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

          {/* Dynamic Category Tabs */}
          {categories.map((cat) => {
            const count = commands.filter(c => (c.category || '').toLowerCase() === cat.toLowerCase()).length;
            const isActive = activeCategory === cat;

            return (
              <div
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`group h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/60 shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
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

      {/* Commands List: Dynamic Content-Width Cards with Command on Top and Muted Comment Below */}
      <div className="flex flex-col items-start space-y-2.5">
        {filteredCommands.length === 0 && (
          <div className="w-full py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-xl">
            Abhi koi command nahi hai. Neeche diye gaye box me command likhein aur Enter dabayein.
          </div>
        )}

        {filteredCommands.map((item) => {
          const isCopied = copiedId === item.id;
          const isDirty = dirtyCmdIds.has(item.id);

          // Calculate dynamic card width based on longest line of command or comment
          const cmdLines = (item.cmd || '').split('\n');
          const maxCmdLen = Math.max(...cmdLines.map(l => l.length), 0);
          const descLen = (item.description || '').length;
          const longest = Math.max(maxCmdLen, descLen);
          const chWidth = Math.min(105, Math.max(26, longest + 6));

          return (
            <div
              key={item.id}
              style={{
                width: `${chWidth}ch`,
                maxWidth: '100%',
              }}
              className={`group relative flex flex-col p-2.5 bg-slate-900/90 border rounded-xl transition duration-100 shadow-xs space-y-1.5 ${
                isDirty 
                  ? 'border-amber-500/60 bg-slate-900' 
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header row: Copy, Category Pill, Save (if modified), Small Delete */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {/* 1-Click Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.cmd)}
                    className={`p-1 rounded text-slate-400 hover:text-white transition cursor-pointer ${
                      isCopied ? 'text-emerald-400 bg-emerald-950/60' : 'hover:bg-slate-800'
                    }`}
                    title="Copy command"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {/* Category Badge */}
                  <span className="px-1.5 py-0.2 bg-slate-950 border border-slate-800 text-[10px] font-mono uppercase text-emerald-400 rounded">
                    {item.category || 'npm'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Automatic SAVE button - Appears automatically only when edited! */}
                  {isDirty && (
                    <button
                      type="button"
                      onClick={() => handleSaveSingleCommand(item.id)}
                      className="h-5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs animate-in fade-in"
                      title="Save this edit (Ctrl + Enter)"
                    >
                      <Save className="w-2.5 h-2.5" />
                      <span>Save</span>
                    </button>
                  )}

                  {/* Delete Icon: Ultra-small and very faded (feeka) */}
                  <button
                    type="button"
                    onClick={() => handleDeleteCommand(item.id)}
                    className="p-1 text-slate-600 hover:text-red-400 opacity-20 group-hover:opacity-80 hover:!opacity-100 transition-opacity rounded cursor-pointer"
                    title="Delete command"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* 1. Main Command: Bada Font & High Contrast Cyan */}
              <div className="flex items-start gap-1.5">
                <span className="text-slate-600 font-mono select-none text-sm font-semibold mt-0.5">$</span>
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
                  className="w-full bg-transparent text-cyan-300 font-mono text-sm font-bold focus:outline-none resize-none overflow-hidden leading-relaxed tracking-tight py-0"
                  style={{ height: 'auto', minHeight: '26px' }}
                  ref={(el) => {
                    if (el) autoResize(el);
                  }}
                />
              </div>

              {/* 2. Comment: Just Neeche & Bahut Feeka (Muted Italic) */}
              <div className="pt-0.5 border-t border-slate-800/40">
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
                  placeholder="comment (optional)..."
                  className="w-full bg-transparent text-xs italic text-slate-500 focus:text-slate-300 placeholder-slate-700/80 focus:outline-none resize-none overflow-hidden leading-relaxed py-0"
                  style={{ height: 'auto', minHeight: '20px' }}
                  ref={(el) => {
                    if (el) autoResize(el);
                  }}
                />
              </div>
            </div>
          );
        })}

        {/* Live Bottom Input Box: Dynamic Content-Width Card for Adding New Command */}
        <form
          onSubmit={handleAddNewCommand}
          style={{
            width: `${Math.min(105, Math.max(34, Math.max(newCmdText.length, newCmdComment.length) + 8))}ch`,
            maxWidth: '100%',
          }}
          className="flex flex-col p-2.5 bg-slate-950 border border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-xl text-xs transition duration-150 shadow-inner space-y-1.5"
        >
          {/* Header Row in Add Form */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-900 pb-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="p-0.5 text-emerald-400">
                <Plus className="w-3.5 h-3.5" />
              </span>
              <span className="px-1.5 py-0.2 bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-mono uppercase text-emerald-400 rounded">
                {activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')}
              </span>
            </div>

            <button
              type="submit"
              disabled={!newCmdText.trim()}
              className="h-5 px-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded text-[10px] font-medium flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Add Command</span>
            </button>
          </div>

          {/* New Command (Bada Font) */}
          <div className="flex items-start gap-1.5">
            <span className="text-slate-600 font-mono select-none text-sm font-semibold mt-0.5">$</span>
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
              placeholder="Nayi command likhein (e.g. npm init -y)..."
              className="w-full bg-transparent text-cyan-300 font-mono text-sm font-bold focus:outline-none placeholder-slate-600 resize-none overflow-hidden leading-relaxed tracking-tight py-0"
              style={{ height: 'auto', minHeight: '26px' }}
            />
          </div>

          {/* New Comment (Just Neeche, Bahut Feeka) */}
          <div className="pt-0.5 border-t border-slate-900">
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
              style={{ height: 'auto', minHeight: '20px' }}
            />
          </div>
        </form>
      </div>

    </div>
  );
};
