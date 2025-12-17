"use client";

import { useState } from "react";
import { Smile, Frown, Meh, CloudRain, Zap, Save, Tag } from "lucide-react";
import { gql, useMutation } from "@apollo/client";

const CREATE_ENTRY = gql`
  mutation CreateEntry($input: CreateEntryInput!) {
    createEntry(input: $input) {
      id
      title
      content
      mood
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
];

export default function JournalEditor() {
  const [selectedMood, setSelectedMood] = useState(moods[1]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [createEntry, { loading, error }] = useMutation(CREATE_ENTRY, {
    refetchQueries: [{ query: GET_ENTRIES }],
    onCompleted: () => {
      // Reset form
      setTitle("");
      setContent("");
      setTags("");
      setSelectedMood(moods[1]);
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

      await createEntry({
        variables: {
          input: {
            title: title.trim(),
            content: content.trim(),
            mood: selectedMood.value,
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
          <label className="text-sm font-medium text-gray-400">
            How are you feeling?
          </label>
          <div className="flex flex-wrap gap-3">
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood.value === mood.value;
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? `${mood.bg} ${mood.border} ${mood.color}`
                      : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                  }`}
                >
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
          <label className="text-sm font-medium text-gray-400">
            Reflection
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full h-64 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all resize-none"
          />
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
