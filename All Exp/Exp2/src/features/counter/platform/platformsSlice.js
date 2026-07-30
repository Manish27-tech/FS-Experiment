import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  platforms: ['All', 'Dev.to', 'Medium', 'Hashnode', 'FreeCodeCamp'],
  activePlatform: 'All',
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    setActivePlatform: (state, action) => { state.activePlatform = action.payload; },
  },
});

export const { setActivePlatform } = platformsSlice.actions;
export const selectAllPlatforms = (state) => state.platforms.platforms;
export const selectActivePlatform = (state) => state.platforms.activePlatform;
export default platformsSlice.reducer;