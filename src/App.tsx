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
  firebaseConfig 
} from './lib/firebase';
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
import { FolderPlus, Plus, Database, Sparkles, Loader2 } from 'lucide-react';

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

  // Projects list directly from Firestore
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Status message
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore sync for user projects
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setActiveProjectId(null);
      return;
    }

    setLoadingProjects(true);
    const unsubscribe = subscribeToUserProjects(
      user.uid,
      (fetchedProjects) => {
        setProjects(fetchedProjects);
        setLoadingProjects(false);
        // Ensure an active project is selected if available
        setActiveProjectId((prev) => {
          if (prev && fetchedProjects.some((p) => p.id === prev)) {
            return prev;
          }
          return fetchedProjects[0]?.id || null;
        });
      },
      (err) => {
        console.error('Error in Firestore live sync:', err);
        setLoadingProjects(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
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

  const handleSaveProjectModal = async (meta: Partial<Project>) => {
    if (!user) return;

    if (projectToEdit) {
      // Update existing project
      const updated: Project = {
        ...projectToEdit,
        ...meta,
        updatedAt: new Date().toISOString()
      };
      await saveProjectToFirestore(user.uid, updated);
      showNotification(`Project "${updated.title}" updated in Firestore!`);
    } else {
      // Create new project
      const newProj = createNewProjectObject(meta);
      await saveProjectToFirestore(user.uid, newProj);
      setActiveProjectId(newProj.id);
      showNotification(`New Project "${newProj.title}" saved to Firestore!`);
    }
  };

  const handleUpdateActiveProject = async (updated: Project) => {
    if (!user) return;
    await saveProjectToFirestore(user.uid, updated);
    showNotification('Changes saved live to Firestore');
  };

  const handleDeleteProject = async (id: string) => {
    if (!user) return;
    const proj = projects.find((p) => p.id === id);
    const confirmed = window.confirm(`Kya aap "${proj?.title || 'yeh project'}" ko Firestore se delete karna chahte hain?`);
    if (!confirmed) return;

    await deleteProjectFromFirestore(user.uid, id);
    showNotification('Project deleted from Firestore');
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
    await saveProjectToFirestore(user.uid, duplicated);
    setActiveProjectId(duplicated.id);
    showNotification('Project duplicated in Firestore');
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setProjects([]);
    setActiveProjectId(null);
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
            /* Empty clean state when user has 0 projects in Firestore */
            <div className="max-w-xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <FolderPlus className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Dashboard Clean & Ready
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Aapka Firebase account (<span className="text-emerald-400 font-semibold">{user.email}</span>) direct Google Firestore (<code className="font-mono text-emerald-300">{firebaseConfig.projectId}</code>) se connected hai.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Abhi dashboard me koi dummy project nahi hai. Niche button par click karke apna software project add karein — aap jo bhi tech stack, commands, API endpoints ya notes likhenge, wo sidha aapke Firestore me live save honge!
              </p>
              <div className="pt-2">
                <button
                  onClick={handleNewProject}
                  className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-emerald-900/40 inline-flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  + Naya Project Banayein
                </button>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            <OverviewView
              project={activeProject}
              onUpdateProject={handleUpdateActiveProject}
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

    </div>
  );
}

export default App;
