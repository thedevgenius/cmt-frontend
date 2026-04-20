import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// The async thunk to fetch data from your FastAPI backend
export const fetchCategories = createAsyncThunk(
    "search/fetchCategories",
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories?search=${query}`);
            
            // if (!response.ok) throw new Error("Failed to fetch categories");
            const data = await response.json();
            return data.items;
            
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

interface SearchState {
    query: string;
    results: any[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SearchState = {
    query: "",
    results: [],
    isLoading: false,
    error: null,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
        clearResults: (state) => {
            state.results = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.results = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setQuery, clearResults } = searchSlice.actions;
export default searchSlice.reducer;