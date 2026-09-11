import React, { useState, useEffect } from 'react';
import { Project, CommandItem } from '../../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles,
  Folder,
  Database,
  Box,
  Layers,
  Edit2,
  CheckCircle2,
  X,
  PlusCircle,
  Hash,
  FileCode,
  Tag
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
    // Also include any categories present in commands
    const fromCmds = (project.commands || []).map(c => c.category).filter(Boolean);
    return Array.from(new Set([...existing, ...fromCmds]));
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // New Category Input state
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Quick Command input fields (on-screen live inputs)
  const [quickCmd, setQuickCmd] = useState('');
  const [quickComment, setQuickComment] = useState('');
  const [quickCategory, setQuickCategory] = useState<string>('npm');

  // Inline editing of existing commands
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCmdText, setEditCmdText] = useState('');
  const [editCommentText, setEditCommentText] = useState('');
  const [editCategoryText, setEditCategoryText] = useState('');

  // Sync state when project prop changes
  useEffect(() => {
    setCommands(project.commands || []);
    if (project.commandCategories && project.commandCategories.length > 0) {
      const fromCmds = (project.commands || []).map(c => c.category).filter(Boolean);
      setCategories(Array.from(new Set([...project.commandCategories, ...fromCmds])));
    }
  }, [project.id, project.commands, project.commandCategories]);

  // When active category changes (and not 'all'), set quickCategory to match
  useEffect(() => {
    if (activeCategory !== 'all') {
      setQuickCategory(activeCategory);
    }
  }, [activeCategory]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const grouped: Record<string, CommandItem[]> = {};
    commands.forEach(c => {
      const cat = c.category || 'general';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(c);
    });

    let script = `#!/usr/bin/env bash\n# CLI Setup & Run Commands for ${project.title}\n\n`;
    for (const cat in grouped) {
      script += `# ==========================================\n`;
      script += `# CATEGORY: [${cat.toUpperCase()}]\n`;
      script += `# ==========================================\n`;
      grouped[cat].forEach(c => {
        if (c.description) {
          script += `# Note: ${c.description}\n`;
        }
        script += `${c.cmd}\n\n`;
      });
    }

    navigator.clipboard.writeText(script);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Add new Category (e.g. npm, db, folder, etc.)
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!cleanName) return;

    if (!categories.includes(cleanName)) {
      const updatedCats = [...categories, cleanName];
      setCategories(updatedCats);
      setActiveCategory(cleanName);
      setQuickCategory(cleanName);

      onUpdateProject({
        ...project,
        commandCategories: updatedCats,
        updatedAt: new Date().toISOString()
      });
    } else {
      setActiveCategory(cleanName);
    }

    setNewCategoryName('');
    setShowAddCategoryInput(false);
  };

  // Delete a Category (and move or keep its commands)
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

  // Add a command row directly on screen
  const handleAddCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickCmd.trim()) return;

    const targetCategory = (activeCategory !== 'all' ? activeCategory : quickCategory).trim() || 'npm';

    const newItem: CommandItem = {
      id: 'cmd_' + Date.now(),
      cmd: quickCmd.trim(),
      category: targetCategory,
      description: quickComment.trim() || undefined
    };

    const updated = [...commands, newItem];
    setCommands(updated);

    // Make sure category exists in categories array
    let updatedCats = categories;
    if (!categories.includes(targetCategory)) {
      updatedCats = [...categories, targetCategory];
      setCategories(updatedCats);
    }

    onUpdateProject({
      ...project,
      commands: updated,
      commandCategories: updatedCats,
      updatedAt: new Date().toISOString()
    });

    setQuickCmd('');
    setQuickComment('');
  };

  // Delete a single command
  const handleDeleteCommand = (id: string) => {
    const updated = commands.filter(c => c.id !== id);
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
  };

  // Start inline editing
  const handleStartEdit = (item: CommandItem) => {
    setEditingId(item.id);
    setEditCmdText(item.cmd);
    setEditCommentText(item.description || '');
    setEditCategoryText(item.category || 'npm');
  };

  // Save inline editing
  const handleSaveEdit = (id: string) => {
    if (!editCmdText.trim()) return;

    const updated = commands.map(c => {
      if (c.id === id) {
        return {
          ...c,
          cmd: editCmdText.trim(),
          description: editCommentText.trim() || undefined,
          category: editCategoryText.trim() || c.category
        };
      }
      return c;
    });

    setCommands(updated);
    setEditingId(null);

    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const filteredCommands = activeCategory === 'all'
    ? commands
    : commands.filter(c => (c.category || '').toLowerCase() === activeCategory.toLowerCase());

  // Category Icon helper
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'npm':
        return <Box className="w-3.5 h-3.5 text-red-400" />;
      case 'db':
      case 'database':
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case 'folder':
        return <Folder className="w-3.5 h-3.5 text-blue-400" />;
      case 'docker':
        return <Layers className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg shadow-black/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                CMD Commands & CLI Terminal Manager
              </h1>
              <p className="text-xs text-slate-400">
                Categories create karein (npm, db, folder, etc.) aur on-screen commands & comments add karke 1-click me copy karein
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Category Button */}
          <button
            onClick={() => setShowAddCategoryInput(true)}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700 cursor-pointer shadow-sm"
            title="Nayi Category Banayein (e.g. npm, db, folder)"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>+ Category Banayein</span>
          </button>

          {/* Copy All Script */}
          {commands.length > 0 && (
            <button
              onClick={handleCopyAll}
              className="py-2 px-3.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-emerald-600/40 cursor-pointer shadow-sm"
              title="Saari commands ek bash script format me copy karein"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Script Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy All Script</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Inline Category Creation Box (if active) */}
      {showAddCategoryInput && (
        <form 
          onSubmit={handleAddCategory}
          className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="flex-1 w-full flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nayi category ka naam (jaise: npm, db, folder, docker, deploy, git)..."
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="submit"
              disabled={!newCategoryName.trim()}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Category Add Karein</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddCategoryInput(false);
                setNewCategoryName('');
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
        {/* All Tab */}
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer shrink-0 ${
            activeCategory === 'all'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>All Commands</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            activeCategory === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {commands.length}
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const count = commands.filter(c => (c.category || '').toLowerCase() === cat.toLowerCase()).length;
          const isActive = activeCategory === cat;

          return (
            <div
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`group px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {getCategoryIcon(cat)}
              <span className="font-semibold uppercase text-[11px] tracking-wide">{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>

              {/* Delete Category Cross (visible on hover if empty or custom) */}
              {cat !== 'npm' && cat !== 'db' && (
                <button
                  onClick={(e) => handleDeleteCategory(cat, e)}
                  title={`Delete category "${cat}"`}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition ml-0.5 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Live On-Screen Command Input Box (User input field jisme command likh saku + comment) */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-md shadow-black/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white">
              {activeCategory === 'all' 
                ? 'Nayi Command Likhein (Screen Input)' 
                : `[${activeCategory.toUpperCase()}] Category Me Nayi Command Likhein`}
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300">Enter</kbd> to add
          </span>
        </div>

        <form onSubmit={handleAddCommand} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Command Field (Required) */}
            <div className="md:col-span-6">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Command (CLI String) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs select-none">$</span>
                <input
                  type="text"
                  value={quickCmd}
                  onChange={(e) => setQuickCmd(e.target.value)}
                  placeholder="e.g. npm install lucide-react (ya koi bhi command)"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-emerald-300 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Comment / Note Field (Optional - jaisa user ne manga: chahu to comment likhu ya na likhu) */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Comment / Description <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-mono text-xs select-none">#</span>
                <input
                  type="text"
                  value={quickComment}
                  onChange={(e) => setQuickComment(e.target.value)}
                  placeholder="Comment likhein agar zarurat ho (e.g. icons library)..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-300 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Select (if in 'all' view) */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={activeCategory !== 'all' ? activeCategory : quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                disabled={activeCategory !== 'all'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 capitalize focus:outline-none focus:border-emerald-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white capitalize">
                    {c}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Add Row Button */}
          <div className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={!quickCmd.trim()}
              className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Command to {activeCategory !== 'all' ? activeCategory.toUpperCase() : quickCategory.toUpperCase()}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Commands List Cards */}
      <div className="space-y-3">
        {filteredCommands.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl text-slate-400 space-y-2">
            <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-medium text-slate-300">
              {activeCategory === 'all' 
                ? 'Abhi koi command add nahi ki gayi hai.' 
                : `"${activeCategory.toUpperCase()}" category me abhi koi command nahi hai.`}
            </p>
            <p className="text-[11px] text-slate-500">
              Upar diye gaye input field me command likhein aur "+ Add Command" par click karein.
            </p>
          </div>
        ) : (
          filteredCommands.map((item, index) => {
            const isCopied = copiedId === item.id;
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 sm:p-4 shadow-sm transition space-y-2.5"
              >
                {isEditing ? (
                  /* Inline Editing Form */
                  <div className="space-y-3 bg-slate-950/70 p-3 rounded-xl border border-emerald-500/40">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-7">
                        <label className="text-[10px] text-slate-400 block mb-1">Edit Command</label>
                        <input
                          type="text"
                          value={editCmdText}
                          onChange={(e) => setEditCmdText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400 block mb-1">Edit Comment</label>
                        <input
                          type="text"
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          placeholder="Optional comment..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 block mb-1">Category</label>
                        <select
                          value={editCategoryText}
                          onChange={(e) => setEditCategoryText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-200 capitalize focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c} className="bg-slate-900 capitalize">{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Display Row */
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Badge */}
                        <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold tracking-wider bg-slate-950 text-emerald-400 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
                          {getCategoryIcon(item.category || 'npm')}
                          <span>{item.category || 'npm'}</span>
                        </span>

                        {/* Optional Comment / Description */}
                        {item.description ? (
                          <span className="text-xs text-slate-400 italic">
                            # {item.description}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">
                            Command #{index + 1}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: Copy, Edit, Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopy(item.id, item.cmd)}
                          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          }`}
                          title="Copy command to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-300" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                          title="Edit command & comment"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteCommand(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                          title="Delete command"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Terminal Command Display Bar */}
                    <div className="relative flex items-center px-3.5 py-2.5 bg-slate-950 border border-slate-800/90 rounded-xl font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto select-all">
                      <span className="text-slate-600 select-none mr-2">$</span>
                      <span className="flex-1 whitespace-pre">{item.cmd}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
