"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Book,
  FileText,
  TrendingUp,
  BrainCircuit,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming utils exists, or I'll use clsx/tailwind-merge directly if not
import { useAuth } from "@/lib/auth/context";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Book, label: "Journal", href: "/dashboard/journal" },
  { icon: FileText, label: "Entries", href: "/dashboard/entries" },
  { icon: TrendingUp, label: "Trends", href: "/dashboard/trends" },
  { icon: BrainCircuit, label: "Analysis", href: "/dashboard/analysis" },
  { icon: User, label: "Therapist", href: "/dashboard/therapist" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 bg-[#0F0714] border-r border-white/10 text-white hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Mindful
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-white/10 text-white shadow-lg shadow-purple-500/10"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-purple-400"
                    : "text-gray-400 group-hover:text-purple-400"
                )}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
