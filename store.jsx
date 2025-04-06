// store.js
import { configureStore } from '@reduxjs/toolkit';
import { expensesTrackerApi } from './services/expensesTrackerApi';
import authReducer from './authSlice';

const store = configureStore({
    reducer: {
        [expensesTrackerApi.reducerPath]: expensesTrackerApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(expensesTrackerApi.middleware),
});

export { store };