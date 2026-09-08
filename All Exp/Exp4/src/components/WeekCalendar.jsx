// src/components/WeekCalendar.jsx
import React, { useMemo, useCallback } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import '../styles/Dashboard.css';

const WeekCalendar = React.memo(({ 
  weekDays,
  weekRange, 
  events, 
  onDeleteEvent, 
  onToggleComplete, 
  onMoveEvent,
  onEditEvent,
  onPrevWeek,
  onNextWeek,
  mode
}) => {
  // Group events by date
  const eventsByDate = useMemo(() => {
    const map = {};
    weekDays.forEach(day => {
      map[day.date] = events.filter(e => e.date === day.date);
    });
    return map;
  }, [weekDays, events]);

  // Handle drag end
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active && over) {
      const eventId = active.id;
      const newDate = over.id;
      
      if (onMoveEvent) {
        onMoveEvent(eventId, newDate);
      }
    }
  }, [onMoveEvent]);

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="week-calendar">
        <div className="week-navigation">
          <button className="nav-btn-week" onClick={onPrevWeek}>‹ Prev</button>
          <div className="week-title">{weekRange}</div>
          <button className="nav-btn-week" onClick={onNextWeek}>Next ›</button>
        </div>

        <div className="week-grid">
          {weekDays.map(day => (
            <DayColumn
              key={day.date}
              day={day}
              events={eventsByDate[day.date] || []}
              onDeleteEvent={onDeleteEvent}
              onToggleComplete={onToggleComplete}
              onEditEvent={onEditEvent}
              mode={mode}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
});

// Individual Day Column
const DayColumn = React.memo(({ day, events, onDeleteEvent, onToggleComplete, onEditEvent, mode }) => {
  const { setNodeRef } = useDroppable({
    id: day.date,
    data: { date: day.date }
  });

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const isToday = day.date === todayStr;

  return (
    <div 
      ref={setNodeRef}
      className={`day-column ${isToday ? 'today' : ''}`}
    >
      <div className="day-header">
        <div className="day-name">{day.dayName}</div>
        <div className="day-date">{day.fullDate}</div>
      </div>
      
      <div className="day-events-list">
        {events.map(event => (
          <EventCard 
            key={event.id}
            event={event}
            onDeleteEvent={onDeleteEvent}
            onToggleComplete={onToggleComplete}
            onEditEvent={onEditEvent}
            mode={mode}
          />
        ))}
        {events.length === 0 && (
          <div className="empty-day">No events</div>
        )}
      </div>
    </div>
  );
});

// Individual Event Card (With Edit)
const EventCard = React.memo(({ event, onDeleteEvent, onToggleComplete, onEditEvent, mode }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: { event }
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    backgroundColor: event.color || '#4A90E2',
    opacity: event.completed ? 0.6 : 1
  };

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Delete this event?')) {
      onDeleteEvent(event.id);
    }
  }, [onDeleteEvent, event.id]);

  const handleToggleComplete = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleComplete(event.id);
  }, [onToggleComplete, event.id]);

  // 🆕 Handle Edit Click
  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onEditEvent) {
      onEditEvent(event);
    }
  }, [onEditEvent, event]);

  return (
    <div
      ref={setNodeRef}
      className="event-card"
      style={style}
      {...listeners}
      {...attributes}
    >
      <div className="event-content">
        <div className="event-title-row">
          {/* 🆕 Click on title to edit */}
          <span 
            className={`event-title ${event.completed ? 'completed' : ''}`}
            onClick={handleEdit}
            style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '2px' }}
            title="Click to edit"
          >
            {event.title}
          </span>
          <button className="event-delete" onPointerDown={handleDelete} onClick={handleDelete}>×</button>
        </div>
        <div className="event-time">{event.time}</div>
      </div>
      <button 
        className="event-complete" 
        onPointerDown={handleToggleComplete}
        onClick={handleToggleComplete}
        title={event.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {event.completed ? '✓' : '○'}
      </button>
    </div>
  );
});

EventCard.displayName = 'EventCard';
DayColumn.displayName = 'DayColumn';
WeekCalendar.displayName = 'WeekCalendar';

export default WeekCalendar;