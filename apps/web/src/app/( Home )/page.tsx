"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import Navbar from "@/app/components/home/Navbar";
import Hero from "@/app/components/landing/Hero";
import N8NAutomation from "@/app/components/landing/N8NAutomation";
import Features from "@/app/components/landing/Features";
import TechnologyUsed from "@/app/components/home/TechnologyUsed";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#0F0714]">
      <Navbar />
      <Hero />
      <N8NAutomation />
      <Features />
      <TechnologyUsed />
    </main>
  );
}
