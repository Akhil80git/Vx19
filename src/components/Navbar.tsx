import React, { useState } from 'react';
import { UserProfile, Project } from '../types';
import { 
  FolderPlus, 
  LogOut, 
  ChevronDown, 
  Database, 
  CheckCircle2, 
  Layers, 
  X
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  projects: Project[];
  activeProject: Project | null;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onLogout: () => void;
  onSaveToFirestore?: () => void;
  isSaving?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  projects,
  activeProject,
  onSelectProject,
  onNewProject,
  onLogout,
  onSaveToFirestore,
  isSaving
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const initialLetter = (user.email || 'A').charAt(0).toUpperCase();

  return (
    <>
      <header className="shrink-0 h-16 bg-slate-900 border-b border-slate-800 text-slate-100 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 select-none shadow-sm">
        
        {/* Left Side: Profile Icon (top left as explicitly requested) & Project Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Top-Left Profile Icon Button */}
          <div 
            id="profile-top-left"
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 py-1.5 px-2.5 sm:px-3 rounded-xl cursor-pointer transition group"
            title="View Profile Details & Role"
          >
            {/* Avatar Letter */}
            <div 
              id="avatarLetter"
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform"
            >
              {initialLetter}
            </div>

            {/* Profile Details text (visible on sm+ screens) */}
            <div className="hidden sm:flex flex-col text-left">
              <span id="profileEmail" className="text-xs font-semibold text-white max-w-[150px] truncate leading-tight">
                {user.email}
              </span>
              <span id="profileRole" className="text-[10px] text-emerald-400 font-medium leading-tight flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Role: {user.role || 'admin'}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Active Project Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 py-1.5 px-2.5 sm:px-3 bg-slate-950/60 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="text-left max-w-[130px] sm:max-w-[200px] truncate">
                <span className="text-[10px] text-slate-400 block leading-tight">Current Project:</span>
                <span className="font-semibold text-white text-xs truncate block">
                  {activeProject ? activeProject.title : 'Koi Project Nahi Hai'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showProjectDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProjectDropdown && (
              <div className="absolute left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Switch Project Blueprint</span>
                  <span className="text-emerald-400 font-bold">{projects.length} Total</span>
                </div>

                <div className="max-h-60 overflow-y-auto py-1">
                  {projects.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Abhi koi project nahi hai. Niche click karke naya project banayein.
                    </div>
                  ) : (
                    projects.map((proj) => {
                      const isSelected = activeProject?.id === proj.id;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => {
                            onSelectProject(proj.id);
                            setShowProjectDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition cursor-pointer ${
                            isSelected ? 'bg-emerald-950/40 text-emerald-300 font-medium' : 'text-slate-300'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <span className="block truncate font-medium">{proj.title}</span>
                            <span className="text-[10px] text-slate-400 capitalize">{proj.category} • {proj.status}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="p-2 border-t border-slate-800 bg-slate-950/50">
                  <button
                    onClick={() => {
                      setShowProjectDropdown(false);
                      onNewProject();
                    }}
                    className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    + Create New Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Status & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Firestore Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Firestore:</span>
            <span className="text-emerald-400 font-mono font-medium">software-4f9fd</span>
          </div>

          {/* Quick Create Project Button */}
          <button
            id="btn-new-project-top"
            onClick={onNewProject}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-medium shadow-sm transition cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ Naya Project</span>
          </button>

          {/* Logout Button */}
          <button
            id="logoutBtn"
            onClick={onLogout}
            className="flex items-center gap-1.5 py-1.5 px-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 rounded-xl text-xs font-medium transition cursor-pointer"
            title="Sign out of current account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Profile Details Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 relative">
            <button 
              onClick={() => setShowProfileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                {initialLetter}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  {user.displayName || 'Administrator'}
                  <span className="px-2 py-0.5 text-[10px] uppercase font-mono tracking-wide bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-full">
                    {user.role}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs mb-6">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Firebase UID:</span>
                <span className="font-mono text-slate-300 text-[11px] truncate max-w-[200px]">{user.uid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Role:</span>
                <span className="text-emerald-400 font-semibold uppercase">{user.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Firestore Project:</span>
                <span className="text-slate-300">software-4f9fd</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Architecture:</span>
                <span className="text-emerald-400">Client-Direct Firestore (No backend server)</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onLogout();
                }}
                className="py-2 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
