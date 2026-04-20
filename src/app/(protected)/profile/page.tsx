// Any page or component
'use client';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store';
import { openModal } from '@/store/slices/modalSlice'

export default function SomePage() {
    const dispatch = useDispatch<AppDispatch>()

    return (
        <>
            <h1>Protected Page</h1>
        </>
    )
}