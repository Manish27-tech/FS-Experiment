import React, { memo } from 'react';
const PlatformFilter = memo(({ platforms, activePlatform, onPlatformChange }) => (
  <div style={{ background: '#fff', padding: '16px', borderRadius: '12px' }}>
    <h4 style={{ margin: '0 0 12px 0' }}>Filter by Platform</h4>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {platforms.map(p => (
        <button key={p} onClick={() => onPlatformChange(p)} style={{ padding: '6px 14px', border: 'none', borderRadius: '6px', background: activePlatform === p ? '#4299e1' : '#edf2f7', color: activePlatform === p ? '#fff' : '#4a5568' }}>{p}</button>
      ))}
    </div>
  </div>
));
export default PlatformFilter;