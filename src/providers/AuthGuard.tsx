'use client';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '@/store/slices/modalSlice';

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        console.log('isAuthenticated', isAuthenticated);
        if (!isAuthenticated) {
            console.log('not authenticated');
            dispatch(openModal({ type: 'loginForm', options: { hideCloseButton: true, disableOverlayClose: true } }));
        }
    }, [isAuthenticated, dispatch]);

    if (!isAuthenticated) {
        return null; // Or you can return a loading spinner or placeholder here
    }

    return (
        <>
            {children}
        </>
    );
}