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

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {getGreeting()}, {user?.displayName || 'Student'}! 👋
              </h1>
              <p className="text-pink-200 text-lg">{formatDate()}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white">{formatTime()}</div>
              <p className="text-pink-200 text-sm mt-1">Current Time</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-lg">Classes Today</h3>
              <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-4xl font-bold text-white">{items.length}</p>
          </div>

          <div 
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-lg">Quiz Mode</h3>
              <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-white text-sm">Practice & Learn</p>
          </div>

          <div 
            onClick={() => navigate('/data-metrics')}
            className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-pink-400/30 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-lg">Your Progress</h3>
              <svg className="w-8 h-8 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-white text-sm">View Analytics</p>
          </div>
        </div>

        {/* Timetable Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Timetable</h2>
              <p className="text-pink-200">View your weekly schedule</p>
            </div>
            <button
              onClick={() => navigate('/edit-timetable')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl font-semibold text-white shadow-lg transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Timetable
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-white text-xl mb-2">No classes scheduled yet</p>
              <p className="text-pink-200 mb-6">Get started by adding your classes to the timetable</p>
              <button
                onClick={() => navigate('/edit-timetable')}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-white transition"
              >
                Add Your First Class
              </button>
            </div>
          ) : (
            <div className="bg-white/5 rounded-2xl p-6 overflow-x-auto">
              <Timetable 
                items={items} 
                onChange={() => {}} 
                locked={true} 
                deleteMode={false} 
              />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div 
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-6 border border-indigo-400/30 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="bg-indigo-500/30 p-3 rounded-xl">
                <svg className="w-8 h-8 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Start Quick Quiz</h3>
                <p className="text-indigo-200">Test your knowledge with a quick practice session</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-xl rounded-2xl p-6 border border-pink-400/30 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="bg-pink-500/30 p-3 rounded-xl">
                <svg className="w-8 h-8 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Update Profile</h3>
                <p className="text-pink-200">Customize your profile and settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;