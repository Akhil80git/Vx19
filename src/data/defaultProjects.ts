import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_saas_crm_01',
    title: 'CloudFlow - Modern Workspace & CRM Platform',
    tagline: 'Streamlined real-time project management and client workspace',
    category: 'fullstack',
    status: 'architecture-ready',
    createdAt: '2026-03-01T09:00:00Z',
    updatedAt: '2026-03-08T14:30:00Z',
    purpose: 'Companies spend 20+ hours weekly switching between disconnected communication, tracking, and billing tools. CloudFlow provides an all-in-one unified dashboard with real-time Firestore synchronization, eliminating backend server overhead and slashing maintenance costs by 70%.',
    targetAudience: 'Software consultancies, digital agencies, and remote agile engineering teams.',
    techStack: {
      frontend: {
        framework: 'React 19 with TypeScript',
        styling: 'Tailwind CSS v4 with Lucide Icons',
        stateManager: 'Zustand & React Context',
        buildTool: 'Vite 6.x (Fast HMR & Optimized Bundles)',
        why: 'Instant load times, zero config bundling, robust type safety, and component flexibility.'
      },
      backend: {
        type: 'firestore-direct',
        runtime: 'Client-managed Firebase SDK v12',
        framework: 'Direct Firestore Database Transactions & Security Rules',
        why: 'No Node.js backend server maintenance required; zero downtime, automatic scaling, sub-100ms real-time listeners.'
      },
      database: {
        primary: 'Google Cloud Firestore (NoSQL Document Store)',
        type: 'nosql-document',
        caching: 'IndexedDB Offline Persistence + LocalStorage Cache',
        why: 'Real-time multi-client document listeners, offline offline-first capabilities, and flexible JSON document schemas.'
      },
      auth: {
        provider: 'Firebase Authentication',
        type: 'Email/Password + Google OAuth + Session Tokens',
        why: 'Enterprise-grade identity security, built-in password resets, secure JWTs, and frictionless single sign-on.'
      },
      hosting: {
        platform: 'Google Cloud Run / Firebase Hosting',
        ciCd: 'GitHub Actions Automated CI/CD Pipeline',
        domainCdn: 'Global Cloudflare CDN with SSL',
        why: 'Global edge distribution, automated branch previews, and cost-efficient scale-to-zero compute.'
      }
    },
    folderStructureText: `cloudflow-workspace/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── logos/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupModal.tsx
│   │   ├── dashboard/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── HeaderProfile.tsx
│   │   │   └── StatCards.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ArchitectureEditor.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       └── Modal.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useFirestore.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── firestore.rules
├── package.json
├── tsconfig.json
└── vite.config.ts`,
    folderTree: [
      {
        id: 'f1',
        name: 'src',
        type: 'folder',
        path: '/src',
        description: 'Frontend application source directory',
        children: [
          {
            id: 'f2',
            name: 'components',
            type: 'folder',
            path: '/src/components',
            description: 'Reusable modular UI components'
          },
          {
            id: 'f3',
            name: 'lib',
            type: 'folder',
            path: '/src/lib',
            description: 'Firebase configuration and utilities'
          },
          {
            id: 'f4',
            name: 'hooks',
            type: 'folder',
            path: '/src/hooks',
            description: 'Custom React hooks for auth & firestore data'
          },
          {
            id: 'f5',
            name: 'types',
            type: 'folder',
            path: '/src/types',
            description: 'TypeScript global interfaces and models'
          }
        ]
      },
      {
        id: 'f6',
        name: 'firestore.rules',
        type: 'file',
        path: '/firestore.rules',
        description: 'Firestore security rules enforcing role-based access'
      },
      {
        id: 'f7',
        name: 'package.json',
        type: 'file',
        path: '/package.json',
        description: 'Project dependencies and scripts manifest'
      }
    ],
    commands: [
      {
        id: 'cmd1',
        category: 'scaffold',
        title: 'Create Vite Project with React & TypeScript',
        cmd: 'npm create vite@latest cloudflow-app -- --template react-ts',
        description: 'Initializes a modern fast React TypeScript workspace'
      },
      {
        id: 'cmd2',
        category: 'dependencies',
        title: 'Install Firebase SDK & UI Dependencies',
        cmd: 'npm install firebase lucide-react motion @tailwindcss/vite',
        description: 'Installs official Firebase SDK, icons, animations, and Tailwind'
      },
      {
        id: 'cmd3',
        category: 'dev',
        title: 'Start Development Server',
        cmd: 'npm run dev',
        description: 'Launches local dev server with lightning fast HMR on port 3000'
      },
      {
        id: 'cmd4',
        category: 'build',
        title: 'Production Optimization Build',
        cmd: 'npm run build',
        description: 'Compiles TypeScript, tree-shakes assets, and minifies output to dist/'
      },
      {
        id: 'cmd5',
        category: 'deploy',
        title: 'Deploy Firestore Rules to Production',
        cmd: 'firebase deploy --only firestore:rules',
        description: 'Uploads and validates security rules in Google Cloud project'
      }
    ],
    apiEndpoints: [
      {
        id: 'api1',
        method: 'GET',
        path: 'firestore://users/{userId}/profile',
        summary: 'Fetches user profile, permissions, and role config',
        authRequired: true,
        estimatedHours: 2,
        responseSample: '{\n  "role": "admin",\n  "email": "user@gmail.com",\n  "createdAt": "2026-03-01T00:00:00Z"\n}'
      },
      {
        id: 'api2',
        method: 'POST',
        path: 'firestore://users/{userId}/projects',
        summary: 'Creates a new architecture blueprint document',
        authRequired: true,
        estimatedHours: 4,
        requestBody: '{\n  "title": "New Web App",\n  "category": "fullstack",\n  "status": "planning"\n}'
      },
      {
        id: 'api3',
        method: 'PUT',
        path: 'firestore://users/{userId}/projects/{projectId}',
        summary: 'Updates tech stack, commands, structure, and timeline',
        authRequired: true,
        estimatedHours: 3
      },
      {
        id: 'api4',
        method: 'DELETE',
        path: 'firestore://users/{userId}/projects/{projectId}',
        summary: 'Archives or deletes a project document',
        authRequired: true,
        estimatedHours: 2
      }
    ],
    timeline: {
      designDays: 4,
      frontendDays: 10,
      backendDays: 3,
      testingDays: 4,
      deploymentDays: 2,
      totalEstimatedWeeks: 4,
      estimatedBudget: '$3,500 - $5,000 USD (or 2 Engineers for 1 Month)',
      targetCompletionDate: '2026-04-15',
      milestones: [
        {
          id: 'm1',
          title: 'Phase 1: Architecture Blueprint & Tech Stack Finalization',
          weekNumber: 1,
          completed: true,
          deliverables: 'Database schema, folder structure blueprint, and design wireframes.'
        },
        {
          id: 'm2',
          title: 'Phase 2: Auth Flow & Dashboard Shell',
          weekNumber: 2,
          completed: true,
          deliverables: 'Firebase login/signup, responsive topbar profile, and left icon navigation.'
        },
        {
          id: 'm3',
          title: 'Phase 3: Real-time Data Sync & Project Management',
          weekNumber: 3,
          completed: false,
          deliverables: 'Full CRUD on project blueprints, commands copier, and API planner.'
        },
        {
          id: 'm4',
          title: 'Phase 4: QA, Security Rules Audit, and Production Launch',
          weekNumber: 4,
          completed: false,
          deliverables: 'Audit security rules, cross-device responsiveness check, and CDN deployment.'
        }
      ]
    },
    notes: 'Admin dashboard connected to Firestore project software-4f9fd. Real-time updates active.'
  },
  {
    id: 'proj_ecommerce_02',
    title: 'SpeedMart - Headless E-Commerce Storefront',
    tagline: 'Ultra-fast retail store with instant cart and local inventory syncing',
    category: 'ecommerce',
    status: 'in-development',
    createdAt: '2026-03-04T11:20:00Z',
    updatedAt: '2026-03-09T16:15:00Z',
    purpose: 'Traditional monolithic e-commerce platforms suffer from slow mobile checkout and expensive server hosting. SpeedMart is designed to deliver sub-second product browsing, instant cart updates, and direct payments.',
    targetAudience: 'Direct-to-consumer lifestyle brands, boutique retailers, and electronics suppliers.',
    techStack: {
      frontend: {
        framework: 'Next.js 15 / React 19',
        styling: 'Tailwind CSS v4 + Motion Animations',
        stateManager: 'Zustand Persistent Cart Store',
        buildTool: 'Turbopack',
        why: 'Server-side product SEO rendering combined with ultra-fast client-side checkout.'
      },
      backend: {
        type: 'firestore-direct',
        runtime: 'Firebase Functions v2 & Direct Firestore Access',
        framework: 'Stripe Webhooks & Firestore Triggers',
        why: 'Zero infrastructure management for peak flash-sale traffic handling.'
      },
      database: {
        primary: 'Firestore (Catalog & Orders)',
        type: 'nosql-document',
        caching: 'Edge CDN Caching for Static Product Data',
        why: 'Fast queries for product categories, order histories, and customer carts.'
      },
      auth: {
        provider: 'Firebase Auth (Phone OTP + Email)',
        type: 'Passwordless One-Time Code + Social Login',
        why: 'Maximum checkout conversion with zero password friction on mobile devices.'
      },
      hosting: {
        platform: 'Vercel / Cloud Run',
        ciCd: 'Git-based instant deployments',
        domainCdn: 'Global Edge Anycast Network',
        why: 'Sub-50ms latency worldwide.'
      }
    },
    folderStructureText: `speedmart-store/
├── src/
│   ├── app/
│   │   ├── (shop)/
│   │   │   ├── cart/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── products/[slug]/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── cart/CartDrawer.tsx
│   │   ├── product/ProductCard.tsx
│   │   └── checkout/PaymentForm.tsx
│   ├── lib/
│   │   ├── stripe.ts
│   │   └── firebase.ts
│   └── stores/
│       └── useCartStore.ts
└── package.json`,
    folderTree: [
      {
        id: 'ec1',
        name: 'src/app',
        type: 'folder',
        path: '/src/app',
        description: 'Next.js App Router pages and layouts'
      },
      {
        id: 'ec2',
        name: 'src/components',
        type: 'folder',
        path: '/src/components',
        description: 'Cart, Product, and Checkout components'
      }
    ],
    commands: [
      {
        id: 'ec_cmd1',
        category: 'scaffold',
        title: 'Create Storefront with Next.js App Router',
        cmd: 'npx create-next-app@latest speedmart --typescript --tailwind --app',
        description: 'Scaffolds Next.js project with Tailwind CSS preconfigured'
      },
      {
        id: 'ec_cmd2',
        category: 'dependencies',
        title: 'Install Stripe & Firebase',
        cmd: 'npm install @stripe/stripe-js stripe firebase lucide-react zustand',
        description: 'Adds payment processing and real-time database SDKs'
      },
      {
        id: 'ec_cmd3',
        category: 'dev',
        title: 'Run Storefront Locally',
        cmd: 'npm run dev',
        description: 'Starts Next.js local server on port 3000'
      }
    ],
    apiEndpoints: [
      {
        id: 'ec_api1',
        method: 'GET',
        path: '/api/products',
        summary: 'List active catalog products with category filters',
        authRequired: false,
        estimatedHours: 4
      },
      {
        id: 'ec_api2',
        method: 'POST',
        path: '/api/checkout/session',
        summary: 'Creates a secure Stripe payment checkout session',
        authRequired: true,
        estimatedHours: 6
      }
    ],
    timeline: {
      designDays: 6,
      frontendDays: 14,
      backendDays: 8,
      testingDays: 6,
      deploymentDays: 2,
      totalEstimatedWeeks: 6,
      estimatedBudget: '$6,000 - $9,000 USD',
      targetCompletionDate: '2026-05-01',
      milestones: [
        { id: 'ec_m1', title: 'Catalog UX & Cart Store', weekNumber: 2, completed: true, deliverables: 'Product grid, filters, and persistent cart.' },
        { id: 'ec_m2', title: 'Stripe & Order Sync', weekNumber: 4, completed: false, deliverables: 'Payment checkout flow and order receipt Firestore document.' },
        { id: 'ec_m3', title: 'Admin Order Processing', weekNumber: 6, completed: false, deliverables: 'Admin dashboard for order status tracking.' }
      ]
    },
    notes: 'Prioritize mobile responsive checkout flow and quick touch targets.'
  },
  {
    id: 'proj_ai_assistant_03',
    title: 'DocuQuery - AI Document & Code Analyst',
    tagline: 'Upload technical architecture documents and chat with context-grounded AI',
    category: 'ai-saas',
    status: 'planning',
    createdAt: '2026-03-07T14:00:00Z',
    updatedAt: '2026-03-10T10:45:00Z',
    purpose: 'Engineers spend countless hours reading outdated READMEs and technical specs. DocuQuery lets teams index their code repositories and architectural diagrams to ask instant questions and generate boilerplate code.',
    targetAudience: 'Software architects, CTOs, senior engineers, and onboarding developers.',
    techStack: {
      frontend: {
        framework: 'React 19 with Tailwind CSS',
        styling: 'Tailwind utility classes + Syntax Highlighting',
        stateManager: 'React Hooks & Context',
        buildTool: 'Vite 6.x',
        why: 'Instant feedback, responsive code blocks, and markdown rendering.'
      },
      backend: {
        type: 'firestore-direct',
        runtime: 'Client-side Gemini API + Firestore for Chat History',
        framework: '@google/genai SDK',
        why: 'Direct integration with Gemini Flash for streaming responses without backend lag.'
      },
      database: {
        primary: 'Firestore (Session logs & indexed prompts)',
        type: 'nosql-document',
        caching: 'Browser IndexedDB',
        why: 'Instant recall of prior technical questions.'
      },
      auth: {
        provider: 'Firebase Authentication',
        type: 'Email & Google Auth',
        why: 'Frictionless developer onboarding.'
      },
      hosting: {
        platform: 'Firebase Hosting / Cloud Run',
        ciCd: 'GitHub Actions',
        domainCdn: 'Global Cloudflare CDN',
        why: 'Low latency and automatic HTTPS.'
      }
    },
    folderStructureText: `docuquery-ai/
├── src/
│   ├── components/
│   │   ├── chat/ChatInterface.tsx
│   │   ├── upload/DocDropzone.tsx
│   │   └── viewer/CodeViewer.tsx
│   ├── lib/
│   │   ├── ai.ts
│   │   └── firebase.ts
│   └── App.tsx
└── package.json`,
    folderTree: [
      {
        id: 'ai1',
        name: 'src/components/chat',
        type: 'folder',
        path: '/src/components/chat',
        description: 'Streaming chat interface with markdown parsing'
      }
    ],
    commands: [
      {
        id: 'ai_cmd1',
        category: 'scaffold',
        title: 'Initialize AI Chat Client',
        cmd: 'npm create vite@latest docuquery-app -- --template react-ts',
        description: 'Vite React TypeScript setup'
      },
      {
        id: 'ai_cmd2',
        category: 'dependencies',
        title: 'Install Google GenAI & Firebase',
        cmd: 'npm i @google/genai firebase lucide-react react-markdown',
        description: 'AI model client and Markdown formatter'
      }
    ],
    apiEndpoints: [
      {
        id: 'ai_api1',
        method: 'POST',
        path: '/api/generate-blueprint',
        summary: 'Generates software architecture blueprint from project description',
        authRequired: true,
        estimatedHours: 4
      }
    ],
    timeline: {
      designDays: 3,
      frontendDays: 7,
      backendDays: 4,
      testingDays: 3,
      deploymentDays: 1,
      totalEstimatedWeeks: 3,
      estimatedBudget: '$3,000 - $4,500 USD',
      targetCompletionDate: '2026-04-01',
      milestones: [
        { id: 'ai_m1', title: 'Document Ingestion UI', weekNumber: 1, completed: false, deliverables: 'Drag-and-drop file upload with preview.' },
        { id: 'ai_m2', title: 'Gemini Streaming Chat', weekNumber: 2, completed: false, deliverables: 'Real-time AI query responses.' },
        { id: 'ai_m3', title: 'Firestore History Sync', weekNumber: 3, completed: false, deliverables: 'Saved chat conversations.' }
      ]
    },
    notes: 'Focus on clean syntax highlighting and copy-to-clipboard for code blocks.'
  }
];
