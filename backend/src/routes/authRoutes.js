import { Router } from 'express';
import dotenv from 'dotenv';
import { verifyIdToken, signInWithEmailPassword } from '../services/authService.js';

dotenv.config();

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'FIREBASE_API_KEY not configured' });

    const result = await signInWithEmailPassword(apiKey, email, password);
    // returns idToken, refreshToken, expiresIn, localId, etc.
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Login failed' });
  }
});

authRouter.post('/verify', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ error: 'idToken required' });
    const decoded = await verifyIdToken(idToken);
    return res.json({ ok: true, decoded });
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Invalid token' });
  }
});


