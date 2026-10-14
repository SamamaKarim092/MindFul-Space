"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Header from "@/app/components/dashboard/Header";
import { MoodProvider } from "@/app/context/MoodContext";
import AmbientBackground from "@/app/components/ui/AmbientBackground";
import OtpModal from "@/app/components/auth/OtpModal";
import { useAuth } from "@/lib/auth/context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If auth checking has finished and there is no authenticated user, redirect immediately to landing page
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // While checking auth status, show a smooth loading indicator instead of empty or fallback UI
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f1eb] dark:bg-[#0F0714] text-slate-600 dark:text-gray-300 gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-600 animate-spin" />
        </div>
        <p className="text-sm font-medium animate-pulse">Loading Mindful Space...</p>
      </div>
    );
  }

  // Prevent any unauthenticated dashboard rendering
  if (!user) {
    return null;
  }

  return (
    <MoodProvider>
      <OtpModal />
      <div className="flex min-h-screen relative">
        <AmbientBackground />
        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <Header onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </MoodProvider>
  );
}
