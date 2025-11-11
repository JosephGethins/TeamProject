import React, { useEffect, useRef, useState } from 'react';
import Bubble from './Bubble';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const START_HOUR = 9;
const END_HOUR = 18; // exclusive

// Layout constants
const HEADER_HEIGHT = 28; // px
const GUTTER_LEFT = 64; // px for time labels
const GRID_PADDING = 0; // internal padding inside cells

const Timetable = ({ items = [], onChange, hourHeight = 60, locked = false, deleteMode = false }) => {
  const containerRef = useRef(null);
  const [localItems, setLocalItems] = useState(items || []);
  const [colWidth, setColWidth] = useState(180);
  const [dragOverClass, setDragOverClass] = useState('');

  useEffect(() => setLocalItems(items || []), [items]);

  useEffect(() => {
    const handleResize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      // account for left gutter
      const usable = Math.max(200, rect.width - GUTTER_LEFT - 12);
      setColWidth(Math.max(120, usable / DAYS.length));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hourCount = END_HOUR - START_HOUR;
  const gridHeight = hourCount * hourHeight;

  const dayColumnLeft = (dayIndex) => dayIndex * colWidth;

  const posToDayHour = (x, y) => {
    const rect = containerRef.current.getBoundingClientRect();
    const relX = x - rect.left - GUTTER_LEFT; // after gutter
    const relY = y - rect.top - HEADER_HEIGHT; // after header
    const day = Math.floor(relX / colWidth);
    const hourOffset = Math.floor(relY / hourHeight);
    const hour = START_HOUR + hourOffset;
    return { day: Math.max(0, Math.min(DAYS.length - 1, day)), hour: Math.max(START_HOUR, Math.min(END_HOUR - 1, hour)) };
  };

  const addBubbleAt = (clientX, clientY, moduleData = null) => {
    const { day, hour } = posToDayHour(clientX, clientY);
    const newId = `tmp-${Date.now()}`;
    
    if (moduleData) {
      // Adding from sidebar drag - use module data
      const newItem = {
        id: newId,
        title: moduleData.name,
        moduleCode: moduleData.code,
        moduleId: moduleData.id,
        location: '',
        day,
        startHour: hour,
        duration: 1,
        sessionType: 'Lecture', // default to Lecture
      };
      const next = [...localItems, newItem];
      setLocalItems(next);
      onChange && onChange({ type: 'add', item: newItem });
    } else {
      // Manual grid clicks do not create entries; users must drag from the module sidebar
      return;
    }
  };

  const handleGridClick = (e) => {
    // No direct creation via click
    return;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverClass('bg-blue-50');
  };

  const handleDragLeave = () => {
    setDragOverClass('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOverClass('');
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'module-drag' && data.module) {
        addBubbleAt(e.clientX, e.clientY, data.module);
      }
    } catch (err) {
      console.error('Failed to parse drop data:', err);
    }
  };

  const onStartDrag = (item, e) => {
    e.preventDefault();
    item._dragging = true;
  };

  const onDrag = (item, e) => {
    if (!item._dragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - GUTTER_LEFT;
    const relY = e.clientY - rect.top - HEADER_HEIGHT;
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

  // Generic updater (used by session type change, resizing, etc.)
  const updateItem = (updated) => {
    setLocalItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
    onChange && onChange({ type: 'update', item: updated });
  };

  const deleteItem = (id) => {
    setLocalItems((prev) => prev.filter((it) => it.id !== id));
    onChange && onChange({ type: 'delete', item: { id } });
  };

  return (
    <div className="w-full flex gap-4 h-full">
      <div
        className="flex-1 border rounded relative overflow-auto bg-gray-50"
        style={{ height: `${gridHeight + HEADER_HEIGHT}px`, paddingTop: HEADER_HEIGHT, paddingLeft: GUTTER_LEFT, backgroundColor: dragOverClass || 'rgb(249, 250, 251)' }}
        ref={containerRef}
        onClick={handleGridClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header background bar */}
        <div className="absolute left-0 right-0" style={{ top: 0, height: `${HEADER_HEIGHT}px` }} />

        {/* Day column headers (inside padding) */}
        {DAYS.map((d, i) => (
          <div
            key={d}
            style={{ left: `${dayColumnLeft(i)}px`, top: `-${HEADER_HEIGHT}px`, width: `${colWidth}px` }}
            className="absolute text-sm font-medium text-gray-700 text-center"
          >
            {d}
          </div>
        ))}

        {/* Time labels gutter */}
        <div className="absolute" style={{ left: `${-GUTTER_LEFT}px`, top: `0px`, width: `${GUTTER_LEFT - 8}px` }}>
          {Array.from({ length: hourCount }).map((_, hi) => (
            <div key={`label-${hi}`} className="text-xs text-gray-500 h-px" style={{ position: 'absolute', top: `${hi * hourHeight - 6}px`, right: '4px' }}>
              {START_HOUR + hi}:00
            </div>
          ))}
        </div>

        {/* Hour grid lines */}
        {Array.from({ length: hourCount }).map((_, hi) => (
          <div key={`row-${hi}`} style={{ top: `${hi * hourHeight}px` }} className="absolute left-0 right-0 border-t border-gray-200" />
        ))}

        {/* Vertical column separators */}
        {DAYS.map((_, i) => (
          <div
            key={`col-${i}`}
            style={{ left: `${dayColumnLeft(i)}px`, top: 0, bottom: 0, width: `${colWidth}px` }}
            className="absolute pointer-events-none border-r border-gray-200"
          />
        ))}

        {/* Bubbles */}
        {localItems.map((it) => (
          <Bubble
            key={it.id}
            item={it}
            hourHeight={hourHeight}
            startBase={START_HOUR}
            colLeft={dayColumnLeft(it.day || 0)}
            colWidth={colWidth}
            maxDuration={END_HOUR - (it.startHour || START_HOUR)}
            onStartDrag={onStartDrag}
            onDrag={onDrag}
            onEndDrag={onEndDrag}
            onUpdate={updateItem}
            onDelete={deleteItem}
            locked={locked}
            deleteMode={deleteMode}
          />
        ))}
      </div>
    </div>
  );
};

export default Timetable;
