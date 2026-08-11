import React, { memo, useState, useCallback } from 'react';

const PostItem = memo(({ post, isSelected, onSelect, onDelete, onToggleLike, onUpdate, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  // ✅ FIXED: Added e.stopPropagation() to comments and likes
  const handleLike = (e) => { e.stopPropagation(); onToggleLike?.(); };
  const handleEdit = (e) => { e.stopPropagation(); if(onEdit) onEdit(); else setIsEditing(true); };
  const handleDelete = (e) => { e.stopPropagation(); if (window.confirm("Are you sure you want to delete this post?")) onDelete?.(); };
  
  const handleUpdate = useCallback(() => { 
    if (editContent.trim() !== post.content && onUpdate) onUpdate({ content: editContent.trim() }); 
    setIsEditing(false); 
  }, [editContent, onUpdate, post.content]);
  
  const handleCancel = useCallback(() => { 
    setIsEditing(false); 
    setEditContent(post.content); 
  }, [post.content]);

  return (
    <div onClick={onSelect} style={{ 
      background: '#fff', padding: '20px', borderRadius: '12px', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
      border: isSelected ? '2px solid #4299e1' : '1px solid #edf2f7',
      transition: 'all 0.2s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: '0 0 4px 0', color: '#2d3748' }}>{post.title}</h3>
        <span style={{ fontSize: '12px', background: '#edf2f7', padding: '4px 12px', borderRadius: '20px', color: '#4a5568' }}>{post.platform}</span>
      </div>
      
      <div style={{ fontSize: '13px', color: '#718096', margin: '4px 0 12px 0' }}>
        ✍️ {post.author} · 📅 {new Date(post.createdAt).toLocaleDateString()}
      </div>

      {isEditing ? (
        <div style={{ margin: '12px 0' }}>
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} 
            style={{ width: '100%', padding: '12px', border: '2px solid #4299e1', borderRadius: '8px', fontFamily: 'inherit' }} 
            rows={3} autoFocus />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={handleUpdate} style={{ background: '#4299e1', color: '#fff', border: 'none', padding: '6px 20px', borderRadius: '6px', fontWeight: '600' }}>💾 Save</button>
            <button onClick={handleCancel} style={{ background: '#edf2f7', border: 'none', padding: '6px 20px', borderRadius: '6px', fontWeight: '600' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: '12px 0', color: '#4a5568', lineHeight: '1.6' }}>{post.content}</p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #edf2f7' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: post.liked ? '#e53e3e' : '#4a5568', fontWeight: post.liked ? 'bold' : 'normal' }}>
            ❤️ {post.likes}
          </button>
          {/* ✅ FIXED: Added e.stopPropagation() so clicking comments doesn't select the post */}
          <span onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#718096' }}>
            💬 {post.comments}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {onEdit && <button onClick={handleEdit} style={{ background: 'none', border: 'none', color: '#4299e1', cursor: 'pointer', fontWeight: '500' }}>✏️ Edit</button>}
          {onDelete && <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: '500' }}>🗑️ Delete</button>}
        </div>
      </div>
    </div>
  );
});
export default PostItem;