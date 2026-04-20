import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { closeModal } from "./modalSlice";

interface LocationState {
    landmark: string;
    lat: number | null;
    lng: number | null;
    isLoading: boolean;
    locationError: string | null;
}

const initialState: LocationState = {
    landmark: "Select Location",
    lat: null,
    lng: null,
    isLoading: false,
    locationError: null,
};

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUserLocation = createAsyncThunk(
    "location/fetchUserLocation",
    async (_, { rejectWithValue, getState, dispatch }) => {

        const state = getState() as any;
        const savedLat = state.location.lat;
        const savedLng = state.location.lng;
        const savedName = state.location.landmark; // or state.location.name depending on your state

        // // If latitude and longitude already exist in Redux, short-circuit and return!
        // if (savedLat != null && savedLng != null) {
        //     return {
        //         name: savedName,
        //         lat: savedLat,
        //         lng: savedLng,
        //     };
        // }
        
        // 1. Check if browser supports GPS
        if (typeof window === "undefined" || !navigator.geolocation) {
            return rejectWithValue("Geolocation is not supported by your browser.");
        }

        try {
            // 2. Wrap the callback-based Geolocation API in a modern Promise
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
            });

            const { latitude, longitude } = position.coords;
            
            // 3. Hit your FastAPI backend
            const response = await fetch(
                `${BASE_API_URL}/location/reverse-geocode?lat=${latitude}&lng=${longitude}`
            );

            if (!response.ok) throw new Error("Failed to fetch location name");

            const data = await response.json();

            // dispatch(closeModal());

            // 4. Return the payload to update Redux
            return {
                name: data.display_name,
                lat: latitude,
                lng: longitude,
            };
        } catch (error: any) {
            // Handle user denying GPS or network failures
            const errorMessage =
                error.code === 1
                    ? "Please allow location access in your browser settings."
                    : "Unable to retrieve your location.";
            return rejectWithValue(errorMessage);
        }
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLatLng: (state, action: PayloadAction<{ lat: number, lng: number }>) => {
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
        },
        setLocation: (state, action: PayloadAction<{ name: string, lat: number | null, lng: number | null }>) => {
            state.landmark = action.payload.name;
            state.lat = action.payload.lat;
            state.lng = action.payload.lng;
        }
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserLocation.pending, (state) => {
                state.isLoading = true;
                state.locationError = null;
            })
            .addCase(fetchUserLocation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.landmark = action.payload.name;
                state.lat = action.payload.lat;
                state.lng = action.payload.lng;
                
            })
            .addCase(fetchUserLocation.rejected, (state, action) => {
                state.isLoading = false;
                state.locationError = action.payload as string;
            });
    },
});

export const { setLatLng, setLocation } = locationSlice.actions;
export default locationSlice.reducer;