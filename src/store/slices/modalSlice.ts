// store/modalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { fetchUserLocation } from './locationSlice'

// ← string, not a union. Registry is the source of truth.
interface ModalOptions {
    disableOverlayClose?: boolean   // prevent closing on overlay click
    hideCloseButton?: boolean       // hide the default X button
}

interface ModalState {
    isOpen: boolean
    type: string | null
    props: Record<string, unknown>
    options: ModalOptions
}

const initialState: ModalState = {
    isOpen: false,
    type: null,
    props: {},
    options: {},
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal(state, action: PayloadAction<{
            type: string
            props?: Record<string, unknown>
            options?: ModalOptions              // ← new
        }>) {
            state.isOpen = true
            state.type = action.payload.type
            state.props = action.payload.props ?? {}
            state.options = action.payload.options ?? {}   // ← new
        },
        closeModal(state) {
            state.isOpen = false
        },
        resetModal(state) {
            state.type = null
            state.props = {}
            state.options = {}              // ← new
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserLocation.fulfilled, (state) => {
                state.isOpen = false;
            });
    },
})

export const { openModal, closeModal, resetModal } = modalSlice.actions
export default modalSlice.reducer