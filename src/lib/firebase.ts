import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc
} from 'firebase/firestore';
import { UserProfile, Project } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyAF-ElX3jmzWiLuXQawTS9PT_bQpIKzzNQ",
  authDomain: "software-4f9fd.firebaseapp.com",
  projectId: "software-4f9fd",
  storageBucket: "software-4f9fd.firebasestorage.app",
  messagingSenderId: "591850820405",
  appId: "1:591850820405:web:46d1f43f1696c23d07327c",
  measurementId: "G-XTMCE9THQQ"
};

// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Local storage key constants
const STORAGE_KEY_USER = 'archplan_user_session';
const STORAGE_KEY_PROJECTS = 'archplan_projects_data';
const STORAGE_KEY_ACTIVE_PROJECT_ID = 'archplan_active_project_id';

// Default Admin Mock for instant 1-click test without forcing registration
export const DEMO_ADMIN_USER: UserProfile = {
  uid: 'admin_demo_super_user',
  email: 'admin@softwareplanner.io',
  role: 'admin',
  displayName: 'Admin Architect',
  isDemo: true,
  customMessage: 'System architecture planner initialized with Firestore and client-side management.'
};

export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    // Fetch profile from Firestore
    let role: UserProfile['role'] = 'admin';
    let customMessage = '';

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        role = data.role || 'admin';
        customMessage = data.customMessage || '';
      } else {
        // Save initial user doc
        await setDoc(userDocRef, {
          email: user.email,
          role: 'admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (fsErr) {
      console.warn('Firestore read error (using auth details):', fsErr);
    }

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      role: role,
      displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
      isDemo: false,
      customMessage: customMessage,
      lastLogin: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    return profile;
  } catch (error: any) {
    throw error;
  }
}

export async function signupWithEmail(email: string, pass: string, role: UserProfile['role'] = 'admin'): Promise<UserProfile> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    const profile: UserProfile = {
      uid: user.uid,
      email: user.email || email,
      role: role,
      displayName: user.email?.split('@')[0] || 'User',
      isDemo: false,
      lastLogin: new Date().toISOString()
    };

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (fsErr) {
      console.warn('Firestore save profile error:', fsErr);
    }

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    return profile;
  } catch (error: any) {
    throw error;
  }
}

export async function saveUserCustomData(uid: string, customMessage: string): Promise<boolean> {
  // Update local storage
  const stored = localStorage.getItem(STORAGE_KEY_USER);
  if (stored) {
    const parsed = JSON.parse(stored);
    parsed.customMessage = customMessage;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(parsed));
  }

  // If demo user or offline, local update is enough
  if (uid.startsWith('admin_demo')) {
    return true;
  }

  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      customMessage,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Firestore save failed:', err);
    return false;
  }
}

export async function saveProjectToStorage(uid: string, project: Project): Promise<{ success: boolean; firestoreSaved: boolean; error?: string }> {
  // 1. Save to local storage for instant reliability
  try {
    const localData = getLocalProjects();
    const existingIndex = localData.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      localData[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      localData.unshift({ ...project, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(localData));
  } catch (e) {
    console.error('Local storage save error:', e);
  }

  // 2. Save to Firestore if authenticated
  if (uid.startsWith('admin_demo')) {
    return { success: true, firestoreSaved: false };
  }

  try {
    const projectDocRef = doc(db, "users", uid, "projects", project.id);
    await setDoc(projectDocRef, {
      ...project,
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced'
    }, { merge: true });
    return { success: true, firestoreSaved: true };
  } catch (err: any) {
    console.warn('Firestore project save warning:', err);
    return { success: true, firestoreSaved: false, error: err?.message };
  }
}

export async function loadUserProjects(uid: string): Promise<{ projects: Project[]; fromFirestore: boolean }> {
  const localProjects = getLocalProjects();

  if (uid.startsWith('admin_demo')) {
    return { projects: localProjects, fromFirestore: false };
  }

  try {
    const projectsColRef = collection(db, "users", uid, "projects");
    const snapshot = await getDocs(projectsColRef);
    if (!snapshot.empty) {
      const fsProjects: Project[] = [];
      snapshot.forEach(docSnap => {
        fsProjects.push(docSnap.data() as Project);
      });
      // Update local storage with fresh remote data
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(fsProjects));
      return { projects: fsProjects, fromFirestore: true };
    }
  } catch (err) {
    console.warn('Firestore read projects error (using local storage):', err);
  }

  return { projects: localProjects, fromFirestore: false };
}

export async function deleteProjectFromStorage(uid: string, projectId: string): Promise<boolean> {
  // Delete from local
  const local = getLocalProjects().filter(p => p.id !== projectId);
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(local));

  if (!uid.startsWith('admin_demo')) {
    try {
      const projectDocRef = doc(db, "users", uid, "projects", projectId);
      await deleteDoc(projectDocRef);
    } catch (e) {
      console.warn('Firestore delete project error:', e);
    }
  }
  return true;
}

export function getLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error parsing local projects:', e);
  }
  return [];
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEY_USER);
}
