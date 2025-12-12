import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, getCurrentUser } from '../utils/auth';
import { getUserProfile } from '../utils/moduleService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const reloadUserProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        return profile;
      } catch (err) {
        console.error('Failed to reload user profile:', err);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      // Load user profile (year and modules) if user is logged in
      if (user) {
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    error,
    setError,
    userProfile,
    reloadUserProfile,
    isAuthenticated: !!user,
    isInstructor: user?.role === 'instructor',
    isAdmin: user?.email?.endsWith('@mu.ie') || false,
    userYear: userProfile?.year,
    selectedModules: userProfile?.selectedModules || [],
    profileComplete: userProfile?.profileComplete || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
