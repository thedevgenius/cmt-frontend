"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import AuthButton from "@/components/shared/AuthButton";
import { openModal, closeModal } from "@/store/slices/modalSlice";

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location);

    return (
        <>
            
            <div className="px-20">
                <h1>Home Page</h1>
                <button onClick={() => dispatch(openModal({ type: 'locationSelect', props: { title: 'Confirm?' } }))}>{location.landmark}</button> <br />

                {/* <Link href={'/profile'} className="text-blue-600">Profile</Link> */}
                <AuthButton href="/profile">Profile</AuthButton> <br />
                <Link href="/profile">Profile</Link>
                <Link href="/categories">categories</Link> <br />
                <Link href="/search">Search</Link> <br />
                <Link href="/exp">Explore</Link>
            </div>
        </>
        
    );
}
