import admin from 'firebase-admin';
import { getFirestore } from '../config/firebaseAdmin.js';

const db = getFirestore();

const docRef = (uid) => db.doc(`timetables/${uid}`);

export async function upsertTimetable(uid, items) {
  if (!uid) throw new Error('uid required');
  const ref = docRef(uid);
  await ref.set({ items: items || [], updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { success: true };
}

export async function getTimetable(uid) {
  if (!uid) throw new Error('uid required');
  const ref = docRef(uid);
  const snap = await ref.get();
  if (!snap.exists) return { items: [] };
  return snap.data();
}

export async function modifyTimetableItem(uid, { action, item }) {
  if (!uid) throw new Error('uid required');
  const ref = docRef(uid);
  const snap = await ref.get();
  const data = snap.exists ? snap.data() : { items: [] };
  let items = data.items || [];

  if (action === 'add') {
    // avoid duplicates: if same id exists, replace it, otherwise append
    items = items.filter((it) => it.id !== item.id);
    items.push(item);
  } else if (action === 'update') {
    items = items.map((it) => (it.id === item.id ? { ...it, ...item } : it));
  } else if (action === 'delete') {
    items = items.filter((it) => it.id !== item.id);
  } else {
    throw new Error('Unknown action');
  }

  await ref.set({ items, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { items };
}
