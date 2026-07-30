import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalMode: 'add', // 'add' or 'edit'
  editingPostId: null,
  searchTerm: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleModal: (state, action) => { state.isModalOpen = action.payload !== undefined ? action.payload : !state.isModalOpen; },
    setModalMode: (state, action) => { state.modalMode = action.payload; },
    setEditingPostId: (state, action) => { state.editingPostId = action.payload; },
    resetModal: (state) => { state.isModalOpen = false; state.modalMode = 'add'; state.editingPostId = null; },
    setSearchTerm: (state, action) => { state.searchTerm = action.payload; },
  },
});

export const { toggleModal, setModalMode, setEditingPostId, resetModal, setSearchTerm } = uiSlice.actions;
export const selectSearchTerm = (state) => state.ui.searchTerm;
export const selectIsModalOpen = (state) => state.ui.isModalOpen;
export const selectModalMode = (state) => state.ui.modalMode;
export const selectEditingPostId = (state) => state.ui.editingPostId;
export default uiSlice.reducer;