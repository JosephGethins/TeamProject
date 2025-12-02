import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import {
  getModulesByYear,
  getUserProfile,
  setUserYear,
  setUserModules,
  getUserModulesWithDetails,
  getAllModules,
} from '../services/moduleService.js';

export const moduleRouter = Router();

// Get all modules across all years (for admins)
moduleRouter.get('/all', authenticateToken, async (req, res) => {
  try {
    const modules = await getAllModules();
    res.json({ modules });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get modules for a specific year
moduleRouter.get('/year/:year', authenticateToken, async (req, res) => {
  try {
    const { year } = req.params;
    const modules = await getModulesByYear(year);
    res.json({ modules });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's profile (year + selected modules)
moduleRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid);
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Set user's year
moduleRouter.post('/year', authenticateToken, async (req, res) => {
  try {
    const { year } = req.body;
    const result = await setUserYear(req.user.uid, year);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Set user's selected modules
moduleRouter.post('/select', authenticateToken, async (req, res) => {
  try {
    const { moduleIds } = req.body;
    const result = await setUserModules(req.user.uid, moduleIds);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get user's selected modules with full details
moduleRouter.get('/selected', authenticateToken, async (req, res) => {
  try {
    const modules = await getUserModulesWithDetails(req.user.uid);
    res.json({ modules });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
