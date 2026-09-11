import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
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
  onSnapshot, 
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

// Initialize Firebase directly on the client (No backend server required!)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication listener
export function subscribeToAuth(callback: (user: UserProfile | null) => void) {
  return fbOnAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      callback(null);
      return;
    }

    try {
      let role: UserProfile['role'] = 'admin';
      let customMessage = '';

      const userDocRef = doc(db, "users", fbUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        role = data.role || 'admin';
        customMessage = data.customMessage || '';
      } else {
        // Save user doc upon initial sign in
        await setDoc(userDocRef, {
          email: fbUser.email,
          role: 'admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        role: role,
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
        customMessage: customMessage,
        lastLogin: new Date().toISOString()
      };

      callback(profile);
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
      // Fallback to basic auth info if Firestore rules block or offline
      callback({
        uid: fbUser.uid,
        email: fbUser.email || '',
        role: 'admin',
        displayName: fbUser.email?.split('@')[0] || 'Admin',
        lastLogin: new Date().toISOString()
      });
    }
  });
}

// Pure Client-side Login (Only login with user credentials added in Firebase Console)
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const fbUser = userCredential.user;

  let role: UserProfile['role'] = 'admin';
  let customMessage = '';

  try {
    const userDocRef = doc(db, "users", fbUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const data = userDocSnap.data();
      role = data.role || 'admin';
      customMessage = data.customMessage || '';
    } else {
      await setDoc(userDocRef, {
        email: fbUser.email,
        role: 'admin',
        createdAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (fsErr) {
    console.warn('Firestore initial sync note:', fsErr);
  }

  const profile: UserProfile = {
    uid: fbUser.uid,
    email: fbUser.email || email,
    role: role,
    displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
    customMessage: customMessage,
    lastLogin: new Date().toISOString()
  };

  return profile;
}

// Sign Out
export async function logoutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Local Storage Offline-First Helpers
export function getLocalProjects(uid: string): Project[] {
  try {
    const raw = localStorage.getItem(`software_planner_projects_${uid}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading projects from localStorage:', e);
  }
  return [];
}

export function saveLocalProjects(uid: string, projects: Project[]): void {
  try {
    localStorage.setItem(`software_planner_projects_${uid}`, JSON.stringify(projects));
  } catch (e) {
    console.warn('Error writing projects to localStorage:', e);
  }
}

// Live real-time Firestore synchronization for all projects of this user
export function subscribeToUserProjects(
  uid: string, 
  onUpdate: (projects: Project[]) => void,
  onError?: (error: any) => void
) {
  const projectsColRef = collection(db, "users", uid, "projects");
  
  return onSnapshot(
    projectsColRef, 
    (snapshot) => {
      const remoteProjects: Project[] = [];
      snapshot.forEach((d) => {
        remoteProjects.push({ ...d.data(), id: d.id } as Project);
      });
      // Sort by updatedAt descending
      remoteProjects.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      
      // Also cache in localStorage for instant offline access
      if (remoteProjects.length > 0) {
        saveLocalProjects(uid, remoteProjects);
      }
      onUpdate(remoteProjects);
    },
    (err) => {
      console.error('Firestore onSnapshot error:', err);
      if (onError) onError(err);
    }
  );
}

// Helper: Remove undefined fields recursively so Firestore never throws unsupported field value error
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
}

// Save or Update Project directly in Firestore
export async function saveProjectToFirestore(uid: string, project: Project): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanProject = sanitizeForFirestore(project);
    const projectDocRef = doc(db, "users", uid, "projects", project.id);
    await setDoc(projectDocRef, {
      ...cleanProject,
      updatedAt: new Date().toISOString(),
      syncStatus: 'synced'
    }, { merge: true });
    return { success: true };
  } catch (err: any) {
    console.error('Firestore save project error:', err);
    return { 
      success: false, 
      error: err?.code === 'permission-denied' 
        ? 'Firestore Rules block access. Please set rules to allow read, write in Firebase Console.' 
        : (err?.message || 'Firestore save failed') 
    };
  }
}

// Delete Project from Firestore
export async function deleteProjectFromFirestore(uid: string, projectId: string): Promise<boolean> {
  try {
    const projectDocRef = doc(db, "users", uid, "projects", projectId);
    await deleteDoc(projectDocRef);
    return true;
  } catch (err) {
    console.error('Firestore delete project error:', err);
    return false;
  }
}

// Save User Custom Note/Message in Firestore (users/{uid})
export async function saveUserCustomData(uid: string, customMessage: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      customMessage,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Firestore custom data error:', err);
    return false;
  }
}
