import axios from "axios";
import { store } from "@/store";
import { logoutUser } from "@/store/slices/authSlice";
import { jwtDecode } from "jwt-decode"; // Add this import
import Cookies from "js-cookie";

// We need a lock so if 5 components make an API call at the exact same time, 
// we only hit the FastAPI /refresh endpoint ONCE.
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    withCredentials: true,
});

// --- THE NEW PROACTIVE REQUEST INTERCEPTOR ---
api.interceptors.request.use(
    async (config) => {
        // 1. Get the current access token from Redux
        // (Make sure you save your access token here when logging in!)
        const accessToken = Cookies.get('access_token'); // You can also use a selector from your Redux store if you prefer

        if (accessToken) {
            // 2. Decode the token to read the 'exp' (expiration) timestamp
            const decodedToken = jwtDecode<{ exp: number }>(accessToken);
            const currentTime = Date.now() / 1000; // Convert to seconds to match JWT format

            // 3. Add a "Buffer Zone" (e.g., 60 seconds)
            // If the token expires in less than 1 minute, consider it dead.
            const isExpired = decodedToken.exp < currentTime + 60;

            if (isExpired) {
                // 4. Lock it down! If we aren't already refreshing, start the process
                if (!isRefreshing) {
                    isRefreshing = true;

                    refreshPromise = axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
                        {},
                        { withCredentials: true }
                    ).then((res) => {
                        // Usually, you would dispatch an action here to save the NEW access_token to Redux
                        Cookies.set('access_token', res.data.access_token, { expires: 7 });
                        isRefreshing = false;
                        return res.data.access_token;
                        
                    }).catch((error) => {
                        isRefreshing = false;
                        store.dispatch(logoutUser());
                        console.log('refresh error', error);
                        console.log('logging out');
                        return Promise.reject(error);
                    });
                }

                // 5. If we ARE refreshing, pause this specific API request until the promise resolves
                const newAccessToken = await refreshPromise;

                // 6. Attach the shiny new token to the paused request
                config.headers.Authorization = `Bearer ${newAccessToken}`;
                return config;
            }

            // If it's not expired, just attach the current token normally
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Keep your Response Interceptor (the 401 catcher) as a fallback safety net!
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // ... your previous 401 retry logic goes here as a backup ...
    }
);

export default api;