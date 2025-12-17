"use client";

import EntriesList from "@/app/components/entries/EntriesList";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function EntriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            My Journal Entries
          </h2>
          <p className="text-gray-400">
            A collection of your thoughts, feelings, and moments.
          </p>
        </div>
        <Link
          href="/dashboard/journal"
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </Link>
      </div>

      <EntriesList />
    </div>
  );
}
