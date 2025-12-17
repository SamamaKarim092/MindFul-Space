"use client";

import { User, MapPin, Star, Calendar, MessageSquare } from "lucide-react";

const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    specialty: "Anxiety & Depression",
    rating: 4.9,
    reviews: 124,
    location: "New York, NY (Remote Available)",
    image: "SW",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Cognitive Behavioral Therapy",
    rating: 4.8,
    reviews: 89,
    location: "San Francisco, CA",
    image: "MC",
    available: false,
  },
  {
    id: 3,
    name: "Dr. Emily Brooks",
    specialty: "Trauma & PTSD",
    rating: 5.0,
    reviews: 56,
    location: "Remote Only",
    image: "EB",
    available: true,
  },
];

export default function TherapistPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Find a Therapist
          </h2>
          <p className="text-gray-400">
            Connect with professional mental health support
          </p>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors font-medium">
          Filter Specialists
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {therapists.map((therapist) => (
          <div
            key={therapist.id}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
                {therapist.image}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {therapist.name}
                    </h3>
                    <p className="text-purple-400 text-sm font-medium mb-1">
                      {therapist.specialty}
                    </p>
                  </div>
                  {therapist.available ? (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                      Available
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded-full border border-gray-500/20">
                      Booked
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white">{therapist.rating}</span>
                    <span>({therapist.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{therapist.location}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10">
                    View Profile
                  </button>
                  <button className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-purple-500/20">
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-linear-to-r from-purple-900/20 to-blue-900/20 border border-white/10 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Need immediate help?
        </h3>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          If you or someone you know is in crisis, please don't hesitate to
          reach out to emergency services or a crisis hotline.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors font-medium">
            Emergency: 911
          </button>
          <button className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-medium">
            Crisis Line: 988
          </button>
        </div>
      </div>
    </div>
  );
}
