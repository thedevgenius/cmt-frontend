import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import CategoryItem from './CategoryItem';
// import { Category, PaginatedCategoryResponse } from './types'; // Adjust path

// types.ts (or within your component file)
interface Category {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    order: number;
    has_children: boolean;
}
interface PaginatedCategoryResponse {
    total: number;
    page: number;
    per_page: number;
    items: Category[];
}

const CategoryList: React.FC = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // 1. Setup the Observer Ref
    const observer = useRef<IntersectionObserver | null>(null);

    // 2. The callback ref that attaches to the last element
    const lastElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return; // Don't trigger if already fetching

        // Disconnect previous observer
        if (observer.current) observer.current.disconnect();

        // Create new observer
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // 3. Fetch Logic
    useEffect(() => {
        // 1. Create the controller to allow cancellation
        const controller = new AbortController();

        const fetchCategories = async () => {
            // 2. Prevent fetching if we already know there's no more data
            // (Except for page 1, which is the initial load)
            if (!hasMore && page !== 1) return;

            setLoading(true);

            try {
                const { data } = await axios.get<PaginatedCategoryResponse>(`${BASE_URL}/categories`, {
                    params: {
                        page: page,
                        per_page: 2,
                        top_level_only: true,
                    },
                    // 3. Attach the signal to the axios request
                    signal: controller.signal
                });

                setCategories((prev) => {
                    // 4. Robust Duplicate Prevention (ID check)
                    // This handles cases where a request might finish after the next one starts
                    const existingIds = new Set(prev.map(item => item.id));
                    const uniqueNewItems = data.items.filter(item => !existingIds.has(item.id));

                    return [...prev, ...uniqueNewItems];
                });

                // 5. Update hasMore based on total count
                if (data.items.length === 0 || (categories.length + data.items.length >= data.total)) {
                    setHasMore(false);
                }
            } catch (error: any) {
                // 6. Don't show errors for intentional cancellations
                if (axios.isCancel(error)) {
                    console.log("Request for page", page, "was cancelled.");
                } else {
                    console.error("Failed to fetch categories:", error);
                }
            } finally {
                // 7. Only set loading to false if the request wasn't aborted
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        // 8. CLEANUP FUNCTION: This is the magic fix for Strict Mode.
        // When React double-mounts, it calls this cleanup for the first mount,
        // effectively killing the "first" request before it repeats data.
        return () => {
            controller.abort();
        };
    }, [page]); // Re-run whenever the page number change

    return (
        <div className="max-w-md mx-auto p-4 bg-gray-50 min-h-screen">
            <h1 className="text-xl font-bold mb-6 text-gray-800">Categories</h1>

            <div className="flex flex-col gap-4">
                {categories.map((cat, index) => {
                    const isLast = categories.length === index + 1;
                    return (
                        <div key={cat.id} ref={isLast ? lastElementRef : null}>
                            <CategoryItem category={cat} />
                        </div>
                    );
                })}
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="py-8 flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* End of list message */}
            {!hasMore && (
                <p className="text-center py-10 text-gray-400 italic">
                    No more categories to load.
                </p>
            )}
        </div>
    );
};

export default CategoryList;