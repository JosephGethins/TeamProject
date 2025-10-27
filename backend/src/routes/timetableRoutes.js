import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upsertTimetable, getTimetable, modifyTimetableItem } from '../services/timetableService.js';


export const timetableRouter = Router();

// Get current user's timetable
timetableRouter.get('/', authenticateToken, async (req, res) => {
  try {
    const data = await getTimetable(req.user.uid);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Replace or create timetable
timetableRouter.post('/', authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    await upsertTimetable(req.user.uid, items || []);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Modify a single item (add/update/delete)
timetableRouter.post('/item', authenticateToken, async (req, res) => {
  try {
    const { action, item } = req.body;
    const data = await modifyTimetableItem(req.user.uid, { action, item });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



