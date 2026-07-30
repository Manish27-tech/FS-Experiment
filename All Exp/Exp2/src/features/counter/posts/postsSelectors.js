import { createSelector } from '@reduxjs/toolkit';
import { postsAdapterSelectors } from './postsSlice';
import { selectActivePlatform } from '../platforms/platformsSlice';
import { selectSearchTerm } from '../ui/uiSlice';

// Basic Selectors
const selectPostsState = (state) => state.posts;
export const { selectAll: selectAllPosts, selectById: selectPostById, selectTotal: selectTotalPosts } = postsAdapterSelectors(selectPostsState);
export const selectSelectedPostId = (state) => state.posts.selectedPostId;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectLastFetched = (state) => state.posts.lastFetched;

// --- MEMOIZED SELECTORS (Experiment 2.2) ---

// 1. Filtered by Platform & Search
export const selectFilteredPosts = createSelector(
  [selectAllPosts, selectActivePlatform, selectSearchTerm],
  (allPosts, activePlatform, searchTerm) => {
    let filtered = allPosts;
    if (activePlatform !== 'All') filtered = filtered.filter(p => p.platform === activePlatform);
    if (searchTerm) filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered;
  }
);

// 2. Total Likes
export const selectTotalLikes = createSelector(
  [selectAllPosts],
  (allPosts) => allPosts.reduce((total, p) => total + p.likes, 0)
);

// 3. Average Likes
export const selectAverageLikes = createSelector(
  [selectTotalLikes, selectTotalPosts],
  (totalLikes, totalPosts) => totalPosts === 0 ? 0 : totalLikes / totalPosts
);

// 4. High Engagement Posts (likes > 30)
export const selectHighEngagementPosts = createSelector(
  [selectAllPosts],
  (allPosts) => allPosts.filter(p => p.likes > 30)
);

// 5. Selected Post Full Data
export const selectSelectedPost = createSelector(
  [selectPostById, selectSelectedPostId],
  (getPostById, selectedId) => selectedId ? getPostById(selectedId) : null
);