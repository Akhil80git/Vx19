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
  theme?: 'dark' | 'light';
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  project,
  onNavigateTab,
  onEditProject,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Hero Banner with Project Name & Quick Stats */}
      <div className={`${
        isLight 
          ? 'bg-white border-slate-200 shadow-sm text-slate-900' 
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-slate-800 text-white shadow-xl'
      } border rounded-2xl p-5 sm:p-7 relative overflow-hidden`}>
        <div className={`absolute right-0 top-0 w-80 h-80 ${isLight ? 'bg-emerald-500/10' : 'bg-emerald-500/5'} rounded-full blur-3xl pointer-events-none`} />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <span className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-md ${
                isLight ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
              }`}>
                {project.category}
              </span>
              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-md border ${
                project.status === 'deployed' 
                  ? (isLight ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-blue-950/80 text-blue-300 border-blue-500/30')
                  : project.status === 'in-development'
                  ? (isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950/80 text-amber-300 border-amber-500/30')
                  : (isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700')
              }`}>
                Status: {project.status}
              </span>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Updated: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {project.title}
            </h1>
            <p className={`text-sm sm:text-base mt-1 max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              {project.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onEditProject}
              className={`py-2 px-4 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                isLight 
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
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
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <div className={`${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/60'} p-3 rounded-xl border`}>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'} flex items-center gap-1 mb-1`}>
              <Cpu className="w-3 h-3 text-emerald-500" />
              Frontend & DB
            </span>
            <span className={`text-sm font-bold truncate block ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {project.techStack?.frontend?.framework ? project.techStack.frontend.framework.split(' ')[0] : 'Not Set'} • Firestore
            </span>
          </div>

          <div className={`${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/60'} p-3 rounded-xl border`}>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'} flex items-center gap-1 mb-1`}>
              <Terminal className="w-3 h-3 text-cyan-500" />
              Setup Commands
            </span>
            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {project.commands.length} Commands Ready
            </span>
          </div>

          <div className={`${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/60'} p-3 rounded-xl border`}>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'} flex items-center gap-1 mb-1`}>
              <Network className="w-3 h-3 text-amber-500" />
              API Endpoints
            </span>
            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {project.apiEndpoints.length} Planned
            </span>
          </div>

          <div className={`${isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/50 border-slate-800/60'} p-3 rounded-xl border`}>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'} flex items-center gap-1 mb-1`}>
              <Clock className="w-3 h-3 text-purple-500" />
              Timeline Estimate
            </span>
            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {project.timeline.totalEstimatedWeeks} Weeks Total
            </span>
          </div>
        </div>
      </div>

      {/* Purpose: "Kyu bana rahe hain" Section (User specified requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Why are we building this? */}
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-sm'} border rounded-2xl p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950 text-emerald-400 border-emerald-500/30'} border`}>
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Kyu Bana Rahe Hain? (Purpose & Problem)
              </h3>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Core rationale and real-world value proposition</span>
            </div>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-950/60 text-slate-300 border-slate-800/70'
          }`}>
            {project.purpose || 'Abhi koi purpose specify nahi kiya hai. "Edit Project Details" ya Timeline tab me jakar add karein.'}
          </p>
        </div>

        {/* Target Audience & Target Users */}
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800 shadow-sm'} border rounded-2xl p-5 sm:p-6`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-1.5 rounded-lg ${isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-cyan-950 text-cyan-400 border-cyan-500/30'} border`}>
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Target Audience (Kiske Liye Hai?)
              </h3>
              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Primary beneficiaries and end users</span>
            </div>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed p-4 rounded-xl border ${
            isLight ? 'bg-slate-50 text-slate-700 border-slate-200' : 'bg-slate-950/60 text-slate-300 border-slate-800/70'
          }`}>
            {project.targetAudience || 'Abhi target audience define nahi ki gayi hai. "Edit Project Details" me jakar add karein.'}
          </p>
        </div>
      </div>

      {/* Tech Stack Summary Cards with Navigation Links */}
      <div className={`${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'} border rounded-2xl p-5 sm:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Cpu className="w-4 h-4 text-emerald-500" />
              Core Architecture & Tech Stack Matrix
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Client-managed architecture using Google Firestore for database and security rules
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('tech-stack')}
            className={`text-xs ${isLight ? 'text-emerald-700 hover:text-emerald-800' : 'text-emerald-400 hover:text-emerald-300'} flex items-center gap-1 font-semibold transition cursor-pointer`}
          >
            <span>Full Tech Config</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Frontend */}
          <div className={`p-4 rounded-xl border transition ${
            isLight ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] uppercase font-mono tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Frontend Layer</span>
              <Code2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{project.techStack.frontend.framework}</h4>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{project.techStack.frontend.styling}</p>
            <div className={`mt-3 text-[11px] p-2 rounded-lg border ${
              isLight ? 'bg-white text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
              <b className="text-emerald-500">Why:</b> {project.techStack.frontend.why}
            </div>
          </div>

          {/* Backend / Firestore */}
          <div className={`p-4 rounded-xl border transition ${
            isLight ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] uppercase font-mono tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Backend Model</span>
              <Server className="w-4 h-4 text-cyan-500" />
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{project.techStack.backend.runtime}</h4>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{project.techStack.backend.framework}</p>
            <div className={`mt-3 text-[11px] p-2 rounded-lg border ${
              isLight ? 'bg-white text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
              <b className="text-cyan-500">Why:</b> {project.techStack.backend.why}
            </div>
          </div>

          {/* Database */}
          <div className={`p-4 rounded-xl border transition ${
            isLight ? 'bg-slate-50/70 border-slate-200 hover:border-slate-300' : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] uppercase font-mono tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Database</span>
              <Database className="w-4 h-4 text-purple-500" />
            </div>
            <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{project.techStack.database.primary}</h4>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{project.techStack.database.type}</p>
            <div className={`mt-3 text-[11px] p-2 rounded-lg border ${
              isLight ? 'bg-white text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}>
              <b className="text-purple-500">Why:</b> {project.techStack.database.why}
            </div>
          </div>

        </div>
      </div>

      {/* Quick Launchpad to Specific Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Structure Card */}
        <div 
          onClick={() => onNavigateTab('structure')}
          className={`p-4 rounded-xl border transition cursor-pointer group ${
            isLight 
              ? 'bg-white border-slate-200 hover:border-emerald-500 shadow-xs' 
              : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <FolderTree className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Project Structure</h3>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            View full folder tree and generate directory scaffolding script.
          </p>
          <div className="mt-3 text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <span>Explore Tree</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Commands Card */}
        <div 
          onClick={() => onNavigateTab('commands')}
          className={`p-4 rounded-xl border transition cursor-pointer group ${
            isLight 
              ? 'bg-white border-slate-200 hover:border-cyan-500 shadow-xs' 
              : 'bg-slate-900 border-slate-800 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>CLI & Setup Commands</h3>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {project.commands.length} Terminal commands with 1-click copy for scaffolding & run.
          </p>
          <div className="mt-3 text-xs text-cyan-500 font-semibold flex items-center gap-1">
            <span>Run Commands</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Timeline & Milestones Card */}
        <div 
          onClick={() => onNavigateTab('timeline')}
          className={`p-4 rounded-xl border transition cursor-pointer group ${
            isLight 
              ? 'bg-white border-slate-200 hover:border-purple-500 shadow-xs' 
              : 'bg-slate-900 border-slate-800 hover:border-purple-500/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Timeline & Milestones</h3>
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Estimated {project.timeline.totalEstimatedWeeks} weeks roadmap with phased deliverables.
          </p>
          <div className="mt-3 text-xs text-purple-500 font-semibold flex items-center gap-1">
            <span>Review Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

    </div>
  );
};
