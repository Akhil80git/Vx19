import React, { useState, useEffect } from 'react';
import { Project, ApiEndpoint } from '../../types';
import { 
  Network, 
  Plus, 
  Trash2, 
  Lock, 
  Unlock, 
  Clock, 
  Code2, 
  Save, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';

interface ApiPlannerViewProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  theme?: 'dark' | 'light';
}

export const ApiPlannerView: React.FC<ApiPlannerViewProps> = ({
  project,
  onUpdateProject,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(project.apiEndpoints || []);
  const [showAddModal, setShowAddModal] = useState(false);

  // Sync state when project changes
  useEffect(() => {
    setEndpoints(project.apiEndpoints || []);
  }, [project.id, project.apiEndpoints]);
  
  // Form states
  const [newMethod, setNewMethod] = useState<ApiEndpoint['method']>('GET');
  const [newPath, setNewPath] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newAuthRequired, setNewAuthRequired] = useState(true);
  const [newHours, setNewHours] = useState(3);
  const [newPayload, setNewPayload] = useState('{\n  "name": "example"\n}');

  const totalHours = endpoints.reduce((acc, ep) => acc + (ep.estimatedHours || 0), 0);

  const getMethodColor = (method: ApiEndpoint['method']) => {
    if (isLight) {
      switch (method) {
        case 'GET': return 'bg-emerald-50 text-emerald-700 border-emerald-300';
        case 'POST': return 'bg-blue-50 text-blue-700 border-blue-300';
        case 'PUT': return 'bg-amber-50 text-amber-700 border-amber-300';
        case 'PATCH': return 'bg-purple-50 text-purple-700 border-purple-300';
        case 'DELETE': return 'bg-red-50 text-red-700 border-red-300';
        default: return 'bg-slate-100 text-slate-700 border-slate-300';
      }
    }
    switch (method) {
      case 'GET': return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
      case 'POST': return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'PUT': return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'PATCH': return 'bg-purple-950 text-purple-300 border-purple-500/40';
      case 'DELETE': return 'bg-red-950 text-red-300 border-red-500/40';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleDelete = (id: string) => {
    const updated = endpoints.filter(ep => ep.id !== id);
    setEndpoints(updated);
    onUpdateProject({
      ...project,
      apiEndpoints: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddEndpoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath.trim()) return;

    const newEp: ApiEndpoint = {
      id: 'api_' + Date.now(),
      method: newMethod,
      path: newPath.trim(),
      summary: newSummary.trim() || 'API endpoint handler',
      authRequired: newAuthRequired,
      estimatedHours: Number(newHours) || 2,
      requestBody: newPayload.trim() || undefined
    };

    const updated = [...endpoints, newEp];
    setEndpoints(updated);
    onUpdateProject({
      ...project,
      apiEndpoints: updated,
      updatedAt: new Date().toISOString()
    });

    setNewPath('');
    setNewSummary('');
    setShowAddModal(false);
  };

  const cardBg = isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800';
  const headingColor = isLight ? 'text-slate-900' : 'text-white';
  const subtextColor = isLight ? 'text-slate-500' : 'text-slate-400';
  const inputBg = isLight 
    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-emerald-500' 
    : 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500';

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border p-5 rounded-2xl ${cardBg}`}>
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${headingColor}`}>
            <Network className="w-5 h-5 text-emerald-500" />
            API & Endpoint Planner (API Kitna & Schema)
          </h1>
          <p className={`text-xs mt-0.5 ${subtextColor}`}>
            Document endpoints, HTTP methods, authentication rules, payload samples, and development time
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className={`px-3 py-1.5 border rounded-xl text-xs flex items-center gap-1.5 ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}>
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Total: <b className={headingColor}>{totalHours} Hours</b> (~{Math.ceil(totalHours / 8)} Days)</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Endpoint</span>
          </button>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-3">
        {endpoints.length === 0 ? (
          <div className={`p-8 text-center border rounded-2xl text-xs ${
            isLight ? 'bg-white border-slate-200 text-slate-500 shadow-sm' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            No API endpoints planned yet. Click "+ Add Endpoint" to register routes.
          </div>
        ) : (
          endpoints.map((ep) => (
            <div
              key={ep.id}
              className={`border rounded-2xl p-4 sm:p-5 shadow-sm transition space-y-3 ${
                isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border ${getMethodColor(ep.method)}`}>
                    {ep.method}
                  </span>
                  <code className={`text-xs sm:text-sm font-mono font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {ep.path}
                  </code>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 text-[10px] rounded-md font-medium border flex items-center gap-1 ${
                    ep.authRequired 
                      ? (isLight ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30')
                      : (isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-slate-800 text-slate-400 border-slate-700')
                  }`}>
                    {ep.authRequired ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {ep.authRequired ? 'Auth Required' : 'Public'}
                  </span>

                  <span className={`px-2 py-0.5 text-[10px] rounded-md font-mono flex items-center gap-1 border ${
                    isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-300 border-slate-800'
                  }`}>
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ep.estimatedHours}h
                  </span>

                  <button
                    onClick={() => handleDelete(ep.id)}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isLight ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-slate-800'
                    }`}
                    title="Delete endpoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {ep.summary}
              </p>

              {ep.requestBody && (
                <div className={`p-3 rounded-xl border ${
                  isLight ? 'bg-slate-900 border-slate-800 text-emerald-300' : 'bg-slate-950 border-slate-800/80 text-emerald-300'
                }`}>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Payload / JSON Sample:</span>
                  <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto">
                    {ep.requestBody}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`border rounded-2xl w-full max-w-lg p-6 shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-slate-100'
          }`}>
            <h3 className={`text-base font-bold mb-4 flex items-center gap-2 ${headingColor}`}>
              <Network className="w-5 h-5 text-emerald-500" />
              Add API Endpoint / Firestore Route
            </h3>

            <form onSubmit={handleAddEndpoint} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>HTTP Method</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className={`w-full px-3 py-2 border rounded-xl font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Route Path</label>
                  <input
                    type="text"
                    required
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    placeholder="e.g., /api/v1/projects or firestore://users/{uid}"
                    className={`w-full px-3 py-2 border rounded-xl font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Summary / Functionality</label>
                <input
                  type="text"
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g., Fetches paginated user architecture blueprints"
                  className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Auth Required?</label>
                  <select
                    value={newAuthRequired ? 'true' : 'false'}
                    onChange={(e) => setNewAuthRequired(e.target.value === 'true')}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
                  >
                    <option value="true">Yes (JWT / Firestore Rule)</option>
                    <option value="false">No (Public Route)</option>
                  </select>
                </div>

                <div>
                  <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Estimated Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none ${inputBg}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Sample Payload / Response JSON (Optional)</label>
                <textarea
                  rows={4}
                  value={newPayload}
                  onChange={(e) => setNewPayload(e.target.value)}
                  className={`w-full p-2.5 border rounded-xl font-mono text-emerald-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none ${
                    isLight ? 'bg-slate-900 border-slate-700' : 'bg-slate-950 border-slate-700'
                  }`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  Add Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
