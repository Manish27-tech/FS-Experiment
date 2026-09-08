// src/components/StatsCards.jsx
import React from 'react';
import '../styles/Dashboard.css';

const StatsCards = React.memo(({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card purple">
        <div className="stat-icon">📊</div>
        <div className="stat-info">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Events</div>
        </div>
      </div>
      
      <div className="stat-card green">
        <div className="stat-icon">✅</div>
        <div className="stat-info">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>
      
      <div className="stat-card yellow">
        <div className="stat-icon">📅</div>
        <div className="stat-info">
          <div className="stat-value">{stats.upcoming}</div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>
      
      <div className="stat-card blue">
        <div className="stat-icon">📌</div>
        <div className="stat-info">
          <div className="stat-value">{stats.todayEvents}</div>
          <div className="stat-label">Today's Events</div>
        </div>
      </div>
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;