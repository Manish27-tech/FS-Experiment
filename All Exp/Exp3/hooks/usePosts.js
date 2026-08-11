import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, addPost, updatePost, deletePost, selectPost, toggleLike } from '../features/posts/postsSlice';
import { selectAllPlatforms, selectActivePlatform, setActivePlatform } from '../features/platforms/platformsSlice';
import { setSearchTerm, toggleModal, setModalMode, setEditingPostId, resetModal, setToast } from '../features/ui/uiSlice';

export const usePosts = () => {
  const dispatch = useDispatch();
  
  // Compute Filtered Posts inside the hook
  const filteredPosts = useSelector(state => {
    const allPosts = Object.values(state.posts.entities);
    const activePlatform = state.platforms.activePlatform;
    const searchTerm = state.ui.searchTerm;
    let filtered = allPosts;
    if (activePlatform !== 'All') filtered = filtered.filter(p => p.platform === activePlatform);
    if (searchTerm) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  });
  
  // Selectors
  const selectedPost = useSelector(state => state.posts.entities[state.posts.selectedPostId]);
  const totalPosts = useSelector(state => Object.keys(state.posts.entities).length);
  const totalLikes = useSelector(state => Object.values(state.posts.entities).reduce((sum, p) => sum + p.likes, 0));
  const averageLikes = totalPosts === 0 ? 0 : totalLikes / totalPosts;
  const highEngagementPosts = useSelector(state => Object.values(state.posts.entities).filter(p => p.likes > 30));
  const loading = useSelector(state => state.posts.loading);
  const error = useSelector(state => state.posts.error);
  const lastFetched = useSelector(state => state.posts.lastFetched);
  const platforms = useSelector(selectAllPlatforms);
  const activePlatform = useSelector(selectActivePlatform);
  const searchTerm = useSelector(state => state.ui.searchTerm);
  
  // FIX: Get the editingPostId directly from Redux for the Edit bug fix
  const editingPostId = useSelector((state) => state.ui.editingPostId);
  const editingPost = useSelector((state) => state.posts.entities[editingPostId]);

  // Actions
  const handleFetchPosts = useCallback(() => dispatch(fetchPosts()), [dispatch]);
  
  const handleAddPost = useCallback((data) => {
    dispatch(addPost(data));
    dispatch(setToast({ type: 'success', message: '✅ Post added successfully!' }));
    dispatch(resetModal()); 
  }, [dispatch]);

  const handleUpdatePost = useCallback((id, changes) => {
    dispatch(updatePost({ id, changes }));
    dispatch(setToast({ type: 'success', message: '✏️ Post updated successfully!' }));
    dispatch(resetModal());
  }, [dispatch]);

  const handleDeletePost = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(id));
      dispatch(setToast({ type: 'error', message: '🗑️ Post deleted successfully!' }));
    }
  }, [dispatch]);

  const handleSelectPost = useCallback((id) => dispatch(selectPost(id)), [dispatch]);
  const handleToggleLike = useCallback((id) => dispatch(toggleLike(id)), [dispatch]);
  const handlePlatformChange = useCallback((platform) => dispatch(setActivePlatform(platform)), [dispatch]);
  const handleSearch = useCallback((term) => dispatch(setSearchTerm(term)), [dispatch]);
  const handleClearError = useCallback(() => dispatch({ type: 'ui/clearError' }), [dispatch]);
  
  const handleOpenAddModal = useCallback(() => { 
    dispatch(setEditingPostId(null)); 
    dispatch(setModalMode('add')); 
    dispatch(toggleModal(true)); 
  }, [dispatch]);

  const handleOpenEditModal = useCallback((id) => { 
    dispatch(setEditingPostId(id)); 
    dispatch(setModalMode('edit')); 
    dispatch(toggleModal(true)); 
  }, [dispatch]);

  const handleCloseModal = useCallback(() => dispatch(resetModal()), [dispatch]);

  return {
    filteredPosts, selectedPost, editingPost, editingPostId, totalPosts, totalLikes, averageLikes, 
    highEngagementPosts, loading, error, lastFetched, activePlatform, platforms, searchTerm,
    handleFetchPosts, handleAddPost, handleUpdatePost, handleDeletePost, handleSelectPost,
    handleToggleLike, handlePlatformChange, handleSearch, handleClearError,
    handleOpenAddModal, handleOpenEditModal, handleCloseModal
  };
};