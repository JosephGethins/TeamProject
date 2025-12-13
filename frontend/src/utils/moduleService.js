import { getCurrentUserToken } from './auth';
import { API_BASE } from '../config';

const API_BASE_URL = API_BASE || '';

async function authFetch(path, options = {}) {
  const token = await getCurrentUserToken();
  const headers = options.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = 'application/json';
  
  // Add timeout to prevent hanging requests
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { 
      ...options, 
      headers,
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Request failed: ${res.status} ${text}`);
    }
    return res.json().catch(() => null);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timeout: The server took too long to respond. Please check if the backend is running.');
    }
    throw err;
  }
}

export async function getModulesByYear(year) {
  return authFetch(`/modules/year/${year}`);
}

export async function getUserProfile() {
  return authFetch('/modules/profile');
}

export async function setUserYear(year) {
  return authFetch('/modules/year', {
    method: 'POST',
    body: JSON.stringify({ year }),
  });
}

export async function setUserModules(moduleIds) {
  return authFetch('/modules/select', {
    method: 'POST',
    body: JSON.stringify({ moduleIds }),
  });
}

export async function getUserModules() {
  return authFetch('/modules/selected');
}

export async function getAllModules() {
  return authFetch('/modules/all');
}
