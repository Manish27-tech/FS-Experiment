import React, { useState, useEffect } from 'react';

const PostForm = ({ onSubmit, onCancel, platforms, editingPost }) => {
  const [title, setTitle] = useState(''); const [content, setContent] = useState(''); const [author, setAuthor] = useState('');
  const validPlatforms = platforms ? platforms.filter(p => p !== 'All') : [];
  const [platform, setPlatform] = useState(validPlatforms[0] || '');

  useEffect(() => {
    if (editingPost) { setTitle(editingPost.title); setContent(editingPost.content); setAuthor(editingPost.author); setPlatform(editingPost.platform); }
    else { setTitle(''); setContent(''); setAuthor(''); }
  }, [editingPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return alert("Please fill all fields!");
    onSubmit({ title: title.trim(), content: content.trim(), author: author.trim(), platform });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ margin: '0 0 8px 0' }}>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
      <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', minHeight: '80px' }} required />
      <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }} required />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        {validPlatforms.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button type="submit" style={{ padding: '10px 24px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '6px' }}>{editingPost ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 24px', background: '#edf2f7', border: 'none', borderRadius: '6px' }}>Cancel</button>
      </div>
    </form>
  );
};
export default PostForm;