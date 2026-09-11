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
  Code
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
  const [commands, setCommands] = useState<CommandItem[]>(project.commands || []);
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

  // New Category input toggle
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Quick live new command input at the bottom
  const [newCmdText, setNewCmdText] = useState('');
  const [newCmdComment, setNewCmdComment] = useState('');
  const newCmdInputRef = useRef<HTMLInputElement>(null);

  // Sync state when project changes
  useEffect(() => {
    setCommands(project.commands || []);
    if (project.commandCategories && project.commandCategories.length > 0) {
      const fromCmds = (project.commands || []).map(c => c.category).filter(Boolean);
      setCategories(Array.from(new Set([...project.commandCategories, ...fromCmds])));
    }
  }, [project.id, project.commands, project.commandCategories]);

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

  // Direct In-Place Edit of Command Text
  const handleCommandChange = (id: string, updatedCmd: string) => {
    const updated = commands.map(c => (c.id === id ? { ...c, cmd: updatedCmd } : c));
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
  };

  // Direct In-Place Edit of Command Comment
  const handleCommentChange = (id: string, updatedComment: string) => {
    const updated = commands.map(c => 
      c.id === id ? { ...c, description: updatedComment || undefined } : c
    );
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
  };

  // Change Category for an item
  const handleItemCategoryChange = (id: string, newCat: string) => {
    const updated = commands.map(c => (c.id === id ? { ...c, category: newCat } : c));
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
  };

  // Delete single command
  const handleDeleteCommand = (id: string) => {
    const updated = commands.filter(c => c.id !== id);
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
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
      description: newCmdComment.trim() || undefined
    };

    const updated = [...commands, newItem];
    setCommands(updated);

    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });

    setNewCmdText('');
    setNewCmdComment('');
    setTimeout(() => newCmdInputRef.current?.focus(), 50);
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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-2 select-none animate-in fade-in duration-150">
      
      {/* Sleek Top Bar: Direct Category + Button, Category Pills, and Quick Actions (NO bulky header text!) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-slate-800/80 text-xs">
        
        {/* Left Side: Direct + Category Button & Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0 flex-nowrap">
          
          {/* Direct + Icon Button to Add Category */}
          {showAddCat ? (
            <form onSubmit={handleAddCategory} className="flex items-center gap-1 bg-slate-900 border border-emerald-500/50 rounded-lg px-2 py-1">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name (e.g. npm, db, git)..."
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
              className="h-7 px-2.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
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

        {/* Right Side: Copy All Script & Quick Count */}
        <div className="flex items-center gap-2 shrink-0">
          {commands.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="h-7 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Copy all commands as bash script"
            >
              {copiedAll ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy Script'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Commands List: Super Compact, Low-Height Input Rows with Zero Outer Bulky Cards */}
      <div className="space-y-1">
        {filteredCommands.length === 0 && (
          <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-xl">
            Abhi koi command nahi hai. Neeche diye gaye input me command likh kar Enter dabayein.
          </div>
        )}

        {filteredCommands.map((item, index) => {
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className="group h-9 w-full flex items-center gap-1.5 px-2 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-lg text-xs transition duration-100 shadow-sm"
            >
              {/* 1. Left Copy Icon (Aage copy button) */}
              <button
                type="button"
                onClick={() => handleCopy(item.id, item.cmd)}
                className={`p-1 rounded text-slate-400 hover:text-white transition cursor-pointer shrink-0 ${
                  isCopied ? 'text-emerald-400 bg-emerald-950/60' : 'hover:bg-slate-800'
                }`}
                title="Copy this command"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* 2. Category Dropdown Pill */}
              <select
                value={item.category || 'npm'}
                onChange={(e) => handleItemCategoryChange(item.id, e.target.value)}
                className="bg-slate-950 border border-slate-800 text-[10px] font-mono uppercase text-emerald-400 rounded px-1.5 py-0.5 focus:outline-none focus:border-emerald-500 shrink-0 cursor-pointer"
                title="Change Category"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-slate-200 uppercase">
                    {c}
                  </option>
                ))}
              </select>

              {/* 3. Terminal $ Symbol */}
              <span className="text-slate-600 font-mono select-none text-xs shrink-0">$</span>

              {/* 4. Direct In-Place Command Input (No separate edit button, direct edit!) */}
              <input
                type="text"
                value={item.cmd}
                onChange={(e) => handleCommandChange(item.id, e.target.value)}
                placeholder="Command string..."
                className="flex-1 min-w-0 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none selection:bg-emerald-900 selection:text-white"
              />

              {/* 5. Optional Inline Comment Input (# comment) */}
              <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[260px] shrink-0 border-l border-slate-800 pl-2">
                <span className="text-slate-600 font-mono text-[11px] select-none">#</span>
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => handleCommentChange(item.id, e.target.value)}
                  placeholder="comment (optional)"
                  className="w-full bg-transparent text-[11px] text-slate-400 focus:text-slate-200 placeholder-slate-600 focus:outline-none truncate"
                />
              </div>

              {/* 6. Minor Delete Icon at the very end of the row (last me minor delete) */}
              <button
                type="button"
                onClick={() => handleDeleteCommand(item.id)}
                className="p-1 text-slate-500 hover:text-red-400 opacity-60 group-hover:opacity-100 rounded hover:bg-slate-800 transition cursor-pointer shrink-0"
                title="Delete command"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Live Bottom Input Row: Sleek, Low Height, Add Command Instantly on Enter */}
        <form
          onSubmit={handleAddNewCommand}
          className="h-9 w-full flex items-center gap-1.5 px-2 bg-slate-950 border border-dashed border-emerald-500/40 hover:border-emerald-500 rounded-lg text-xs transition duration-100 shadow-inner"
        >
          {/* Left + Icon */}
          <span className="p-1 text-emerald-400 shrink-0">
            <Plus className="w-3.5 h-3.5" />
          </span>

          {/* Category Tag */}
          <span className="bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-mono uppercase text-emerald-400 rounded px-1.5 py-0.5 shrink-0">
            {activeCategory !== 'all' ? activeCategory : (categories[0] || 'npm')}
          </span>

          <span className="text-slate-600 font-mono select-none text-xs shrink-0">$</span>

          {/* New Command Input */}
          <input
            ref={newCmdInputRef}
            type="text"
            value={newCmdText}
            onChange={(e) => setNewCmdText(e.target.value)}
            placeholder="Nayi command likhein aur Enter dabayein..."
            className="flex-1 min-w-0 bg-transparent text-emerald-300 font-mono text-xs focus:outline-none placeholder-slate-500"
          />

          {/* New Comment Input */}
          <div className="flex items-center gap-1 max-w-[180px] sm:max-w-[240px] shrink-0 border-l border-slate-800 pl-2">
            <span className="text-slate-600 font-mono text-[11px] select-none">#</span>
            <input
              type="text"
              value={newCmdComment}
              onChange={(e) => setNewCmdComment(e.target.value)}
              placeholder="comment (optional)"
              className="w-full bg-transparent text-[11px] text-slate-400 placeholder-slate-600 focus:outline-none truncate"
            />
          </div>

          {/* Quick Add Button */}
          <button
            type="submit"
            disabled={!newCmdText.trim()}
            className="h-6 px-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer shrink-0"
          >
            <Plus className="w-3 h-3" />
            <span>Add</span>
          </button>
        </form>
      </div>

    </div>
  );
};
