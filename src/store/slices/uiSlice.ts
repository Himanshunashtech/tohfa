import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  activeModals: string[];
  theme: 'light' | 'dark' | 'system';
  adminPerspective: string | null;
  notifications: Array<{ id: string; type: 'info' | 'success' | 'error'; message: string }>;
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModals: [],
  theme: 'system',
  adminPerspective: null,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openModal: (state, action: PayloadAction<string>) => {
      if (!state.activeModals.includes(action.payload)) {
        state.activeModals.push(action.payload);
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.activeModals = state.activeModals.filter(m => m !== action.payload);
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id'>>) => {
      const id = Math.random().toString(36).substr(2, 9);
      state.notifications.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    setAdminPerspective: (state, action: PayloadAction<string | null>) => {
      state.adminPerspective = action.payload;
    },
  },
});

export const { toggleSidebar, openModal, closeModal, addNotification, removeNotification, setAdminPerspective } = uiSlice.actions;
export default uiSlice.reducer;
