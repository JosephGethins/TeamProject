import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile,
  getUserProgress,
  updateUserProgress
} from '../services/userService.js';

export const userRouter = Router();

// Create user profile (called after successful registration)
userRouter.post('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, role } = req.body;
    const userData = {
      email: req.user.email,
      displayName,
      role: role || 'student'
    };

    const profile = await createUserProfile(req.user.uid, userData);
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user profile
userRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid);
    res.json(profile);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
userRouter.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { displayName, preferences } = req.body;
    const updateData = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (preferences !== undefined) updateData.preferences = preferences;

    const updatedProfile = await updateUserProfile(req.user.uid, updateData);
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user profile
userRouter.delete('/profile', authenticateToken, async (req, res) => {
  try {
    await deleteUserProfile(req.user.uid);
    res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user progress
userRouter.get('/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await getUserProgress(req.user.uid);
    res.json(progress);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user progress
userRouter.put('/progress', authenticateToken, async (req, res) => {
  try {
    const progressData = req.body;
    const updatedProgress = await updateUserProgress(req.user.uid, progressData);
    res.json(updatedProgress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user settings
userRouter.get('/settings', authenticateToken, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid);
    res.json({
      displayName: profile.displayName,
      email: profile.email,
      preferences: profile.preferences
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user settings
userRouter.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { displayName, preferences, password } = req.body;
    const updateData = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    if (preferences !== undefined) updateData.preferences = preferences;

    const updatedProfile = await updateUserProfile(req.user.uid, updateData);
    
    // Note: Password updates would need to be handled through Firebase Auth
    // This is a placeholder for future implementation
    if (password) {
      // Password update logic would go here
      // This requires Firebase Auth Admin SDK password update
    }
    
    res.json({
      displayName: updatedProfile.displayName,
      email: updatedProfile.email,
      preferences: updatedProfile.preferences,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user account information for settings page
userRouter.get('/account', authenticateToken, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid);
    res.json({
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      role: profile.role,
      createdAt: profile.createdAt,
      lastLogin: profile.lastLogin || null
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update account information
userRouter.put('/account', authenticateToken, async (req, res) => {
  try {
    const { displayName, email } = req.body;
    const updateData = {};
    
    if (displayName !== undefined) updateData.displayName = displayName;
    // Note: Email updates would need Firebase Auth integration
    
    const updatedProfile = await updateUserProfile(req.user.uid, updateData);
    res.json({
      uid: updatedProfile.uid,
      email: updatedProfile.email,
      displayName: updatedProfile.displayName,
      role: updatedProfile.role,
      message: 'Account updated successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
