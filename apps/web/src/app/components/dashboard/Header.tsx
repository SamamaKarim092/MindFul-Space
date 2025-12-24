"use client";

import { useAuth } from "@/lib/auth/context";
import { useMood } from "@/app/context/MoodContext";
import { Bell, Search } from "lucide-react";

export default function Header() {
  const { user } = useAuth();
  const { currentMood } = useMood();

  return (
    <header className="h-16 border-b border-white/10 bg-[#0F0714]/50 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 hidden md:block">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-500 ${currentMood.accent}`} />
          <input
            type="text"
            placeholder="Search entries, moods, or resources..."
            className={`w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder:opacity-60 transition-all duration-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10`}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-[#0F0714]" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-gray-400">Free Plan</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
            {user?.email?.[0].toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
}
