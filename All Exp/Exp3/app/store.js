import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import platformsReducer from '../features/platforms/platformsSlice';
import uiReducer from '../features/ui/uiSlice';
import authReducer from '../features/auth/authSlice'; // NEW

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    ui: uiReducer,
    auth: authReducer, // Add auth
  },
});