"use client";

import { Search, Calendar, Filter, Loader2 } from "lucide-react";
import { gql, useQuery } from "@apollo/client";
import { format } from "date-fns";

const GET_ENTRIES = gql`
  query GetEntries {
    entries {
      id
      title
      content
      mood
      customMoodLabel
      moodLabels
      tags
      sentiment
      createdAt
      updatedAt
    }
  }
`;

const moodColors = {
  POSITIVE: "border-green-400/50",
  NEUTRAL: "border-blue-400/50",
  NEGATIVE: "border-orange-400/50",
};

const moodLabels = {
  POSITIVE: "Happy",
  NEUTRAL: "Neutral",
  NEGATIVE: "Sad",
};

export default function JournalEntryList() {
  const { data, loading, error } = useQuery(GET_ENTRIES, {
    pollInterval: 5000, // Refresh every 5 seconds
  });

  const entries = data?.entries || [];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Recent Entries</h2>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search entries..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          Failed to load entries. Please refresh the page.
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-medium mb-2">No entries yet</p>
          <p className="text-sm">Start journaling to see your entries here</p>
        </div>
      )}

      <div className="space-y-4">
        {entries.map((entry: any) => {
          const preview =
            entry.content.length > 100
              ? entry.content.substring(0, 100) + "..."
              : entry.content;
          const formattedDate = format(
            new Date(entry.createdAt),
            "MMM dd, h:mm a"
          );

          return (
            <div
              key={entry.id}
              className={`bg-white/5 border-l-4 ${entry.mood ? moodColors[entry.mood as keyof typeof moodColors] : "border-gray-500/50"} rounded-r-xl p-4 hover:bg-white/10 transition-all cursor-pointer group`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                  {entry.title}
                </h3>
                <span className="text-xs text-gray-500">{formattedDate}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {preview}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {entry.moodLabels && entry.moodLabels.length > 0
                  ? entry.moodLabels.map((label: string) => (
                      <span
                        key={label}
                        className="text-xs px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {label}
                      </span>
                    ))
                  : null}
                {entry.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
