"use client";

import { Activity, TrendingUp, Zap, Book as BookIcon } from "lucide-react";
import { gql, useQuery } from "@apollo/client";
import { useMemo } from "react";

const GET_ENTRIES = gql`
  query GetEntries {
    entries {
      id
      createdAt
    }
  }
`;

const GET_ENTRY_STATS = gql`
  query GetEntryStats {
    entryStats {
      totalEntries
      positiveCount
      neutralCount
      negativeCount
      averageSentiment
    }
  }
`;

export default function StatsCards() {
  const { data: entriesData, loading: entriesLoading } = useQuery(GET_ENTRIES, {
    pollInterval: 30000, // Poll every 30 seconds
  });
  const { data: statsData, loading: statsLoading } = useQuery(GET_ENTRY_STATS, {
    pollInterval: 30000, // Poll every 30 seconds
  });

  // Calculate current streak from entries
  const streak = useMemo(() => {
    if (!entriesData?.entries || entriesData.entries.length === 0) {
      return 0;
    }

    // Sort entries by date (most recent first)
    const sortedEntries = [...entriesData.entries].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get unique dates
    const uniqueDates = Array.from(
      new Set(
        sortedEntries.map((entry) => new Date(entry.createdAt).toDateString())
      )
    );

    if (uniqueDates.length === 0) return 0;

    // Check consecutive days
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(uniqueDates[0]);
    currentDate.setHours(0, 0, 0, 0);

    // If most recent entry is not today or yesterday, streak is 0
    const daysDiff = Math.floor(
      (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 1) {
      return streak; // Only today's entry or yesterday
    }

    // Count consecutive days
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      prevDate.setHours(0, 0, 0, 0);
      currDate.setHours(0, 0, 0, 0);

      const diff = Math.floor(
        (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [entriesData]);

  const stats = [
    {
      label: "Current Streak",
      value: `${streak} ${streak === 1 ? "Day" : "Days"}`,
      change: streak > 0 ? "Keep it up!" : "Start journaling today",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Average Mood",
      value:
        statsData?.entryStats?.averageSentiment !== null &&
        statsData?.entryStats?.averageSentiment !== undefined
          ? (statsData.entryStats.averageSentiment * 10).toFixed(1)
          : "N/A",
      change:
        statsData?.entryStats?.averageSentiment !== null &&
        statsData?.entryStats?.averageSentiment !== undefined
          ? statsData.entryStats.averageSentiment > 0
            ? "Positive sentiment"
            : statsData.entryStats.averageSentiment < 0
              ? "Needs attention"
              : "Neutral"
          : "No data yet",
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: "Total Entries",
      value: `${statsData?.entryStats?.totalEntries || 0}`,
      change:
        (statsData?.entryStats?.totalEntries || 0) > 0
          ? "Entries recorded"
          : "No entries yet",
      icon: BookIcon,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Mood Trend",
      value: "Coming Soon",
      change: "More features ahead",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  if (entriesLoading || statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse"
          >
            <div className="h-12 bg-white/10 rounded-xl mb-4"></div>
            <div className="h-8 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
