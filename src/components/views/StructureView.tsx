import React, { useState, useEffect } from 'react';
import { Project, FolderNode, StructureModel } from '../../types';
import { 
  FolderTree, 
  Folder, 
  FolderOpen,
  FileCode, 
  FileText,
  Copy, 
  Check, 
  Terminal, 
  Plus, 
  Trash2, 
  ChevronRight,
  ChevronDown,
  FolderPlus,
  FilePlus,
  Edit2,
  X,
  Code2,
  Layers,
  Sparkles
} from 'lucide-react';

interface StructureViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

// Default initial starter node if user starts completely fresh
const DEFAULT_ROOT_NODES: FolderNode[] = [
  {
    id: 'f_src',
    name: 'src',
    type: 'folder',
    path: '/src',
    description: 'Source code folder',
    children: [
      {
        id: 'f_comp',
        name: 'components',
        type: 'folder',
        path: '/src/components',
        description: 'UI components and widgets',
        children: [
          {
            id: 'f_btn',
            name: 'Button.tsx',
            type: 'file',
            path: '/src/components/Button.tsx',
            description: 'Reusable button'
          }
        ]
      },
      {
        id: 'f_app',
        name: 'App.tsx',
        type: 'file',
        path: '/src/App.tsx',
        description: 'Root application component'
      },
      {
        id: 'f_main',
        name: 'main.tsx',
        type: 'file',
        path: '/src/main.tsx',
        description: 'Client entry point'
      }
    ]
  },
  {
    id: 'f_pkg',
    name: 'package.json',
    type: 'file',
    path: '/package.json',
    description: 'Dependencies and scripts'
  },
  {
    id: 'f_env',
    name: '.env.example',
    type: 'file',
    path: '/.env.example',
    description: 'Environment variables definition'
  }
];

// Helper to convert FolderNode tree to ASCII text tree
function treeToAscii(nodes: FolderNode[], prefix = ''): string {
  let output = '';
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    output += `${prefix}${branch}${node.name}${node.type === 'folder' ? '/' : ''}\n`;

    if (node.type === 'folder' && node.children && node.children.length > 0) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      output += treeToAscii(node.children, nextPrefix);
    }
  });
  return output;
}

