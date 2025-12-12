import admin from 'firebase-admin';
import { getFirestore } from '../config/firebaseAdmin.js';

const db = getFirestore();

// Module data structure by year
const MODULES_BY_YEAR = {
  1: [
    { id: 'CS161', name: 'Introduction to Programming', code: 'CS161' },
    { id: 'CS162', name: 'Data Structures', code: 'CS162' },
    { id: 'CS171', name: 'Computer Systems I', code: 'CS171' },
    { id: 'CS172', name: 'Computer Systems II', code: 'CS172' },
    { id: 'MT101SC', name: 'Calculus I', code: 'MT101SC' },
    { id: 'MT102SC', name: 'Calculus II', code: 'MT102SC' },
    { id: 'MT113SC', name: 'Linear Algebra', code: 'MT113SC' },
  ],
  2: [
    { id: 'CS210', name: 'Algorithms and data structures I', code: 'CS210' },
    { id: 'CS211', name: 'Algorithms and data structures II', code: 'CS211' },
    { id: 'CS130', name: 'Database Systems', code: 'CS130' },
    { id: 'MT201S', name: 'Calculus III', code: 'MT201S' },
    { id: 'ST221', name: 'Statistics', code: 'ST221' },
    { id: 'CS230', name: 'Web Development', code: 'CS230' },
    { id: 'CS220', name: 'Computer Architecture', code: 'CS220' },
    { id: 'CS240', name: 'Operating Systems', code: 'CS240' },
    { id: 'CS280', name: 'UI/UX Design', code: 'CS280' },
    { id: 'CS265', name: 'Software Testing', code: 'CS265' },
    { id: 'CS335', name: 'Software Engineering and Processes', code: 'CS335' },
    { id: 'CS355', name: 'Theory of Computation', code: 'CS355' },
  ],
  3: [
    { id: 'CS70', name: 'Computation and Complexity', code: 'CS70' },
    { id: 'CS264', name: 'Software Design', code: 'CS264' },
    { id: 'CS320', name: 'Computer Networks', code: 'CS320' },
    { id: 'CS310', name: 'Programming Languages and Compilers', code: 'CS310' },
    { id: 'CS357', name: 'Software Verification', code: 'CS357' },
    { id: 'CS353', name: 'Team Project', code: 'CS353' },
  ],
  4: [
    { id: 'CS401', name: 'Machine Learning', code: 'CS401' },
    { id: 'CS410', name: 'Computer Vision', code: 'CS410' },
    { id: 'CS416', name: 'Cryptography', code: 'CS416' },
    { id: 'CS404', name: 'AI & Deep Learning', code: 'CS404' },
    { id: 'CS424', name: 'PROGRAMMING LANGUAGE DESIGN & SEMANTICS', code: 'CS424' },
    { id: 'CS440', name: 'Final Year Project', code: 'CS440' },
    { id: 'CS402', name: 'Parallel & Distributed Systems', code: 'CS402' },
    { id: 'CS430', name: 'Advanced Concepts & Issues', code: 'CS430' },
    { id: 'CS433', name: 'Advanced Computer Architecture', code: 'CS433' },
    { id: 'CS425', name: 'Audio & Speech Processing', code: 'CS425' },
    { id: 'CS427', name: 'Autonomous Mobile Robotics', code: 'CS427' },
    { id: 'CS426', name: 'Computer Graphics', code: 'CS426' },
  ],
};

// Get modules for a specific year
export async function getModulesByYear(year) {
  const yearNum = parseInt(year, 10);
  if (!MODULES_BY_YEAR[yearNum]) {
    throw new Error(`Invalid year: ${year}`);
  }
  return MODULES_BY_YEAR[yearNum];
}

// Get user's profile with year and selected modules
export async function getUserProfile(uid) {
  if (!uid) throw new Error('uid required');
  const ref = db.doc(`users/${uid}`);
  const snap = await ref.get();
  if (!snap.exists) {
    return { year: null, selectedModules: [], profileComplete: false };
  }
  return snap.data();
}

// Update user's year selection
export async function setUserYear(uid, year) {
  if (!uid) throw new Error('uid required');
  const yearNum = parseInt(year, 10);
  if (!MODULES_BY_YEAR[yearNum]) {
    throw new Error(`Invalid year: ${year}`);
  }
  const ref = db.doc(`users/${uid}`);
  await ref.set(
    {
      year: yearNum,
      selectedModules: [],
      profileComplete: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { year: yearNum, selectedModules: [] };
}

// Update user's selected modules
export async function setUserModules(uid, moduleIds) {
  if (!uid) throw new Error('uid required');
  if (!Array.isArray(moduleIds)) throw new Error('moduleIds must be an array');

  const ref = db.doc(`users/${uid}`);
  await ref.set(
    {
      selectedModules: moduleIds,
      profileComplete: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { selectedModules: moduleIds, profileComplete: true };
}

// Get user's selected modules with details
export async function getUserModulesWithDetails(uid) {
  if (!uid) throw new Error('uid required');
  const profile = await getUserProfile(uid);
  
  if (!profile.year || !profile.selectedModules) {
    return [];
  }

  const allModules = MODULES_BY_YEAR[profile.year] || [];
  return allModules.filter(m => profile.selectedModules.includes(m.id));
}

// Get all modules across all years
export async function getAllModules() {
  const allModules = [];
  for (const year in MODULES_BY_YEAR) {
    allModules.push(...MODULES_BY_YEAR[year]);
  }
  return allModules;
}
