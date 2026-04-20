'use client';
import { useEffect } from 'react';
import { openModal } from '@/store/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            dispatch(openModal({ type: 'loginForm', options: { hideCloseButton: true, disableOverlayClose: true } }));
        }
    }, [isAuthenticated, dispatch]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}