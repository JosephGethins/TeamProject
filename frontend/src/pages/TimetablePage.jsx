import React, { useEffect, useState, useCallback } from 'react';
import Timetable from '../components/timetable/Timetable';
import ModuleSidebar from '../components/timetable/ModuleSidebar';
import { useAuth } from '../contexts/AuthContext';
import { loadTimetable, modifyTimetableItem } from '../utils/timetableService';

const EditTimetable = () => {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [locked, setLocked] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchTimetable = useCallback(async () => {
    if (!user) return;
    try {
      const data = await loadTimetable(user.uid);
      setItems(data?.items ?? []);
    } catch {
      setError('Failed to load timetable. Please try again later.');
    }
  }, [user]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const handleChange = useCallback(
    async ({ type, item }) => {
      if (isUpdating) return;

      setIsUpdating(true);
      setError(null);
      const previousItems = [...items];
      
      setItems((prev) => {
        switch (type) {
          case 'add': return [...prev, item];
          case 'update': return prev.map((i) => (i.id === item.id ? item : i));
          case 'delete': return prev.filter((i) => i.id !== item.id);
          default: return prev;
        }
      });

      try {
        const res = await modifyTimetableItem(type, item);
        if (res?.items) setItems(res.items);
      } catch (err) {
        console.error('Failed to modify timetable item:', err);
        setItems(previousItems);
        setError('Could not update timetable. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    },
    [items, isUpdating]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)]">
        <div className="text-white text-xl">Loading timetable...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)]">
        <div className="text-white text-xl">Please sign in to edit your timetable.</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ModuleSidebar collapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                disabled={isUpdating}
                className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                {sidebarCollapsed ? '→' : '←'}
              </button>
              <h2 className="text-xl font-bold">Edit Timetable</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLocked((s) => !s)}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg font-semibold shadow transition bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] disabled:opacity-50"
              >
                {locked ? 'Unlock' : 'Lock'}
              </button>
              <button
                onClick={() => setDeleteMode((s) => !s)}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-lg font-semibold shadow transition disabled:opacity-50 ${
                  deleteMode
                    ? 'bg-[var(--error-bg)] text-[var(--error-text)]'
                    : 'bg-[var(--secondary-bg)] text-[var(--secondary-text)]'
                }`}
              >
                {deleteMode ? 'Delete mode: ON' : 'Delete mode: OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Timetable content */}
        <div className="flex-1 overflow-auto p-4">
          {error && (
            <div className="mb-4 rounded-lg p-3 text-sm border border-[var(--error-border)] bg-[var(--error-bg)] text-[var(--error-text)]">
              {error}
            </div>
          )}
          <div className="rounded-2xl p-4 overflow-x-auto h-full bg-[var(--card-bg)]">
            <Timetable
              items={items}
              onChange={handleChange}
              locked={locked}
              deleteMode={deleteMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTimetable;
