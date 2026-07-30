import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

// Normalized State using Entity Adapter
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState({
  selectedPostId: null,
  loading: false,
  error: null,
  lastFetched: null,
});

// Async Thunks (Mock API calls)
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay
  return [
    { id: '1', title: 'Redux Toolkit Guide', content: 'RTK makes Redux easy.', platform: 'Dev.to', author: 'Jane Doe', createdAt: new Date().toISOString(), likes: 42, comments: 12, liked: false },
    { id: '2', title: 'Entity Adapters', content: 'Normalize your state for performance.', platform: 'Medium', author: 'John Smith', createdAt: new Date(Date.now() - 86400000).toISOString(), likes: 28, comments: 8, liked: false },
    { id: '3', title: 'React Performance', content: 'Memoization and useCallback.', platform: 'Dev.to', author: 'Sarah Lee', createdAt: new Date(Date.now() - 172800000).toISOString(), likes: 56, comments: 15, liked: false },
    { id: '4', title: 'State Management', content: 'Redux, Zustand, and Context API.', platform: 'Hashnode', author: 'Mike Johnson', createdAt: new Date(Date.now() - 259200000).toISOString(), likes: 34, comments: 9, liked: false },
  ];
});

export const addPost = createAsyncThunk('posts/addPost', async (postData) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id: Date.now().toString(), ...postData, createdAt: new Date().toISOString(), likes: 0, comments: 0, liked: false };
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, changes }) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { id, changes };
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return id;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    selectPost: (state, action) => { state.selectedPostId = action.payload; },
    clearSelectedPost: (state) => { state.selectedPostId = null; },
    toggleLike: (state, action) => {
      const post = state.entities[action.payload];
      if (post) { post.likes += post.liked ? -1 : 1; post.liked = !post.liked; }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(addPost.fulfilled, postsAdapter.addOne)
      .addCase(updatePost.fulfilled, (state, action) => {
        postsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload.changes });
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
        if (state.selectedPostId === action.payload) state.selectedPostId = null;
      });
  },
});

export const { selectPost, clearSelectedPost, toggleLike } = postsSlice.actions;
export const postsAdapterSelectors = postsAdapter.getSelectors;
export default postsSlice.reducer;