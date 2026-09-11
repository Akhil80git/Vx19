import React from 'react';
import { Project, ActiveTab } from '../../types';
import { 
  Sparkles, 
  Cpu, 
  FolderTree, 
  Terminal, 
  Network, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target, 
  HelpCircle, 
  ExternalLink,
  ArrowRight,
  Code2,
  Database,
  ShieldCheck,
  Server
} from 'lucide-react';

interface OverviewViewProps {
  project: Project;
  onNavigateTab: (tab: ActiveTab) => void;
  onEditProject: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  project,
  onNavigateTab,
  onEditProject
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Hero Banner with Project Name & Quick Stats */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                {project.category}
              </span>
              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-md border ${
                project.status === 'deployed' 
                  ? 'bg-blue-950/80 text-blue-300 border-blue-500/30' 
                  : project.status === 'in-development'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                Status: {project.status}
              </span>
              <span className="text-xs text-slate-500">
                Updated: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
              {project.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onEditProject}
              className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              Edit Project Details
            </button>
            <button
              onClick={() => onNavigateTab('commands')}
              className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-900/30"
            >
              <Terminal className="w-3.5 h-3.5" />
              View Commands
            </button>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Cpu className="w-3 h-3 text-emerald-400" />
              Frontend & DB
            </span>
            <span className="text-sm font-bold text-white truncate block">
              {project.techStack.frontend.framework.split(' ')[0]} + Firestore
            </span>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              Setup Commands
            </span>
            <span className="text-sm font-bold text-white">
              {project.commands.length} Commands Ready
            </span>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Network className="w-3 h-3 text-amber-400" />
              API Endpoints
            </span>
            <span className="text-sm font-bold text-white">
              {project.apiEndpoints.length} Planned
            </span>
          </div>

          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-purple-400" />
              Timeline Estimate
            </span>
            <span className="text-sm font-bold text-white">
              {project.timeline.totalEstimatedWeeks} Weeks Total
            </span>
          </div>
        </div>
      </div>

      {/* Purpose: "Kyu bana rahe hain" Section (User specified requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Why are we building this? */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Kyu Bana Rahe Hain? (Purpose & Problem)
              </h3>
              <span className="text-[10px] text-slate-400">Core rationale and real-world value proposition</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
            {project.purpose}
          </p>
        </div>

        {/* Target Audience & Target Users */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                Target Audience (Kiske Liye Hai?)
              </h3>
              <span className="text-[10px] text-slate-400">Primary beneficiaries and end users</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
            {project.targetAudience}
          </p>
        </div>
      </div>

      {/* Tech Stack Summary Cards with Navigation Links */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Core Architecture & Tech Stack Matrix
            </h2>
            <p className="text-xs text-slate-400">
              Client-managed architecture using Google Firestore for database and security rules
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tech-stack')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition"
          >
            <span>Full Tech Config</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Frontend */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Frontend Layer</span>
              <Code2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">{project.techStack.frontend.framework}</h4>
            <p className="text-xs text-slate-400 mt-1">{project.techStack.frontend.styling}</p>
            <div className="mt-3 text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
              <b className="text-emerald-400">Why:</b> {project.techStack.frontend.why}
            </div>
          </div>

          {/* Backend / Firestore */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Backend Model</span>
              <Server className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white">{project.techStack.backend.runtime}</h4>
            <p className="text-xs text-slate-400 mt-1">{project.techStack.backend.framework}</p>
            <div className="mt-3 text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
              <b className="text-cyan-400">Why:</b> {project.techStack.backend.why}
            </div>
          </div>

          {/* Database */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Database</span>
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white">{project.techStack.database.primary}</h4>
            <p className="text-xs text-slate-400 mt-1">Type: {project.techStack.database.type}</p>
            <div className="mt-3 text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
              <b className="text-purple-400">Why:</b> {project.techStack.database.why}
            </div>
          </div>

        </div>
      </div>

      {/* Quick Launchpad to Specific Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Structure Card */}
        <div 
          onClick={() => onNavigateTab('structure')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-white">Project Structure</h3>
          </div>
          <p className="text-xs text-slate-400">
            View full folder tree and generate directory scaffolding script.
          </p>
          <div className="mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1">
            <span>Explore Tree</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Commands Card */}
        <div 
          onClick={() => onNavigateTab('commands')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-white">CLI & Setup Commands</h3>
          </div>
          <p className="text-xs text-slate-400">
            {project.commands.length} Terminal commands with 1-click copy for scaffolding & run.
          </p>
          <div className="mt-3 text-xs text-cyan-400 font-medium flex items-center gap-1">
            <span>Run Commands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Timeline & Milestones Card */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-bold text-white">Timeline & Milestones</h3>
          </div>
          <p className="text-xs text-slate-400">
            Estimated {project.timeline.totalEstimatedWeeks} weeks roadmap with phased deliverables.
          </p>
          <div className="mt-3 text-xs text-purple-400 font-medium flex items-center gap-1">
            <span>Review Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

    </div>
  );
};