// Helper to get file extension icon color
function getFileBadge(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return { label: 'REACT', color: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/30' };
    case 'ts':
    case 'js':
      return { label: 'TS', color: 'bg-blue-950/80 text-blue-400 border-blue-500/30' };
    case 'css':
    case 'scss':
      return { label: 'CSS', color: 'bg-pink-950/80 text-pink-400 border-pink-500/30' };
    case 'json':
      return { label: 'JSON', color: 'bg-amber-950/80 text-amber-400 border-amber-500/30' };
    case 'env':
      return { label: 'ENV', color: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' };
    case 'md':
      return { label: 'DOC', color: 'bg-purple-950/80 text-purple-400 border-purple-500/30' };
    default:
      return { label: 'FILE', color: 'bg-slate-800 text-slate-400 border-slate-700' };
  }
}

export const StructureView: React.FC<StructureViewProps> = ({
  project,
  onUpdateProject
}) => {
  // 1. Multiple Structures in the same project
  const [structures, setStructures] = useState<StructureModel[]>(() => {
    if (project.structures && project.structures.length > 0) {
      return project.structures;
    }
    // Initial fallback structure
    return [
      {
        id: 'struct_main',
        name: 'Main App Structure',
        description: 'Complete project folder tree',
        tree: project.folderTree && project.folderTree.length > 0 ? project.folderTree : DEFAULT_ROOT_NODES
      }
    ];
  });

  const [activeStructureId, setActiveStructureId] = useState<string>(() => {
    if (project.structures && project.structures.length > 0) {
      return project.structures[0].id;
    }
    return 'struct_main';
  });

  const [viewMode, setViewMode] = useState<'visual' | 'ascii'>('visual');
  const [copiedAscii, setCopiedAscii] = useState(false);
  const [copiedBash, setCopiedBash] = useState(false);

  // New structure creation modal
  const [showNewStructureModal, setShowNewStructureModal] = useState(false);
  const [newStructureName, setNewStructureName] = useState('');
  const [newStructureDesc, setNewStructureDesc] = useState('');
  const [newStructureTemplate, setNewStructureTemplate] = useState<'react' | 'blank'>('react');

  // Node adding inside a folder
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState<'folder' | 'file'>('file');
  const [newNodeDesc, setNewNodeDesc] = useState('');

  // Expanded folders set
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    f_src: true,
    f_comp: true
  });

  // Sync with project prop
  useEffect(() => {
    if (project.structures && project.structures.length > 0) {
      setStructures(project.structures);
      if (!project.structures.some(s => s.id === activeStructureId)) {
        setActiveStructureId(project.structures[0].id);
      }
    }
  }, [project.id, project.structures]);

  const activeStructure = structures.find(s => s.id === activeStructureId) || structures[0];

  // Helper to update active structure's tree and save
  const updateActiveTree = (newTree: FolderNode[]) => {
    const updatedStructures = structures.map(s => {
      if (s.id === activeStructure.id) {
        return {
          ...s,
          tree: newTree,
          textFormat: treeToAscii(newTree)
        };
      }
      return s;
    });

    setStructures(updatedStructures);

    onUpdateProject({
      ...project,
      structures: updatedStructures,
      folderTree: newTree,
      folderStructureText: treeToAscii(newTree),
      updatedAt: new Date().toISOString()
    });
  };

  // Toggle folder open/close
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Add a new Structure to this project
  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStructureName.trim()) return;

    const newStruct: StructureModel = {
      id: 'struct_' + Date.now(),
      name: newStructureName.trim(),
      description: newStructureDesc.trim() || undefined,
      tree: newStructureTemplate === 'react' ? DEFAULT_ROOT_NODES : []
    };

    const updated = [...structures, newStruct];
    setStructures(updated);
    setActiveStructureId(newStruct.id);
    setShowNewStructureModal(false);
    setNewStructureName('');
    setNewStructureDesc('');

    onUpdateProject({
      ...project,
      structures: updated,
      updatedAt: new Date().toISOString()
    });
  };

  // Delete a structure
  const handleDeleteStructure = (structId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (structures.length <= 1) {
      alert('Kam se kam ek structure hona zaruri hai.');
      return;
    }
    const confirmed = window.confirm('Kya aap yeh structure delete karna chahte hain?');
    if (!confirmed) return;

    const remaining = structures.filter(s => s.id !== structId);
    setStructures(remaining);
    setActiveStructureId(remaining[0].id);

    onUpdateProject({
      ...project,
      structures: remaining,
      updatedAt: new Date().toISOString()
    });
  };

  // Recursively add a node
  const handleAddNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const newNode: FolderNode = {
      id: 'node_' + Date.now(),
      name: newNodeName.trim(),
      type: newNodeType,
      path: targetFolderId ? `/${newNodeName.trim()}` : `/${newNodeName.trim()}`,
      description: newNodeDesc.trim() || undefined,
      children: newNodeType === 'folder' ? [] : undefined
    };

    const addRecursive = (nodes: FolderNode[]): FolderNode[] => {
      if (!targetFolderId) {
        // Add to root
        return [...nodes, newNode];
      }
      return nodes.map(node => {
        if (node.id === targetFolderId && node.type === 'folder') {
          return {
            ...node,
            children: [...(node.children || []), newNode]
          };
        }
        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: addRecursive(node.children)
          };
        }
        return node;
      });
    };

    const updatedTree = addRecursive(activeStructure.tree);
    updateActiveTree(updatedTree);

    if (targetFolderId) {
      setExpandedFolders(prev => ({ ...prev, [targetFolderId]: true }));
    }

    setTargetFolderId(null);
    setNewNodeName('');
    setNewNodeDesc('');
  };

  // Recursively delete a node
  const handleDeleteNode = (nodeId: string) => {
    const deleteRecursive = (nodes: FolderNode[]): FolderNode[] => {
      return nodes
        .filter(n => n.id !== nodeId)
        .map(n => {
          if (n.children && n.children.length > 0) {
            return {
              ...n,
              children: deleteRecursive(n.children)
            };
          }
          return n;
        });
    };

    const updatedTree = deleteRecursive(activeStructure.tree);
    updateActiveTree(updatedTree);
  };

  // Copy ASCII Tree representation
  const handleCopyAscii = () => {
    const text = treeToAscii(activeStructure.tree);
    navigator.clipboard.writeText(text);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  // Copy Bash mkdir scaffold script
  const handleCopyBash = () => {
    const getDirsAndFiles = (nodes: FolderNode[], currentPath = ''): { dirs: string[], files: string[] } => {
      let dirs: string[] = [];
      let files: string[] = [];

      nodes.forEach(n => {
        const itemPath = currentPath ? `${currentPath}/${n.name}` : n.name;
        if (n.type === 'folder') {
          dirs.push(itemPath);
          if (n.children && n.children.length > 0) {
            const sub = getDirsAndFiles(n.children, itemPath);
            dirs = dirs.concat(sub.dirs);
            files = files.concat(sub.files);
          }
        } else {
          files.push(itemPath);
        }
      });

      return { dirs, files };
    };

    const { dirs, files } = getDirsAndFiles(activeStructure.tree);

    const bashScript = `#!/usr/bin/env bash
# Auto-generated Scaffold for "${project.title} - ${activeStructure.name}"
echo "Scaffolding structure..."

${dirs.length > 0 ? `# Create Directories\nmkdir -p ${dirs.join(' ')}\n` : ''}
${files.length > 0 ? `# Touch Files\ntouch ${files.join(' ')}\n` : ''}
echo "Done! Project structure created."
`;

    navigator.clipboard.writeText(bashScript);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  // Recursive Tree Renderer with Connecting Branch Lines
  const renderConnectedTree = (nodes: FolderNode[], depth = 0, isRoot = true) => {
    if (!nodes || nodes.length === 0) return null;

    return (
      <div className={`space-y-1.5 ${!isRoot ? 'relative pl-5 ml-2.5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-slate-800' : ''}`}>
        {nodes.map((node, index) => {
          const isFolder = node.type === 'folder';
          const isExpanded = expandedFolders[node.id] ?? true;
          const isLast = index === nodes.length - 1;

          return (
            <div key={node.id} className="relative group">
              
              {/* Connecting branch guideline (horizontal line from parent vertical line) */}
              {!isRoot && (
                <div className="absolute -left-5 top-4 w-4 h-px bg-slate-800 pointer-events-none group-hover:bg-slate-700 transition-colors" />
              )}

              {/* Node Card Row */}
              <div 
                className={`flex items-center justify-between p-2 rounded-xl transition select-none ${
                  isFolder 
                    ? 'bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-100' 
                    : 'bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 text-slate-200'
                }`}
              >
                {/* Left Side: Expand icon, folder/file icon, name, description */}
                <div 
                  className="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer"
                  onClick={() => isFolder && toggleFolder(node.id)}
                >
                  {isFolder ? (
                    <button 
                      type="button"
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <span className="w-5" /> // spacer
                  )}

                  {/* Folder / File Icon */}
                  {isFolder ? (
                    isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                    )
                  ) : (
                    <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}

                  {/* Name */}
                  <span className={`font-mono text-xs truncate ${isFolder ? 'font-bold text-white' : 'font-medium text-slate-200'}`}>
                    {node.name}
                  </span>

                  {/* File type badge */}
                  {!isFolder && (
                    <span className={`px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded border ${getFileBadge(node.name).color}`}>
                      {getFileBadge(node.name).label}
                    </span>
                  )}

                  {/* Description note */}
                  {node.description && (
                    <span className="hidden sm:inline-block text-[11px] text-slate-400 truncate italic">
                      — {node.description}
                    </span>
                  )}
                </div>

                {/* Right Side: Quick Add inside folder, or Delete */}
                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {isFolder && (
                    <>
                      <button
                        onClick={() => {
                          setTargetFolderId(node.id);
                          setNewNodeType('file');
                        }}
                        className="py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        title="Add file inside this folder"
                      >
                        <FilePlus className="w-3 h-3 text-emerald-400" />
                        <span className="hidden sm:inline">+ File</span>
                      </button>
                      <button
                        onClick={() => {
                          setTargetFolderId(node.id);
                          setNewNodeType('folder');
                        }}
                        className="py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 transition cursor-pointer"
                        title="Add sub-folder inside this folder"
                      >
                        <FolderPlus className="w-3 h-3 text-amber-400" />
                        <span className="hidden sm:inline">+ Folder</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                    title={`Delete ${isFolder ? 'folder' : 'file'}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recursive Children with Connected Lines */}
              {isFolder && isExpanded && node.children && node.children.length > 0 && (
                <div className="mt-1">
                  {renderConnectedTree(node.children, depth + 1, false)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg shadow-black/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Folder Structure Architect
              </h1>
              <p className="text-xs text-slate-400">
                Ek hi project me alag-alag structures banayein aur visually connected branches me files & folders organize karein
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Multiple Structure Button */}
          <button
            onClick={() => setShowNewStructureModal(true)}
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-950/40"
            title="Is project me ek aur naya folder structure banayein"
          >
            <Plus className="w-4 h-4" />
            <span>+ Naya Structure Banayein</span>
          </button>

          {/* Copy Tree Text */}
          <button
            onClick={handleCopyAscii}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            title="ASCII Tree text copy karein"
          >
            {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Tree</span>
          </button>

          {/* Copy Bash Script */}
          <button
            onClick={handleCopyBash}
            className="py-2 px-3 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition border border-cyan-500/30 cursor-pointer"
            title="Terminal me folder banane wala bash script copy karein"
          >
            {copiedBash ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Terminal className="w-3.5 h-3.5" />}
            <span>Copy Bash Script</span>
          </button>
        </div>
      </div>

      {/* Multiple Structures Tab Bar (User can create multiple structures in 1 project!) */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {structures.map((s) => {
            const isActive = s.id === activeStructure.id;
            return (
              <div
                key={s.id}
                onClick={() => setActiveStructureId(s.id)}
                className={`group px-3.5 py-2 rounded-xl font-medium flex items-center gap-2 transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span className="font-semibold text-xs">{s.name}</span>

                {/* Delete Structure button (if more than 1) */}
                {structures.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteStructure(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition ml-1 p-0.5"
                    title={`Delete structure "${s.name}"`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* View mode toggle: Visual Connected Tree vs Raw ASCII Tree */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              viewMode === 'visual' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Visual Connected Tree
          </button>
          <button
            onClick={() => setViewMode('ascii')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
              viewMode === 'ascii' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ASCII Text Preview
          </button>
        </div>
      </div>

      {/* Structure Description & Quick Root Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800/80 p-3.5 rounded-2xl">
        <div className="text-xs text-slate-400">
          Current Structure: <strong className="text-white">{activeStructure.name}</strong>
          {activeStructure.description && <span> • {activeStructure.description}</span>}
        </div>

        {/* Root level add buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTargetFolderId(null);
              setNewNodeType('folder');
            }}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Root Folder</span>
          </button>
          <button
            onClick={() => {
              setTargetFolderId(null);
              setNewNodeType('file');
            }}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Root File</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'visual' ? (
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl shadow-black/20">
          {activeStructure.tree.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-3">
              <FolderTree className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs font-medium text-slate-300">
                Yeh structure abhi bilkul khali hai.
              </p>
              <p className="text-[11px] text-slate-500">
                Upar diye gaye "+ Root Folder" ya "+ Root File" par click karke shuruat karein.
              </p>
            </div>
          ) : (
            renderConnectedTree(activeStructure.tree)
          )}
        </div>
      ) : (
        /* ASCII Text Preview & Editor */
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Terminal ASCII View:</span>
            <button
              onClick={handleCopyAscii}
              className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>Copy All Text</span>
            </button>
          </div>
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed overflow-x-auto select-all">
            {treeToAscii(activeStructure.tree) || 'Root structure is empty.'}
          </pre>
        </div>
      )}

      {/* Modal: Add File or Folder */}
      {(targetFolderId !== null || newNodeType) && (targetFolderId !== null || (newNodeName !== '' || false)) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {newNodeType === 'folder' ? <FolderPlus className="w-5 h-5 text-amber-400" /> : <FilePlus className="w-5 h-5 text-emerald-400" />}
                {newNodeType === 'folder' ? 'Add Folder' : 'Add File'} {targetFolderId ? 'Inside Folder' : 'At Root Level'}
              </h3>
              <button
                onClick={() => setTargetFolderId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNodeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  {newNodeType === 'folder' ? 'Folder Name (e.g. components, utils, api)' : 'File Name (e.g. Button.tsx, schema.ts, db.json)'}
                </label>
                <input
                  type="text"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder={newNodeType === 'folder' ? 'e.g. services' : 'e.g. auth.service.ts'}
                  autoFocus
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Description / Purpose <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newNodeDesc}
                  onChange={(e) => setNewNodeDesc(e.target.value)}
                  placeholder="e.g. Handles JWT tokens & session verification"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTargetFolderId(null)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newNodeName.trim()}
                  className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Add {newNodeType === 'folder' ? 'Folder' : 'File'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Naya Structure in this project */}
      {showNewStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-emerald-400" />
                Naya Folder Structure Banayein
              </h3>
              <button
                onClick={() => setShowNewStructureModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Aap is ek hi project ke andar alag-alag structures (jaise: Backend API, Frontend App, Microservices) maintain kar sakte hain.
            </p>

            <form onSubmit={handleCreateStructure} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Structure Name *
                </label>
                <input
                  type="text"
                  value={newStructureName}
                  onChange={(e) => setNewStructureName(e.target.value)}
                  placeholder="e.g. Backend API Structure, Monorepo Layout"
                  autoFocus
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Description <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newStructureDesc}
                  onChange={(e) => setNewStructureDesc(e.target.value)}
                  placeholder="e.g. Node.js Express controllers and routes"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Initial Template
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewStructureTemplate('react')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      newStructureTemplate === 'react' 
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Fullstack / React</span>
                    <span className="text-[10px] text-slate-500">src, components, main</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewStructureTemplate('blank')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      newStructureTemplate === 'blank' 
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="font-semibold block text-xs">Clean / Blank</span>
                    <span className="text-[10px] text-slate-500">0 folders (khali)</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewStructureModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newStructureName.trim()}
                  className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Structure Banayein</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
