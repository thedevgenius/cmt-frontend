'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Package,
    ChevronDown,
    LayoutDashboard,
    Tags,
    Boxes
} from 'lucide-react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    // Initialize product menu as open if the current URL is a product sub-route
    const [isProductMenuOpen, setProductMenuOpen] = useState(pathname.includes('/products'));

    // Sync submenu state with URL changes (optional, but helpful for direct navigation)
    useEffect(() => {
        if (pathname.includes('/products')) {
            setProductMenuOpen(true);
        }
    }, [pathname]);

    return (
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-[#ebebeb] flex flex-col transition-all duration-200 h-screen sticky top-0`}>
            {/* Logo Section - Click to toggle sidebar for demo purposes */}
            <div 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="h-14 flex items-center px-6 border-b border-[#ebebeb] font-bold text-lg tracking-tight cursor-pointer hover:bg-gray-50"
            >
                {isSidebarOpen ? 'STOREFRONT' : 'S'}
            </div>

            <nav className="flex-1 p-3 space-y-1">
                {/* Regular Link */}
                <NavItem 
                    href="/admin" 
                    icon={<LayoutDashboard size={20} />} 
                    label="Dashboard" 
                    isOpen={isSidebarOpen} 
                    active={pathname === '/admin'} 
                />

                {/* Collapsible Menu */}
                <div className="space-y-1">
                    <button
                        onClick={() => setProductMenuOpen(!isProductMenuOpen)}
                        className={`w-full flex items-center justify-between p-2 rounded-md transition-colors group
                            ${pathname.includes('/products') ? 'bg-[#f6f6f7] text-black' : 'text-[#616161] hover:bg-[#f1f1f1] hover:text-black'}`}
                    >
                        <div className="flex items-center">
                            <Package size={20} className={pathname.includes('/products') ? 'text-black' : 'text-[#616161] group-hover:text-black'} />
                            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Products</span>}
                        </div>
                        {isSidebarOpen && (
                            <ChevronDown 
                                size={14} 
                                className={`transition-transform duration-200 ${isProductMenuOpen ? 'rotate-180' : ''}`} 
                            />
                        )}
                    </button>

                    {/* Submenu Items */}
                    {isProductMenuOpen && isSidebarOpen && (
                        <div className="ml-4 pl-5 border-l border-[#ebebeb] mt-1 space-y-1">
                            <SubNavItem 
                                href="/products/collections" 
                                label="Collections" 
                                active={pathname === '/products/collections'} 
                            />
                            <SubNavItem 
                                href="/products/inventory" 
                                label="Inventory" 
                                active={pathname === '/products/inventory'} 
                            />
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
}

/**
 * Main Navigation Item Component
 */
function NavItem({ href, icon, label, isOpen, active }: { href: string, icon: React.ReactNode, label: string, isOpen: boolean, active: boolean }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center p-2 rounded-md transition-colors group ${
                active 
                ? 'bg-[#ebebeb] text-black' 
                : 'text-[#616161] hover:bg-[#f1f1f1] hover:text-black'
            }`}
        >
            {icon}
            {isOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
        </Link>
    );
}

/**
 * Sub-navigation Item Component (Shopify Style)
 */
function SubNavItem({ href, label, active }: { href: string, label: string, active: boolean }) {
    return (
        <Link 
            href={href} 
            className={`block p-2 text-sm rounded-md transition-all ${
                active 
                ? 'text-black font-semibold' 
                : 'text-[#616161] hover:text-black hover:translate-x-1'
            }`}
        >
            {label}
        </Link>
    );
}