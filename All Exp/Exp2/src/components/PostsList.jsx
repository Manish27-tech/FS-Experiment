import React, { memo } from 'react';
import PostItem from './PostItem';

const PostsList = memo(({
  posts,
  selectedId,
  onSelectPost,
  onDeletePost,
  onToggleLike,
  onUpdatePost,
  onEditPost, // New prop to handle opening Edit Modal
  loading,
  emptyMessage = 'No posts available',
}) => {
  if (loading) {
    return <div style={styles.loading}>📡 Loading posts...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div style={styles.empty}>{emptyMessage}</div>;
  }

  return (
    <div style={styles.container}>
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          isSelected={post.id === selectedId}
          onSelect={() => onSelectPost(post.id)}
          onDelete={() => onDeletePost(post.id)}
          onToggleLike={() => onToggleLike(post.id)}
          onEdit={() => onEditPost(post.id)} // Pass the edit trigger
          onUpdate={(changes) => onUpdatePost(post.id, changes)}
        />
      ))}
    </div>
  );
});

PostsList.displayName = 'PostsList';

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '12px' },
  loading: { textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px' },
  empty: { textAlign: 'center', padding: '40px', backgroundColor: '#fff', borderRadius: '12px', color: '#718096' },
};

export default PostsList;