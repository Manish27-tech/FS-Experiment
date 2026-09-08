// src/components/EventItem.jsx
import React, { useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import '../styles/EventItem.css';

const EventItem = React.memo(({ event, onDelete, onEdit }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform,
    isDragging
  } = useDraggable({
    id: event.id,
    data: { event }
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    backgroundColor: event.color || '#4A90E2',
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab'
  };

  // Delete handler
  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Delete this event?')) {
      if (onDelete) {
        onDelete(event.id);
      }
    }
  }, [onDelete, event.id]);

  // Edit handler
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEdit) {
      onEdit(event);
    }
  }, [onEdit, event]);

  return (
    <div
      ref={setNodeRef}
      className="event-item"
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="event-content">
        <span className="event-title">{event.title}</span>
        <div className="event-actions">
          <button 
            className="event-edit" 
            onPointerDown={handleEdit}
            onClick={handleEdit}
            aria-label="Edit event"
          >
            ✏️
          </button>
          <button 
            className="event-delete" 
            onPointerDown={handleDelete}
            onClick={handleDelete}
            aria-label="Delete event"
          >
            ×
          </button>
        </div>
      </div>
      {event.time && (
        <div className="event-time">
          {event.time}
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // CUSTOM COMPARISON - Only re-render if event object reference changes
  return prevProps.event === nextProps.event && 
         prevProps.onDelete === nextProps.onDelete &&
         prevProps.onEdit === nextProps.onEdit;
});

EventItem.displayName = 'EventItem';
export default EventItem;