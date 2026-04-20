import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
    slug: string;
    has_children: boolean;
}

const CategoryItem: React.FC<{ category: Category }> = ({ category }) => {
    const [children, setChildren] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    // Ref for the container of the sub-categories
    const childContainerRef = useRef<HTMLDivElement | null>(null);

    const fetchSubCategories = useCallback(async () => {
        // Only fetch if it hasn't been fetched and it actually has children
        if (hasFetched || !category.has_children || loading) return;

        setLoading(true);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                params: {
                    parent_id: category.id,
                    per_page: 50 // Fetch children without infinite scroll for simplicity
                }
            });
            console.log(data);
            setChildren(data.items);
            setHasFetched(true);
        } catch (err) {
            console.error("Error loading subcategories", err);
        } finally {
            setLoading(false);
        }
    }, [category.id, category.has_children, hasFetched, loading]);

    // Observer to trigger fetch when the category item appears
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchSubCategories();
                    // Once it's in view and we start fetching, we can stop observing this specific node
                    if (childContainerRef.current) {
                        observer.unobserve(childContainerRef.current);
                    }
                }
            },
            { threshold: 0.1, rootMargin: '100px' } // Fetch slightly before it enters the view (100px)
        );

        if (childContainerRef.current && category.has_children) {
            observer.observe(childContainerRef.current);
        }

        return () => observer.disconnect();
    }, [fetchSubCategories, category.has_children]);

    return (
        <div className="mb-4 pbe-64">
            {/* Parent Category Card */}
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 mb-2">
                <h3 className="font-bold text-gray-800">{category.name}</h3>
                <p className="text-xs text-gray-400">/{category.slug}</p>
            </div>

            {/* Children Container (The Observer targets this) */}
            {category.has_children && (
                <div
                    ref={childContainerRef}
                    className="ml-8 border-l-2 border-blue-100 pl-4 min-h-5"
                >
                    {loading && (
                        <div className="flex gap-2 items-center text-blue-400 text-sm animate-pulse">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Loading sub-categories...
                        </div>
                    )}

                    {children.map((child) => (
                        <CategoryItem key={child.id} category={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryItem;