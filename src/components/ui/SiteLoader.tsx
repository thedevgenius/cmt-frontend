'use client';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

export default function SiteLoader() {
    const isSiteLoading = useSelector((state: RootState) => state.ui.isSiteLoading);

    // if (!isSiteLoading) return null;

    return (
        // This wrapper ensures the spinner is perfectly centered on the screen
        <div className="flex items-center justify-center min-h-screen absolute inset-0 z-99 bg-gray-50">

            {/* The spinner itself */}
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500"></div>

        </div>
    );
}