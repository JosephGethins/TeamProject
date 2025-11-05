import React from 'react';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-800 to-cyan-700 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Available Quizzes</h1>
          <p className="text-xl text-cyan-200">Test your knowledge and track your progress in computer science</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-white/20 rounded-lg p-1 flex shadow-lg">
            <button className="px-6 py-2 rounded-md bg-cyan-500 text-white font-medium">All</button>
            <button className="px-6 py-2 rounded-md text-white/70 hover:text-white font-medium">Programming</button>
            <button className="px-6 py-2 rounded-md text-white/70 hover:text-white font-medium">Algorithms</button>
            <button className="px-6 py-2 rounded-md text-white/70 hover:text-white font-medium">Databases</button>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quiz Card 1 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-cyan-600">Programming</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Available</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">JavaScript Basics</h3>
            <p className="text-white/70 mb-4">Learn the fundamentals of JavaScript including variables, functions, and loops.</p>

            <div className="space-y-2 mb-4 text-white/70 text-sm">
              <div className="flex items-center"><span className="mr-2">15 questions</span></div>
              <div className="flex items-center"><span className="mr-2">30 minutes</span></div>
              <div className="flex items-center"><span className="mr-2">Passing: 70%</span></div>
            </div>

            <button className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-xl py-2 font-semibold text-white transition">Start Quiz</button>
          </div>

          {/* Quiz Card 2 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-blue-600">Algorithms</span>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">In Progress</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Sorting Algorithms</h3>
            <p className="text-white/70 mb-4">Understand popular sorting techniques like QuickSort, MergeSort, and BubbleSort.</p>

            <div className="space-y-2 mb-4 text-white/70 text-sm">
              <div className="flex items-center"><span className="mr-2">20 questions</span></div>
              <div className="flex items-center"><span className="mr-2">40 minutes</span></div>
              <div className="flex items-center"><span className="mr-2">Passing: 75%</span></div>
            </div>

            <button className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-xl py-2 font-semibold text-white transition">Continue Quiz</button>
          </div>

          {/* Quiz Card 3 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-indigo-600">Databases</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">SQL Fundamentals</h3>
            <p className="text-white/70 mb-4">Learn SQL queries, joins, and database design basics.</p>

            <div className="space-y-2 mb-4 text-white/70 text-sm">
              <div className="flex items-center"><span className="mr-2">25 questions</span></div>
              <div className="flex items-center"><span className="mr-2">50 minutes</span></div>
              <div className="flex items-center"><span className="mr-2">Passing: 70%</span></div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg mb-4 text-green-700">
              <div className="flex justify-between text-sm font-medium">
                <span>Your Score</span>
                <span className="font-bold">88%</span>
              </div>
              <p className="text-xs mt-1">Completed 1 day ago</p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-2 font-semibold text-white transition">View Results</button>
          </div>

          {/* Quiz Card 4 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-white hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-teal-600">Programming</span>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Available</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Python Basics</h3>
            <p className="text-white/70 mb-4">Intro to Python syntax, data types, and control structures.</p>

            <div className="space-y-2 mb-4 text-white/70 text-sm">
              <div className="flex items-center"><span className="mr-2">18 questions</span></div>
              <div className="flex items-center"><span className="mr-2">35 minutes</span></div>
              <div className="flex items-center"><span className="mr-2">Passing: 80%</span></div>
            </div>

            <button className="w-full bg-cyan-500 hover:bg-cyan-600 rounded-xl py-2 font-semibold text-white transition">Start Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
