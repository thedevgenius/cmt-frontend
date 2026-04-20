import AdminGuard from "@/providers/AdminGuard";
import AdminSidebar from "./_components/AdminSidebar";
import AdminHeader from "./_components/AdminHeader";

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <AdminGuard>
                <div className="flex h-screen bg-[#f6f6f7] text-[#303030]">
                    {/* Sidebar */}
                    <AdminSidebar />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                        {/* Top Header */}
                        <AdminHeader />

                        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                            {children}
                        </main>
                    </div>
                </div>
            </AdminGuard>
        </>
    );
}