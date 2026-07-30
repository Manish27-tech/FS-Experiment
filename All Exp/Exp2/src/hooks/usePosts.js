import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPosts, addPost, updatePost, deletePost, selectPost, toggleLike 
} from '../features/posts/postsSlice';
import { 
  selectFilteredPosts, selectSelectedPost, selectTotalLikes, selectAverageLikes, 
  selectHighEngagementPosts, selectPostsLoading, selectPostsError, selectLastFetched,
  selectTotalPosts, selectPostById
} from '../features/posts/postsSelectors';
import { setActivePlatform, selectAllPlatforms, selectActivePlatform } from '../features/platforms/platformsSlice';
import { setSearchTerm, toggleModal, setModalMode, setEditingPostId, resetModal } from '../features/ui/uiSlice';

export const usePosts = () => {
  const dispatch = useDispatch();

  // Basic Selectors
  const filteredPosts = useSelector(selectFilteredPosts);
  const selectedPost = useSelector(selectSelectedPost);
  const totalPosts = useSelector(selectTotalPosts);
  const totalLikes = useSelector(selectTotalLikes);
  const averageLikes = useSelector(selectAverageLikes);
  const highEngagementPosts = useSelector(selectHighEngagementPosts);
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const lastFetched = useSelector(selectLastFetched);
  const platforms = useSelector(selectAllPlatforms);
  const activePlatform = useSelector(selectActivePlatform);
  const searchTerm = useSelector((state) => state.ui.searchTerm);
  
  // ✅ CRITICAL: Return the ID directly so we can look it up safely in the form
  const editingPostId = useSelector((state) => state.ui.editingPostId);
  const editingPost = useSelector((state) => selectPostById(state, editingPostId));

  // Actions
  const handleFetchPosts = useCallback(() => dispatch(fetchPosts()), [dispatch]);
  const handleAddPost = useCallback((data) => dispatch(addPost(data)), [dispatch]);
  const handleUpdatePost = useCallback((id, changes) => dispatch(updatePost({ id, changes })), [dispatch]);
  const handleDeletePost = useCallback((id) => dispatch(deletePost(id)), [dispatch]);
  const handleSelectPost = useCallback((id) => dispatch(selectPost(id)), [dispatch]);
  const handleToggleLike = useCallback((id) => dispatch(toggleLike(id)), [dispatch]);
  const handlePlatformChange = useCallback((platform) => dispatch(setActivePlatform(platform)), [dispatch]);
  const handleSearch = useCallback((term) => dispatch(setSearchTerm(term)), [dispatch]);
  
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
  const handleClearError = useCallback(() => dispatch({ type: 'ui/clearError' }), [dispatch]);

  return {
    filteredPosts, selectedPost, editingPost, editingPostId, totalPosts, totalLikes, averageLikes, highEngagementPosts,
    loading, error, lastFetched, activePlatform, platforms, searchTerm,
    handleFetchPosts, handleAddPost, handleUpdatePost, handleDeletePost, handleSelectPost,
    handleToggleLike, handlePlatformChange, handleSearch, handleClearError,
    handleOpenAddModal, handleOpenEditModal, handleCloseModal
  };
};