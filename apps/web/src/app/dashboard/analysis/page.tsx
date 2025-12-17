"use client";

import {
  BrainCircuit,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const insights = [
  {
    type: "positive",
    title: "Morning Routine Impact",
    description:
      "Your mood is 40% higher on days when you log a morning meditation session.",
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    type: "warning",
    title: "Sleep Correlation",
    description:
      "Anxiety levels tend to spike when you report less than 6 hours of sleep.",
    icon: AlertCircle,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    type: "suggestion",
    title: "Activity Suggestion",
    description:
      "You seem to have more energy on weekends. Consider moving high-effort tasks to Saturday mornings.",
    icon: Lightbulb,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
];

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">AI Analysis</h2>
        <p className="text-gray-400">
          Deep insights derived from your journal entries and mood patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-2xl p-6 col-span-full">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <BrainCircuit className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Weekly Summary
              </h3>
              <p className="text-gray-300 leading-relaxed">
                This week has shown a positive upward trend in your overall
                mood. You've been consistent with your journaling, which
                correlates with better emotional regulation. The data suggests
                that social interactions on Wednesday significantly boosted your
                spirits, while work-related stress peaked on Tuesday.
              </p>
            </div>
          </div>
        </div>

        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`bg-white/5 border ${insight.border} rounded-2xl p-6 hover:bg-white/10 transition-all`}
            >
              <div className={`p-3 rounded-xl w-fit mb-4 ${insight.bg}`}>
                <Icon className={`w-6 h-6 ${insight.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {insight.title}
              </h3>
              <p className="text-sm text-gray-400">{insight.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          Sentiment Keywords
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            "Productive",
            "Anxious",
            "Grateful",
            "Tired",
            "Excited",
            "Overwhelmed",
            "Peaceful",
            "Stressed",
          ].map((word, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:border-purple-500/50 hover:text-purple-300 transition-all cursor-default"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
