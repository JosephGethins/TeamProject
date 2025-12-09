import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Timetable from '../components/timetable/Timetable';
import { loadTimetable } from '../utils/timetableService';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!user) return;
    loadTimetable(user.uid).then((d) => setItems(d?.items || []));
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div 
        className="min-h-screen py-8 px-6 flex items-center justify-center"
        style={{ 
          backgroundImage: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))',
          minHeight: '100vh'
        }}
      >
        <div style={{ color: 'var(--text-primary)' }} className="text-xl">Loading...</div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () =>
    currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatTime = () =>
    currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Calculate classes today (Lectures and Tutorials only, excluding Labs)
  const getClassesToday = () => {
    const dayOfWeek = currentTime.getDay(); // 0=Sunday, 1=Monday, etc.
    // Map to timetable day index (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri)
    const dayMap = { 0: -1, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: -1 }; // Weekend = -1
    const todayIndex = dayMap[dayOfWeek];
    
    if (todayIndex === -1) return 0; // Weekend, no classes
    
    return items.filter(item => item.day === todayIndex && item.type !== 'Lab').length;
  };

  // Calculate labs today
  const getLabsToday = () => {
    const dayOfWeek = currentTime.getDay(); // 0=Sunday, 1=Monday, etc.
    // Map to timetable day index (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri)
    const dayMap = { 0: -1, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: -1 }; // Weekend = -1
    const todayIndex = dayMap[dayOfWeek];
    
    if (todayIndex === -1) return 0; // Weekend, no labs
    
    return items.filter(item => item.day === todayIndex && item.type === 'Lab').length;
  };

  return (
    <div 
      className="min-h-screen py-8 px-6"
      style={{ 
        backgroundImage: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))',
        minHeight: '100vh'
      }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Welcome Header */}
        <div 
          className="rounded-3xl shadow-2xl p-8 mb-8 border backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {getGreeting()}, {user?.displayName || 'Student'}! 👋
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>{formatDate()}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatTime()}</div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Current Time</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Classes Today */}
          <div 
            className="rounded-2xl p-6 border hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--card-border)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Classes Today</h3>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{getClassesToday()}</p>
          </div>

          {/* Lab Mode */}
          <div 
            className="rounded-2xl p-6 border hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--card-border)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Labs Today</h3>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>{getLabsToday()}</p>
          </div>

          {/* Your Progress */}
          <div 
            className="rounded-2xl p-6 border hover:scale-105 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--card-border)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Your Progress</h3>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>—</p>
          </div>
        </div>

        {/* Timetable Section */}
        <div 
          className="rounded-3xl shadow-2xl p-8 border backdrop-blur-sm"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your Timetable</h2>
              <p style={{ color: 'var(--text-secondary)' }}>View your weekly schedule</p>
            </div>
            <button
              onClick={() => navigate('/edit-timetable')}
              className="px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ 
                backgroundImage: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))', 
                color: 'var(--btn-text)',
                border: 'none'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Timetable
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <div 
                className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  border: '2px dashed var(--card-border)'
                }}
              >
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     style={{ color: 'var(--accent)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xl mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>No classes scheduled yet</p>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Get started by adding your classes to the timetable</p>
              <button
                onClick={() => navigate('/edit-timetable')}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))',
                  color: 'var(--btn-text)',
                  border: 'none'
                }}
              >
                Add Your First Class
              </button>
            </div>
          ) : (
            <div className="rounded-2xl p-6 overflow-x-auto" style={{ backgroundColor: 'rgba(0,0,0,0.02)' }}>
              <Timetable items={items} onChange={() => {}} locked={true} deleteMode={false} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;