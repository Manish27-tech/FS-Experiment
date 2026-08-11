import React, { memo } from 'react';
import PostItem from './PostItem';
const PostsList = memo(({ posts, selectedId, onSelectPost, onDeletePost, onToggleLike, onUpdatePost, onEditPost, loading, emptyMessage = 'No posts available' }) => {
  if (loading) return <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px' }}>📡 Loading...</div>;
  if (!posts || posts.length === 0) return <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', color: '#718096' }}>{emptyMessage}</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {posts.map(post => (
        <PostItem key={post.id} post={post} isSelected={post.id === selectedId}
          onSelect={() => onSelectPost(post.id)} onDelete={() => onDeletePost?.(post.id)} onToggleLike={() => onToggleLike(post.id)}
          onEdit={() => onEditPost?.(post.id)} onUpdate={(changes) => onUpdatePost?.(post.id, changes)}
        />
      ))}
    </div>
  );
});
export default PostsList;