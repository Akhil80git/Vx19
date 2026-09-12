import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory, ProjectStatus } from '../../types';
import { FolderPlus, X, Sparkles, HelpCircle, Target } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => void;
  projectToEdit?: Project | null;
  theme?: 'dark' | 'light';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('fullstack');
  const [status, setStatus] = useState<ProjectStatus>('planning');
  const [purpose, setPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setTagline(projectToEdit.tagline);
      setCategory(projectToEdit.category);
      setStatus(projectToEdit.status);
      setPurpose(projectToEdit.purpose);
      setTargetAudience(projectToEdit.targetAudience);
    } else {
      setTitle('');
      setTagline('');
      setCategory('fullstack');
      setStatus('planning');
      setPurpose('');
      setTargetAudience('');
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      tagline: tagline.trim(),
      category,
      status,
      purpose: purpose.trim(),
      targetAudience: targetAudience.trim()
    });
    onClose();
  };

  const modalBg = isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const labelColor = isLight ? 'text-slate-600' : 'text-slate-300';
  const dividerColor = isLight ? 'border-slate-200' : 'border-slate-800';
  const inputBg = isLight 
    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500' 
    : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`border rounded-2xl w-full max-w-xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${modalBg}`}>
        <div className={`flex items-center justify-between pb-3 mb-4 border-b ${dividerColor}`}>
          <h3 className={`text-base font-bold flex items-center gap-2 ${headingColor}`}>
            <FolderPlus className="w-5 h-5 text-emerald-500" />
            {projectToEdit ? 'Edit Blueprint Meta' : 'Create New Architecture Blueprint'}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition cursor-pointer ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className={`block font-medium mb-1 ${labelColor}`}>
              Project Name / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., PayPulse - Real-time Billing & Invoicing System"
              className={`w-full px-3 py-2 border rounded-xl text-xs sm:text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${labelColor}`}>
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g., Ultra-lightweight subscription tracking with automated receipts"
              className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1 ${labelColor}`}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
              >
                <option value="fullstack">Fullstack Web App</option>
                <option value="ecommerce">E-Commerce Storefront</option>
                <option value="ai-saas">AI & SaaS Platform</option>
                <option value="web-app">Single Page Web App</option>
                <option value="mobile">Mobile Application</option>
                <option value="api-service">API & Microservices</option>
              </select>
            </div>

            <div>
              <label className={`block font-medium mb-1 ${labelColor}`}>Current Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
              >
                <option value="planning">Planning & Architecture</option>
                <option value="architecture-ready">Architecture Ready</option>
                <option value="in-development">In Development</option>
                <option value="deployed">Deployed to Production</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block font-medium mb-1 flex items-center gap-1.5 ${labelColor}`}>
              <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
              Kyu Bana Rahe Hain? (Purpose & Problem Statement)
            </label>
            <textarea
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe the main problem this software solves and why we are building it..."
              className={`w-full p-2.5 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none leading-relaxed ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 flex items-center gap-1.5 ${labelColor}`}>
              <Target className="w-3.5 h-3.5 text-cyan-500" />
              Target Audience (Kiske Liye Hai?)
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Freelancers, small businesses, SaaS founders"
              className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-md shadow-emerald-900/30"
            >
              {projectToEdit ? 'Save Changes' : 'Create Blueprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
