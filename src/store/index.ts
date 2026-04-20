import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from './storage';
import uiReducer from './slices/uiSlice';
import locationReducer from './slices/locationSlice';
import authReducer from './slices/authSlice';
import modalReducer from './slices/modalSlice';
import searchReducer from './slices/searchSlice';

const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['isAuthenticated']
};
// Combine your reducers here
const rootReducer = combineReducers({
    ui: uiReducer,
    location: locationReducer,
    auth: persistReducer(authPersistConfig, authReducer),
    modal: modalReducer,
    search: searchReducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['location',], // Optional: Only persist specific reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types to prevent Redux Toolkit from throwing serialization errors
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;