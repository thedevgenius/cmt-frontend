// store/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// --- Async Thunks for Real API Calls ---

export const sendOtp = createAsyncThunk(
    "auth/sendOtp",
    async (phone: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_API_URL}/v1/auth/otp/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country:'IN', phone_number:phone }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Failed to send OTP');
            }

            return phone;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (payload: {country: string; phone: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_API_URL}/v1/auth/otp/verify`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Invalid OTP');
            }

            const data = await response.json();
            Cookie.set('access_token', data.access_token, { expires: 7 });
            return data.access_token;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_API_URL}/v1/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData.message || 'Failed to logout');
            }
            Cookie.remove('access_token');
            return true;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error occurred');
        }
    }
);

// --- Slice Definition ---

interface AuthState {
    isAuthenticated: boolean;
    step: 'PHONE' | 'OTP';
    phone: string | null;
    access_token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    step: 'PHONE',
    phone: null,
    access_token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        resetAuth: () => initialState,
    },
    extraReducers: (builder) => {
        // Send OTP Cases
        builder.addCase(sendOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(sendOtp.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.step = 'OTP';
            state.phone = action.payload;
        });
        builder.addCase(sendOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Verify OTP Cases
        builder.addCase(verifyOtp.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(verifyOtp.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.access_token = action.payload;
        });
        builder.addCase(verifyOtp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Logout Cases
        builder.addCase(logoutUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.step = 'PHONE';
            state.phone = null;
            state.access_token = null;
        });
        builder.addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;