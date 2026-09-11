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
}

export const ApiPlannerView: React.FC<ApiPlannerViewProps> = ({
  project,
  onUpdateProject
}) => {
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            API & Endpoint Planner (API Kitna & Schema)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document endpoints, HTTP methods, authentication rules, payload samples, and development time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total: <b className="text-white">{totalHours} Hours</b> (~{Math.ceil(totalHours / 8)} Days)</span>
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
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
            No API endpoints planned yet. Click "+ Add Endpoint" to register routes.
          </div>
        ) : (
          endpoints.map((ep) => (
            <div
              key={ep.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-sm transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border ${getMethodColor(ep.method)}`}>
                    {ep.method}
                  </span>
                  <code className="text-xs sm:text-sm font-mono text-white font-semibold">
                    {ep.path}
                  </code>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 text-[10px] rounded-md font-medium border flex items-center gap-1 ${
                    ep.authRequired 
                      ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {ep.authRequired ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {ep.authRequired ? 'Auth Required' : 'Public'}
                  </span>

                  <span className="px-2 py-0.5 text-[10px] bg-slate-950 text-slate-300 border border-slate-800 rounded-md font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ep.estimatedHours}h
                  </span>

                  <button
                    onClick={() => handleDelete(ep.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                    title="Delete endpoint"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                {ep.summary}
              </p>

              {ep.requestBody && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
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
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Network className="w-5 h-5 text-emerald-400" />
              Add API Endpoint / Firestore Route
            </h3>

            <form onSubmit={handleAddEndpoint} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">HTTP Method</label>
                  <select
                    value={newMethod}
                    onChange={(e) => setNewMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-slate-300 mb-1">Route Path</label>
                  <input
                    type="text"
                    required
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    placeholder="e.g., /api/v1/projects or firestore://users/{uid}"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Summary / Functionality</label>
                <input
                  type="text"
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g., Fetches paginated user architecture blueprints"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Auth Required?</label>
                  <select
                    value={newAuthRequired ? 'true' : 'false'}
                    onChange={(e) => setNewAuthRequired(e.target.value === 'true')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="true">Yes (JWT / Firestore Rule)</option>
                    <option value="false">No (Public Route)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newHours}
                    onChange={(e) => setNewHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Sample Payload / Response JSON (Optional)</label>
                <textarea
                  rows={4}
                  value={newPayload}
                  onChange={(e) => setNewPayload(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-emerald-300 focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition cursor-pointer"
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
