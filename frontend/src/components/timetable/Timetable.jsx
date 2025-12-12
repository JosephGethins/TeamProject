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

  // Check if a time slot is occupied by any existing item (excluding the item being updated)
  const isSlotOccupied = (day, startHour, duration, excludeId = null) => {
    return localItems.some((item) => {
      if (item.id === excludeId) return false; // skip the item being moved/resized
      if (item.day !== day) return false; // different day
      
      const itemEnd = item.startHour + (item.duration || 1);
      const slotEnd = startHour + duration;
      
      // Check if time ranges overlap
      return startHour < itemEnd && slotEnd > item.startHour;
    });
  };

  // Find maximum allowed duration without collision
  const getMaxAllowedDuration = (day, startHour, excludeId = null) => {
    let maxDuration = END_HOUR - startHour; // max possible
    
    for (const item of localItems) {
      if (item.id === excludeId) continue;
      if (item.day !== day) continue;
      if (item.startHour <= startHour) continue; // item is before or at same time
      
      // Item is after our start - limit duration to not overlap
      const gapDuration = item.startHour - startHour;
      maxDuration = Math.min(maxDuration, gapDuration);
    }
    
    return Math.max(1, maxDuration);
  };

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
      // Check if slot is already occupied - silently prevent
      if (isSlotOccupied(day, hour, 1)) {
        return;
      }
      
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
        type: 'Lecture', // default to Lecture
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
    
    // Check if new position would cause overlap - silently revert to original
    if (isSlotOccupied(updatedItem.day, updatedItem.startHour, updatedItem.duration || 1, item.id)) {
      // Revert to original position - reload from items prop or reset
      setLocalItems(items || []);
      return;
    }
    
    setLocalItems((prev) => prev.map((it) => (it.id === item.id ? updatedItem : it)));
    onChange && onChange({ type: 'update', item: updatedItem });
  };

  // Generic updater (used by session type change, resizing, etc.)
  const updateItem = (updated) => {
    // If duration changed, check for collisions
    const original = localItems.find((it) => it.id === updated.id);
    if (original && original.duration !== updated.duration) {
      // Check if resize would cause overlap
      if (isSlotOccupied(updated.day, updated.startHour, updated.duration || 1, updated.id)) {
        // Clamp duration to max allowed
        const maxAllowed = getMaxAllowedDuration(updated.day, updated.startHour, updated.id);
        updated = { ...updated, duration: maxAllowed };
      }
    }
    
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
        className="flex-1 border rounded relative overflow-hidden bg-gray-50"
        style={{ height: `${gridHeight + HEADER_HEIGHT}px`, backgroundColor: dragOverClass || 'rgb(249, 250, 251)' }}
        ref={containerRef}
        onClick={handleGridClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Fixed header row for day labels */}
        <div className="sticky top-0 left-0 right-0 z-30 bg-white border-b border-gray-300" style={{ height: `${HEADER_HEIGHT}px` }}>
          <div className="flex h-full">
            {/* Empty corner cell */}
            <div style={{ width: `${GUTTER_LEFT}px` }} className="border-r border-gray-300 bg-gray-100" />
            {/* Day column headers */}
            {DAYS.map((d, i) => (
              <div
                key={d}
                style={{ width: `${colWidth}px` }}
                className="flex items-center justify-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable content area with time gutter and grid */}
        <div className="relative flex" style={{ height: `${gridHeight}px` }}>
          {/* Time labels gutter (fixed left) */}
          <div className="sticky left-0 top-0 bg-gray-100 border-r border-gray-300 shrink-0" style={{ width: `${GUTTER_LEFT}px` }}>
            {Array.from({ length: hourCount }).map((_, hi) => (
              <div key={`label-${hi}`} className="text-xs text-gray-600 text-right pr-2" style={{ height: `${hourHeight}px`, lineHeight: `${hourHeight}px` }}>
                {START_HOUR + hi}:00
              </div>
            ))}
          </div>

          {/* Grid area with days */}
          <div className="relative flex-1">
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
            {localItems.map((it) => {
              const maxAllowed = getMaxAllowedDuration(it.day || 0, it.startHour || START_HOUR, it.id);
              return (
                <Bubble
                  key={it.id}
                  item={it}
                  hourHeight={hourHeight}
                  startBase={START_HOUR}
                  colLeft={dayColumnLeft(it.day || 0)}
                  colWidth={colWidth}
                  maxDuration={maxAllowed}
                  onStartDrag={onStartDrag}
                  onDrag={onDrag}
                  onEndDrag={onEndDrag}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                  locked={locked}
                  deleteMode={deleteMode}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
