// src/components/EventForm.jsx
import React, { useState, useCallback } from 'react';
import '../styles/Dashboard.css';

const EventForm = React.memo(({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter an event title');
      return;
    }
    
    const eventDate = date || new Date().toISOString().split('T')[0];
    
    onAddEvent({
      title: title.trim(),
      date: eventDate,
      time: '12:00',
      color: '#4A90E2'
    });
    
    setTitle('');
    setDate('');
  }, [title, date, onAddEvent]);

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="event-title-input"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="event-date-input"
      />
      <button type="submit" className="add-event-btn">
        ➕ Add Event
      </button>
    </form>
  );
});

EventForm.displayName = 'EventForm';
export default EventForm;