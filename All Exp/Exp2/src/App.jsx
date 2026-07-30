import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePosts } from './hooks/usePosts';
import PostsList from './components/PostsList';
import PostForm from './components/PostForm';
import PlatformFilter from './components/PlatformFilter';

function App() {
  const {
    filteredPosts, selectedPost, editingPost, totalPosts, totalLikes, averageLikes, highEngagementPosts,
    loading, error, lastFetched, activePlatform, platforms, searchTerm,
    handleFetchPosts, handleAddPost, handleUpdatePost, handleDeletePost, handleSelectPost,
    handleToggleLike, handlePlatformChange, handleSearch, handleClearError,
    handleOpenAddModal, handleOpenEditModal, handleCloseModal
  } = usePosts();

  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const modalMode = useSelector((state) => state.ui.modalMode);

  useEffect(() => {
    handleFetchPosts();
  }, [handleFetchPosts]);

  const handleFormSubmit = (data) => {
    if (modalMode === 'add') {
      handleAddPost(data);
    } else if (modalMode === 'edit' && editingPost) {
      handleUpdatePost(editingPost.id, data);
    }
    handleCloseModal();
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📝 Blog Post Manager</h1>
        <div style={styles.stats}>
          <span>📊 Total: {totalPosts}</span>
          <span>❤️ Likes: {totalLikes}</span>
          <span>📈 Avg: {averageLikes.toFixed(1)}</span>
          <span>🔥 High: {highEngagementPosts.length}</span>
          <span>🕐 {lastFetched ? new Date(lastFetched).toLocaleString() : 'Never'}</span>
        </div>
      </header>

      {error && (
        <div style={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={handleClearError} style={styles.closeBtn}>×</button>
        </div>
      )}

      <div style={styles.mainContent}>
        <aside style={styles.sidebar}>
          <PlatformFilter platforms={platforms} activePlatform={activePlatform} onPlatformChange={handlePlatformChange} />
          <input type="text" placeholder="🔍 Search posts..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} style={styles.searchInput} />
          <button onClick={handleOpenAddModal} style={styles.addBtn}>➕ Add Post</button>
          
          {selectedPost && (
            <div style={styles.selectedPreview}>
              <h4>Selected</h4>
              <p><strong>{selectedPost.title}</strong></p>
              <p style={styles.previewMeta}>{selectedPost.author} · {selectedPost.platform}</p>
              <button onClick={() => handleSelectPost(null)} style={styles.clearBtn}>Clear</button>
              <button onClick={() => handleOpenEditModal(selectedPost.id)} style={styles.editBtnSmall}>✏️ Edit</button>
            </div>
          )}
        </aside>

        <main style={styles.postsContainer}>
          <PostsList
            posts={filteredPosts}
            selectedId={selectedPost?.id}
            onSelectPost={handleSelectPost}
            onDeletePost={handleDeletePost}
            onToggleLike={handleToggleLike}
            onUpdatePost={handleUpdatePost}
            onEditPost={handleOpenEditModal}
            loading={loading}
          />
        </main>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={styles.modalCloseBtn}>×</button>
            <PostForm
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              platforms={platforms}
              // ✅ Pass the full object here. If editing, it has data. If adding, it is null.
              editingPost={modalMode === 'edit' ? editingPost : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', backgroundColor: '#f5f7fa' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  title: { margin: 0, fontSize: '24px', fontWeight: '700', color: '#1a202c' },
  stats: { display: 'flex', gap: '16px', fontSize: '14px', color: '#4a5568', alignItems: 'center', flexWrap: 'wrap' },
  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fed7d7', color: '#c53030', padding: '12px 20px', borderRadius: '8px', marginBottom: '16px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#c53030', fontWeight: 'bold', padding: '0 8px' },
  mainContent: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '16px' },
  searchInput: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  addBtn: { padding: '12px 16px', backgroundColor: '#4299e1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  selectedPreview: { padding: '16px', backgroundColor: '#ebf8ff', borderRadius: '8px', border: '1px solid #bee3f8' },
  previewMeta: { fontSize: '12px', color: '#4a5568', marginTop: '4px' },
  clearBtn: { marginTop: '8px', padding: '4px 12px', background: 'none', border: '1px solid #4299e1', borderRadius: '4px', color: '#4299e1', cursor: 'pointer', fontSize: '12px', marginRight: '6px' },
  editBtnSmall: { marginTop: '8px', padding: '4px 12px', background: '#4299e1', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '12px' },
  postsContainer: { minHeight: '400px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { backgroundColor: '#fff', borderRadius: '12px', padding: '32px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  modalCloseBtn: { position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#4a5568', padding: '0 8px' },
};

export default App;