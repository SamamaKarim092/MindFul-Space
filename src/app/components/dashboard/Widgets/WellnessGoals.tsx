"use client";

import Link from "next/link";
import { useEntries } from "@/hooks/use-api";
import { BookOpen, PenLine } from "lucide-react";
import { format } from "date-fns";

const moodEmojis: Record<string, string> = {
  Happy: "😊",
  Neutral: "😐",
  Sad: "😢",
  Anxious: "😰",
  Energetic: "⚡",
  Calm: "😌",
  Grateful: "🙏",
  Angry: "😠",
};

export default function WellnessGoals() {
  const { data: entries, isLoading } = useEntries();

  // Check if user journaled today
  const today = new Date().toDateString();
  const journaledToday = entries?.some(
    (e: any) => new Date(e.createdAt).toDateString() === today,
  );

  const recentEntries = (entries || []).slice(0, 3);

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="h-5 bg-white/10 rounded w-40 animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-white/10 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Journal Today Prompt */}
      {!journaledToday && (
        <Link
          href="/dashboard/journal"
          className="flex items-center gap-3 p-4 mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
        >
          <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
            <PenLine className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">
              Haven&apos;t journaled today
            </p>
            <p className="text-gray-400 text-xs">Tap to write about your day</p>
          </div>
        </Link>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Recent Entries
        </h3>
        <Link
          href="/dashboard/entries"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View All
        </Link>
      </div>

      {recentEntries.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">No entries yet</p>
          <p className="text-xs mt-1">
            Start journaling to see your entries here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {recentEntries.map((entry: any) => {
            const primaryMood = entry.moods?.[0]?.label || "Neutral";
            return (
              <Link
                key={entry.id}
                href="/dashboard/entries"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="text-lg">
                  {moodEmojis[primaryMood] || "😐"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate group-hover:text-purple-300 transition-colors">
                    {entry.title || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(entry.createdAt), "MMM d, h:mm a")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
