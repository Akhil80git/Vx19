import React, { useState, useEffect } from 'react';
import { Project, TechStackConfig } from '../../types';
import { 
  Cpu, 
  Code2, 
  Server, 
  Database, 
  ShieldCheck, 
  Globe, 
  Save, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ArchitectureViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  theme?: 'dark' | 'light';
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  project,
  onUpdateProject,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [techStack, setTechStack] = useState<TechStackConfig>(project.techStack);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when project changes
  useEffect(() => {
    setTechStack(project.techStack);
  }, [project.id, project.techStack]);

  const handleFieldChange = (section: keyof TechStackConfig, field: string, value: string) => {
    setTechStack(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdateProject({
      ...project,
      techStack,
      updatedAt: new Date().toISOString()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const cardBg = isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800';
  const innerBoxBg = isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800';
  const inputBg = isLight 
    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500' 
    : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500';
  const labelColor = isLight ? 'text-slate-600' : 'text-slate-300';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const subtextColor = isLight ? 'text-slate-500' : 'text-slate-400';
  const dividerColor = isLight ? 'border-slate-200' : 'border-slate-800';

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border p-5 rounded-2xl ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${headingColor}`}>
            <Cpu className="w-5 h-5 text-emerald-500" />
            Software Architecture & Tech Stack Planner
          </h1>
          <p className={`text-xs mt-0.5 ${subtextColor}`}>
            Define Frontend, Backend model (Firestore client-managed), Database, Auth, and Hosting with rationale
          </p>
        </div>

        <button
          onClick={handleSave}
          className="self-start sm:self-auto py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-emerald-900/30 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              Saved Tech Stack!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Tech Stack Changes
            </>
          )}
        </button>
      </div>

      {/* Architecture System Flow Diagram */}
      <div className={`border rounded-2xl p-5 ${cardBg}`}>
        <h2 className={`text-xs uppercase font-mono tracking-wider mb-3 flex items-center gap-1.5 ${subtextColor}`}>
          <Layers className="w-4 h-4 text-emerald-500" />
          Client-Managed System Flow (No Heavy Backend Server)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          {/* Box 1: Client */}
          <div className={`p-3.5 rounded-xl border flex flex-col items-center ${innerBoxBg}`}>
            <div className={`p-2 rounded-lg mb-2 ${isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950 text-emerald-400'}`}>
              <Code2 className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold ${headingColor}`}>Client UI Layer</span>
            <span className={`text-[11px] mt-1 ${subtextColor}`}>{techStack.frontend.framework}</span>
            <span className="text-[10px] text-emerald-500 mt-1 font-medium">Reactive State + Tailwind</span>
          </div>

          {/* Box 2: Auth */}
          <div className={`p-3.5 rounded-xl border flex flex-col items-center ${innerBoxBg}`}>
            <div className={`p-2 rounded-lg mb-2 ${isLight ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-cyan-950 text-cyan-400'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold ${headingColor}`}>Identity & Auth</span>
            <span className={`text-[11px] mt-1 ${subtextColor}`}>{techStack.auth.provider}</span>
            <span className="text-[10px] text-cyan-500 mt-1 font-medium">Secure JWT Tokens</span>
          </div>

          {/* Box 3: Firestore Database */}
          <div className={`p-3.5 rounded-xl border flex flex-col items-center ${innerBoxBg}`}>
            <div className={`p-2 rounded-lg mb-2 ${isLight ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-purple-950 text-purple-400'}`}>
              <Database className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold ${headingColor}`}>Firestore Database</span>
            <span className={`text-[11px] mt-1 ${subtextColor}`}>{techStack.database.primary}</span>
            <span className="text-[10px] text-purple-500 mt-1 font-medium">Direct Client Sync + Rules</span>
          </div>

          {/* Box 4: Hosting */}
          <div className={`p-3.5 rounded-xl border flex flex-col items-center ${innerBoxBg}`}>
            <div className={`p-2 rounded-lg mb-2 ${isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950 text-blue-400'}`}>
              <Globe className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold ${headingColor}`}>Edge CDN Hosting</span>
            <span className={`text-[11px] mt-1 ${subtextColor}`}>{techStack.hosting.platform}</span>
            <span className="text-[10px] text-blue-500 mt-1 font-medium">Global Edge Caching</span>
          </div>
        </div>
      </div>

      {/* Editable Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Frontend Layer */}
        <div className={`border rounded-2xl p-5 space-y-4 ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-2 border-b ${dividerColor}`}>
            <Code2 className="w-5 h-5 text-emerald-500" />
            <h3 className={`text-sm font-bold ${headingColor}`}>1. Frontend Architecture</h3>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Framework & Language</label>
            <input
              type="text"
              value={techStack.frontend.framework}
              onChange={(e) => handleFieldChange('frontend', 'framework', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Styling Engine</label>
              <input
                type="text"
                value={techStack.frontend.styling}
                onChange={(e) => handleFieldChange('frontend', 'styling', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Build Tool</label>
              <input
                type="text"
                value={techStack.frontend.buildTool}
                onChange={(e) => handleFieldChange('frontend', 'buildTool', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Why chosen? (Kyu chuna hai?)</label>
            <textarea
              rows={2}
              value={techStack.frontend.why}
              onChange={(e) => handleFieldChange('frontend', 'why', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none ${inputBg}`}
            />
          </div>
        </div>

        {/* 2. Backend Architecture (Firestore Direct vs API) */}
        <div className={`border rounded-2xl p-5 space-y-4 ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-2 border-b ${dividerColor}`}>
            <Server className="w-5 h-5 text-cyan-500" />
            <h3 className={`text-sm font-bold ${headingColor}`}>2. Backend Strategy (Firestore Direct)</h3>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Backend Runtime / Model</label>
            <input
              type="text"
              value={techStack.backend.runtime}
              onChange={(e) => handleFieldChange('backend', 'runtime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Framework / Security Model</label>
            <input
              type="text"
              value={techStack.backend.framework}
              onChange={(e) => handleFieldChange('backend', 'framework', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Why chosen? (Zero server overhead explanation)</label>
            <textarea
              rows={2}
              value={techStack.backend.why}
              onChange={(e) => handleFieldChange('backend', 'why', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none ${inputBg}`}
            />
          </div>
        </div>

        {/* 3. Database Layer */}
        <div className={`border rounded-2xl p-5 space-y-4 ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-2 border-b ${dividerColor}`}>
            <Database className="w-5 h-5 text-purple-500" />
            <h3 className={`text-sm font-bold ${headingColor}`}>3. Database Schema & Storage</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Primary Database</label>
              <input
                type="text"
                value={techStack.database.primary}
                onChange={(e) => handleFieldChange('database', 'primary', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Database Type</label>
              <input
                type="text"
                value={techStack.database.type}
                onChange={(e) => handleFieldChange('database', 'type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Client Caching / Offline Sync</label>
            <input
              type="text"
              value={techStack.database.caching || ''}
              onChange={(e) => handleFieldChange('database', 'caching', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Why chosen?</label>
            <textarea
              rows={2}
              value={techStack.database.why}
              onChange={(e) => handleFieldChange('database', 'why', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none ${inputBg}`}
            />
          </div>
        </div>

        {/* 4. Authentication & Identity */}
        <div className={`border rounded-2xl p-5 space-y-4 ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-2 border-b ${dividerColor}`}>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className={`text-sm font-bold ${headingColor}`}>4. Identity & Authentication</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Auth Provider</label>
              <input
                type="text"
                value={techStack.auth.provider}
                onChange={(e) => handleFieldChange('auth', 'provider', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Auth Strategy</label>
              <input
                type="text"
                value={techStack.auth.type}
                onChange={(e) => handleFieldChange('auth', 'type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Why chosen?</label>
            <textarea
              rows={2}
              value={techStack.auth.why}
              onChange={(e) => handleFieldChange('auth', 'why', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none ${inputBg}`}
            />
          </div>
        </div>

        {/* 5. Hosting & Deployment */}
        <div className={`border rounded-2xl p-5 space-y-4 md:col-span-2 ${cardBg}`}>
          <div className={`flex items-center gap-2 pb-2 border-b ${dividerColor}`}>
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className={`text-sm font-bold ${headingColor}`}>5. Deployment, CI/CD & Hosting</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Platform</label>
              <input
                type="text"
                value={techStack.hosting.platform}
                onChange={(e) => handleFieldChange('hosting', 'platform', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>CI/CD Pipeline</label>
              <input
                type="text"
                value={techStack.hosting.ciCd}
                onChange={(e) => handleFieldChange('hosting', 'ciCd', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${inputBg}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelColor}`}>CDN & SSL</label>
              <input
                type="text"
                value={techStack.hosting.domainCdn}
                onChange={(e) => handleFieldChange('hosting', 'domainCdn', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelColor}`}>Why chosen?</label>
            <textarea
              rows={2}
              value={techStack.hosting.why}
              onChange={(e) => handleFieldChange('hosting', 'why', e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none ${inputBg}`}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
