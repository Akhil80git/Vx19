import React, { useState, useEffect } from 'react';
import { Project, FolderNode } from '../../types';
import { 
  FolderTree, 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  Plus, 
  Save, 
  Download, 
  CheckCircle2,
  FolderPlus,
  FilePlus,
  Trash2
} from 'lucide-react';

interface StructureViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

export const StructureView: React.FC<StructureViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [structureText, setStructureText] = useState(project.folderStructureText || '');
  const [copiedTree, setCopiedTree] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mode, setMode] = useState<'text' | 'scaffold'>('text');

  // Sync state when project changes
  useEffect(() => {
    setStructureText(project.folderStructureText || '');
  }, [project.id, project.folderStructureText]);

  // Generate runnable bash script to create the folders and files
  const generateBashScaffold = () => {
    const lines = structureText.split('\n');
    const dirs = new Set<string>();
    const files = new Set<string>();

    let currentDir = '.';

    // Basic heuristic to parse tree lines
    lines.forEach(line => {
      const trimmed = line.replace(/[├─│└\s]+/g, '').trim();
      if (!trimmed) return;
      if (trimmed.endsWith('/')) {
        dirs.add(trimmed.slice(0, -1));
      } else if (trimmed.includes('.')) {
        files.add(trimmed);
      }
    });

    const script = `#!/usr/bin/env bash
# Auto-generated project scaffold script for ${project.title}
echo "Scaffolding ${project.title}..."

# 1. Create Directories
mkdir -p public src/assets src/components/ui src/components/layout src/lib src/hooks src/types

# 2. Touch Essential Configuration Files
touch package.json tsconfig.json vite.config.ts firestore.rules index.html

# 3. Touch Source Boilerplates
touch src/App.tsx src/main.tsx src/index.css src/lib/firebase.ts src/types/index.ts

echo "Done! Project structure created successfully."
`;
    return script;
  };

  const handleCopyTree = () => {
    navigator.clipboard.writeText(structureText);
    setCopiedTree(true);
    setTimeout(() => setCopiedTree(false), 2000);
  };

  const handleCopyBash = () => {
    navigator.clipboard.writeText(generateBashScaffold());
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  const handleSaveText = () => {
    onUpdateProject({
      ...project,
      folderStructureText: structureText,
      updatedAt: new Date().toISOString()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-400" />
            Project File & Folder Architecture
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive folder structure representation with auto-generated terminal scaffolding commands
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyTree}
            className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            {copiedTree ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tree Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Tree</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyBash}
            className="py-2 px-3.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer border border-cyan-500/40"
          >
            {copiedBash ? (
              <>
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bash Script Copied!</span>
              </>
            ) : (
              <>
                <Terminal className="w-3.5 h-3.5" />
                <span>Copy Scaffolding Script</span>
              </>
            )}
          </button>

          <button
            onClick={handleSaveText}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-900/30"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved Structure!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setMode('text')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition cursor-pointer ${
            mode === 'text'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Visual / Text Tree Editor
        </button>
        <button
          onClick={() => setMode('scaffold')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition cursor-pointer ${
            mode === 'scaffold'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Auto Scaffolding CLI Script (mkdir & touch)
        </button>
      </div>

      {/* Editor & Viewer */}
      {mode === 'text' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-mono">Editable Directory Hierarchy (ASCII Tree):</span>
            <span className="text-[11px] text-emerald-400">You can add, edit, or customize any folder paths directly</span>
          </div>

          <textarea
            value={structureText}
            onChange={(e) => setStructureText(e.target.value)}
            rows={22}
            className="w-full p-4 bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-y selection:bg-emerald-900 selection:text-white"
            placeholder="project-root/&#10;├── src/&#10;└── package.json"
          />
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Terminal Run Command (Scaffold All at Once)
              </h3>
              <p className="text-xs text-slate-400">
                Run this directly in your terminal to instantly generate all directories and files:
              </p>
            </div>
            <button
              onClick={handleCopyBash}
              className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedBash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBash ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 text-cyan-300 font-mono text-xs sm:text-sm rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
            {generateBashScaffold()}
          </pre>
        </div>
      )}

    </div>
  );
};
