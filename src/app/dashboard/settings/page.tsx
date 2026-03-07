"use client";

import { useState, useEffect } from "react";
import { User, Download, LogOut, Shield, Info, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { apiFetch } from "@/lib/api/fetcher";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Load display name from Supabase user metadata
  useEffect(() => {
    if (user) {
      setDisplayName(
        user.user_metadata?.display_name || user.email?.split("@")[0] || "",
      );
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error(
          "Supabase environment variables are missing. Profile updates are unavailable.",
        );
      }

      await supabase.auth.updateUser({
        data: { display_name: displayName },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) return;
    setPasswordSaving(true);
    setPasswordSaved(false);
    setPasswordError("");
    try {
      const supabase = createClient();
      if (!supabase) {
        throw new Error(
          "Supabase environment variables are missing. Password updates are unavailable.",
        );
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (!error) {
        setPasswordSaved(true);
        setNewPassword("");
        setTimeout(() => setPasswordSaved(false), 3000);
      } else {
        setPasswordError(error.message || "Failed to update password.");
        console.error("Failed to change password:", error.message);
      }
    } catch (err: any) {
      setPasswordError(err?.message || "An unexpected error occurred.");
      console.error("Failed to change password:", err);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const entries = await apiFetch("/api/entries");
      const data = {
        exportedAt: new Date().toISOString(),
        email: user?.email,
        totalEntries: entries.length,
        entries: entries.map((e: any) => ({
          title: e.title,
          content: e.content,
          moods: e.moods?.map((m: any) => m.label) || [],
          sentiment: e.sentiment,
          createdAt: e.createdAt,
        })),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mindful-journal-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export data:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Profile Information
          </h3>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20 shrink-0">
              {(user?.email?.charAt(0) || "U").toUpperCase()}
            </div>
            <div className="space-y-4 flex-1 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-gray-400 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl text-sm font-medium transition-colors border border-purple-500/20 disabled:opacity-50"
              >
                {saving ? "Saving..." : saved ? "✓ Saved!" : "Update Profile"}
              </button>
            </div>
          </div>
        </section>

        {/* Security Section (Change Password) */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            Security
          </h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
              />
              {passwordError && (
                <p className="text-red-400 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            <button
              onClick={handleChangePassword}
              disabled={passwordSaving || newPassword.length < 6}
              className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-xl text-sm font-medium transition-colors border border-indigo-500/20 disabled:opacity-50"
            >
              {passwordSaving
                ? "Updating..."
                : passwordSaved
                  ? "✓ Updated!"
                  : "Change Password"}
            </button>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Data & Privacy
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Export Your Data</p>
                  <p className="text-sm text-gray-500">
                    Download all your journal entries as JSON
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportData}
                disabled={exporting}
                className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 disabled:opacity-50"
              >
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-200">
                  Your data is stored securely and is only accessible to you.
                  All journal entries are private and encrypted in transit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-red-400" />
            Account
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10 hover:bg-red-500/10 transition-colors group"
            >
              <span className="text-red-400 font-medium flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
