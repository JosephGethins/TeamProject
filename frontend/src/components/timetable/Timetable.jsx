import React, { useEffect, useRef, useState } from 'react';
import Bubble from './Bubble';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const START_HOUR = 9;
const END_HOUR = 18; // exclusive

const Timetable = ({ items = [], onChange, hourHeight = 60, locked = false, deleteMode = false }) => {
  const containerRef = useRef(null);
  const [localItems, setLocalItems] = useState(items || []);
  const [colWidth, setColWidth] = useState(180);

  useEffect(() => setLocalItems(items || []), [items]);

  useEffect(() => {
    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setColWidth(Math.max(120, (rect.width - 40) / DAYS.length));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hourCount = END_HOUR - START_HOUR;
  const gridHeight = hourCount * hourHeight;

  const dayColumnLeft = (dayIndex) => 10 + dayIndex * colWidth;

  const posToDayHour = (x, y) => {
    const rect = containerRef.current.getBoundingClientRect();
    const relX = x - rect.left - 10;
    const relY = y - rect.top;
    const day = Math.floor(relX / colWidth);
    const hourOffset = Math.floor(relY / hourHeight);
    const hour = START_HOUR + hourOffset;
    return { day: Math.max(0, Math.min(DAYS.length - 1, day)), hour: Math.max(START_HOUR, Math.min(END_HOUR - 1, hour)) };
  };

  const addBubbleAt = (clientX, clientY) => {
    const { day, hour } = posToDayHour(clientX, clientY);
    // create item and immediately prompt for details
    const newId = `tmp-${Date.now()}`;
    const newItem = { id: newId, title: '', location: '', day, startHour: hour, duration: 1 };
    // open edit dialog immediately
    const title = prompt('Module name:', '');
    if (title === null) return; // cancelled
    const location = prompt('Location:', '');
    if (location === null) return;
    const durationStr = prompt('Duration (hours):', '1');
    if (durationStr === null) return;
    const duration = Math.max(1, Math.min(8, parseInt(durationStr || '1', 10) || 1));
    const final = { ...newItem, title, location, duration };
    const next = [...localItems, final];
    setLocalItems(next);
    onChange && onChange({ type: 'add', item: final });
  };

  const handleGridClick = (e) => {
    if (locked) return;
    if (deleteMode) return; // don't add while in delete mode
    if (e.target.closest('.bubble-ignore')) return; // clicking a bubble
    addBubbleAt(e.clientX, e.clientY);
  };

  const onStartDrag = (item, e) => {
    e.preventDefault();
    item._dragging = true;
  };

  const onDrag = (item, e) => {
    if (!item._dragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - 10;
    const relY = e.clientY - rect.top;
    const day = Math.floor(relX / colWidth);
    const hourOffset = Math.floor(relY / hourHeight);
    const newDay = Math.max(0, Math.min(DAYS.length - 1, day));
    const newHour = START_HOUR + Math.max(0, Math.min(hourCount - 1, hourOffset));
    setLocalItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, day: newDay, startHour: newHour } : it)));
  };

  const onEndDrag = (item) => {
    if (!item._dragging) return;
    item._dragging = false;
    const updatedItem = localItems.find((it) => it.id === item.id) || item;
    setLocalItems((prev) => prev.map((it) => (it.id === item.id ? updatedItem : it)));
    onChange && onChange({ type: 'update', item: updatedItem });
  };

  const editItem = (item) => {
    const title = prompt('Module name:', item.title || '');
    if (title === null) return; // cancelled
    const location = prompt('Location:', item.location || '');
    if (location === null) return;
    const durationStr = prompt('Duration (hours):', String(item.duration || 1));
    if (durationStr === null) return;
    const duration = Math.max(1, Math.min(8, parseInt(durationStr || '1', 10) || 1));
    const updated = { ...item, title, location, duration };
    setLocalItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
    onChange && onChange({ type: 'update', item: updated });
  };

  const deleteItem = (id) => {
    setLocalItems((prev) => prev.filter((it) => it.id !== id));
    onChange && onChange({ type: 'delete', item: { id } });
  };

  return (
    <div className="w-full flex gap-4">
      <div className="w-64">
        <div className="mb-4">
          <div className="text-sm text-gray-600">Click any cell (Mon–Fri, 9:00–18:00) to add a bubble. Double-click a bubble to edit. Drag to move across days/hours.</div>
        </div>
      </div>

      <div className="flex-1 border rounded bg-gray-50 relative overflow-auto" style={{ height: `${gridHeight}px` }} ref={containerRef} onClick={handleGridClick}>
        {/* Column headers */}
        {DAYS.map((d, i) => (
          <div key={d} style={{ left: `${dayColumnLeft(i)}px`, top: '-30px', width: `${colWidth - 10}px` }} className="absolute text-sm font-medium">
            {d}
          </div>
        ))}

        {/* Hour lines and labels */}
        {Array.from({ length: hourCount }).map((_, hi) => (
          <div key={hi} style={{ top: `${hi * hourHeight}px` }} className="absolute left-0 right-0 border-t border-gray-200">
            <div className="absolute -left-20 -mt-2 w-20 text-xs text-gray-500">{START_HOUR + hi}:00</div>
          </div>
        ))}

        {/* Vertical column separators */}
        {DAYS.map((d, i) => (
          <div key={`col-${i}`} style={{ left: `${dayColumnLeft(i) - 6}px`, top: 0, bottom: 0, width: `${colWidth}px` }} className="absolute pointer-events-none border-r border-gray-200" />
        ))}

        {/* Bubbles */}
        {localItems.map((it) => (
          <Bubble key={it.id} item={it} hourHeight={hourHeight} startBase={START_HOUR} colLeft={dayColumnLeft(it.day || 0)} colWidth={colWidth} onStartDrag={onStartDrag} onDrag={onDrag} onEndDrag={onEndDrag} onEdit={editItem} onDelete={deleteItem} locked={locked} deleteMode={deleteMode} />
        ))}
      </div>
    </div>
  );
};

export default Timetable;
