import React, { useState, useEffect } from 'react';
import { UserProfile, Project, ActiveTab } from './types';
import { 
  getStoredUser, 
  clearStoredSession, 
  loadUserProjects, 
  saveProjectToStorage, 
  deleteProjectFromStorage,
  DEMO_ADMIN_USER 
} from './lib/firebase';
import { INITIAL_PROJECTS } from './data/defaultProjects';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginSection } from './components/LoginSection';
import { OverviewView } from './components/views/OverviewView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { StructureView } from './components/views/StructureView';
import { CommandsView } from './components/views/CommandsView';
import { ApiPlannerView } from './components/views/ApiPlannerView';
import { TimelineView } from './components/views/TimelineView';
import { FirestoreDataView } from './components/views/FirestoreDataView';
import { ProjectsListView } from './components/views/ProjectsListView';
import { ProjectModal } from './components/modals/ProjectModal';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    return getStoredUser() || DEMO_ADMIN_USER; // Direct admin ready by default for instant frictionless preview!
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    // Check local storage or initialize with rich initial blueprints
    try {
      const stored = localStorage.getItem('archplan_projects_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projects[0]?.id || 'proj_saas_crm_01';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSavingFirestore, setIsSavingFirestore] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Sync projects with Firestore when user is logged in
  useEffect(() => {
    if (user && !user.isDemo) {
      loadUserProjects(user.uid).then(result => {
        if (result.projects && result.projects.length > 0) {
          setProjects(result.projects);
          if (!result.projects.find(p => p.id === activeProjectId)) {
            setActiveProjectId(result.projects[0].id);
          }
        }
      });
    }
  }, [user?.uid]);

  // Persist projects to local storage
  useEffect(() => {
    try {
      localStorage.setItem('archplan_projects_data', JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    clearStoredSession();
    setUser(null);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    if (user) {
      setIsSavingFirestore(true);
      await saveProjectToStorage(user.uid, updatedProject);
      setIsSavingFirestore(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!user || !activeProject) return;
    setIsSavingFirestore(true);
    await saveProjectToStorage(user.uid, activeProject);
    setTimeout(() => {
      setIsSavingFirestore(false);
    }, 400);
  };

  const handleNewProject = () => {
    setProjectToEdit(null);
    setProjectModalOpen(true);
  };

  const handleEditProjectModal = (proj?: Project) => {
    setProjectToEdit(proj || activeProject);
    setProjectModalOpen(true);
  };

  const handleSaveProjectModal = async (projectData: Partial<Project>) => {
    if (projectToEdit) {
      // Editing existing project
      const updated: Project = {
        ...projectToEdit,
        ...projectData,
        updatedAt: new Date().toISOString()
      };
      await handleUpdateProject(updated);
    } else {
      // Creating a brand new project
      const newProjId = 'proj_' + Date.now();
      const newProj: Project = {
        id: newProjId,
        title: projectData.title || 'Untitled Web Application',
        tagline: projectData.tagline || 'Modern responsive application',
        purpose: projectData.purpose || 'Solving core client requirements with clean scalable architecture.',
        targetAudience: projectData.targetAudience || 'Web and mobile end users',
        category: projectData.category || 'fullstack',
        status: projectData.status || 'planning',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        techStack: {
          frontend: {
            framework: 'React 19 with TypeScript',
            styling: 'Tailwind CSS v4 with Lucide Icons',
            stateManager: 'React Context / Zustand',
            buildTool: 'Vite 6.x',
            why: 'Fast bundling, reactive state updates, and flexible UI styling.'
          },
          backend: {
            type: 'firestore-direct',
            runtime: 'Client-managed Firebase SDK v12',
            framework: 'Firestore Real-time Queries & Security Rules',
            why: 'Zero backend server maintenance, automatic scaling, sub-100ms sync.'
          },
          database: {
            primary: 'Google Cloud Firestore',
            type: 'nosql-document',
            caching: 'IndexedDB & LocalStorage',
            why: 'Real-time multi-device document updates and offline tolerance.'
          },
          auth: {
            provider: 'Firebase Authentication',
            type: 'Email & Password / OAuth',
            why: 'Frictionless user identity and secure role enforcement.'
          },
          hosting: {
            platform: 'Cloud Run / Firebase Hosting',
            ciCd: 'GitHub Actions Pipeline',
            domainCdn: 'Global Edge CDN',
            why: 'Automatic SSL certificates and scale-to-zero compute cost.'
          }
        },
        folderStructureText: `${(projectData.title || 'new-app').toLowerCase().replace(/\s+/g, '-')}/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   │   └── firebase.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── firestore.rules
└── package.json`,
        folderTree: [
          { id: 'f1', name: 'src', type: 'folder', path: '/src', description: 'Application source files' },
          { id: 'f2', name: 'firestore.rules', type: 'file', path: '/firestore.rules', description: 'Security access rules' }
        ],
        commands: [
          {
            id: 'c1_' + Date.now(),
            category: 'scaffold',
            title: 'Create Vite Project Scaffolding',
            cmd: `npm create vite@latest ${(projectData.title || 'app').toLowerCase().replace(/\s+/g, '-')} -- --template react-ts`,
            description: 'Scaffolds clean React TypeScript workspace'
          },
          {
            id: 'c2_' + Date.now(),
            category: 'dependencies',
            title: 'Install Firebase & Dependencies',
            cmd: 'npm install firebase lucide-react motion',
            description: 'Official Firebase SDK and UI libraries'
          },
          {
            id: 'c3_' + Date.now(),
            category: 'dev',
            title: 'Launch Development Server',
            cmd: 'npm run dev',
            description: 'Starts Vite dev server on port 3000'
          }
        ],
        apiEndpoints: [
          {
            id: 'api_' + Date.now(),
            method: 'GET',
            path: 'firestore://users/{userId}/data',
            summary: 'Fetch user profile and documents',
            authRequired: true,
            estimatedHours: 3
          }
        ],
        timeline: {
          designDays: 3,
          frontendDays: 7,
          backendDays: 3,
          testingDays: 3,
          deploymentDays: 1,
          totalEstimatedWeeks: 3,
          estimatedBudget: '$3,000 USD',
          milestones: [
            { id: 'm1_' + Date.now(), title: 'Phase 1: Architecture & Auth Setup', weekNumber: 1, completed: false, deliverables: 'Firebase configuration and dashboard UI shell.' },
            { id: 'm2_' + Date.now(), title: 'Phase 2: Core Data Sync & APIs', weekNumber: 2, completed: false, deliverables: 'Firestore collections and CRUD operations.' },
            { id: 'm3_' + Date.now(), title: 'Phase 3: QA & Production Deploy', weekNumber: 3, completed: false, deliverables: 'Security rules audit and CDN deployment.' }
          ]
        },
        notes: 'Project created via Architecture Planner.'
      };

      const updatedList = [newProj, ...projects];
      setProjects(updatedList);
      setActiveProjectId(newProjId);
      setActiveTab('overview');

      if (user) {
        setIsSavingFirestore(true);
        await saveProjectToStorage(user.uid, newProj);
        setIsSavingFirestore(false);
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
    if (user) {
      await deleteProjectFromStorage(user.uid, id);
    }
  };

  const handleDuplicateProject = async (proj: Project) => {
    const cloneId = 'proj_' + Date.now();
    const cloned: Project = {
      ...proj,
      id: cloneId,
      title: `${proj.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedList = [cloned, ...projects];
    setProjects(updatedList);
    setActiveProjectId(cloneId);
    if (user) {
      await saveProjectToStorage(user.uid, cloned);
    }
  };

  // If user not authenticated, show LoginSection
  if (!user) {
    return <LoginSection onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-900 selection:text-white">
      
      {/* 1. Top Bar / Navbar (with Top-Left Profile Icon as requested) */}
      <Navbar
        user={user}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={(id) => {
          setActiveProjectId(id);
          setActiveTab('overview');
        }}
        onNewProject={handleNewProject}
        onLogout={handleLogout}
        onSaveToFirestore={handleSaveToFirestore}
        isSaving={isSavingFirestore}
      />

      {/* 2. Main Body with Responsive Sidebar & Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Navigation (Responsive: compact icon strip on mobile, full sidebar on desktop) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          projectCount={projects.length}
          apiCount={activeProject?.apiEndpoints.length || 0}
          commandCount={activeProject?.commands.length || 0}
        />

        {/* Main Workspace Viewport */}
        <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto bg-slate-950/60">
          {activeProject ? (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  project={activeProject}
                  onNavigateTab={setActiveTab}
                  onEditProject={() => handleEditProjectModal(activeProject)}
                />
              )}

              {activeTab === 'tech-stack' && (
                <ArchitectureView
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'structure' && (
                <StructureView
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'commands' && (
                <CommandsView
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'apis' && (
                <ApiPlannerView
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineView
                  project={activeProject}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'firestore-data' && (
                <FirestoreDataView
                  user={user}
                  project={activeProject}
                  onUpdateUserMessage={(msg) => setUser({ ...user, customMessage: msg })}
                  onUpdateProject={handleUpdateProject}
                />
              )}

              {activeTab === 'projects-list' && (
                <ProjectsListView
                  projects={projects}
                  activeProjectId={activeProjectId}
                  onSelectProject={(id) => {
                    setActiveProjectId(id);
                    setActiveTab('overview');
                  }}
                  onNewProject={handleNewProject}
                  onDeleteProject={handleDeleteProject}
                  onDuplicateProject={handleDuplicateProject}
                  onEditProject={(proj) => handleEditProjectModal(proj)}
                />
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              No project selected. Click "+ Create New Project" to start.
            </div>
          )}
        </main>
      </div>

      {/* Project Create / Edit Modal */}
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProjectModal}
        projectToEdit={projectToEdit}
      />

    </div>
  );
}
