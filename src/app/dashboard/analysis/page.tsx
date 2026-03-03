"use client";

import { useState, useEffect } from "react";
import {
  BrainCircuit,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Flame as FireIcon,
  Smile,
  Frown,
  Meh,
  CloudRain,
  Zap,
  Coffee,
  Heart,
  Flame,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useAnalysis } from "@/hooks/use-api";
import { apiFetch } from "@/lib/api/fetcher";

const MOOD_COLORS: Record<string, string> = {
  Happy: "#FACC15",
  Neutral: "#C084FC",
  Sad: "#60A5FA",
  Anxious: "#D8B4FE",
  Energetic: "#FB923C",
  Calm: "#34D399",
  Grateful: "#F472B6",
  Angry: "#EF4444",
};

const MOOD_ICONS: Record<string, any> = {
  Happy: Smile,
  Neutral: Meh,
  Sad: Frown,
  Anxious: CloudRain,
  Energetic: Zap,
  Calm: Coffee,
  Grateful: Heart,
  Angry: Flame,
};

const INSIGHT_ICONS: Record<string, any> = {
  positive: CheckCircle2,
  warning: AlertCircle,
  suggestion: Lightbulb,
};

const INSIGHT_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  positive: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  warning: { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  suggestion: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
};

export default function AnalysisPage() {
  const [days, setDays] = useState(30);
  const { data: analysis, isLoading, error } = useAnalysis(days);

  // AI insights state
  const [aiData, setAiData] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Fetch AI insights when analysis data is ready
  useEffect(() => {
    if (!analysis || analysis.totalEntries === 0) {
      setAiData(null);
      return;
    }

    const fetchAI = async () => {
      setAiLoading(true);
      try {
        const result = await apiFetch("/api/entries/analysis/ai", {
          method: "POST",
          body: JSON.stringify({
            entrySummaries: analysis.entrySummaries,
            moodBreakdown: analysis.moodBreakdown,
            avgSentiment: analysis.avgSentiment,
            sentimentTrend: analysis.sentimentTrend,
            writingStreak: analysis.writingStreak,
            totalEntries: analysis.totalEntries,
            period: analysis.period,
          }),
        });
        console.log("AI analysis result:", result);
        setAiData(result);
      } catch (err) {
        console.error("AI analysis fetch error:", err);
        setAiData(null);
      } finally {
        setAiLoading(false);
      }
    };

    fetchAI();
  }, [analysis]);

  // Mood breakdown sorted by count
  const moodEntries = analysis?.moodBreakdown
    ? Object.entries(analysis.moodBreakdown)
        .sort((a: any, b: any) => b[1] - a[1])
    : [];

  const totalMoodTags = moodEntries.reduce((acc: number, [, count]: any) => acc + count, 0);

  const sentimentIcon =
    analysis?.sentimentTrend === "up" ? TrendingUp :
    analysis?.sentimentTrend === "down" ? TrendingDown : Minus;

  const sentimentLabel =
    analysis?.sentimentTrend === "up" ? "Improving" :
    analysis?.sentimentTrend === "down" ? "Declining" : "Stable";

  const sentimentColor =
    analysis?.sentimentTrend === "up" ? "text-green-400" :
    analysis?.sentimentTrend === "down" ? "text-red-400" : "text-gray-400";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">AI Analysis</h2>
          <p className="text-gray-400">
            Deep insights derived from your journal entries and mood patterns
          </p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 3 Months</option>
        </select>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          Failed to load analysis. Please refresh the page.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && analysis?.totalEntries === 0 && (
        <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No entries yet</h3>
          <p className="text-gray-500">Start journaling to unlock AI-powered insights about your emotional patterns!</p>
        </div>
      )}

      {!isLoading && !error && analysis && analysis.totalEntries > 0 && (
        <>
          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-gray-400">Entries</span>
              </div>
              <p className="text-2xl font-bold text-white">{analysis.totalEntries}</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-gray-400">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {analysis.writingStreak} <span className="text-sm font-normal text-gray-500">days</span>
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-gray-400">Avg Sentiment</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {analysis.avgSentiment !== null
                  ? `${Math.round(analysis.avgSentiment * 100)}%`
                  : "—"}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                {(() => {
                  const SentIcon = sentimentIcon;
                  return <SentIcon className={`w-4 h-4 ${sentimentColor}`} />;
                })()}
                <span className="text-xs text-gray-400">Trend</span>
              </div>
              <p className={`text-2xl font-bold ${sentimentColor}`}>{sentimentLabel}</p>
            </div>
          </div>

          {/* AI Summary (with loading shimmer) */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl shrink-0">
                <BrainCircuit className="w-8 h-8 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  AI Summary
                </h3>
                {aiLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-4/5" />
                    <div className="h-4 bg-white/10 rounded animate-pulse w-3/5" />
                  </div>
                ) : aiData?.summary ? (
                  <p className="text-gray-300 leading-relaxed">{aiData.summary}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    {analysis.totalEntries < 3
                      ? "Write at least 3 entries to unlock AI-powered summaries."
                      : "AI summary will appear here. Make sure the n8n Analyze Entries workflow is set up."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* AI Insight Cards */}
          {aiData?.insights && aiData.insights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiData.insights.map((insight: any, index: number) => {
                const type = insight.type || "suggestion";
                const style = INSIGHT_STYLES[type] || INSIGHT_STYLES.suggestion;
                const Icon = INSIGHT_ICONS[type] || Lightbulb;
                return (
                  <div
                    key={index}
                    className={`bg-white/5 border ${style.border} rounded-2xl p-6 hover:bg-white/10 transition-all`}
                  >
                    <div className={`p-3 rounded-xl w-fit mb-4 ${style.bg}`}>
                      <Icon className={`w-6 h-6 ${style.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-gray-400">{insight.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Loading Shimmer for Insights */}
          {aiLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-xl mb-4 animate-pulse" />
                  <div className="h-5 bg-white/10 rounded w-2/3 mb-3 animate-pulse" />
                  <div className="h-3 bg-white/10 rounded w-full mb-2 animate-pulse" />
                  <div className="h-3 bg-white/10 rounded w-4/5 animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Mood Breakdown + Keywords Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mood Breakdown */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Mood Breakdown</h3>
              {moodEntries.length > 0 ? (
                <div className="space-y-3">
                  {moodEntries.map(([mood, count]: any) => {
                    const percent = totalMoodTags > 0 ? Math.round((count / totalMoodTags) * 100) : 0;
                    const MIcon = MOOD_ICONS[mood] || Meh;
                    return (
                      <div key={mood} className="flex items-center gap-3">
                        <MIcon
                          className="w-5 h-5 shrink-0"
                          style={{ color: MOOD_COLORS[mood] || "#9CA3AF" }}
                        />
                        <span className="text-sm text-gray-300 w-20 shrink-0">{mood}</span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percent}%`,
                              backgroundColor: MOOD_COLORS[mood] || "#9CA3AF",
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {count} ({percent}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No mood data available yet.</p>
              )}
            </div>

            {/* Sentiment Keywords */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Your Most Used Words
              </h3>
              {analysis.topKeywords && analysis.topKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.topKeywords.map((kw: any, i: number) => {
                    // Scale size based on count
                    const maxCount = analysis.topKeywords[0].count;
                    const ratio = kw.count / maxCount;
                    const size = ratio > 0.7 ? "text-base px-4 py-2" : ratio > 0.4 ? "text-sm px-3 py-1.5" : "text-xs px-3 py-1.5";
                    const opacity = ratio > 0.7 ? "text-purple-300 border-purple-500/30" : ratio > 0.4 ? "text-gray-300 border-white/15" : "text-gray-400 border-white/10";
                    return (
                      <span
                        key={i}
                        className={`rounded-full bg-white/5 border ${opacity} ${size} hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-default`}
                        title={`Used ${kw.count} times`}
                      >
                        {kw.word}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Write more to see your frequently used words.</p>
              )}
            </div>
          </div>

          {/* AI Suggestions */}
          {aiData?.suggestions && aiData.suggestions.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Wellness Suggestions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiData.suggestions.map((suggestion: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/5"
                  >
                    <span className="text-yellow-400 text-lg mt-0.5">💡</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
