import React, { useEffect, useState } from 'react';
import Timetable from '../components/timetable/Timetable';
import { useAuth } from '../contexts/AuthContext';
import { loadTimetable, saveTimetable, modifyTimetableItem } from '../utils/timetableService';

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
			if (isUpdating) return; // Prevent concurrent modifications
			setIsUpdating(true);
			setError(null);

			// Store previous state for rollback
			const previousItems = [...items];

			// Optimistically update UI
			setItems((prev) => {
				if (type === 'add') return [...prev, item];
				if (type === 'update') return prev.map((i) => (i.id === item.id ? item : i));
				if (type === 'delete') return prev.filter((i) => i.id !== item.id);
				return prev;
			});

			try {
				console.log('Modifying timetable:', { type, item });
				const res = await modifyTimetableItem(type, item);
				console.log('Server response:', res);
				
				if (res?.items) {
					// Update with server response
					setItems(res.items);
				}
			} catch (err) {
				console.error('Failed to modify timetable item:', err);
				setError(err.message || String(err));
				// Rollback to previous state
				setItems(previousItems);
				// Reload from server to ensure consistency
				if (user?.uid) {
					loadTimetable(user.uid).then((d) => setItems(d?.items || []));
				}
			} finally {
				setIsUpdating(false);
			}
		};

	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Please sign in to edit your timetable.</div>;

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-bold">Edit Timetable</h2>
				<div>
					<button onClick={() => setLocked((s) => !s)} className="btn-secondary mr-2">{locked ? 'Unlock' : 'Lock'}</button>
					<button onClick={() => setDeleteMode((s) => !s)} className={`mr-2 px-3 py-1 rounded ${deleteMode ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>{deleteMode ? 'Delete mode: ON' : 'Delete mode: OFF'}</button>
				</div>
			</div>

			{error && <div className="mb-4 text-red-600">Error: {error}</div>}
			<Timetable items={items} onChange={handleChange} locked={locked} deleteMode={deleteMode} />
		</div>
	);
};

export default EditTimetable;

