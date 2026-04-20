"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setLocation, fetchUserLocation } from "@/store/slices/locationSlice";
import { closeModal } from "@/store/slices/modalSlice";

interface Suggestion {
    place_id: string;
    main_text: string;
    secondary_text: string;
}

const LocationSelect = () => {
    const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, locationError } = useSelector((state: RootState) => state.location);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleCloseModal = () => {
        dispatch(closeModal());
        setTimeout(() => {
            setSearchQuery("");     // 1. Empty the input field
            setSuggestions([]);     // 2. Clear out any old dropdown results
            setIsSearching(false);
        }, 300);
    };

    useEffect(() => {
        // 1. If the input is empty, clear everything and stop.
        if (searchQuery.trim().length <= 2) {
            setSuggestions([]);
            setIsSearching(false);
            return;
        }

        if (!suggestions.length) setIsSearching(true);

        // 2. Set a timer to wait 500ms after they stop typing
        const delayDebounceFn = setTimeout(async () => {
            if (!suggestions.length) setIsSearching(true);
            try {
                // Hit your FastAPI autocomplete endpoint
                const response = await fetch(
                    `${BASE_API_URL}/v1/location/autocomplete?q=${encodeURIComponent(searchQuery)}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data.suggestions); // Expecting an array of results
                }
            } catch (error) {
                console.error("Autocomplete fetch failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        // 3. Cleanup function: If they type again before 500ms, clear the old timer!
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleCurrentLocation = async () => {
        console.log("Fetching current location...");
        try {
            await dispatch(fetchUserLocation()).unwrap();
        } catch (error) {
            console.log("Location fetch failed:", error);
        }
    };

    const handleSelectSuggestion = async (suggestion: Suggestion) => {
        try {
            // 1. Fetch the exact coordinates using the unique place_id
            const response = await fetch(
                `${BASE_API_URL}/v1/location/coordinates?place_id=${suggestion.place_id}`
            );

            if (!response.ok) throw new Error("Failed to fetch coordinates");

            const data = await response.json();

            // 2. Dispatch BOTH the combined name and the new coordinates to Redux
            dispatch(setLocation({
                name: `${suggestion.main_text}, ${suggestion.secondary_text}`,
                lat: data.lat,
                lng: data.lng
            }));
        } catch (error) {
            // Fallback: If the API fails, we still save the name so the user isn't stuck
            dispatch(setLocation({
                name: `${suggestion.main_text}, ${suggestion.secondary_text}`,
                lat: null,
                lng: null
            }));
        } finally {
            handleCloseModal();
        }
    };

    // if (!isLocationModalOpen) return null;

    return (
        <div className="p-6">
            {/* --- SEARCH BAR --- */}
            <div className="pb-4 border-b border-gray-50 shrink-0 z-10">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fa-solid fa-magnifying-glass text-brand text-sm group-focus-within:text-brand-dark"></i>
                    </div>
                    <input type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-xl text-gray-900 text-sm font-bold placeholder-gray-400 outline-none transition"
                        placeholder="Search area, street name..." />

                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-300 hover:text-gray-500 cursor-pointer">
                        <i className="fa-solid fa-circle-xmark"></i>
                    </button>
                </div>
            </div>
            {/* --- SUGGESTIONS --- */}
            <div>
                {suggestions.length == 0 && (
                    <button
                        onClick={handleCurrentLocation}
                        disabled={isLoading}
                        className="w-full flex items-center gap-4 py-2 border-b border-gray-50 group bg-gray-50 rounded-xl transition px-4 cursor-pointer">
                        <div
                            className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand shrink-0 group-hover:scale-110 transition">
                            <i className="fa-solid fa-location-crosshairs text-lg"></i>
                        </div>
                        <h4 className="text-sm font-black text-brand">{isLoading ? "Locating..." : "Use Current Location"}</h4>
                        <i className="fa-solid fa-chevron-right text-gray-300 text-xs ml-auto"></i>
                    </button>
                )}

                {searchQuery.length > 2 && (
                    <div className="pb-6">
                        {isSearching ? (
                            /* --- SKELETON LOADER --- */
                            <div>
                                {[1, 2, 3, 4].map((skeleton) => (
                                    <div
                                        key={skeleton}
                                        className="min-w-full flex items-start gap-4 py-3.5 border-b border-gray-50 px-2 -mx-2 rounded-lg animate-pulse"
                                    >
                                        <div className="w-8 h-8 mt-1 rounded-full bg-gray-100 shrink-0 border border-gray-50"></div>
                                        <div className="text-left flex-1 min-w-0 py-1">
                                            <div className="h-3.5 bg-gray-200 rounded-full w-2/3 mb-2.5"></div>
                                            <div className="h-2 bg-gray-100 rounded-full w-1/3"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : suggestions.length > 0 ? (
                            /* --- ACTUAL RESULTS --- */
                            <div className="bg-white px-3 py-2 rounded-xl">
                                {suggestions.map((item, index) => (
                                    <button
                                        key={item.place_id || index}
                                        onClick={() => handleSelectSuggestion(item)} // Don't forget your click handler here!
                                        className="flex w-full py-3 gap-3 border-b border-gray-200 last:border-0 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 mt-1 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                            <i className="fa-solid fa-location-dot text-xs"></i>
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-brand transition">
                                                {item.main_text}
                                            </h4>
                                            <p className="text-[11px] text-gray-500 truncate">
                                                {item.secondary_text}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            /* --- NO RESULTS FALLBACK --- */
                            <div className="text-center mt-8">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                                    <i className="fa-solid fa-magnifying-glass-location text-lg"></i>
                                </div>
                                <p className="text-sm font-bold text-gray-600">No locations found</p>
                                <p className="text-xs text-gray-400 mt-1">Check the spelling and try again</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="min-h-96">

            </div>
        </div>
    )
}

export default LocationSelect;