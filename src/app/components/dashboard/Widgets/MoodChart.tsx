"use client";

import { useState } from "react";
import { useMoodTrends } from "@/hooks/use-api";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

export default function MoodChart() {
  const [days, setDays] = useState(7);

  const { data, isLoading: loading, error } = useMoodTrends(days);

  // Transform data for the chart
  const chartData = (data || []).map((trend: any) => {
    // Parse the date and format it
    const date = parseISO(trend.date);
    const dayLabel = format(date, "EEE"); // Mon, Tue, Wed, etc.

    // Convert sentiment from -1 to 1 scale to 0 to 10 scale for better visualization
    // sentiment = null means no sentiment analysis yet
    const moodScore =
      trend.averageSentiment !== null
        ? ((trend.averageSentiment + 1) / 2) * 10
        : null;

    return {
      day: dayLabel,
      fullDate: format(date, "MMM dd"),
      mood: moodScore,
      rawSentiment: trend.averageSentiment,
      positiveCount: trend.positiveCount,
      neutralCount: trend.neutralCount,
      negativeCount: trend.negativeCount,
    };
  });

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDays(Number(e.target.value));
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-white/10 rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-white/10 rounded w-32 animate-pulse"></div>
        </div>
        <div className="h-[300px] w-full bg-white/5 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Weekly Mood Overview
          </h3>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-400">
          Error loading mood trends
        </div>
      </div>
    );
  }

  const hasData =
    chartData.length > 0 && chartData.some((d: any) => d.mood !== null);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Mood Overview</h3>
        <select
          className="bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none"
          value={days}
          onChange={handlePeriodChange}
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
        </select>
      </div>

      {!hasData ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="mb-2">No sentiment data available yet</p>
            <p className="text-sm">
              Sentiment scores will appear here once your entries are analyzed
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F1229",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: any, name: string, props: any) => {
                  if (name === "mood" && value !== null) {
                    return [
                      <>
                        <div>Mood Score: {value.toFixed(1)}/10</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {props.payload.fullDate}
                        </div>
                        <div className="text-xs text-gray-400">
                          😊 {props.payload.positiveCount} | 😐{" "}
                          {props.payload.neutralCount} | 😔{" "}
                          {props.payload.negativeCount}
                        </div>
                      </>,
                      "Mood",
                    ];
                  }
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#C084FC"
                strokeWidth={3}
                dot={{ fill: "#C084FC", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "#fff" }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
