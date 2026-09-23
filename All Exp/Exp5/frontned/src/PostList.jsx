import React, { useState } from 'react';

const PostList = ({ posts, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [copiedId, setCopiedId] = useState(null);

  const handleEditClick = (post) => {
    setEditingId(post.id);
    setEditContent(post.content);
  };

  const handleSaveClick = (id, platform) => {
    onUpdate(id, { platform, content: editContent });
    setEditingId(null);
  };

  const handleCancelClick = () => {
    setEditingId(null);
  };

  // 👇 Confirm before delete
  const handleDeleteClick = (id) => {
    if (window.confirm("Delete this post permanently?")) {
      onDelete(id);
    }
  };

  // 👇 Copy to clipboard
  const handleCopy = async (post) => {
    try {
      await navigator.clipboard.writeText(post.content);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // 👇 Relative time formatter ("2 minutes ago")
  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const then = new Date(isoString);
    const seconds = Math.floor((Date.now() - then.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return then.toLocaleDateString();
  };

  // 👇 Apply filter + search + sort
  const visiblePosts = posts
    .filter(p => platformFilter === 'All' || p.platform === platformFilter)
    .filter(p => p.content.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime;
    });

  if (posts.length === 0) {
    return (
      <div className="post-list">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Start composing your first post above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list">
      <h2>Recent Posts ({visiblePosts.length})</h2>

      {/* 👇 Search + Filter + Sort bar */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="toolbar-search"
        />
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="toolbar-select"
        >
          <option value="All">All Platforms</option>
          <option value="Twitter">Twitter</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="toolbar-select"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {visiblePosts.length === 0 ? (
        <div className="no-posts">No posts match your filters.</div>
      ) : (
        visiblePosts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-header-left">
                <span className={`platform-badge ${post.platform.toLowerCase()}`}>
                  {post.platform}
                </span>
                {post.createdAt && (
                  <span className="post-time">• {formatRelativeTime(post.createdAt)}</span>
                )}
              </div>
              <div className="post-actions">
                {editingId === post.id ? (
                  <>
                    <button className="action-btn save" onClick={() => handleSaveClick(post.id, post.platform)}>Save</button>
                    <button className="action-btn cancel" onClick={handleCancelClick}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="action-btn copy" onClick={() => handleCopy(post)}>
                      {copiedId === post.id ? '✓ Copied' : 'Copy'}
                    </button>
                    <button className="action-btn edit" onClick={() => handleEditClick(post)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDeleteClick(post.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
            
            <div className="post-body">
              {editingId === post.id ? (
                <textarea 
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows="4"
                  className="edit-textarea"
                />
              ) : (
                <p>{post.content}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;