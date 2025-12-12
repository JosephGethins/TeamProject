import { getFirestore } from '../config/firebaseAdmin.js';

const db = getFirestore();

export async function createUserProfile(uid, userData) {
  const userRef = db.collection('users').doc(uid);
  const userProfile = {
    uid,
    email: userData.email,
    displayName: userData.displayName || '',
    role: userData.role || 'student',
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await userRef.set(userProfile);
  return userProfile;
}

export async function getUserProfile(uid) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();
  
  if (!userDoc.exists) {
    throw new Error('User profile not found');
  }
  
  return { id: userDoc.id, ...userDoc.data() };
}

export async function updateUserProfile(uid, updateData) {
  const userRef = db.collection('users').doc(uid);
  const updatePayload = {
    ...updateData,
    updatedAt: new Date()
  };

  await userRef.update(updatePayload);
  return await getUserProfile(uid);
}

export async function deleteUserProfile(uid) {
  const userRef = db.collection('users').doc(uid);
  await userRef.delete();
  return { success: true };
}

export async function getUserProgress(uid) {
  const progressRef = db.collection('userProgress').doc(uid);
  const progressDoc = await progressRef.get();
  
  if (!progressDoc.exists) {
    return {
      totalQuizzesTaken: 0,
      averageScore: 0,
      modulesCompleted: [],
      lastActivity: null
    };
  }
  
  return { id: progressDoc.id, ...progressDoc.data() };
}

export async function updateUserProgress(uid, progressData) {
  const progressRef = db.collection('userProgress').doc(uid);
  const updatePayload = {
    ...progressData,
    lastActivity: new Date()
  };

  await progressRef.set(updatePayload, { merge: true });
  return await getUserProgress(uid);
}
