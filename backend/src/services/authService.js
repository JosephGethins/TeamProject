import fetch from 'node-fetch';
import { getAuth } from '../config/firebaseAdmin.js';

export async function verifyIdToken(idToken) {
  const auth = getAuth();
  const decoded = await auth.verifyIdToken(idToken);
  return decoded; // includes uid, email, etc.
}

export async function signInWithEmailPassword(apiKey, email, password) {
  const endpoint = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `Login failed with status ${response.status}`;
    throw new Error(message);
  }

  return response.json();
}


