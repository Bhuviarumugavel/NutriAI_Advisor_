import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">NutriAI Advisor</h1>
          <p className="text-slate-600">Your personal nutrition companion</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome</h2>
            <p className="text-slate-500 mt-2">Get started with your nutrition journey</p>
          </div>

          {/* New User Option */}
          <Link href="/register">
            <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🆕</span>
                <div className="text-left">
                  <p className="font-bold">New User</p>
                  <p className="text-sm opacity-90">Create profile & get User ID</p>
                </div>
              </div>
            </button>
          </Link>

          {/* Existing User Option */}
          <Link href="/login">
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-slate-200">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🔐</span>
                <div className="text-left">
                  <p className="font-bold">Existing User</p>
                  <p className="text-sm opacity-75">Login with User ID</p>
                </div>
              </div>
            </button>
          </Link>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-3 text-sm text-slate-600">
            <p className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold text-lg">✓</span>
              <span>Track your daily nutrition and meals</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold text-lg">✓</span>
              <span>Get personalized meal suggestions</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold text-lg">✓</span>
              <span>Monitor your hydration and macros</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
