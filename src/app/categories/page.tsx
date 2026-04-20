"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import CategoryList from "./_components/CategoryList";

export default function Categories() {
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location);

    return (
        <div className="px-20">
            <h1>categories</h1>
            <CategoryList />
        </div>
    );
}
