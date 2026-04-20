'use client';
import React, { useState } from 'react';
import {
    Menu,
    User,
    LogOut,
    Settings
} from 'lucide-react';
import { logoutUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useStore';

export default function AdminSidebar() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isProductMenuOpen, setProductMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        router.push('/'); // Redirect to home page after logout
    }

    return (
        <header className="h-14 bg-white border-b border-[#ebebeb] flex items-center justify-between px-4 sm:px-8">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-md">
                <Menu size={20} />
            </button>

            {/* User Profile */}
            <div className="relative">
                <button
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center p-1.5 hover:bg-gray-100 rounded-md transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-[#303030] flex items-center justify-center text-white text-xs">JD</div>
                </button>

                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-[#ebebeb] rounded-lg shadow-xl py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                            <p className="text-sm font-semibold">John Doe</p>
                            <p className="text-xs text-gray-500">admin@store.com</p>
                        </div>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#f1f1f1] flex items-center gap-2">
                            <User size={16} /> Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-[#f1f1f1] flex items-center gap-2">
                            <Settings size={16} /> Store Settings
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer" onClick={() => handleLogout()}>
                            <LogOut size={16} /> Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

