import { createSelector } from 'reselect';
import { postsAdapterSelectors } from './postsSlice';
import { selectActivePlatform } from '../platforms/platformsSlice';
import { selectSearchTerm } from '../ui/uiSlice';

// --- Basic Selectors (Non-memoized) ---
export const selectPostsState = (state) => state.posts;

// Entity adapter selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectTotal: selectTotalPosts,
} = postsAdapterSelectors(selectPostsState);

// Custom selectors
export const selectSelectedPostId = (state) => state.posts.selectedPostId;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectLastFetched = (state) => state.posts.lastFetched;

// --- Memoized Selectors (Derived State) ---

// 1. Filter posts by platform - memoized
export const selectPostsByPlatform = createSelector(
  [selectAllPosts, selectActivePlatform],
  (allPosts, activePlatform) => {
    console.log('🟢 Computing filtered posts...'); // Only runs when inputs change
    if (activePlatform === 'All') return allPosts;
    return allPosts.filter((post) => post.platform === activePlatform);
  }
);

// 2. Filter posts by search term - memoized
export const selectSearchedPosts = createSelector(
  [selectAllPosts, selectSearchTerm],
  (allPosts, searchTerm) => {
    if (!searchTerm) return allPosts;
    const lowerSearch = searchTerm.toLowerCase();
    return allPosts.filter((post) =>
      post.title.toLowerCase().includes(lowerSearch)
    );
  }
);

// 3. Combined filter - platform + search - memoized
export const selectFilteredPosts = createSelector(
  [selectAllPosts, selectActivePlatform, selectSearchTerm],
  (allPosts, activePlatform, searchTerm) => {
    console.log('🔵 Computing combined filter...');
    let filtered = allPosts;
    
    if (activePlatform !== 'All') {
      filtered = filtered.filter((post) => post.platform === activePlatform);
    }
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(lowerSearch)
      );
    }
    
    return filtered;
  }
);

// 4. Total likes - memoized
export const selectTotalLikes = createSelector(
  [selectAllPosts],
  (allPosts) => {
    console.log('🟡 Computing total likes...');
    return allPosts.reduce((total, post) => total + post.likes, 0);
  }
);

// 5. Average likes - memoized
export const selectAverageLikes = createSelector(
  [selectTotalLikes, selectTotalPosts],
  (totalLikes, totalPosts) => {
    console.log('🟠 Computing average likes...');
    return totalPosts === 0 ? 0 : totalLikes / totalPosts;
  }
);

// 6. Most liked post - memoized
export const selectMostLikedPost = createSelector(
  [selectAllPosts],
  (allPosts) => {
    console.log('🔴 Computing most liked post...');
    if (allPosts.length === 0) return null;
    return allPosts.reduce((max, post) => (post.likes > max.likes ? post : max));
  }
);

// 7. Posts grouped by platform - memoized
export const selectPostsGroupedByPlatform = createSelector(
  [selectAllPosts],
  (allPosts) => {
    console.log('🟣 Computing grouped posts...');
    return allPosts.reduce((groups, post) => {
      if (!groups[post.platform]) {
        groups[post.platform] = [];
      }
      groups[post.platform].push(post);
      return groups;
    }, {});
  }
);

// 8. Platform statistics - memoized
export const selectPlatformStats = createSelector(
  [selectAllPosts, selectAllPlatforms],
  (allPosts, platforms) => {
    console.log('🟤 Computing platform stats...');
    const stats = {};
    platforms.forEach((platform) => {
      if (platform === 'All') {
        stats[platform] = {
          count: allPosts.length,
          totalLikes: allPosts.reduce((sum, p) => sum + p.likes, 0),
          avgLikes: allPosts.length === 0 ? 0 : allPosts.reduce((sum, p) => sum + p.likes, 0) / allPosts.length,
        };
      } else {
        const posts = allPosts.filter((p) => p.platform === platform);
        stats[platform] = {
          count: posts.length,
          totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
          avgLikes: posts.length === 0 ? 0 : posts.reduce((sum, p) => sum + p.likes, 0) / posts.length,
        };
      }
    });
    return stats;
  }
);

// 9. Selected post with full data - memoized
export const selectSelectedPost = createSelector(
  [selectPostById, selectSelectedPostId],
  (getPostById, selectedId) => {
    if (!selectedId) return null;
    return getPostById(selectedId);
  }
);

// 10. High engagement posts (likes > 30) - memoized
export const selectHighEngagementPosts = createSelector(
  [selectAllPosts],
  (allPosts) => {
    console.log('📊 Computing high engagement posts...');
    return allPosts.filter((post) => post.likes > 30);
  }
);