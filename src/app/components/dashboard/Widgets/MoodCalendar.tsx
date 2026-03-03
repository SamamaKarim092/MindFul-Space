"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useEntries } from "@/hooks/use-api";

// Mood to color mapping
const MOOD_COLORS: Record<string, string> = {
  Happy:     "#facc15", // yellow
  Neutral:   "#a78bfa", // purple
  Sad:       "#60a5fa", // blue
  Anxious:   "#c084fc", // light purple
  Energetic: "#fb923c", // orange
  Calm:      "#34d399", // emerald
  Grateful:  "#f472b6", // pink
  Angry:     "#ef4444", // red
};

const NO_ENTRY_COLOR = "rgba(255,255,255,0.03)";
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getPrimaryMoodLabel(entry: any): string {
  if (entry.moodLabels && entry.moodLabels.length > 0) {
    return entry.moodLabels.find((l: string) => MOOD_COLORS[l]) || entry.moodLabels[0];
  }
  if (entry.mood === "POSITIVE") return "Happy";
  if (entry.mood === "NEGATIVE") return "Sad";
  return "Neutral";
}

export default function MoodCalendar() {
  const { data: entries, isLoading } = useEntries();

// Build a map of date -> primary mood
  const moodMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!entries) return map;
    for (const entry of entries) {
      // Use local date string (YYYY-MM-DD) instead of UTC ISO string
      const dateKey = format(new Date(entry.createdAt), 'yyyy-MM-dd');
      if (!map[dateKey]) {
        map[dateKey] = getPrimaryMoodLabel(entry);
      }
    }
    return map;
  }, [entries]);

  // Generate grid of last 12 weeks (84 days)
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const totalDays = 84; // 12 weeks
    const result: Array<Array<{ date: Date; dateKey: string; mood: string | null }>> = [];

    // Start from 84 days ago, aligned to Monday
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);
    // Align to Monday (0 = Sun, 1 = Mon)
    const dayOfWeek = startDate.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToMonday);

    let currentWeek: typeof result[0] = [];
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 1);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = format(d, 'yyyy-MM-dd');
      currentWeek.push({
        date: new Date(d),
        dateKey,
        mood: moodMap[dateKey] || null,
      });
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [moodMap]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({
            label: firstDay.date.toLocaleString("default", { month: "short" }),
            col: i,
          });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="h-5 bg-white/10 rounded w-48 animate-pulse mb-4" />
        <div className="h-[120px] bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Mood Calendar</h3>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-2 pt-5">
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="h-[14px] text-[10px] text-gray-500 leading-[14px]">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div>
            {/* Month labels row */}
            <div className="flex gap-0.5 mb-1 h-4">
              {weeks.map((_, i) => {
                const label = monthLabels.find((m) => m.col === i);
                return (
                  <div key={i} className="w-[14px] text-[10px] text-gray-500">
                    {label?.label || ""}
                  </div>
                );
              })}
            </div>

            {/* Calendar grid */}
            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, di) => {
                    const isFuture = day.date > new Date();
                    const color = day.mood ? MOOD_COLORS[day.mood] || "#6b7280" : NO_ENTRY_COLOR;
                    return (
                      <div
                        key={di}
                        className="w-[14px] h-[14px] rounded-[3px] transition-all hover:scale-125 cursor-default"
                        style={{
                          backgroundColor: isFuture ? "transparent" : color,
                          border: isFuture ? "1px solid rgba(255,255,255,0.05)" : "none",
                        }}
                        title={`${day.dateKey}${day.mood ? ` — ${day.mood}` : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs">
        {Object.entries(MOOD_COLORS).map(([mood, color]) => (
          <div key={mood} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-gray-400">{mood}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
