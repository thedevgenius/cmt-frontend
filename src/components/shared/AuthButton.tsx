"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { openModal } from "@/store/slices/modalSlice"; 

interface AuthButtonProps {
    children: React.ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
}

export default function AuthButton({
    children,
    className = "",
    href,
    onClick,
}: AuthButtonProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const handleClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            dispatch(
                openModal({
                    type: "loginForm",
                    props: { userId: 42 },
                    options: { hideCloseButton: true },
                })
            );
            return;
        }

        if (onClick) onClick();

        if (href) router.push(href);
    };

    return (
        <button className={className} onClick={handleClick}>
            {children}
        </button>
    );
}