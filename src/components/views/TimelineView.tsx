import React, { useState } from 'react';
import { Project, ProjectTimeline, MilestoneItem } from '../../types';
import { 
  CalendarClock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Save, 
  Clock, 
  Target, 
  HelpCircle, 
  DollarSign, 
  Calendar,
  Layers
} from 'lucide-react';

interface TimelineViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  project,
  onUpdateProject
}) => {
  const [purpose, setPurpose] = useState(project.purpose);
  const [targetAudience, setTargetAudience] = useState(project.targetAudience);
  const [timeline, setTimeline] = useState<ProjectTimeline>(project.timeline);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New milestone state
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneWeek, setMilestoneWeek] = useState(1);
  const [milestoneDeliverables, setMilestoneDeliverables] = useState('');

  const totalDays = 
    (timeline.designDays || 0) + 
    (timeline.frontendDays || 0) + 
    (timeline.backendDays || 0) + 
    (timeline.testingDays || 0) + 
    (timeline.deploymentDays || 0);

  const calculatedWeeks = Math.ceil(totalDays / 5); // 5 working days per week

  const handleToggleMilestone = (id: string) => {
    const updatedMilestones = timeline.milestones.map(m => 
      m.id === id ? { ...m, completed: !m.completed } : m
    );
    const updatedTimeline = { ...timeline, milestones: updatedMilestones };
    setTimeline(updatedTimeline);
    onUpdateProject({
      ...project,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    const newM: MilestoneItem = {
      id: 'm_' + Date.now(),
      title: milestoneTitle.trim(),
      weekNumber: Number(milestoneWeek) || 1,
      completed: false,
      deliverables: milestoneDeliverables.trim() || 'Core module completion'
    };

    const updatedTimeline = {
      ...timeline,
      milestones: [...timeline.milestones, newM]
    };
    setTimeline(updatedTimeline);
    onUpdateProject({
      ...project,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    });

    setMilestoneTitle('');
    setMilestoneDeliverables('');
    setShowAddMilestone(false);
  };

  const handleSaveAll = () => {
    const updatedTimeline = {
      ...timeline,
      totalEstimatedWeeks: calculatedWeeks
    };

    onUpdateProject({
      ...project,
      purpose,
      targetAudience,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-400" />
            Project Timeline & Purpose (Kitna Time & Kyu Bana Rahe Hain)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document project objectives, target audience, development time estimates, and phased milestones
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-emerald-900/30 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Saved Timeline & Purpose!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Purpose & Audience Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Purpose: Kyu bana rahe hain? */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Kyu Bana Rahe Hain? (Purpose & Problem)</h3>
              <span className="text-[10px] text-slate-400">Why does this software exist? What pain point is solved?</span>
            </div>
          </div>
          <textarea
            rows={5}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none leading-relaxed"
            placeholder="Explain why this project is being created, what business value it unlocks, and what problems it solves..."
          />
        </div>

        {/* Target Audience: Kiske liye hai? */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Target className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Target Audience (Kiske Liye Hai?)</h3>
              <span className="text-[10px] text-slate-400">Who will use this software? Personas & demographic</span>
            </div>
          </div>
          <textarea
            rows={5}
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none leading-relaxed"
            placeholder="Specify target user personas, industries, roles, or customer demographics..."
          />
        </div>

      </div>

      {/* Time Breakdown Cards (Kitna Time) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Phase-wise Time Estimation (Kitna Time Lagega)
            </h3>
            <span className="text-xs text-slate-400">Estimated working days for each phase</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <span className="text-slate-400">Total Work Days: </span>
              <span className="font-bold text-emerald-400">{totalDays} Days</span>
            </div>
            <div className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/30 rounded-xl text-xs">
              <span className="text-slate-400">Total Duration: </span>
              <span className="font-bold text-emerald-300">~{calculatedWeeks} Weeks</span>
            </div>
          </div>
        </div>

        {/* 5 Phase Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1">1. UI/UX Design</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={90}
                value={timeline.designDays}
                onChange={(e) => setTimeline({ ...timeline, designDays: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
              />
              <span className="text-slate-400">days</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1">2. Frontend Build</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={90}
                value={timeline.frontendDays}
                onChange={(e) => setTimeline({ ...timeline, frontendDays: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
              />
              <span className="text-slate-400">days</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1">3. Firestore & DB</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={90}
                value={timeline.backendDays}
                onChange={(e) => setTimeline({ ...timeline, backendDays: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
              />
              <span className="text-slate-400">days</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-slate-400 mb-1">4. QA & Testing</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={90}
                value={timeline.testingDays}
                onChange={(e) => setTimeline({ ...timeline, testingDays: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
              />
              <span className="text-slate-400">days</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
            <label className="block text-slate-400 mb-1">5. Deployment</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={0}
                max={90}
                value={timeline.deploymentDays}
                onChange={(e) => setTimeline({ ...timeline, deploymentDays: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center"
              />
              <span className="text-slate-400">days</span>
            </div>
          </div>

        </div>

        {/* Budget / Cost note */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Estimated Budget or Resource Allocation (Optional)
          </label>
          <input
            type="text"
            value={timeline.estimatedBudget || ''}
            onChange={(e) => setTimeline({ ...timeline, estimatedBudget: e.target.value })}
            placeholder="e.g., $4,000 USD or 2 Full-Time Developers for 1 Month"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Phased Milestones Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Project Milestones Roadmap
            </h3>
            <span className="text-xs text-slate-400">Track key deliverables by week</span>
          </div>

          <button
            onClick={() => setShowAddMilestone(true)}
            className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Milestone</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {timeline.milestones.map((m) => (
            <div
              key={m.id}
              onClick={() => handleToggleMilestone(m.id)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                m.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-white'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {m.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-slate-300">
                    Week {m.weekNumber}
                  </span>
                  <span className={`font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {m.title}
                  </span>
                </div>
                <p className="text-slate-400 mt-1 text-[11px]">
                  Deliverables: {m.deliverables}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showAddMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-4">Add Project Milestone</h3>

            <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Milestone Phase Title</label>
                <input
                  type="text"
                  required
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  placeholder="e.g., Phase 2: User Authentication & Firestore Rules"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Target Week Number</label>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={milestoneWeek}
                  onChange={(e) => setMilestoneWeek(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Deliverables</label>
                <textarea
                  rows={3}
                  value={milestoneDeliverables}
                  onChange={(e) => setMilestoneDeliverables(e.target.value)}
                  placeholder="e.g., Security rules audit, login UI, and session persistence verified"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMilestone(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-md shadow-emerald-900/30"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
