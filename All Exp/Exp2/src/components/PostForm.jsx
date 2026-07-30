import React, { useState, useMemo } from 'react';

const PostForm = ({ onSubmit, onCancel, platforms, editingPost }) => {
  // Prepare safe platform list
  const validPlatforms = useMemo(() => {
    return platforms ? platforms.filter(p => p !== 'All') : [];
  }, [platforms]);
  
  const defaultPlatform = useMemo(() => {
    return validPlatforms.length > 0 ? validPlatforms[0] : '';
  }, [validPlatforms]);

  // Initialize state directly from the prop, or empty values
  const [title, setTitle] = useState(editingPost?.title || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [author, setAuthor] = useState(editingPost?.author || '');
  const [platform, setPlatform] = useState(editingPost?.platform || defaultPlatform);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert("Please fill in all fields!");
      return;
    }
    onSubmit({ 
      title: title.trim(), 
      content: content.trim(), 
      author: author.trim(), 
      platform: platform || defaultPlatform 
    });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
      
      <div style={styles.field}>
        <label style={styles.label}>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} placeholder="Post title..." required />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Content</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} style={styles.textarea} rows="4" placeholder="Post content..." required />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Author</label>
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} style={styles.input} placeholder="Author name..." required />
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Platform</label>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={styles.select} required>
          {validPlatforms.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div style={styles.actions}>
        <button type="submit" style={styles.submitBtn}>{editingPost ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
      </div>
    </form>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  title: { margin: '0 0 8px 0', fontSize: '22px', color: '#1a202c' },
  field: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#4a5568' },
  input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' },
  textarea: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' },
  select: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', backgroundColor: '#fff' },
  actions: { display: 'flex', gap: '12px', marginTop: '8px' },
  submitBtn: { padding: '10px 24px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
  cancelBtn: { padding: '10px 24px', backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' },
};

export default PostForm;