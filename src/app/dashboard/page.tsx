"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import StatsCards from "@/app/components/dashboard/Widgets/StatsCards";
import MoodChart from "@/app/components/dashboard/Widgets/MoodChart";
import RecentEntries from "@/app/components/dashboard/Widgets/WellnessGoals";
import QuoteCard from "@/app/components/dashboard/Widgets/QuoteCard";

import MoodCalendar from "@/app/components/dashboard/Widgets/MoodCalendar";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0714]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user.email?.split("@")[0]}!
        </h2>
        <p className="text-gray-400">
          Here&apos;s your daily mental wellness overview.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MoodChart />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <QuoteCard />
          <RecentEntries />
        </div>
      </div>

      <MoodCalendar />
    </div>
  );
}
