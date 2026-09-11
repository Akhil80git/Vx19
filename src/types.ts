export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'architect' | 'developer' | 'user';
  displayName?: string;
  photoURL?: string;
  isDemo?: boolean;
  customMessage?: string;
  lastLogin?: string;
}

export type ProjectCategory = 'fullstack' | 'web-app' | 'mobile' | 'ai-saas' | 'ecommerce' | 'api-service';
export type ProjectStatus = 'planning' | 'architecture-ready' | 'in-development' | 'deployed';

export interface TechItem {
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'auth' | 'hosting' | 'tools';
  version?: string;
  description: string;
  whyChosen: string;
  iconName?: string;
}

export interface TechStackConfig {
  frontend: {
    framework: string;
    styling: string;
    stateManager: string;
    buildTool: string;
    why: string;
  };
  backend: {
    type: 'firestore-direct' | 'serverless' | 'nodejs-express' | 'python-fastapi' | 'go-fiber';
    runtime: string;
    framework: string;
    why: string;
  };
  database: {
    primary: string;
    type: 'nosql-document' | 'relational-sql' | 'key-value';
    caching?: string;
    why: string;
  };
  auth: {
    provider: string;
    type: string;
    why: string;
  };
  hosting: {
    platform: string;
    ciCd: string;
    domainCdn: string;
    why: string;
  };
}

export interface FolderNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  description?: string;
  children?: FolderNode[];
}

export interface CommandItem {
  id: string;
  title?: string;
  cmd: string;
  category: string; // custom categories: 'npm', 'db', 'docker', 'folder', 'git', 'dev', 'build', 'deploy' etc.
  description?: string;
}

export interface StructureModel {
  id: string;
  name: string;
  description?: string;
  tree: FolderNode[];
  textFormat?: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  authRequired: boolean;
  estimatedHours: number;
  requestBody?: string;
  responseSample?: string;
}

export interface MilestoneItem {
  id: string;
  title: string;
  weekNumber: number;
  completed: boolean;
  deliverables: string;
}

export interface ProjectTimeline {
  designDays: number;
  frontendDays: number;
  backendDays: number;
  testingDays: number;
  deploymentDays: number;
  totalEstimatedWeeks: number;
  estimatedBudget?: string;
  targetCompletionDate?: string;
  milestones: MilestoneItem[];
}

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  purpose: string; // Kyu bana rahe hain
  targetAudience: string; // Kiske liye hai
  category: ProjectCategory;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  techStack: TechStackConfig;
  folderStructureText: string;
  folderTree: FolderNode[];
  structures?: StructureModel[]; // Support multiple folder structures in a single project
  commands: CommandItem[];
  commandCategories?: string[]; // Custom categories like 'npm', 'db', 'docker', 'git', etc.
  apiEndpoints: ApiEndpoint[];
  timeline: ProjectTimeline;
  notes: string;
  chatSessions?: ChatSession[];
  syncStatus?: 'synced' | 'local' | 'syncing' | 'error';
}

export type ActiveTab = 'overview' | 'tech-stack' | 'structure' | 'commands' | 'chat' | 'apis' | 'timeline' | 'firestore-data' | 'projects-list';
