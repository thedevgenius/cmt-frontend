"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ChevronRight, Search } from 'lucide-react';

interface CategoryItem {
    id: string;
    name: string;
    parent_id: string | null;
    icon: string;
    slug: string;
}

export default function ThreeLevelCategoryPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isManualScrolling = useRef(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/categories?limit=1000`);
                const data = await response.json();
                setCategories(data.items);

                const firstLevelOne = data.items.find((i: CategoryItem) => !i.parent_id);
                if (firstLevelOne) setActiveTab(firstLevelOne.id);
            } catch (error) {
                console.error("Fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // --- 3-Level Grouping Logic ---
    const nestedData = useMemo(() => {
        // Level 1: Top Tabs (parent_id is null)
        const level1 = categories.filter(cat => !cat.parent_id);

        return level1.map(l1 => {
            // Level 2: Section Titles (parent_id is a Level 1 ID)
            const level2 = categories.filter(cat => cat.parent_id === l1.id);

            return {
                ...l1,
                sections: level2.map(l2 => ({
                    ...l2,
                    // Level 3: List Items (parent_id is a Level 2 ID)
                    items: categories.filter(cat => cat.parent_id === l2.id)
                }))
            };
        }).filter(l1 =>
            l1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l1.sections.some(l2 => l2.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [categories, searchQuery]);

    // --- Scroll & Observer Logic ---
    useEffect(() => {
        const activeBtn = document.getElementById(`tab-${activeTab}`);
        if (activeBtn && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollPosition = activeBtn.offsetLeft - (container.offsetWidth / 2) + (activeBtn.offsetWidth / 2);
            container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        }
    }, [activeTab]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (isManualScrolling.current) return;
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveTab(entry.target.id);
            });
        }, { rootMargin: '-120px 0px -60% 0px' });

        nestedData.forEach((l1) => {
            const el = document.getElementById(l1.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [nestedData]);

    const scrollToLevel1 = (id: string) => {
        isManualScrolling.current = true;
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.pageYOffset - 160;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setTimeout(() => { isManualScrolling.current = false; }, 800);
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-400">Loading directory...</div>;

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a]">
            {/* Header: Search + Level 1 Tabs */}
            <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-2xl mx-auto px-6 pt-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search services..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-all"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div ref={scrollContainerRef} className="flex items-center overflow-x-auto no-scrollbar gap-8">
                        {nestedData.map((l1) => (
                            <button
                                key={l1.id}
                                id={`tab-${l1.id}`}
                                onClick={() => scrollToLevel1(l1.id)}
                                className={`shrink-0 text-sm font-bold pb-3 relative whitespace-nowrap transition-colors ${activeTab === l1.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {l1.name}
                                {activeTab === l1.id && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-black" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="space-y-24">
                    {nestedData.map((l1) => (
                        <section key={l1.id} id={l1.id} className="scroll-mt-40">
                            {/* Level 1 Title (Optional visual cue) */}
                            <div className="mb-8">
                                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{l1.name}</span>
                            </div>

                            {/* Level 2 Sections */}
                            <div className="space-y-12">
                                {l1.sections.map((l2) => (
                                    <div key={l2.id}>
                                        <h3 className="text-md font-bold mb-4 text-gray-900 flex items-center gap-2">
                                            <span className="text-lg">{l2.icon || '•'}</span>
                                            {l2.name}
                                        </h3>

                                        {/* Level 3 List Items */}
                                        <div className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                                            {l2.items.length > 0 ? (
                                                l2.items.map((l3, index) => (
                                                    <div
                                                        key={l3.id}
                                                        className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${index !== l2.items.length - 1 ? 'border-b border-gray-50' : ''
                                                            }`}
                                                    >
                                                        <span className="text-[14px] font-medium text-gray-700">{l3.name}</span>
                                                        <ChevronRight size={14} className="text-gray-300" />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-5 py-4 text-xs text-gray-400 italic">No sub-services available.</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </div>
    );
}