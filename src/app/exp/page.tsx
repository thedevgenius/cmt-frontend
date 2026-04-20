// Any page or component
'use client';
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store';
import { openModal } from '@/store/slices/modalSlice'

export default function SomePage() {
    const dispatch = useDispatch<AppDispatch>()

    return (
        <>
            <button onClick={() => dispatch(openModal({ type: 'locationSelect', props: { title: 'Confirm?' } }))}>
                Open Location
            </button>

            <button onClick={() => dispatch(openModal({ type: 'loginForm', props: { userId: 42 }, options: { hideCloseButton: true } }))}>
                Open Login
            </button>
            <button onClick={() => dispatch(openModal({ type: 'profileUpdate', props: { userId: 42 } }))}>
                Open profile
            </button>
        </>
    )
}