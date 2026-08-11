import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { usePosts } from '../hooks/usePosts';
import Navbar from '../components/Navbar';
import PostsList from '../components/PostsList';
import PostForm from '../components/PostForm';
import PlatformFilter from '../components/PlatformFilter';

const Dashboard = () => {
  const user = useSelector(selectUser);
  
  const {
    filteredPosts, selectedPost, editingPost, 
    totalPosts, totalLikes, averageLikes, highEngagementPosts, 
    platforms, activePlatform, searchTerm,
    handleFetchPosts, handleAddPost, handleUpdatePost, handleDeletePost, handleSelectPost, 
    handleToggleLike, handlePlatformChange, handleSearch, 
    handleOpenAddModal, handleCloseModal, handleOpenEditModal
  } = usePosts();

  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const modalMode = useSelector((state) => state.ui.modalMode);

  useEffect(() => { handleFetchPosts(); }, []);

  // 🛑 STRICT RBAC RULES (Expt 3.2)
  const canCreate = user?.role === 'admin' || user?.role === 'editor';
  const canEdit   = user?.role === 'admin' || user?.role === 'editor';
  const canDelete = user?.role === 'admin';

  return (
    <div>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', padding: '20px', backgroundColor: '#f7fafc', minHeight: '100vh' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <PlatformFilter platforms={platforms} activePlatform={activePlatform} onPlatformChange={handlePlatformChange} />
          </div>
          
          <div style={{ background: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <input type="text" placeholder="🔍 Search posts..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
          </div>
          
          {canCreate && <button onClick={handleOpenAddModal} style={{ width: '100%', padding: '12px', background: '#4299e1', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '16px', boxShadow: '0 4px 6px rgba(66,153,225,0.3)' }}>➕ Add New Post</button>}
          
          {selectedPost && (
            <div style={{ padding: '16px', background: '#ebf8ff', borderRadius: '12px', border: '1px solid #bee3f8' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#2b6cb0' }}>📌 Selected Post</h4>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: '14px' }}>{selectedPost.title}</p>
              <button onClick={() => handleSelectPost(null)} style={{ marginTop: '8px', border: '1px solid #4299e1', borderRadius: '6px', padding: '4px 12px', background: 'transparent', color: '#4299e1', cursor: 'pointer' }}>Clear</button>
            </div>
          )}
          
          <div style={{ padding: '16px', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#4a5568' }}>📊 Analytics</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4a5568', padding: '4px 0' }}><span>Total Posts</span><span style={{ fontWeight: 'bold' }}>{totalPosts}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4a5568', padding: '4px 0' }}><span>Total Likes</span><span style={{ fontWeight: 'bold' }}>❤️ {totalLikes}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4a5568', padding: '4px 0' }}><span>Avg Likes</span><span style={{ fontWeight: 'bold' }}>{averageLikes.toFixed(1)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4a5568', padding: '4px 0' }}><span>🔥 High Engagement</span><span style={{ fontWeight: 'bold' }}>{highEngagementPosts.length}</span></div>
          </div>
        </aside>

        <main>
          <PostsList
            posts={filteredPosts}
            selectedId={selectedPost?.id}
            onSelectPost={handleSelectPost}
            onDeletePost={canDelete ? handleDeletePost : null} 
            onToggleLike={handleToggleLike}
            onUpdatePost={canEdit ? handleUpdatePost : null}
            onEditPost={canEdit ? handleOpenEditModal : null}
            loading={false}
          />
        </main>
      </div>

      {/* FIX: Pass 'editingPost' to the form, NOT 'selectedPost' to fix the Edit Bug */}
      {isModalOpen && canCreate && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={handleCloseModal}>
          <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#a0aec0' }}>×</button>
            <PostForm
              onSubmit={modalMode === 'add' ? handleAddPost : (data) => handleUpdatePost(editingPost?.id, data)}
              onCancel={handleCloseModal}
              platforms={platforms}
              editingPost={modalMode === 'edit' ? editingPost : null}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;