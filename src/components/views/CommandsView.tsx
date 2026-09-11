import React, { useState } from 'react';
import { Project, CommandItem } from '../../types';
import { 
  Terminal, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Code2, 
  Play, 
  Save, 
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

interface CommandsViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

export const CommandsView: React.FC<CommandsViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [commands, setCommands] = useState<CommandItem[]>(project.commands);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // New command modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCmd, setNewCmd] = useState('');
  const [newCategory, setNewCategory] = useState<CommandItem['category']>('dependencies');
  const [newDescription, setNewDescription] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const script = `#!/usr/bin/env bash
# Setup commands for ${project.title}

${commands.map(c => `# [${c.category.toUpperCase()}] ${c.title}\n${c.cmd}\n`).join('\n')}
`;
    navigator.clipboard.writeText(script);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDeleteCommand = (id: string) => {
    const updated = commands.filter(c => c.id !== id);
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCmd.trim()) return;

    const newItem: CommandItem = {
      id: 'cmd_' + Date.now(),
      title: newTitle.trim(),
      cmd: newCmd.trim(),
      category: newCategory,
      description: newDescription.trim() || undefined
    };

    const updated = [...commands, newItem];
    setCommands(updated);
    onUpdateProject({
      ...project,
      commands: updated,
      updatedAt: new Date().toISOString()
    });

    setNewTitle('');
    setNewCmd('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const filteredCommands = selectedCategory === 'all' 
    ? commands 
    : commands.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            CLI Setup & Run Commands (Command Kya Kya Lagege)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Essential terminal commands for scaffolding, dependencies, dev server, build, and deployment
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>All Commands Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Script</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Command</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
        {['all', 'scaffold', 'dependencies', 'dev', 'build', 'deploy'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium capitalize whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat} {cat === 'all' ? `(${commands.length})` : ''}
          </button>
        ))}
      </div>

      {/* Commands List */}
      <div className="space-y-4">
        {filteredCommands.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No commands in this category. Click "+ Add Command" to create one.
          </div>
        ) : (
          filteredCommands.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 rounded-md">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {item.title}
                      </h3>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCopy(item.id, item.cmd)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteCommand(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                      title="Delete command"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Terminal Command Output Box */}
                <div className="relative group">
                  <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950 border border-slate-800/90 rounded-xl font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto select-all">
                    <span className="text-slate-600 select-none mr-2">$</span>
                    <span className="flex-1 whitespace-pre">{item.cmd}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Command Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Add Setup or CLI Command
            </h3>

            <form onSubmit={handleAddCommand} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Command Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Install Tailwind CSS plugin"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="scaffold">Scaffolding / Init</option>
                  <option value="dependencies">Dependencies (npm install)</option>
                  <option value="dev">Dev Server</option>
                  <option value="build">Build & Bundling</option>
                  <option value="deploy">Deployment & Firestore Rules</option>
                  <option value="docker">Docker & Container</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Command Line String (Exact Command)</label>
                <input
                  type="text"
                  required
                  value={newCmd}
                  onChange={(e) => setNewCmd(e.target.value)}
                  placeholder="e.g., npm install -D @tailwindcss/vite"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-emerald-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Short Description (Optional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g., Configures Tailwind CSS styling compiler"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-md shadow-emerald-900/30"
                >
                  Add Command
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
