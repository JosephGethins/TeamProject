import admin from 'firebase-admin';
import { getFirestore } from '../config/firebaseAdmin.js';

const db = getFirestore();

// Module data structure by year
const MODULES_BY_YEAR = {
  1: [
    { id: 'CS1001', name: 'Introduction to Programming', code: 'CS1001' },
    { id: 'CS1002', name: 'Data Structures', code: 'CS1002' },
    { id: 'CS1003', name: 'Digital Logic', code: 'CS1003' },
    { id: 'MATH1001', name: 'Calculus I', code: 'MATH1001' },
    { id: 'MATH1002', name: 'Linear Algebra', code: 'MATH1002' },
    { id: 'ENG1001', name: 'Technical Writing', code: 'ENG1001' },
  ],
  2: [
    { id: 'CS2001', name: 'Object-Oriented Programming', code: 'CS2001' },
    { id: 'CS2002', name: 'Algorithms', code: 'CS2002' },
    { id: 'CS2003', name: 'Database Systems', code: 'CS2003' },
    { id: 'MATH2001', name: 'Calculus II', code: 'MATH2001' },
    { id: 'MATH2002', name: 'Discrete Mathematics', code: 'MATH2002' },
    { id: 'CS2004', name: 'Web Development', code: 'CS2004' },
  ],
  3: [
    { id: 'CS3001', name: 'Software Engineering', code: 'CS3001' },
    { id: 'CS3002', name: 'Operating Systems', code: 'CS3002' },
    { id: 'CS3003', name: 'Computer Networks', code: 'CS3003' },
    { id: 'CS3004', name: 'Machine Learning', code: 'CS3004' },
    { id: 'CS3005', name: 'Mobile Development', code: 'CS3005' },
    { id: 'CS3006', name: 'Cybersecurity', code: 'CS3006' },
  ],
  4: [
    { id: 'CS4001', name: 'Cloud Computing', code: 'CS4001' },
    { id: 'CS4002', name: 'AI & Deep Learning', code: 'CS4002' },
    { id: 'CS4003', name: 'Advanced Algorithms', code: 'CS4003' },
    { id: 'CS4004', name: 'Distributed Systems', code: 'CS4004' },
    { id: 'CS4005', name: 'Project Management', code: 'CS4005' },
    { id: 'CS4006', name: 'Capstone Project', code: 'CS4006' },
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
