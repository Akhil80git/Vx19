import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Project, 
  ActiveTab 
} from './types';
import { 
  subscribeToAuth, 
  subscribeToUserProjects, 
  saveProjectToFirestore, 
  deleteProjectFromFirestore, 
  logoutUser,
  firebaseConfig,
  getLocalProjects,
  saveLocalProjects
} from './lib/firebase';
import { INITIAL_PROJECTS } from './data/defaultProjects';
import { LoginSection } from './components/LoginSection';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { StructureView } from './components/views/StructureView';
import { CommandsView } from './components/views/CommandsView';
import { ApiPlannerView } from './components/views/ApiPlannerView';
import { TimelineView } from './components/views/TimelineView';
import { FirestoreDataView } from './components/views/FirestoreDataView';
import { ProjectsListView } from './components/views/ProjectsListView';
import { ProjectModal } from './components/modals/ProjectModal';
import { 
  FolderPlus, 
  Plus, 
  Database, 
  Sparkles, 
  Loader2, 
  ShieldAlert, 
  Copy, 
  Check, 
  X, 
  ExternalLink,
  Zap
} from 'lucide-react';

export function createNewProjectObject(meta: Partial<Project>): Project {
  const id = 'proj_' + Date.now();
  const now = new Date().toISOString();
  return {
    id,
    title: meta.title || 'New Software Blueprint',
    tagline: meta.tagline || 'Modern software architecture plan',
    purpose: meta.purpose || 'Software solution addressing business requirements with clean architecture.',
    targetAudience: meta.targetAudience || 'End users & developers',
    category: meta.category || 'fullstack',
    status: meta.status || 'planning',
    createdAt: now,
    updatedAt: now,
    techStack: {
      frontend: {
        framework: 'React with TypeScript',
        styling: 'Tailwind CSS',
        stateManager: 'React State & Context',
        buildTool: 'Vite',
        why: 'Fast bundling, modular components, and type safety.'
      },
      backend: {
        type: 'firestore-direct',
        runtime: 'Client-side Firebase SDK',
        framework: 'Direct Firestore Database Transactions',
        why: 'No backend server maintenance; zero downtime, serverless & real-time.'
      },
      database: {
        primary: 'Google Cloud Firestore',
        type: 'nosql-document',
        caching: 'IndexedDB & Local Cache',
        why: 'Direct document sync, real-time listeners, and automatic scaling.'
      },
      auth: {
        provider: 'Firebase Authentication',
        type: 'Email & Password',
        why: 'Enterprise identity security with zero custom auth server.'
      },
      hosting: {
        platform: 'Firebase Hosting / Cloud Run',
        ciCd: 'GitHub Actions / Cloud Build',
        domainCdn: 'Global Edge CDN',
        why: 'Instant global deployment and high availability.'
      }
    },
    folderStructureText: `src/
├── components/
│   ├── ui/
│   └── views/
├── lib/
│   └── firebase.ts
├── types.ts
├── App.tsx
└── main.tsx`,
    folderTree: [
      {
        id: 'f_src',
        name: 'src',
        type: 'folder',
        path: '/src',
        description: 'Source code root',
        children: [
          {
            id: 'f_components',
            name: 'components',
            type: 'folder',
            path: '/src/components',
            description: 'UI components directory'
          },
          {
            id: 'f_lib',
            name: 'lib',
            type: 'folder',
            path: '/src/lib',
            description: 'Firebase and helper libraries'
          },
          {
            id: 'f_app',
            name: 'App.tsx',
            type: 'file',
            path: '/src/App.tsx',
            description: 'Main App Component'
          }
        ]
      }
    ],
    commands: [
      {
        id: 'cmd_1',
        title: 'Project Scaffold',
        cmd: 'npm create vite@latest my-app -- --template react-ts',
        category: 'scaffold',
        description: 'Initialize Vite React project with TypeScript'
      },
      {
        id: 'cmd_2',
        title: 'Install Firebase & UI Dependencies',
        cmd: 'npm install firebase lucide-react tailwindcss @tailwindcss/vite',
        category: 'dependencies',
        description: 'Install client dependencies'
      },
      {
        id: 'cmd_3',
        title: 'Start Development Server',
        cmd: 'npm run dev',
        category: 'dev',
        description: 'Run live hot-reload development server'
      }
    ],
    apiEndpoints: [
      {
        id: 'api_1',
        method: 'GET',
        path: '/users/{uid}/projects',
        summary: 'Direct Firestore fetch for user projects',
        authRequired: true,
        estimatedHours: 2,
        responseSample: '{\n  "status": "success",\n  "count": 1\n}'
      }
    ],
    timeline: {
      designDays: 3,
      frontendDays: 7,
      backendDays: 2,
      testingDays: 3,
      deploymentDays: 1,
      totalEstimatedWeeks: 3,
      estimatedBudget: '₹25,000 - ₹50,000',
      milestones: [
        {
          id: 'm_1',
          title: 'Database Schema & Auth Setup',
          weekNumber: 1,
          completed: false,
          deliverables: 'Firebase project initialized with Firestore rules'
        },
        {
          id: 'm_2',
          title: 'Core Frontend Screens & State',
          weekNumber: 2,
          completed: false,
          deliverables: 'Interactive dashboard and input forms'
        },
        {
          id: 'm_3',
          title: 'Production Testing & Launch',
          weekNumber: 3,
          completed: false,
          deliverables: 'Tested and deployed live on web'
        }
      ]
    },
    notes: 'Created via direct frontend Firestore client sync.',
    syncStatus: 'synced'
  };
}

