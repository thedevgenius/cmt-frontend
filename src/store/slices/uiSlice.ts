import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    isSiteLoading: boolean;
    isAuthModalOpen: boolean;
    isLocationModalOpen: boolean;
    isProfileOpen: boolean; // Added an extra one to show scalability
}

const initialState: UiState = {
    isSiteLoading: false,
    isAuthModalOpen: false,
    isLocationModalOpen: false,
    isProfileOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setIsSiteLoading: (state, action: PayloadAction<boolean>) => {
            state.isSiteLoading = action.payload;
        },
        // General function to set any boolean UI state (open/close)
        setModalStatus: (
            state,
            action: PayloadAction<{ key: keyof UiState; isOpen: boolean }>
        ) => {
            const { key, isOpen } = action.payload;
            // Using 'as any' or a specific check if the key is strictly a modal key
            if (typeof state[key] === 'boolean') {
                (state[key] as boolean) = isOpen;
            }
        },
        // General function to toggle a state
        toggleModal: (state, action: PayloadAction<keyof UiState>) => {
            const key = action.payload;
            if (typeof state[key] === 'boolean') {
                (state[key] as boolean) = !state[key];
            }
        },
    },
});

export const { setIsSiteLoading, setModalStatus, toggleModal } = uiSlice.actions;
export default uiSlice.reducer;