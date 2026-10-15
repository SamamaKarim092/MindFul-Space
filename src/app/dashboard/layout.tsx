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
  const [slowLoad, setSlowLoad] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setSlowLoad(true);
      }, 2400);
    } else {
      setSlowLoad(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    // If auth checking has finished and there is no authenticated user, redirect immediately to landing page
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  // While checking auth status, show a smooth loading indicator with helpful context if backend is cold
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f1eb] dark:bg-[#0F0714] text-slate-600 dark:text-gray-300 gap-5 p-6">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-purple-500/20 border-t-purple-600 animate-spin" />
        </div>
        <div className="text-center max-w-sm space-y-3">
          <p className="text-base font-semibold text-slate-800 dark:text-white animate-pulse">
            Connecting to Mindful Space...
          </p>

          {slowLoad && (
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs leading-relaxed space-y-1.5 shadow-lg shadow-amber-500/5 transition-all">
              <div className="flex items-center justify-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300">
                <span>☁️</span>
                <span>Render Backend Waking Up</span>
              </div>
              <p>
                Our backend server runs on Render's free tier, which sleeps when idle. Booting takes about <strong>30–50 seconds</strong> on the first visit.
              </p>
              <p className="text-[11px] opacity-80">
                Thanks for your patience while your space loads! ✨
              </p>
            </div>
          )}
        </div>
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
