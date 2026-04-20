"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/";
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
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

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