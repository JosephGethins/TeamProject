import React, { useState, useEffect } from 'react';
import { getUserModules, getAllModules } from '../../utils/moduleService';
import { useAuth } from '../../contexts/AuthContext';

const ModuleSidebar = ({ collapsed = false }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadModules = async () => {
      try {
        // Admins get all modules, students get their selected modules
        const data = isAdmin ? await getAllModules() : await getUserModules();
        setModules(data.modules || []);
      } catch (err) {
        console.error('Failed to load modules:', err);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [isAdmin]);

  const handleDragStart = (e, module) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'module-drag',
      module: module,
    }));
  };

  if (collapsed) {
    return (
      <div className="w-16 bg-gray-100 border-r border-gray-200 flex flex-col items-center py-4">
        <div className="text-xs text-gray-600 transform -rotate-90 whitespace-nowrap">MODULES</div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="font-bold text-lg">{isAdmin ? 'All Modules' : 'Your Modules'}</h2>
        <p className="text-xs text-gray-500 mt-1">
          {isAdmin ? 'Drag modules to create timetables' : 'Drag modules to the timetable'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading modules...</div>
        ) : modules.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No modules selected</p>
            <p className="text-xs mt-2">Go to Settings to select modules</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {modules.map((module) => (
              <div
                key={module.id}
                draggable
                onDragStart={(e) => handleDragStart(e, module)}
                className="p-3 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="font-semibold text-sm text-gray-800">{module.name}</div>
                <div className="text-xs text-gray-500">{module.code}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleSidebar;
