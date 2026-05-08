"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import Navbar from "@/app/components/home/Navbar";
import Hero from "@/app/components/landing/Hero";
import Philosophy from "@/app/components/landing/Philosophy";
import DashboardShowcase from "@/app/components/landing/DashboardShowcase";
import Features from "@/app/components/landing/Features";
import ImpactNumbers from "@/app/components/landing/ImpactNumbers";
import FinalCTA from "@/app/components/landing/FinalCTA";


// checking commit

export default function HomePage() {
  // Read the current auth state so the page knows whether to keep the user here or redirect.
  const { user, loading } = useAuth();
  // Next.js router used for programmatic navigation.
  const router = useRouter();

  useEffect(() => {
    // If the user is already signed in, send them straight to the dashboard.
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);


  return (
    // Public landing page shown only when the user is not already authenticated.
    <main className="bg-[#f6f1eb] text-slate-950">
      <Navbar />

      {/* Content wrapper with margin bottom for footer reveal */}
      <div className="relative z-10 bg-[#f6f1eb] mb-[100vh] rounded-b-[2rem] sm:rounded-b-[4rem] shadow-[0_20px_80px_rgba(0,0,0,0.4)] transition-all">
        <div className="relative">
          <Hero />
          <Philosophy />
        </div>
        <div className="relative z-20 bg-[#f6f1eb] rounded-b-[2rem] sm:rounded-b-[4rem] pb-8">
          <DashboardShowcase />
          <Features />
          <ImpactNumbers />
        </div>
      </div>

      {/* Sticky Footer Reveal */}
      <div className="fixed bottom-0 left-0 right-0 z-0 h-screen w-full">
        <FinalCTA />
      </div>
    </main>
  );
}
