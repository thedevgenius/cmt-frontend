'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchUserLocation } from "@/store/slices/locationSlice";
import Modal from "@/components/modals/Modal";

export default function UIProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch<AppDispatch>();

    // useEffect(() => {
    //     dispatch(fetchUserLocation());
    // }, []);
    
    return (
        
        <>
            {children}
            <Modal />
        </>
    );
}