import React, { useState, useEffect } from 'react';
import { UserProfile, Project } from '../../types';
import { saveUserCustomData, saveProjectToFirestore, firebaseConfig } from '../../lib/firebase';
import { Database, Save, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface FirestoreDataViewProps {
  user: UserProfile;
  project: Project | null;
  onUpdateUserMessage?: (msg: string) => void;
  onUpdateProject?: (updated: Project) => void;
}

export const FirestoreDataView: React.FC<FirestoreDataViewProps> = ({
  user,
  project,
  onUpdateUserMessage,
  onUpdateProject
}) => {
  const [userInput, setUserInput] = useState(user.customMessage || project?.notes || '');
  const [saveMsg, setSaveMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<Array<{ text: string; time: string }>>([
    { text: user.customMessage || 'Initial Firestore live sync ready', time: 'Just now' }
  ]);

  useEffect(() => {
    if (user.customMessage) {
      setUserInput(user.customMessage);
    }
  }, [user.customMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMsg({ text: '', type: '' });
    setSaving(true);

    try {
      // 1. Direct save user custom message to Firestore document users/{uid}
      await saveUserCustomData(user.uid, userInput);

      // 2. Also save to current project notes if a project is active
      if (project && onUpdateProject) {
        const updatedProject = {
          ...project,
          notes: userInput,
          updatedAt: new Date().toISOString()
        };
        onUpdateProject(updatedProject);
        await saveProjectToFirestore(user.uid, updatedProject);
      }

      if (onUpdateUserMessage) {
        onUpdateUserMessage(userInput);
      }

      setHistory(prev => [{ text: userInput, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);

      setSaveMsg({
        text: 'Data Firestore me successfully live save ho gaya!',
        type: 'success'
      });
    } catch (err: any) {
      console.error(err);
      setSaveMsg({ text: 'Data save karne me error aayi: ' + (err?.message || err), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const initialLetter = (user.email || 'Admin').charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          Firestore Live Sync & Data Manager
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Direct client-side sync to Google Firestore (<code>{firebaseConfig.projectId}</code>). Koi separate backend server ki zaroorat nahi hai.
        </p>
      </div>

      {/* Main Dashboard Card matching User's snippet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
        
        {/* Top Profile Section inside Dashboard (from user snippet) */}
        <div className="flex items-center bg-slate-950/80 p-3.5 rounded-xl border-l-4 border-emerald-500 mb-6 border border-slate-800">
          <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-base mr-3 shrink-0 shadow-sm">
            {initialLetter}
          </div>
          <div className="overflow-hidden">
            <b className="block text-sm text-white truncate">
              {user.email}
            </b>
            <span className="text-xs text-emerald-400 font-medium">
              Role: {user.role || 'admin'}
            </span>
          </div>
        </div>

        {/* Center Input Form */}
        <h3 className="text-base font-bold text-white text-center mb-4">
          Data Save Karein
        </h3>

        <form id="dataForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userInput" className="block text-xs font-medium text-slate-300 mb-1.5">
              Kuch bhi type karein:
            </label>
            <textarea
              id="userInput"
              required
              rows={4}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Yahan apna project data ya notes likhein..."
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Firestore me Save Karein
              </>
            )}
          </button>

          {/* Feedback message */}
          {saveMsg.text && (
            <div
              id="save-msg"
              className={`p-3 rounded-xl text-xs text-center flex items-center justify-center gap-1.5 border ${
                saveMsg.type === 'success'
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'bg-red-950/40 text-red-300 border-red-500/30'
              }`}
            >
              {saveMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{saveMsg.text}</span>
            </div>
          )}
        </form>

        {/* Saved Data Log History */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Recent Saved Logs
          </h4>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between gap-2">
                <span className="truncate">{h.text}</span>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
