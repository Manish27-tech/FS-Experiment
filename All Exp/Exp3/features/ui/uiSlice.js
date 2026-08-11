// src/features/ui/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isModalOpen: false,
  modalMode: 'add', 
  editingPostId: null, 
  searchTerm: '',
  toast: null, // <--- NEW: Holds { type: 'success'|'error', message: '...' }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleModal: (state, action) => { 
      state.isModalOpen = action.payload !== undefined ? action.payload : !state.isModalOpen; 
    },
    setModalMode: (state, action) => { 
      state.modalMode = action.payload; 
    },
    setEditingPostId: (state, action) => { 
      state.editingPostId = action.payload; 
    },
    resetModal: (state) => { 
      state.isModalOpen = false; 
      state.modalMode = 'add'; 
      state.editingPostId = null; 
    },
    setSearchTerm: (state, action) => { 
      state.searchTerm = action.payload; 
    },
    
    // NEW Toast Reducers
    setToast: (state, action) => { 
      state.toast = action.payload; 
    },
    clearToast: (state) => { 
      state.toast = null; 
    },
  },
});

export const { 
  toggleModal, setModalMode, setEditingPostId, resetModal, setSearchTerm, 
  setToast, clearToast // Export new actions
} = uiSlice.actions;

// New Selector
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer;