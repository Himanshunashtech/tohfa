import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { supabaseApi } from './api/supabaseApi';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { eventBus } from '@/lib/event-bus';

export const store = configureStore({
  reducer: {
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(supabaseApi.middleware).concat((store) => (next) => (action: any) => {
      // Logic for Data Orchestration via Event Bus
      if (action.type.endsWith('fulfilled')) {
        eventBus.log('Data fetched successfully', { action: action.type });
      }
      if (action.type.endsWith('rejected')) {
        eventBus.emit('app:toast', { message: 'Database error occurred', type: 'error' });
      }
      return next(action);
    }),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
