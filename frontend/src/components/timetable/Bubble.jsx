import React, { useRef, useEffect, useState } from 'react';

const Bubble = ({ item, hourHeight, colLeft = 0, colWidth = 150, startBase = 9, onStartDrag, onDrag, onEndDrag, onEdit, onDelete, locked, deleteMode=false }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlePointerDown = (e) => {
      if (locked) return;
      e.preventDefault();
      setDragging(true);
      onStartDrag(item, e);
      try { el.setPointerCapture(e.pointerId); } catch {}
    };

    const handlePointerMove = (e) => {
      if (!dragging) return;
      onDrag(item, e);
    };

    const handlePointerUp = (e) => {
      if (!dragging) return;
      setDragging(false);
      onEndDrag(item, e);
      try { el.releasePointerCapture(e.pointerId); } catch (err) {}
    };

    el.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, locked, item, onStartDrag, onDrag, onEndDrag]);

  // Positioning: top relative to startBase and left relative to day column
  const startHour = Number(item.startHour || startBase);
  const top = (startHour - startBase) * hourHeight;
  const height = Math.max(1, (item.duration || 1)) * hourHeight - 4; // small gap
  const left = colLeft + 6; // padding inside column
  const width = Math.max(40, colWidth - 12);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(item);
  };

  const handleClick = (e) => {
    if (deleteMode) {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm(`Delete ${item.title || 'this item'}?`)) {
        onDelete && onDelete(item.id);
      }
    }
  };

  return (
    <div
      ref={ref}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
      className={`bubble-ignore absolute bg-white rounded-lg shadow p-2 cursor-move select-none ${locked ? 'opacity-80' : 'opacity-100'}`}
      style={{ top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px`, zIndex: dragging ? 50 : 10 }}
      title={`${item.title || 'Untitled'} — ${item.location || ''}`}
    >
      <div className="font-semibold text-sm truncate">{item.title || 'Untitled'}</div>
      <div className="text-xs text-gray-500">{item.location || ''}</div>
      <div className="text-xs text-gray-400 mt-1">{item.duration || 1}h</div>
      {!deleteMode && (
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete && onDelete(item.id); }} className="absolute right-2 top-1 text-xs bg-red-500 text-white rounded px-2 py-0.5">Del</button>
      )}
    </div>
  );
};

export default Bubble;
