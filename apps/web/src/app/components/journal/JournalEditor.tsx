"use client";

import { useState, useEffect } from "react";
import {
  Smile,
  Frown,
  Meh,
  CloudRain,
  Zap,
  Save,
  Tag,
  Heart,
  Coffee,
  Sparkles,
} from "lucide-react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { detectMoodFromText } from "@/lib/mood-detection";

const SUGGEST_MOOD = gql`
  query SuggestMood($content: String!) {
    suggestMood(content: $content) {
      suggestions
    }
  }
`;

const CREATE_ENTRY = gql`
  mutation CreateEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
      id
      title
      content
      mood
      customMoodLabel
      moodLabels
      tags
      createdAt
    }
  }
`;

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

const moods = [
  {
    icon: Smile,
    label: "Happy",
    value: "POSITIVE",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
  },
  {
    icon: Meh,
    label: "Neutral",
    value: "NEUTRAL",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Frown,
    label: "Sad",
    value: "NEGATIVE",
    color: "text-blue-300",
    bg: "bg-blue-300/10",
    border: "border-blue-300/20",
  },
  {
    icon: CloudRain,
    label: "Anxious",
    value: "NEGATIVE",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    icon: Zap,
    label: "Energetic",
    value: "POSITIVE",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    icon: Coffee,
    label: "Calm",
    value: "NEUTRAL",
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    border: "border-teal-400/20",
  },
  {
    icon: Heart,
    label: "Grateful",
    value: "POSITIVE",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
];

const REFLECTION_PROMPTS = [
  "What made you smile today?",
  "What is a challenge you faced today, and how did you handle it?",
  "Describe a moment where you felt at peace.",
  "What is something you learned about yourself recently?",
  "Who are you grateful for today and why?",
  "What is one thing you want to let go of?",
  "How did you take care of yourself today?",
  "What are you looking forward to tomorrow?",
];

export default function JournalEditor() {
  const [selectedMoods, setSelectedMoods] = useState<typeof moods>([]); // Start with no moods selected
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [suggestedMood, setSuggestedMood] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(REFLECTION_PROMPTS[0]);

  const [getSuggestMood] = useLazyQuery(SUGGEST_MOOD);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  
  const getEncouragement = () => {
      if (wordCount === 0) return "Ready to listen...";
      if (wordCount < 10) return "Great start...";
      if (wordCount < 30) return "Keep flowing...";
      if (wordCount < 50) return "You're doing great!";
      return "Excellent depth!";
  };

  const getActiveMoodStyle = () => {
      // Prioritize suggested mood, then first selected mood
      const moodLabel = suggestedMood || (selectedMoods.length > 0 ? selectedMoods[0].label : null);
      if (!moodLabel) return null;
      return moods.find(m => m.label.toLowerCase() === moodLabel.toLowerCase());
  };

  const activeMoodStyle = getActiveMoodStyle();

  const shufflePrompt = () => {
    const currentIndex = REFLECTION_PROMPTS.indexOf(currentPrompt);
    const nextIndex = (currentIndex + 1) % REFLECTION_PROMPTS.length;
    setCurrentPrompt(REFLECTION_PROMPTS[nextIndex]);
  };

  // Live Mood Detection Effect - Triggers 1 second after user stops typing
  // Analyzes both title and content for mood keywords
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Combine title and content for mood detection
      const combinedText = `${title} ${content}`.trim();

      if (!combinedText || combinedText.length < 5) {
        setSuggestedMood(null);
        setAiSuggestions([]);
        return;
      }

      // First try keyword detection (instant)
      const keywordMood = detectMoodFromText(combinedText);

      if (keywordMood) {
        console.log("✅ Keyword match found:", keywordMood);
        setSuggestedMood(keywordMood);
        setAiSuggestions([]);
      } else {
        // Fallback to AI if no keyword match
        console.log("🤖 No keyword match, calling AI for:", combinedText);
        setIsLoadingAI(true);
        try {
          const { data } = await getSuggestMood({
            variables: { content: combinedText },
          });

          const suggestions = data?.suggestMood?.suggestions || [];
          console.log("🎯 AI returned suggestions:", suggestions);
          setAiSuggestions(suggestions);
          setSuggestedMood(null); // Clear single suggestion when showing multiple
        } catch (error) {
          console.error("❌ AI mood suggestion error:", error);
          setAiSuggestions([]);
        } finally {
          setIsLoadingAI(false);
        }
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [title, content, getSuggestMood]);

  const [createEntry, { loading, error }] = useMutation(CREATE_ENTRY, {
    refetchQueries: [{ query: GET_ENTRIES }],
    onCompleted: () => {
      // Reset form
      setTitle("");
      setContent("");
      setTags("");
      setSelectedMoods([moods[1]]); // Reset to default Neutral mood
      setSuggestedMood(null);
      setSuccessMessage("Entry saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error) => {
      console.error("Error creating entry:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsSaving(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Extract all mood labels from selected moods
      const moodLabels = selectedMoods.map((m) => m.label);

      // Determine which mood to save as primary and capture any custom AI mood labels
      const customMoodLabel = selectedMoods.find(
        (m) =>
          m.value === "NEUTRAL" &&
          !moods.some((hardcoded) => hardcoded.label === m.label)
      )?.label;

      // Only save hardcoded mood if a hardcoded mood was actually selected
      const hardcodedMood = selectedMoods.find((m) =>
        moods.some((hardcoded) => hardcoded.label === m.label)
      );

      await createEntry({
        variables: {
          input: {
            title: title.trim(),
            content: content.trim(),
            mood: hardcodedMood ? hardcodedMood.value : undefined,
            customMoodLabel: customMoodLabel || null,
            moodLabels: moodLabels,
            tags: tagsArray,
          },
        },
      });
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        New Journal Entry
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">
              How are you feeling?
            </label>
            {isLoadingAI && (
              <span className="text-xs text-purple-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-pulse" />
                AI analyzing...
              </span>
            )}
            {suggestedMood && !isLoadingAI && (
              <span className="text-xs text-purple-400 animate-pulse">
                It sounds like you might be feeling {suggestedMood}...
              </span>
            )}
          </div>

          {/* AI Mood Suggestions Chips */}
          {aiSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl shadow-lg">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-sm text-purple-300 font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  AI Mood Suggestions
                </span>
                <span className="text-xs text-gray-400">Click to select</span>
              </div>
              <div className="w-full flex flex-wrap gap-2">
                {aiSuggestions.map((suggestion, index) => {
                  // Try to match with existing mood, otherwise create custom
                  const matchingMood = moods.find(
                    (m) => m.label.toLowerCase() === suggestion.toLowerCase()
                  );
                  const Icon = matchingMood?.icon || Sparkles;
                  const isSelected =
                    selectedMoods.find((m) => m.label === suggestion) !==
                    undefined;

                  return (
                    <button
                      key={`${suggestion}-${index}`}
                      type="button"
                      onClick={() => {
                        if (matchingMood) {
                          // Toggle mood in selected moods
                          if (
                            selectedMoods.find((m) => m.label === suggestion)
                          ) {
                            setSelectedMoods(
                              selectedMoods.filter(
                                (m) => m.label !== suggestion
                              )
                            );
                          } else {
                            setSelectedMoods([...selectedMoods, matchingMood]);
                          }
                        } else {
                          // Create a custom mood object for AI-suggested moods
                          const customMood = {
                            icon: Sparkles,
                            label: suggestion,
                            value: "NEUTRAL", // Default to NEUTRAL for custom moods
                            color: "text-purple-400",
                            bg: "bg-purple-400/10",
                            border: "border-purple-400/20",
                          };
                          // Toggle custom mood
                          if (
                            selectedMoods.find((m) => m.label === suggestion)
                          ) {
                            setSelectedMoods(
                              selectedMoods.filter(
                                (m) => m.label !== suggestion
                              )
                            );
                          } else {
                            setSelectedMoods([...selectedMoods, customMood]);
                          }
                        }
                        // Keep suggestions visible after selection
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedMoods.find((m) => m.label === suggestion)
                          ? matchingMood
                            ? `${matchingMood.bg} ${matchingMood.color} border ${matchingMood.border} ring-2 ring-offset-2 ring-offset-[#0F0714]`
                            : "bg-purple-500/20 text-purple-300 border border-purple-400/50 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-[#0F0714]"
                          : "bg-white/5 text-gray-300 hover:bg-purple-500/10 hover:text-purple-300 border border-white/10 hover:border-purple-500/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMoods.some(
                (m) => m.value === mood.value && m.label === mood.label
              );
              const isSuggested = suggestedMood === mood.label;

              return (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => {
                    // Toggle mood in selected moods
                    if (isSelected) {
                      setSelectedMoods(
                        selectedMoods.filter(
                          (m) =>
                            !(m.value === mood.value && m.label === mood.label)
                        )
                      );
                    } else {
                      setSelectedMoods([...selectedMoods, mood]);
                    }
                  }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? `${mood.bg} ${mood.border} ${mood.color}`
                      : isSuggested
                        ? "bg-white/10 border-purple-500/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                        : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {isSuggested && !isSelected && (
                    <span className="absolute -top-2 -right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                  )}
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your day a headline..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all"
          />
        </div>

        {/* Content Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-400">
              Reflection
            </label>
            <button
              type="button"
              onClick={shufflePrompt}
              className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              Inspire me
            </button>
          </div>
          <div className="relative group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentPrompt}
              className={`w-full h-64 bg-black/20 border rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none transition-all resize-none ${
                activeMoodStyle
                  ? `${activeMoodStyle.border} shadow-[0_0_20px_rgba(0,0,0,0)] focus:shadow-[0_0_20px_rgba(168,85,247,0.1)]`
                  : "border-white/10 focus:border-purple-500/50 focus:bg-black/40"
              }`}
            />
            {/* Word count and encouragement indicator */}
            <div className="absolute bottom-4 right-4 text-xs font-medium transition-all duration-300 opacity-50 group-hover:opacity-100 flex items-center gap-2">
              <span className={wordCount > 0 ? "text-purple-400" : "text-gray-600"}>
                {getEncouragement()}
              </span>
              <span className="text-gray-600 bg-black/40 px-2 py-1 rounded-md">
                {wordCount} words
              </span>
            </div>
          </div>
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">Tags</label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags separated by commas (e.g., work, family, sleep)"
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all"
            />
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
            Failed to save entry. Please try again.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/10">
          <button
            type="button"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSaving || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSaving || loading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
}
