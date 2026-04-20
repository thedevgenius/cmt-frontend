'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import Cookies from 'js-cookie';
import api from '@/lib/api'; // Your Axios interceptor!
import SiteLoader from '@/components/ui/SiteLoader';
import { resetAuth } from '@/store/slices/authSlice';
import { jwtDecode } from 'jwt-decode'; // Import this!

// --- The Auth Logic Component ---
export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const accessToken = Cookies.get('access_token');

            // 1. No token found in cookies at all
            if (!accessToken) {
                dispatch(resetAuth());
                setIsInitialLoad(false);
                return;
            }

            try {
                const decodedToken = jwtDecode<{ exp: number }>(accessToken);
                const currentTime = Date.now() / 1000;
                const isExpired = decodedToken.exp < currentTime + 60;

                if (!isExpired) { 
                    return setIsInitialLoad(false);
                } else {
                    const response = await api.get('/v1/users/me');
                }
                // const response = await api.get('/user/me');
            } catch (error) {
                dispatch(resetAuth());
                Cookies.remove('access_token');
            } finally {
                // Check is complete, reveal the UI
                setIsInitialLoad(false);
            }
        };

        checkAuthStatus();
    }, [dispatch]);

    // Prevent UI flashing while checking authentication status
    if (isInitialLoad) {
        return (
            <SiteLoader />
        );
    }

    return <>{children}</>;
}
