"use client";

import { User, Bell, Shield, Moon, Globe, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Settings</h2>
        <p className="text-gray-400">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Profile Information
          </h3>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/20">
              {user?.email?.[0].toUpperCase() || "U"}
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
                  placeholder="Enter your name"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10">
                Update Profile
              </button>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            App Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">
                    Adjust the appearance of the application
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-purple-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive daily reminders to journal
                  </p>
                </div>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Security
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:bg-black/30 transition-colors group">
              <span className="text-white font-medium">Change Password</span>
              <span className="text-sm text-gray-500 group-hover:text-white transition-colors">
                Update
              </span>
            </button>
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