export function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Projects list directly from Firestore and local cache
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [showRulesHelp, setShowRulesHelp] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  // Status message & Firestore Sync Warnings
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore sync for user projects + Instant Offline Cache
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setActiveProjectId(null);
      return;
    }

    // A. Read instant local cache first so user NEVER experiences blank UI
    const cached = getLocalProjects(user.uid);
    if (cached && cached.length > 0) {
      setProjects(cached);
      setActiveProjectId((prev) => {
        if (prev && cached.some((p) => p.id === prev)) return prev;
        return cached[0]?.id || null;
      });
      setLoadingProjects(false);
    } else {
      setLoadingProjects(true);
    }

    // B. Subscribe to live real-time Firestore database
    const unsubscribe = subscribeToUserProjects(
      user.uid,
      (remoteProjects) => {
        setLoadingProjects(false);
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects(remoteProjects);
          saveLocalProjects(user.uid, remoteProjects);
          setActiveProjectId((prev) => {
            if (prev && remoteProjects.some((p) => p.id === prev)) {
              return prev;
            }
            return remoteProjects[0]?.id || null;
          });
        }
      },
      (err) => {
        console.warn('Firestore live sync listener error:', err);
        setLoadingProjects(false);
        if (err?.code === 'permission-denied') {
          setSyncWarning('Firestore security rules: Write/Read permission required in Firebase Console.');
        }
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // Active project selection
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  // Project handlers
  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const handleNewProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleEditProjectModal = (proj: Project) => {
    setProjectToEdit(proj);
    setIsProjectModalOpen(true);
  };

  // 1-Click Load Starter Pre-configured Blueprint
  const handleLoadStarterTemplate = async () => {
    if (!user) return;
    const base = INITIAL_PROJECTS[0];
    const newProj: Project = {
      ...base,
      id: 'proj_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update state & local storage immediately
    setProjects(prev => {
      const next = [newProj, ...prev];
      saveLocalProjects(user.uid, next);
      return next;
    });
    setActiveProjectId(newProj.id);
    setActiveTab('overview');
    showNotification(`Starter Blueprint "${newProj.title}" loaded successfully!`);

    // Sync to Firestore
    const res = await saveProjectToFirestore(user.uid, newProj);
    if (!res.success) {
      setSyncWarning(res.error || 'Firestore sync pending');
    }
  };

  const handleSaveProjectModal = async (meta: Partial<Project>) => {
    if (!user) return;

    if (projectToEdit) {
      // Update existing project
      const updated: Project = {
        ...projectToEdit,
        ...meta,
        updatedAt: new Date().toISOString()
      };

      // 1. Update React state immediately
      setProjects((prev) => {
        const next = prev.map((p) => (p.id === updated.id ? updated : p));
        saveLocalProjects(user.uid, next);
        return next;
      });
      showNotification(`Project "${updated.title}" updated!`);

      // 2. Sync to Firestore in background
      const res = await saveProjectToFirestore(user.uid, updated);
      if (!res.success) {
        setSyncWarning(res.error || 'Firestore sync pending');
      }
    } else {
      // Create new project
      const newProj = createNewProjectObject(meta);

      // 1. Update React state immediately
      setProjects((prev) => {
        const next = [newProj, ...prev];
        saveLocalProjects(user.uid, next);
        return next;
      });
      setActiveProjectId(newProj.id);
      setActiveTab('overview');
      showNotification(`New Project "${newProj.title}" created!`);

      // 2. Sync to Firestore in background
      const res = await saveProjectToFirestore(user.uid, newProj);
      if (!res.success) {
        setSyncWarning(res.error || 'Firestore sync pending');
      }
    }
  };

  const handleUpdateActiveProject = async (updated: Project) => {
    if (!user) return;

    // 1. Update React state & localStorage immediately
    setProjects((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      saveLocalProjects(user.uid, next);
      return next;
    });
    showNotification('Changes saved live!');

    // 2. Sync to Firestore in background
    const res = await saveProjectToFirestore(user.uid, updated);
    if (!res.success) {
      setSyncWarning(res.error || 'Firestore sync pending');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) return;
    const proj = projects.find((p) => p.id === id);
    const confirmed = window.confirm(`Kya aap "${proj?.title || 'yeh project'}" ko delete karna chahte hain?`);
    if (!confirmed) return;

    // 1. Update state & localStorage immediately
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveLocalProjects(user.uid, next);
      return next;
    });

    if (activeProjectId === id) {
      const remaining = projects.filter((p) => p.id !== id);
      setActiveProjectId(remaining[0]?.id || null);
    }

    showNotification('Project deleted');

    // 2. Delete from Firestore in background
    await deleteProjectFromFirestore(user.uid, id);
  };

  const handleDuplicateProject = async (proj: Project) => {
    if (!user) return;
    const duplicated: Project = {
      ...proj,
      id: 'proj_' + Date.now(),
      title: `${proj.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 1. Update state & localStorage immediately
    setProjects((prev) => {
      const next = [duplicated, ...prev];
      saveLocalProjects(user.uid, next);
      return next;
    });
    setActiveProjectId(duplicated.id);
    showNotification('Project duplicated successfully!');

    // 2. Sync to Firestore
    const res = await saveProjectToFirestore(user.uid, duplicated);
    if (!res.success) {
      setSyncWarning(res.error || 'Firestore sync pending');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProjects([]);
    setActiveProjectId(null);
  };

  const firestoreRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firestoreRulesText);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2000);
  };

  // Loading auth state
  if (loadingAuth) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">
          Verifying Firebase connection...
        </p>
      </div>
    );
  }

  // Not logged in -> Show ONLY login
  if (!user) {
    return <LoginSection onLoginSuccess={(u) => setUser(u)} />;
  }

  // Logged in user dashboard
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onLogout={handleLogout}
      />

      {/* Optional Firestore Rules Notice Banner if console permissions are restricted */}
      {syncWarning && (
        <div className="bg-amber-950/90 border-b border-amber-500/40 px-4 py-2 text-xs text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Data Local Storage me 100% saved hai!</strong> Firestore Cloud Sync ke liye Firebase Console me Firestore Rules ko allow karein.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowRulesHelp(true)}
              className="underline hover:text-amber-100 font-medium cursor-pointer"
            >
              Rules Setup Dekhein
            </button>
            <button
              onClick={() => setSyncWarning(null)}
              className="text-amber-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          projectCount={projects.length}
          apiCount={activeProject?.apiEndpoints?.length || 0}
          commandCount={activeProject?.commands?.length || 0}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          
          {/* Live Notification Banner */}
          {statusNotification && (
            <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl shadow-emerald-950/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <Sparkles className="w-4 h-4" />
              <span>{statusNotification}</span>
            </div>
          )}

          {/* Conditional View Rendering */}
          {activeTab === 'firestore-data' ? (
            <FirestoreDataView
              user={user}
              project={activeProject}
              onUpdateUserMessage={(msg) => setUser(prev => prev ? { ...prev, customMessage: msg } : null)}
              onUpdateProject={handleUpdateActiveProject}
            />
          ) : activeTab === 'projects-list' ? (
            <ProjectsListView
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => {
                handleSelectProject(id);
                setActiveTab('overview');
              }}
              onNewProject={handleNewProject}
              onDeleteProject={handleDeleteProject}
              onDuplicateProject={handleDuplicateProject}
              onEditProject={handleEditProjectModal}
            />
          ) : !activeProject ? (
            /* Empty clean state when user has 0 projects */
            <div className="max-w-xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <FolderPlus className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Dashboard Clean & Ready
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aapka account (<span className="text-emerald-400 font-semibold">{user.email}</span>) direct Firebase & Google Firestore (<code className="font-mono text-emerald-300">{firebaseConfig.projectId}</code>) se jud chuka hai.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Abhi dashboard bilkul clean hai. Aap naya project create karke commands, tech stack, API endpoints aur planning add kar sakte hain — sab data live save hoga!
              </p>
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleNewProject}
                  className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-900/40 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Naya Project Banayein
                </button>
                <button
                  onClick={handleLoadStarterTemplate}
                  className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-medium text-xs sm:text-sm rounded-xl transition border border-slate-700 inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  ⚡ Pre-Configured Blueprint Load Karein
                </button>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            <OverviewView
              project={activeProject}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onEditProject={() => handleEditProjectModal(activeProject)}
            />
          ) : activeTab === 'tech-stack' ? (
            <ArchitectureView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
            />
          ) : activeTab === 'structure' ? (
            <StructureView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
            />
          ) : activeTab === 'commands' ? (
            <CommandsView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
            />
          ) : activeTab === 'apis' ? (
            <ApiPlannerView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
            />
          ) : activeTab === 'timeline' ? (
            <TimelineView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
            />
          ) : null}

        </main>
      </div>

      {/* Project Create / Edit Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProjectModal}
        projectToEdit={projectToEdit}
      />

      {/* Firestore Security Rules Helper Modal */}
      {showRulesHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Firebase Firestore Security Rules Guide
              </h3>
              <button
                onClick={() => setShowRulesHelp(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Firebase Console me jab Firestore Database create hota hai, to by default writes locked ho sakti hain.
              Agar aap chahte hain ki authenticated user (<code className="text-emerald-400 font-mono">{user.email}</code>) direct Firestore me data likh sake, to:
            </p>

            <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside bg-slate-950 p-3 rounded-xl border border-slate-800">
              <li>Firebase Console kholiye (<code className="text-emerald-300">{firebaseConfig.projectId}</code>).</li>
              <li><strong>Firestore Database</strong> &gt; <strong>Rules</strong> tab par jayein.</li>
              <li>Niche diye gaye rules paste karke <strong>Publish</strong> karein:</li>
            </ol>

            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {firestoreRulesText}
              </pre>
              <button
                onClick={handleCopyRules}
                className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition cursor-pointer"
              >
                {copiedRules ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Rules</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRulesHelp(false)}
                className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Samajh Aa Gaya / Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
