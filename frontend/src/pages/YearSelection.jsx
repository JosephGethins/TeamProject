import React, { useState } from 'react';
import { setUserYear } from '../utils/moduleService';

const YearSelection = ({ onYearSelected }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const years = [
    { value: 1, label: '1st Year', description: 'Foundation modules' },
    { value: 2, label: '2nd Year', description: 'Intermediate modules' },
    { value: 3, label: '3rd Year', description: 'Advanced modules' },
    { value: 4, label: '4th Year', description: 'Specialized modules' },
  ];

  const handleSelectYear = async (year) => {
    setSelectedYear(year);
    setLoading(true);
    setError('');

    try {
      await setUserYear(year);
      onYearSelected(year);
    } catch (err) {
      setError(err.message || 'Failed to save year selection');
      setSelectedYear(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Select Your Year
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Choose your academic year to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {years.map((year) => (
            <button
              key={year.value}
              onClick={() => handleSelectYear(year.value)}
              disabled={loading}
              className={`p-8 rounded-2xl text-center transition-all duration-200 ${
                selectedYear === year.value
                  ? 'ring-2 ring-offset-2 ring-offset-transparent'
                  : 'hover:scale-105'
              }`}
              style={{
                backgroundColor: 'var(--card-bg)',
                borderColor: selectedYear === year.value ? 'var(--accent)' : 'transparent',
                color: 'var(--text-primary)',
              }}
            >
              <div className="text-3xl font-bold mb-2">{year.label}</div>
              <p style={{ color: 'var(--text-secondary)' }}>{year.description}</p>
              {selectedYear === year.value && loading && (
                <div className="mt-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearSelection;
