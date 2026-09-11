import React, { useState } from 'react';
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
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [techStack, setTechStack] = useState<TechStackConfig>(project.techStack);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            Software Architecture & Tech Stack Planner
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h2 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          Client-Managed System Flow (No Heavy Backend Server)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          {/* Box 1: Client */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 mb-2">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Client UI Layer</span>
            <span className="text-[11px] text-slate-400 mt-1">{techStack.frontend.framework}</span>
            <span className="text-[10px] text-emerald-400 mt-1">Reactive State + Tailwind</span>
          </div>

          {/* Box 2: Auth */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Identity & Auth</span>
            <span className="text-[11px] text-slate-400 mt-1">{techStack.auth.provider}</span>
            <span className="text-[10px] text-cyan-400 mt-1">Secure JWT Tokens</span>
          </div>

          {/* Box 3: Firestore Database */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 mb-2">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Firestore Database</span>
            <span className="text-[11px] text-slate-400 mt-1">{techStack.database.primary}</span>
            <span className="text-[10px] text-purple-400 mt-1">Direct Client Sync + Rules</span>
          </div>

          {/* Box 4: Hosting */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Edge CDN Hosting</span>
            <span className="text-[11px] text-slate-400 mt-1">{techStack.hosting.platform}</span>
            <span className="text-[10px] text-blue-400 mt-1">Global Edge Caching</span>
          </div>
        </div>
      </div>

      {/* Editable Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Frontend Layer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">1. Frontend Architecture</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Framework & Language</label>
            <input
              type="text"
              value={techStack.frontend.framework}
              onChange={(e) => handleFieldChange('frontend', 'framework', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Styling Engine</label>
              <input
                type="text"
                value={techStack.frontend.styling}
                onChange={(e) => handleFieldChange('frontend', 'styling', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Build Tool</label>
              <input
                type="text"
                value={techStack.frontend.buildTool}
                onChange={(e) => handleFieldChange('frontend', 'buildTool', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Why chosen? (Kyu chuna hai?)</label>
            <textarea
              rows={2}
              value={techStack.frontend.why}
              onChange={(e) => handleFieldChange('frontend', 'why', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 2. Backend Architecture (Firestore Direct vs API) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">2. Backend Strategy (Firestore Direct)</h3>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Backend Runtime / Model</label>
            <input
              type="text"
              value={techStack.backend.runtime}
              onChange={(e) => handleFieldChange('backend', 'runtime', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Framework / Security Model</label>
            <input
              type="text"
              value={techStack.backend.framework}
              onChange={(e) => handleFieldChange('backend', 'framework', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Why chosen? (Zero server overhead explanation)</label>
            <textarea
              rows={2}
              value={techStack.backend.why}
              onChange={(e) => handleFieldChange('backend', 'why', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 3. Database Layer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">3. Database Schema & Storage</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Database</label>
              <input
                type="text"
                value={techStack.database.primary}
                onChange={(e) => handleFieldChange('database', 'primary', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Database Type</label>
              <input
                type="text"
                value={techStack.database.type}
                onChange={(e) => handleFieldChange('database', 'type', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Client Caching / Offline Sync</label>
            <input
              type="text"
              value={techStack.database.caching || ''}
              onChange={(e) => handleFieldChange('database', 'caching', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Why chosen?</label>
            <textarea
              rows={2}
              value={techStack.database.why}
              onChange={(e) => handleFieldChange('database', 'why', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 4. Authentication & Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">4. Identity & Authentication</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Auth Provider</label>
              <input
                type="text"
                value={techStack.auth.provider}
                onChange={(e) => handleFieldChange('auth', 'provider', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Auth Strategy</label>
              <input
                type="text"
                value={techStack.auth.type}
                onChange={(e) => handleFieldChange('auth', 'type', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Why chosen?</label>
            <textarea
              rows={2}
              value={techStack.auth.why}
              onChange={(e) => handleFieldChange('auth', 'why', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* 5. Hosting & Deployment */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Globe className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">5. Deployment, CI/CD & Hosting</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Platform</label>
              <input
                type="text"
                value={techStack.hosting.platform}
                onChange={(e) => handleFieldChange('hosting', 'platform', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CI/CD Pipeline</label>
              <input
                type="text"
                value={techStack.hosting.ciCd}
                onChange={(e) => handleFieldChange('hosting', 'ciCd', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">CDN & SSL</label>
              <input
                type="text"
                value={techStack.hosting.domainCdn}
                onChange={(e) => handleFieldChange('hosting', 'domainCdn', e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Why chosen?</label>
            <textarea
              rows={2}
              value={techStack.hosting.why}
              onChange={(e) => handleFieldChange('hosting', 'why', e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
