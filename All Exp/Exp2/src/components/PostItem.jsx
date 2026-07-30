import React, { memo, useState, useCallback } from 'react';

const PostItem = memo(({
  post,
  isSelected,
  onSelect,
  onDelete,
  onToggleLike,
  onEdit, // New prop specifically for triggering the parent's edit modal
}) => {
  const [isEditingInline, setIsEditingInline] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  // Handle local inline updates
  const handleUpdateInline = useCallback(() => {
    if (editContent.trim() !== post.content) {
      onEdit({ content: editContent.trim() }); // If your parent supports inline editing
    }
    setIsEditingInline(false);
  }, [editContent, onEdit, post.content]);

  const handleCancelEdit = useCallback(() => {
    setIsEditingInline(false);
    setEditContent(post.content);
  }, [post.content]);

  const handleLike = useCallback((e) => {
    e.stopPropagation();
    onToggleLike();
  }, [onToggleLike]);

  // This triggers the Edit Modal in App.jsx
  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    onEdit(post.id); 
  }, [onEdit, post.id]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete();
    }
  }, [onDelete]);

  return (
    <div
      style={{
        ...styles.container,
        ...(isSelected ? styles.selected : {}),
      }}
      onClick={onSelect}
    >
      <div style={styles.header}>
        <h3 style={styles.title}>{post.title}</h3>
        <span style={styles.platform}>{post.platform}</span>
      </div>

      <div style={styles.meta}>
        <span>✍️ {post.author}</span>
        <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {isEditingInline ? (
        <div style={styles.editContainer}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={styles.textarea}
            rows={3}
            autoFocus
          />
          <div style={styles.editActions}>
            <button onClick={handleUpdateInline} style={styles.saveBtn}>💾 Save</button>
            <button onClick={handleCancelEdit} style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={styles.content}>{post.content}</p>
      )}

      <div style={styles.footer}>
        <div style={styles.stats}>
  <button
    onClick={handleLike}
    style={{ ...styles.likeBtn, ...(post.liked ? styles.liked : {}) }}
  >
    ❤️ {post.likes}
  </button>
  <span 
    onClick={(e) => e.stopPropagation()} // This stops the parent "Select" trigger!
    style={{ cursor: 'default' }}
  >
    💬 {post.comments}
  </span>
</div>

        <div style={styles.actions}>
          <button onClick={handleEditClick} style={styles.editBtn}>✏️ Edit</button>
          <button onClick={handleDeleteClick} style={styles.deleteBtn}>🗑️ Delete</button>
        </div>
      </div>
    </div>
  );
});

PostItem.displayName = 'PostItem';

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '16px 20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  },
  selected: {
    borderColor: '#4299e1',
    boxShadow: '0 4px 12px rgba(66,153,225,0.2)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' },
  title: { margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#2d3748' },
  platform: { fontSize: '12px', backgroundColor: '#edf2f7', padding: '2px 10px', borderRadius: '12px', color: '#4a5568' },
  meta: { display: 'flex', gap: '16px', fontSize: '13px', color: '#718096', marginBottom: '8px' },
  content: { margin: '8px 0 12px 0', color: '#4a5568', lineHeight: '1.6' },
  editContainer: { margin: '8px 0 12px 0' },
  textarea: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' },
  editActions: { display: 'flex', gap: '8px', marginTop: '8px' },
  saveBtn: { padding: '4px 16px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  cancelBtn: { padding: '4px 16px', backgroundColor: '#edf2f7', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #edf2f7' },
  stats: { display: 'flex', gap: '16px', fontSize: '14px', color: '#718096' },
  likeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#718096', padding: '0' },
  liked: { color: '#e53e3e', fontWeight: 'bold' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { background: 'none', border: 'none', color: '#4299e1', cursor: 'pointer', fontSize: '13px' },
  deleteBtn: { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '13px' },
};

export default PostItem;