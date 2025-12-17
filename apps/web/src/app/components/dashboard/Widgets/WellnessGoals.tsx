"use client";

const goals = [
  {
    title: "Meditation",
    target: "15 mins",
    current: "10 mins",
    progress: 66,
    color: "bg-purple-500",
  },
  {
    title: "Sleep",
    target: "8 hours",
    current: "6.5 hours",
    progress: 80,
    color: "bg-blue-500",
  },
  {
    title: "Water Intake",
    target: "2000ml",
    current: "1500ml",
    progress: 75,
    color: "bg-cyan-500",
  },
  {
    title: "Reading",
    target: "30 mins",
    current: "0 mins",
    progress: 0,
    color: "bg-pink-500",
  },
];

export default function WellnessGoals() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Daily Wellness Goals
        </h3>
        <button className="text-sm text-purple-400 hover:text-purple-300">
          Edit Goals
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300 font-medium">{goal.title}</span>
              <span className="text-gray-400">
                {goal.current} / {goal.target}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${goal.color} transition-all duration-500`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
