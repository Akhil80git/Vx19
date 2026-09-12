import React, { useState } from 'react';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { 
  Folders, 
  Plus, 
  Search, 
  Trash2, 
  Copy, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Network,
  Sparkles,
  Edit3
} from 'lucide-react';

interface ProjectsListViewProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  theme?: 'dark' | 'light';
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onDeleteProject,
  onDuplicateProject,
  onEditProject,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cardBg = isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const subtextColor = isLight ? 'text-slate-500' : 'text-slate-400';
  const dividerColor = isLight ? 'border-slate-200' : 'border-slate-800';

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border p-5 rounded-2xl ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${headingColor}`}>
            <Folders className="w-5 h-5 text-emerald-500" />
            All Software Blueprints & Projects ({projects.length})
          </h1>
          <p className={`text-xs mt-0.5 ${subtextColor}`}>
            Click any project to switch to it, inspect its architecture, commands, APIs, and edit all details
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/30 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Project</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`w-4 h-4 absolute left-3.5 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, tech, purpose..."
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
              isLight 
                ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm' 
                : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
            }`}
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {['all', 'fullstack', 'ecommerce', 'ai-saas', 'web-app', 'mobile'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium capitalize whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : (isLight 
                      ? 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200' 
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800')
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length === 0 ? (
          <div className={`col-span-full p-12 text-center border rounded-2xl ${cardBg}`}>
            <Folders className={`w-10 h-10 mx-auto mb-3 ${isLight ? 'text-slate-300' : 'text-slate-600'}`} />
            <h3 className={`text-sm font-semibold ${headingColor}`}>No projects found</h3>
            <p className={`text-xs mt-1 mb-4 ${subtextColor}`}>Try another search or create a new architecture blueprint.</p>
            <button
              onClick={onNewProject}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              + Create Project
            </button>
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isActive = activeProjectId === proj.id;

            return (
              <div
                key={proj.id}
                className={`rounded-2xl p-5 border transition flex flex-col justify-between shadow-sm relative group ${
                  isLight ? 'bg-white' : 'bg-slate-900'
                } ${
                  isActive
                    ? 'border-emerald-500 ring-1 ring-emerald-500/30'
                    : (isLight ? 'border-slate-200 hover:border-slate-300' : 'border-slate-800 hover:border-slate-700')
                }`}
              >
                {/* Active Indicator badge */}
                {isActive && (
                  <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    Active Blueprint
                  </span>
                )}

                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 border rounded text-[10px] font-mono uppercase ${
                      isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-950 text-emerald-400 border-slate-800'
                    }`}>
                      {proj.category}
                    </span>
                    <span className={`text-[10px] capitalize ${subtextColor}`}>
                      {proj.status}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className={`text-base font-bold transition-colors line-clamp-1 ${
                    isLight ? 'text-slate-900 group-hover:text-emerald-600' : 'text-white group-hover:text-emerald-300'
                  }`}>
                    {proj.title}
                  </h3>
                  <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${subtextColor}`}>
                    {proj.tagline || proj.purpose}
                  </p>

                  {/* Tech specs mini row */}
                  <div className={`mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-[11px] ${dividerColor}`}>
                    <div>
                      <span className={`block text-[10px] uppercase font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Frontend</span>
                      <span className={`font-medium truncate block ${headingColor}`}>{proj.techStack.frontend.framework.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className={`block text-[10px] uppercase font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Database</span>
                      <span className={`font-medium truncate block ${headingColor}`}>{proj.techStack.database.primary.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Commands and APIs counts */}
                  <div className={`flex items-center gap-3 mt-3 text-[11px] font-mono ${subtextColor}`}>
                    <span className="flex items-center gap-1">
                      <Terminal className="w-3 h-3 text-cyan-500" />
                      {proj.commands.length} cmds
                    </span>
                    <span className="flex items-center gap-1">
                      <Network className="w-3 h-3 text-purple-500" />
                      {proj.apiEndpoints.length} apis
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      {proj.timeline.totalEstimatedWeeks}w
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className={`mt-5 pt-3 border-t flex items-center justify-between gap-2 ${dividerColor}`}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditProject(proj)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Edit project meta"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateProject(proj)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Clone blueprint"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {projects.length > 1 && (
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          isLight ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                        }`}
                        title="Delete blueprint"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : (isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200')
                    }`}
                  >
                    <span>{isActive ? 'Current' : 'Open & Edit'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
