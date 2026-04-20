"use client";

import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal"; 
import { closeModal } from "@/store/slices/modalSlice"; // Adjust this path to your modal slice
import type { RootState } from "@/store"; // Adjust this path to your store type

// 1. Lazy load specific modal contents for code-splitting
const LoginForm = dynamic(() => import("../shared/LoginForm"));
const LocationSelect = dynamic(() => import("../shared/LocationSelect"));
// const LocationView = dynamic(() => import("./modal-views/LocationView"));

export default function GlobalModal() {
    const dispatch = useDispatch();

    // Extract state from Redux
    const { isOpen, view, config, payload } = useSelector(
        (state: RootState) => state.modal
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => dispatch(closeModal())}
            variant={config.variant || "bottom"}
            title={config.title || ""}
            bgColor={config.bgColor || "bg-white"}
        >
            {/* 2. Render the correct view based on Redux state */}
            {view === "AUTH" && <LoginForm />}
            {view === "LOCATION" && <LocationSelect />}
            <>

            </>
        </Modal>
    );
}