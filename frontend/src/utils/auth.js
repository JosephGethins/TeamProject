import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      token: await userCredential.user.getIdToken()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Create new user account
export const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
    }
    
    return {
      success: true,
      user: userCredential.user,
      token: await userCredential.user.getIdToken()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get current user token
export const getCurrentUserToken = async () => {
  const user = getCurrentUser();
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const user = getCurrentUser();
    if (user) {
      await updateProfile(user, updates);
      return { success: true };
    }
    return {
      success: false,
      error: 'No user logged in'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
