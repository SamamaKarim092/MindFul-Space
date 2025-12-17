"use client";

import { MoreHorizontal, Smile, Frown, Meh } from "lucide-react";

const entries = [
  {
    id: 1,
    title: "Feeling anxious about work",
    preview: "Today was a bit overwhelming with the upcoming deadline...",
    mood: "Anxious",
    moodIcon: Frown,
    moodColor: "text-orange-400",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "Great morning run!",
    preview: "Started the day with a 5k run and felt amazing afterwards...",
    mood: "Happy",
    moodIcon: Smile,
    moodColor: "text-green-400",
    time: "Yesterday",
  },
  {
    id: 3,
    title: "Just a regular day",
    preview: "Nothing special happened today, just went through the routine...",
    mood: "Neutral",
    moodIcon: Meh,
    moodColor: "text-blue-400",
    time: "2 days ago",
  },
];

export default function RecentEntries() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Entries</h3>
        <button className="text-sm text-purple-400 hover:text-purple-300">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => {
          const MoodIcon = entry.moodIcon;
          return (
            <div
              key={entry.id}
              className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-black/20 ${entry.moodColor}`}
                  >
                    <MoodIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white group-hover:text-purple-300 transition-colors">
                      {entry.title}
                    </h4>
                    <span className="text-xs text-gray-500">{entry.time}</span>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 pl-[52px]">
                {entry.preview}
              </p>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2">
        <span>+ New Entry</span>
      </button>
    </div>
  );
}
