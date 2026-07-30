import React, { memo } from 'react';

const PlatformFilter = memo(({
  platforms,
  activePlatform,
  onPlatformChange,
}) => {
  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Filter by Platform</h4>
      <div style={styles.buttonGroup}>
        {platforms.map((platform) => (
          <button
            key={platform}
            onClick={() => onPlatformChange(platform)}
            style={{
              ...styles.button,
              ...(activePlatform === platform ? styles.active : {}),
            }}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
});

PlatformFilter.displayName = 'PlatformFilter';

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  title: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4a5568',
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  button: {
    padding: '6px 14px',
    backgroundColor: '#edf2f7',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#4a5568',
    transition: 'all 0.2s',
  },
  active: {
    backgroundColor: '#4299e1',
    color: '#fff',
    fontWeight: '500',
  },
};

export default PlatformFilter;