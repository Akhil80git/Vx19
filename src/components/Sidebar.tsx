import React from 'react';
import { ActiveTab } from '../types';
import { 
  LayoutDashboard, 
  Cpu, 
  FolderTree, 
  Terminal, 
  Network, 
  CalendarClock, 
  Database, 
  Folders, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  projectCount: number;
  apiCount: number;
  commandCount: number;
  theme?: 'dark' | 'light';
}

interface NavItem {
  id: ActiveTab;
  label: string;
  hindiHint: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  projectCount,
  apiCount,
  commandCount,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Project Overview',
      hindiHint: 'Overview & Specs',
      icon: LayoutDashboard,
    },
    {
      id: 'tech-stack',
      label: 'Tech Stack & DB',
      hindiHint: 'Frontend, Backend, DB',
      icon: Cpu,
    },
    {
      id: 'structure',
      label: 'Folder Structure',
      hindiHint: 'Files & Folders tree',
      icon: FolderTree,
    },
    {
      id: 'commands',
      label: 'CMD Commands',
      hindiHint: 'Terminal & CLI Commands',
      icon: Terminal,
      badge: commandCount,
      badgeColor: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50'
    },
    {
      id: 'chat',
      label: 'Self Chat & Notes',
      hindiHint: 'Personal Scratchpad & Messages',
      icon: MessageSquare,
      badgeColor: 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50'
    },
    {
      id: 'apis',
      label: 'API Endpoints',
      hindiHint: 'Routes & Schemas',
      icon: Network,
      badge: apiCount,
      badgeColor: 'bg-cyan-900/60 text-cyan-300 border-cyan-700/50'
    },
    {
      id: 'timeline',
      label: 'Timeline & Purpose',
      hindiHint: 'Kyu bana rahe hain & Time',
      icon: CalendarClock,
    },
    {
      id: 'firestore-data',
      label: 'Firestore Sync Data',
      hindiHint: 'Data Save Karein',
      icon: Database,
      badge: 'Live',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
    },
    {
      id: 'projects-list',
      label: 'All Blueprints',
      hindiHint: 'All Projects (' + projectCount + ')',
      icon: Folders,
      badge: projectCount,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    }
  ];

  return (
    <aside className={`shrink-0 h-full overflow-hidden z-20 ${
      isLight 
        ? 'bg-slate-50 border-r border-slate-200 text-slate-800' 
        : 'bg-slate-900/95 border-r border-slate-800 text-slate-200'
    } flex flex-col justify-between select-none w-14 sm:w-16 md:w-64 transition-all duration-200`}
    >
      {/* Top Header / Brand indication */}
      <div className={`p-2 sm:p-3 md:p-4 border-b ${isLight ? 'border-slate-200' : 'border-slate-800/80'} flex items-center justify-center md:justify-start gap-2.5`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="hidden md:block overflow-hidden">
          <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'} tracking-tight block truncate`}>
            Architecture Planner
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            Full Planning System
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-3 px-1.5 sm:px-2 md:px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={`${item.label} (${item.hindiHint})`}
              className={`w-full group flex items-center justify-center md:justify-between px-2 sm:px-2.5 md:px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer relative ${
                isActive
                  ? isLight
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                    : 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-transparent'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              {/* Left active marker on mobile */}
              {isActive && (
                <div className="md:hidden absolute left-0.5 top-2 bottom-2 w-1 bg-emerald-500 rounded-r" />
              )}

              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive 
                    ? isLight ? 'text-emerald-600' : 'text-emerald-400' 
                    : isLight ? 'text-slate-500 group-hover:text-slate-900' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <div className="hidden md:block text-left">
                  <span className={`block leading-tight font-medium ${
                    isActive 
                      ? isLight ? 'text-emerald-900 font-semibold' : 'text-white' 
                      : isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    {item.hindiHint}
                  </span>
                </div>
              </div>

              {/* Badge for desktop */}
              {item.badge !== undefined && (
                <span className={`hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  isLight 
                    ? 'bg-slate-200 text-slate-700 border-slate-300' 
                    : item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Small dot badge on mobile icon view */}
              {item.badge !== undefined && (
                <span className="md:hidden absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Hint / Info */}
      <div className={`p-2 sm:p-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
        <div className={`hidden md:flex items-center gap-2 p-2.5 rounded-xl ${
          isLight ? 'bg-slate-100 border border-slate-200 text-slate-600' : 'bg-slate-950/60 border border-slate-800/80 text-slate-400'
        } text-[11px]`}>
          <HelpCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Client-only architecture via Firestore</span>
        </div>

        {/* Mobile icon-only footer indicator */}
        <div className="md:hidden flex justify-center py-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500/70" title="Firestore Connected" />
        </div>
      </div>
    </aside>
  );
};
