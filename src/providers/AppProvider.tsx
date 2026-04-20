// src/providers/AppProvider.tsx
import { ReduxProvider } from "@/store/Provider";
import UIProvider from "./UIProvider";
import AuthProvider from "./AuthProvider"; // Import your AuthProvider

// You can import future providers here (e.g., ThemeProvider, AuthProvider)

export default function AppProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReduxProvider>
            <AuthProvider>
                <UIProvider>
                    {children}
                </UIProvider>
            </AuthProvider>
        </ReduxProvider>
    );
}