import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserModules } from '../utils/moduleService';

const Quiz = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await getUserModules();
      console.log('Fetched modules data:', data); // Debug log
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setModules(data);
      } else if (data && Array.isArray(data.modules)) {
        setModules(data.modules);
      } else if (data && typeof data === 'object') {
        // If it's an object, convert to array
        setModules(Object.values(data));
      } else {
        setModules([]);
      }
    } catch (err) {
      setError('Failed to load modules. Please try again.');
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from modules
  const categories = ['All', ...new Set(modules.map(m => m.category || 'General'))];

  // Filter modules based on active filter
  const filteredModules = activeFilter === 'All' 
    ? modules 
    : modules.filter(m => (m.category || 'General') === activeFilter);

  // Color schemes for different categories
  const getCategoryColors = (category) => {
    const colorMap = {
      'Programming': { bg: 'rgba(59, 130, 246, 0.1)', text: 'rgb(59, 130, 246)' },
      'Algorithms': { bg: 'rgba(236, 72, 153, 0.1)', text: 'rgb(236, 72, 153)' },
      'Databases': { bg: 'rgba(34, 197, 94, 0.1)', text: 'rgb(34, 197, 94)' },
      'General': { bg: 'rgba(168, 85, 247, 0.1)', text: 'rgb(168, 85, 247)' }
    };
    return colorMap[category] || colorMap['General'];
  };

  // Get status badge colors
  const getStatusColors = (status) => {
    const statusMap = {
      'available': { bg: 'rgba(34, 197, 94, 0.2)', text: 'rgb(34, 197, 94)' },
      'in_progress': { bg: 'rgba(251, 191, 36, 0.2)', text: 'rgb(251, 191, 36)' },
      'completed': { bg: 'rgba(59, 130, 246, 0.2)', text: 'rgb(59, 130, 246)' }
    };
    return statusMap[status] || statusMap['available'];
  };

  const handleQuizClick = (moduleId, moduleName) => {
    navigate(`/quiz-problem?module=${moduleId}&name=${encodeURIComponent(moduleName)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchModules}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Available Quizzes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Test your knowledge and track your progress in your modules
          </p>
        </div>

        {/* Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex justify-center mb-10 overflow-x-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 flex shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-2 rounded-md font-medium transition whitespace-nowrap ${
                    activeFilter === category
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Modules Message */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {activeFilter === 'All' 
                ? 'No modules found. Please select your modules in settings.'
                : `No modules found in ${activeFilter} category.`}
            </p>
          </div>
        )}

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const categoryColors = getCategoryColors(module.category || 'General');
            const statusColors = getStatusColors(module.quizStatus || 'available');
            const statusText = module.quizStatus === 'in_progress' ? 'In Progress' 
              : module.quizStatus === 'completed' ? 'Completed' 
              : 'Available';

            return (
              <div
                key={module._id}
                className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: categoryColors.bg }}
                    >
                      <svg 
                        className="w-5 h-5" 
                        style={{ color: categoryColors.text }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                        />
                      </svg>
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: categoryColors.text }}
                    >
                      {module.category || 'General'}
                    </span>
                  </div>
                  <span 
                    className="px-2 py-1 text-xs font-medium rounded-full"
                    style={{ 
                      backgroundColor: statusColors.bg,
                      color: statusColors.text 
                    }}
                  >
                    {statusText}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {module.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {module.description || `Test your knowledge of ${module.name}`}
                </p>

                <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300 text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">{module.questionCount || 15} questions</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">{module.duration || 30} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">Passing: {module.passingScore || 70}%</span>
                  </div>
                </div>

                {module.quizStatus === 'completed' && module.lastScore && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                    <div className="flex justify-between text-sm font-medium text-blue-900 dark:text-blue-200">
                      <span>Your Score</span>
                      <span className="font-bold">{module.lastScore}%</span>
                    </div>
                    {module.completedDate && (
                      <p className="text-xs mt-1 text-blue-700 dark:text-blue-300">
                        Completed {new Date(module.completedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleQuizClick(module._id, module.name)}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-2 font-semibold text-white transition"
                >
                  {module.quizStatus === 'completed' ? 'Retake Quiz' 
                    : module.quizStatus === 'in_progress' ? 'Continue Quiz' 
                    : 'Start Quiz'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz;