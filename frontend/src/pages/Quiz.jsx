import React from 'react';

const Quiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)] py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-3">Available Quizzes</h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Test your knowledge and track your progress in computer science
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-[var(--tab-bg)] rounded-lg p-1 flex shadow-lg">
            <button className="px-6 py-2 rounded-md bg-[var(--tab-active-bg)] text-[var(--tab-active-text)] font-medium">All</button>
            <button className="px-6 py-2 rounded-md text-[var(--tab-inactive-text)] hover:text-[var(--tab-active-text)] font-medium">Programming</button>
            <button className="px-6 py-2 rounded-md text-[var(--tab-inactive-text)] hover:text-[var(--tab-active-text)] font-medium">Algorithms</button>
            <button className="px-6 py-2 rounded-md text-[var(--tab-inactive-text)] hover:text-[var(--tab-active-text)] font-medium">Databases</button>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quiz Card 1 */}
          <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-[var(--text-primary)] hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[var(--accent-bg)] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--accent-text)]">Programming</span>
              </div>
              <span className="px-2 py-1 bg-[var(--badge-available-bg)] text-[var(--badge-available-text)] text-xs font-medium rounded-full">Available</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">JavaScript Basics</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Learn the fundamentals of JavaScript including variables, functions, and loops.
            </p>

            <div className="space-y-2 mb-4 text-[var(--text-secondary)] text-sm">
              <div className="flex items-center"><span className="mr-2">15 questions</span></div>
              <div className="flex items-center"><span className="mr-2">30 minutes</span></div>
              <div className="flex items-center"><span className="mr-2">Passing: 70%</span></div>
            </div>

            <button className="w-full bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)] rounded-xl py-2 font-semibold text-[var(--btn-text)] transition">
              Start Quiz
            </button>
          </div>

          {/* Quiz Card 2 */}
          <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-[var(--text-primary)] hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[var(--accent2-bg)] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent2-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--accent2-text)]">Algorithms</span>
              </div>
              <span className="px-2 py-1 bg-[var(--badge-inprogress-bg)] text-[var(--badge-inprogress-text)] text-xs font-medium rounded-full">In Progress</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Sorting Algorithms</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Understand popular sorting techniques like QuickSort, MergeSort, and BubbleSort.
            </p>

            <div className="space-y-2 mb-4 text-[var(--text-secondary)] text-sm">
              <div className="flex items-center"><span className="mr-2">20 questions</span></div>
              <div className="flex items-center"><span className="mr-2">40 minutes</span></div>
              <div className="flex items-center"><span className="mr-2">Passing: 75%</span></div>
            </div>

            <button className="w-full bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)] rounded-xl py-2 font-semibold text-[var(--btn-text)] transition">
              Continue Quiz
            </button>
          </div>

          {/* Quiz Card 3 */}
          <div className="bg-[var(--card-bg)] backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-[var(--text-primary)] hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[var(--accent3-bg)] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--accent3-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-[var(--accent3-text)]">Databases</span>
              </div>
              <span className="px-2 py-1 bg-[var(--badge-completed-bg)] text-[var(--badge-completed-text)] text-xs font-medium rounded-full">Completed</span>
            </div>

            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">SQL Fundamentals</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Learn SQL queries, joins, and database design basics.
            </p>

            <div className="bg-[var(--score-bg)] p-3 rounded-lg mb-4 text-[var(--score-text)]">
              <div className="flex justify-between text-sm font-medium">
                <span>Your Score</span>
                <span className="font-bold">88%</span>
              </div>
              <p className="text-xs mt-1">Completed 1 day ago</p>
            </div>

            <button className="w-full bg-[var(--btn-primary)] hover:bg-[var(--btn-primary-hover)] rounded-xl py-2 font-semibold text-[var(--btn-text)] transition">
              View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
