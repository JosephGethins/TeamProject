import React, { useEffect, useState } from 'react';
import Timetable from '../components/timetable/Timetable';
import { useAuth } from '../contexts/AuthContext';
import { loadTimetable, modifyTimetableItem } from '../utils/timetableService';

const EditTimetable = () => {
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [locked, setLocked] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadTimetable(user.uid).then((d) => setItems(d?.items || []));
  }, [user]);

  const handleChange = async ({ type, item }) => {
    if (isUpdating) return; 
    setIsUpdating(true);
    setError(null);

    const previousItems = [...items];

    setItems((prev) => {
      if (type === 'add') return [...prev, item];
      if (type === 'update') return prev.map((i) => (i.id === item.id ? item : i));
      if (type === 'delete') return prev.filter((i) => i.id !== item.id);
      return prev;
    });

    try {
      const res = await modifyTimetableItem(type, item);
      if (res?.items) setItems(res.items);
    } catch (err) {
      console.error('Failed to modify timetable item:', err);
      setError(err.message || String(err));
      setItems(previousItems);
      if (user?.uid) loadTimetable(user.uid).then((d) => setItems(d?.items || []));
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}>
        <div className="text-white text-xl">Loading timetable...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}>
        <div className="text-white text-xl">Please sign in to edit your timetable.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-6" style={{ background: 'linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end))' }}>
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl md:text-3xl font-bold">Edit Timetable</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocked((s) => !s)}
              className="px-4 py-2 rounded-lg font-semibold shadow transition"
              style={{ background: 'linear-gradient(to right, var(--primary-start), var(--primary-end))' }}
            >
              {locked ? 'Unlock' : 'Lock'}
            </button>
            <button
              onClick={() => setDeleteMode((s) => !s)}
              className={`px-4 py-2 rounded-lg font-semibold shadow transition`}
              style={{
                background: deleteMode ? 'var(--error-bg)' : 'var(--secondary-bg)',
                color: deleteMode ? 'var(--error-text)' : 'var(--secondary-text)'
              }}
            >
              {deleteMode ? 'Delete mode: ON' : 'Delete mode: OFF'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg p-3 text-sm" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', border: '1px solid var(--error-border)' }}>
            Error: {error}
          </div>
        )}

        <div className="rounded-2xl p-4 overflow-x-auto" style={{ backgroundColor: 'var(--card-bg)' }}>
          <Timetable items={items} onChange={handleChange} locked={locked} deleteMode={deleteMode} />
        </div>
      </div>
    </div>
  );
};

export default EditTimetable;
