// src/components/CalendarDashboard.jsx
import React, { useState, useMemo, useCallback } from 'react';
import StatsCards from './StatsCards';
import WeekCalendar from './WeekCalendar';
import EventForm from './EventForm';
import EditEventModal from './EditEventModal';
import '../styles/Dashboard.css';

const CalendarDashboard = React.memo(({ 
  events, 
  mode, 
  onToggleMode, 
  onAddEvent, 
  onDeleteEvent,
  onUpdateEvent, 
  onToggleComplete, 
  onMoveEvent,
  wastedRenders,
  parentRenders
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, today, completed, upcoming, thisWeek
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date('2026-09-07'));
  const [editingEvent, setEditingEvent] = useState(null); // For edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Get current time
  const currentTime = useMemo(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, []);

  // Get today's date string
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // ✅ FIXED: Get week days based on currentWeekStart
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      days.push({
        date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
      });
    }
    return days;
  }, [currentWeekStart]);

  // Filter events based on search and filter
  const filteredEvents = useMemo(() => {
    let result = events;
    
    // Search filter
    if (searchQuery) {
      result = result.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    // Filter
    if (filter === 'today') {
      result = result.filter(e => e.date === todayStr);
    } else if (filter === 'completed') {
      result = result.filter(e => e.completed);
    } else if (filter === 'upcoming') {
      result = result.filter(e => e.date >= todayStr && !e.completed);
    } else if (filter === 'thisWeek') {
      const weekDates = weekDays.map(d => d.date);
      result = result.filter(e => weekDates.includes(e.date));
    }
    
    return result;
  }, [events, searchQuery, filter, todayStr, weekDays]);

  // Stats
  const stats = useMemo(() => {
    const total = events.length;
    const completed = events.filter(e => e.completed).length;
    const upcoming = events.filter(e => e.date >= todayStr && !e.completed).length;
    const todayEvents = events.filter(e => e.date === todayStr).length;
    return { total, completed, upcoming, todayEvents };
  }, [events, todayStr]);

  // ✅ FIXED: Navigate weeks
  const handlePrevWeek = useCallback(() => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  // 🆕 Handle Edit Event
  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  }, []);

  const handleSaveEdit = useCallback((updatedEvent) => {
    if (onUpdateEvent) {
      onUpdateEvent(editingEvent.id, updatedEvent);
    }
    handleCloseEditModal();
  }, [editingEvent, onUpdateEvent, handleCloseEditModal]);

  // Get week range string
  const weekRange = useMemo(() => {
    if (weekDays.length > 0) {
      return `Week of ${weekDays[0]?.date} – ${weekDays[6]?.date}`;
    }
    return '';
  }, [weekDays]);

  return (
    <div className="dashboard">
      {/* ========== HEADER ========== */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="calendar-icon">📅</div>
          <h1>Calendar Dashboard</h1>
          <div className="header-date">| {currentTime}</div>
        </div>
        
        <div className="header-right">
          <button 
            className={`mode-btn ${mode === 'optimized' ? 'active' : ''}`}
            onClick={() => mode !== 'optimized' && onToggleMode()}
          >
            ⚡ Optimized
          </button>
          <button 
            className={`mode-btn ${mode === 'non-optimized' ? 'active' : ''}`}
            onClick={() => mode !== 'non-optimized' && onToggleMode()}
          >
            🔴 Non-Optimized
          </button>
          <div className="theme-toggle">
            <span>🌙</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
            <span>☀️</span>
          </div>
        </div>
      </div>

      {/* ========== MODE BANNER ========== */}
      <div className={`mode-banner ${mode}`}>
        {mode === 'optimized' ? (
          <span>✅ Optimized - Total Renders: {parentRenders} (Parent renders only)</span>
        ) : (
          <span>❌ Non-Optimized - Total Wasted Renders: {wastedRenders} (Parent renders: {parentRenders}) ⚠️ Every child re-renders on every interaction!</span>
        )}
      </div>

      {/* ========== STATS CARDS ========== */}
      <StatsCards stats={stats} />

      {/* ========== SEARCH & FILTERS ========== */}
      <div className="search-filter-row">
        <div className="search-box">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >All</button>
          <button 
            className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >Today</button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >Completed</button>
          <button 
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >Upcoming</button>
          <button 
            className={`filter-btn ${filter === 'thisWeek' ? 'active' : ''}`}
            onClick={() => setFilter('thisWeek')}
          >This Week</button>
          
          <div className="view-toggle-group">
            <button className="view-btn active">📅 Calendar</button>
            <button className="view-btn">📋 List</button>
          </div>
        </div>
      </div>

      {/* ========== WEEK CALENDAR ========== */}
      <WeekCalendar 
        weekDays={weekDays}
        weekRange={weekRange}
        events={filteredEvents}
        onDeleteEvent={onDeleteEvent}
        onToggleComplete={onToggleComplete}
        onMoveEvent={onMoveEvent}
        onEditEvent={handleEditEvent}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        mode={mode}
      />

      {/* ========== ADD EVENT FORM ========== */}
      <EventForm onAddEvent={onAddEvent} />

      {/* ========== EDIT EVENT MODAL ========== */}
      {isEditModalOpen && editingEvent && (
        <EditEventModal 
          event={editingEvent}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
});

CalendarDashboard.displayName = 'CalendarDashboard';
export default CalendarDashboard;