import { getCurrentUserToken } from './auth';
import { API_BASE } from '../config';

const API_BASE_URL = API_BASE || '';
async function authFetch(path, options = {}) {
  const token = await getCurrentUserToken();
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  return res.json().catch(() => null);
}

export async function saveTimetable(uid, items) {
  // Calls backend to upsert full timetable
  return authFetch('/timetable', { method: 'POST', body: JSON.stringify({ items }) });
}

export async function loadTimetable(uid) {
  // Load current user's timetable
  return authFetch('/timetable');
}

export async function modifyTimetableItem(type, item) {
  console.log('Calling modifyTimetableItem with:', { type, item });
  // Convert type to action for backend compatibility
  const action = type;
  const result = await authFetch('/timetable/item', { 
    method: 'POST', 
    body: JSON.stringify({ action, item }) 
  });
  console.log('modifyTimetableItem response:', result);
  return result;
}

