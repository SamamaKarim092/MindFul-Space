import Link from "next/link";

export default function FeaturesSection() {
  return (
    <div className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Journal Your Thoughts
            </h3>
            <p className="text-white/80">
              Express yourself freely with private journal entries. Track your
              daily experiences and reflect on your emotional journey.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Track Your Mood
            </h3>
            <p className="text-white/80">
              Visualize your emotional patterns over time with beautiful
              charts and insights. Understand what affects your wellbeing.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              AI Therapy Chat
            </h3>
            <p className="text-white/80">
              Talk to an understanding AI therapist anytime. Get supportive
              guidance and coping strategies when you need them most.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 drop-shadow-lg">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                desc: "Create your free account",
              },
              {
                step: "2",
                title: "Journal",
                desc: "Write your thoughts daily",
              },
              { step: "3", title: "Track", desc: "See your mood patterns" },
              { step: "4", title: "Grow", desc: "Improve your wellbeing" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center border border-white/20">
          <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-lg">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of people who are taking control of their mental
            health. It's free, private, and always available.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-indigo-600 font-medium rounded-xl text-lg hover:bg-yellow-200 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>
        {/* Footer */}
        <footer className="max-w-6xl mx-auto px-6 py-12 text-center text-white/70">
          <p>© 2024 MindJournal. Your mental health matters.</p>
          <p className="text-sm mt-2">
            This app is not a replacement for professional mental health care.
          </p>
        </footer>
    </div>
  );
}
