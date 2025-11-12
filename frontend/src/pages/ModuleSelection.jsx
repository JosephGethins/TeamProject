import React, { useState, useEffect } from 'react';
import { getModulesByYear, setUserModules } from '../utils/moduleService';

const ModuleSelection = ({ year, onModulesSelected }) => {
  const [modules, setModules] = useState([]);
  const [selectedModules, setSelectedModules] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        const data = await getModulesByYear(year);
        setModules(data.modules || []);
      } catch (err) {
        setError(err.message || 'Failed to load modules');
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [year]);

  const handleToggleModule = (moduleId) => {
    const newSelected = new Set(selectedModules);
    if (newSelected.has(moduleId)) {
      newSelected.delete(moduleId);
    } else {
      newSelected.add(moduleId);
    }
    setSelectedModules(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedModules.size === modules.length) {
      setSelectedModules(new Set());
    } else {
      setSelectedModules(new Set(modules.map(m => m.id)));
    }
  };

  const handleSubmit = async () => {
    if (selectedModules.size === 0) {
      setError('Please select at least one module');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await setUserModules(Array.from(selectedModules));
      onModulesSelected(Array.from(selectedModules));
    } catch (err) {
      setError(err.message || 'Failed to save module selection');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}>
        <div style={{ color: 'var(--text-primary)' }}>Loading modules...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Select Your Modules
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Choose the modules you'll be taking this year
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)' }}>
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div style={{ color: 'var(--text-secondary)' }}>
            {selectedModules.size} of {modules.length} modules selected
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 rounded-lg transition"
            style={{
              backgroundColor: 'var(--card-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
            }}
          >
            {selectedModules.size === modules.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              onClick={() => handleToggleModule(module.id)}
              className="p-4 rounded-lg cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: selectedModules.has(module.id) ? 'var(--accent)' : 'var(--card-bg)',
                color: selectedModules.has(module.id) ? 'white' : 'var(--text-primary)',
                border: `2px solid ${selectedModules.has(module.id) ? 'var(--accent)' : 'transparent'}`,
              }}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedModules.has(module.id)}
                  onChange={() => handleToggleModule(module.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="mr-4 w-5 h-5 cursor-pointer"
                  style={{
                    accentColor: selectedModules.has(module.id) ? 'white' : 'var(--accent)',
                  }}
                />
                <div>
                  <div className="font-semibold">{module.name}</div>
                  <div className="text-sm opacity-75">{module.code}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || selectedModules.size === 0}
          className="w-full py-3 rounded-lg font-semibold transition disabled:opacity-50"
          style={{
            background: 'var(--primary-gradient)',
            color: 'var(--btn-text)',
          }}
        >
          {submitting ? 'Saving...' : 'Continue to Timetable'}
        </button>
      </div>
    </div>
  );
};

export default ModuleSelection;
