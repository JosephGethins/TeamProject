import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import YearSelection from './YearSelection';
import ModuleSelection from './ModuleSelection';

const Onboarding = () => {
  const { userProfile, reloadUserProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('year');
  const [selectedYear, setSelectedYear] = useState(null);

  // If user already completed onboarding, redirect to home
  useEffect(() => {
    if (userProfile?.profileComplete) {
      navigate('/');
    }
  }, [userProfile?.profileComplete, navigate]);

  // Check if user has year but not completed - start from modules
  useEffect(() => {
    if (userProfile?.year && !userProfile?.profileComplete) {
      setSelectedYear(userProfile.year);
      setStep('modules');
    }
  }, [userProfile]);

  if (userProfile?.profileComplete) {
    return null;
  }

  const handleYearSelected = async (year) => {
    setSelectedYear(year);
    setStep('modules');
    // Reload profile to get updated year
    await reloadUserProfile();
  };

  const handleModulesSelected = async (moduleIds) => {
    // Reload profile to get updated completion status
    const updatedProfile = await reloadUserProfile();
    
    // If profile is complete, navigate immediately
    if (updatedProfile?.profileComplete) {
      navigate('/');
    } else {
      // Otherwise wait a bit and reload again
      setTimeout(async () => {
        const retryProfile = await reloadUserProfile();
        if (retryProfile?.profileComplete) {
          navigate('/');
        } else {
          console.warn('Profile still not complete after retry');
        }
      }, 1000);
    }
  };

  return (
    <div>
      {step === 'year' && <YearSelection onYearSelected={handleYearSelected} />}
      {step === 'modules' && selectedYear && <ModuleSelection year={selectedYear} onModulesSelected={handleModulesSelected} />}
    </div>
  );
};

export default Onboarding;
