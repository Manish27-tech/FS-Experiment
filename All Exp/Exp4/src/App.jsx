// src/App.jsx
import React, { useState, useCallback, useMemo } from 'react';
import CalendarDashboard from './components/CalendarDashboard';
import './styles/Dashboard.css';

// Initial events data
const initialEvents = [
  { id: '1', title: 'Design review', date: '2026-09-07', time: '10:00', color: '#FF6B6B', completed: false },
  { id: '2', title: 'Ship v2.3', date: '2026-09-07', time: '16:00', color: '#4ECDC4', completed: false },
  { id: '3', title: '1:1 with Sam', date: '2026-09-07', time: '09:30', color: '#45B7D1', completed: false },
  { id: '4', title: 'Write proposal', date: '2026-09-08', time: '13:00', color: '#96CEB4', completed: false },
  { id: '5', title: 'Sprint planning', date: '2026-09-09', time: '15:00', color: '#FFEAA7', completed: false },
  { id: '6', title: 'Client demo', date: '2026-09-10', time: '10:00', color: '#DDA0DD', completed: false },
  { id: '7', title: 'Grocery run', date: '2026-09-11', time: '11:00', color: '#FF9FF3', completed: false },
];

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [mode, setMode] = useState('optimized'); // 'optimized' or 'non-optimized'
  const [wastedRenders, setWastedRenders] = useState(0);
  const [parentRenders, setParentRenders] = useState(0);

  // ==========================================
  // 🎯 SIMULATION LOGIC
  // ==========================================
  
  const addEvent = useCallback((newEvent) => {
    setEvents(prev => [...prev, { 
      ...newEvent, 
      id: Date.now().toString(),
      completed: false
    }]);
    
    // Simulate renders based on mode
    if (mode === 'optimized') {
      setParentRenders(prev => prev + 1);
    } else {
      setParentRenders(prev => prev + 1);
      setWastedRenders(prev => prev + 20 + Math.floor(Math.random() * 11));
    }
  }, [mode]);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    
    // Simulate renders based on mode
    if (mode === 'optimized') {
      setParentRenders(prev => prev + 1);
    } else {
      setParentRenders(prev => prev + 1);
      setWastedRenders(prev => prev + 20 + Math.floor(Math.random() * 11));
    }
  }, [mode]);

  // 🆕 EDIT EVENT FUNCTIONALITY
  const updateEvent = useCallback((id, updatedEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ));
    
    // Simulate renders based on mode
    if (mode === 'optimized') {
      setParentRenders(prev => prev + 1);
    } else {
      setParentRenders(prev => prev + 1);
      setWastedRenders(prev => prev + 20 + Math.floor(Math.random() * 11));
    }
  }, [mode]);

  const toggleComplete = useCallback((id) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
    
    // Simulate renders based on mode
    if (mode === 'optimized') {
      setParentRenders(prev => prev + 1);
    } else {
      setParentRenders(prev => prev + 1);
      setWastedRenders(prev => prev + 20 + Math.floor(Math.random() * 11));
    }
  }, [mode]);

  const moveEvent = useCallback((id, newDate) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, date: newDate } : event
    ));
    
    // Simulate renders based on mode
    if (mode === 'optimized') {
      setParentRenders(prev => prev + 1);
    } else {
      setParentRenders(prev => prev + 1);
      setWastedRenders(prev => prev + 20 + Math.floor(Math.random() * 11));
    }
  }, [mode]);

  // Toggle mode
  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'optimized' ? 'non-optimized' : 'optimized');
    // Reset counters when switching
    setWastedRenders(0);
    setParentRenders(0);
  }, []);

  return (
    <CalendarDashboard 
      events={events}
      mode={mode}
      onToggleMode={toggleMode}
      onAddEvent={addEvent}
      onDeleteEvent={deleteEvent}
      onUpdateEvent={updateEvent}
      onToggleComplete={toggleComplete}
      onMoveEvent={moveEvent}
      wastedRenders={wastedRenders}
      parentRenders={parentRenders}
    />
  );
}

export default App;