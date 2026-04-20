"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/";
import { setQuery, clearResults, fetchCategories } from "@/store/slices/searchSlice";
// import SearchHeader from "./_components/SearchHeader";
// import BusinessCard from "@/components/shared/BusinessCard";

const FREQUENT_CATEGORIES = [
    { id: "1", name: "Restaurants", icon: "🍔" },
    { id: "2", name: "Fitness & Gyms", icon: "🏋️‍♀️" },
    { id: "3", name: "Salons & Spa", icon: "✂️" },
];

const recentSearches = ["Biryani", "AC Repair", "Gym"];

const trendingSearches = [
    { name: "Top Rated Restaurants", icon: "fa-fire", color: "orange" },
    { name: "Electricians", icon: "fa-bolt", color: "blue" },
    { name: "Spa & Massage", icon: "fa-spa", color: "pink" },
    { name: "Home Tutors", icon: "fa-graduation-cap", color: "purple" }
];

export default function CategorySearchPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { query, results, isLoading, error } = useSelector((state: RootState) => state.search);

    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setIsTyping(false);

            if (query.trim().length >= 2) {
                dispatch(fetchCategories(query));
            } else {
                dispatch(clearResults());
            }
        }, 500);
        
        return () => clearTimeout(delayDebounceFn);
    }, [query, dispatch]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsTyping(true);
        dispatch(setQuery(e.target.value));
    };

    return (
        <div>
            <div className="min-h-screen max-w-2xl mx-auto pb-8">
                {/* <SearchHeader /> */}
                <div className="relative w-full group">
                    <Link
                        href="/"
                        className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 text-gray-400 hover:text-brand transition cursor-pointer"
                    >
                        <i className="fa-solid fa-arrow-left-long text-xl"></i>
                    </Link>

                    {/* Note: React uses autoFocus with a capital F */}
                    <input
                        onChange={handleInputChange}
                        type="text"
                        autoFocus
                        className="block w-full pl-10 pr-10 py-4 bg-gray-100 border-none rounded-xl text-gray-800 placeholder-gray-400 text-sm font-bold outline-none focus:bg-white focus:ring-1 focus:ring-brand/20 transition shadow-inner-light"
                        placeholder="Search for 'Plumber'..."
                    />

                    <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                        <i className="fa-solid fa-magnifying-glass text-sm"></i>
                    </button>
                </div>

                {/* --- RECENT SEARCHES --- */}
                <section className="mt-5 px-3">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Recent</h3>
                        <button className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition">Clear</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, i) => (
                            <button key={i} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 shadow-sm active:scale-95 transition">
                                <i className="fa-regular fa-clock text-gray-300"></i> {term}
                            </button>
                        ))}
                    </div>
                </section>

                {/* --- TRENDING NEARBY --- */}
                <section className="mt-6 px-3 mb-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Trending Nearby</h3>

                    <div className="flex flex-col">
                        {trendingSearches.map((item, i) => (
                            <button key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 group hover:bg-gray-50 px-2 rounded-lg transition last:border-0">
                                <div className={`w-8 h-8 rounded-full bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 group-hover:scale-110 transition`}>
                                    <i className={`fa-solid ${item.icon} text-xs`}></i>
                                </div>
                                <span className="text-sm font-bold text-gray-700 flex-1 text-left">{item.name}</span>
                                <i className="fa-solid fa-arrow-right -rotate-45 text-gray-300 text-xs group-hover:text-brand transition"></i>
                            </button>
                        ))}
                    </div>
                </section>

                {/* --- SPONSORED ADS / API RESULTS --- */}
                <section className="px-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Sponsored</h3>
                        <span className="text-[9px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded">Ads</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Using our newly extracted component! */}
                        {/* <BusinessCard
                            id="1"
                            name="Tech Fix Laptop Repair"
                            category="Computer Repair"
                            distance="0.8 km"
                            rating={4.9}
                            imageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80"
                            actionText="Call Now"
                        />

                        <BusinessCard
                            id="2"
                            name="City Care Clinic"
                            category="General Physician"
                            distance="1.2 km"
                            rating={4.5}
                            imageUrl="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&q=80"
                            actionText="Book"
                        /> */}
                    </div>
                </section>

            </div>
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Explore Categories</h1>

                <div className="relative mb-8">
                    <input
                        type="text"
                        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Search for a category..."
                        value={query}
                        onChange={handleInputChange}
                    />
                </div>

                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

                <div className="space-y-4">
                    {query.length < 3 ? (
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-4">Frequently Searched</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {FREQUENT_CATEGORIES.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => {
                                            setIsTyping(true);
                                            dispatch(setQuery(category.name));
                                        }}
                                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                    >
                                        <span className="mr-3 text-2xl">{category.icon}</span>
                                        <span className="font-medium">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Search Results</h3>

                            {/* UPDATED LOGIC HERE */}
                            {(isLoading || isTyping) && results.length === 0 ? (
                                // 1. Show skeleton ONLY if loading/typing AND we have no previous results
                                <div className="space-y-3">
                                    {[1, 2, 3].map((skeleton) => (
                                        <div key={skeleton} className="p-4 border border-gray-200 rounded-lg bg-white animate-pulse">
                                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                                            <div className="h-4 bg-gray-100 rounded w-2/3 mb-2"></div>
                                            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : results.length > 0 ? (
                                // 2. Show actual results. Dim them slightly if a new fetch is happening in the background.
                                <div className={`space-y-3 transition-opacity duration-200`}>
                                    {results.map((category: any) => (
                                        <div key={category.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer bg-white relative">
                                            <a href={`/category/${category.slug}`} className="absolute inset-0"></a>
                                            <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                                            {category.description && (
                                                <p className="text-gray-600 mt-1 text-sm">{category.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // 3. Show Not Found only when done loading/typing and no results exist
                                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-gray-500">No categories found matching "{query}".</p>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}