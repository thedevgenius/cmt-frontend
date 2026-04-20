'use client';

import api from '@/lib/api';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useStore';
import { logoutUser } from '@/store/slices/authSlice';
import SiteLoader from '@/components/ui/SiteLoader';
import Cookies from 'js-cookie';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const accessToken = Cookies.get('access_token');

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data } = await api.get('/v1/users/me');
                console.log('User data:', data);
                if (data.role !== 'admin') {
                    router.replace('/');
                    return;
                }
            } catch {
                dispatch(logoutUser());
                router.replace('/');
            }
        };

        if (!accessToken) {
            router.replace('/');
            return;
        }

        checkAdmin();
    }, [accessToken]);

    if (!accessToken) {
        return <SiteLoader />;
    }

    return <>{children}</>;
}

