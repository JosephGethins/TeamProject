import React, { useRef, useEffect, useState } from 'react';

const TYPES = ['Lecture', 'Lab', 'Tutorial'];

const Bubble = ({
  item,
  hourHeight,
  colLeft = 0,
  colWidth = 150,
  startBase = 9,
  maxDuration = 8,
  onStartDrag,
  onDrag,
  onEndDrag,
  onUpdate,
  onDelete,
  locked,
  deleteMode = false,
}) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const RESIZE_ZONE_PX = 12; // bottom zone that initiates resize anywhere across width
  
  // Color styles per type (list all classes for Tailwind safelist)
  const typeStyles = {
    Lecture: {
      container: 'bg-blue-50 border border-blue-300',
      button: 'bg-blue-500 hover:bg-blue-600',
      pill: 'bg-blue-200',
    },
    Lab: {
      container: 'bg-green-50 border border-green-300',
      button: 'bg-green-600 hover:bg-green-700',
      pill: 'bg-green-200',
    },
    Tutorial: {
      container: 'bg-purple-50 border border-purple-300',
      button: 'bg-purple-600 hover:bg-purple-700',
      pill: 'bg-purple-200',
    },
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlePointerDown = (e) => {
      if (locked) return;
      // Ignore if clicking on buttons
      if (e.target.closest('button')) return;
      e.preventDefault();
      // Start resizing if click is within bottom zone anywhere or on explicit handle; else drag-move
      const elRect = ref.current?.getBoundingClientRect();
      const yWithin = elRect ? e.clientY - elRect.top : 0;
      const isBottomZone = elRect ? (elRect.height - yWithin) <= RESIZE_ZONE_PX : false;
      const isHandle = e.target.closest?.('.resize-handle');
      if (isHandle || isBottomZone) {
        setResizing(true);
      } else {
        setDragging(true);
        onStartDrag(item, e);
      }
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
    };

    const handlePointerMove = (e) => {
      if (dragging) {
        onDrag(item, e);
      } else if (resizing) {
        // compute new duration based on pointer Y relative to top
        const rect = el.getBoundingClientRect();
        const relY = e.clientY - rect.top;
        const slots = Math.max(1, Math.ceil(relY / hourHeight));
        const clamped = Math.max(1, Math.min(maxDuration, slots));
        if (clamped !== (item.duration || 1)) {
          onUpdate && onUpdate({ ...item, duration: clamped });
        }
      }
    };

    const handlePointerUp = (e) => {
      if (dragging) {
        setDragging(false);
        onEndDrag(item, e);
      }
      if (resizing) {
        setResizing(false);
      }
      try {
        el.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    el.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, resizing, locked, item, onStartDrag, onDrag, onEndDrag, onUpdate, hourHeight, maxDuration]);

  // Positioning: top relative to startBase and left relative to day column
  const startHour = Number(item.startHour || startBase);
  const top = (startHour - startBase) * hourHeight;
  const height = Math.max(1, (item.duration || 1)) * hourHeight - 4; // small gap
  const left = colLeft + 8; // padding inside column
  const width = Math.max(40, colWidth - 16);
  const sessionType = item.sessionType || 'Lecture';
  const styles = typeStyles[sessionType] || typeStyles.Lecture;

  // Remove double-click text editing; bubbles are not directly editable

  const handleClick = (e) => {
    if (deleteMode) {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm(`Delete ${item.title || 'this item'}?`)) {
        onDelete && onDelete(item.id);
      }
    }
  };

  const cycleType = () => {
    const curr = item.sessionType || 'Lecture';
    const idx = TYPES.indexOf(curr);
    const next = TYPES[(idx + 1) % TYPES.length];
    onUpdate && onUpdate({ ...item, sessionType: next });
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={`bubble-ignore absolute rounded-lg shadow p-2 cursor-move select-none ${styles.container} ${locked ? 'opacity-80' : 'opacity-100'}`}
      style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px`, zIndex: dragging ? 50 : 10 }}
      title={`${item.title || 'Untitled'} — ${item.location || ''}`}
    >
      <div className="font-semibold text-sm truncate">{item.moduleCode || item.title || 'Untitled'}</div>
      <div className="text-xs text-gray-600">{item.location || ''}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-500">{item.duration || 1}h</span>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); cycleType(); }}
          title="Click to change session type"
          className={`text-xs text-white rounded px-2 py-0.5 ${styles.button}`}
        >
          {sessionType}
        </button>
      </div>

      {/* Resize handle at bottom */}
      <div
        className="resize-handle absolute left-0 right-0 bottom-0 cursor-ns-resize z-20"
        style={{ background: 'transparent', height: RESIZE_ZONE_PX }}
      >
        <div className="mx-auto w-14 h-1.5 bg-gray-300 rounded-full my-0.5" />
      </div>

      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete && onDelete(item.id); }} className="absolute right-2 top-1 text-xs bg-red-500 text-white rounded px-2 py-0.5 hover:bg-red-600">Del</button>
    </div>
  );
};

export default Bubble;
