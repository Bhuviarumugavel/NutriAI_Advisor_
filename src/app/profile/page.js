import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import UserProfileCard from "@/components/UserProfileCard";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Navbar title="Profile" subtitle="Personal health settings" />

      <main className="mx-auto max-w-6xl p-5 space-y-5">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <UserProfileCard />

          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Goal</p>
                  <h2 className="text-xl font-bold text-slate-900">Daily Wellness</h2>
                </div>
                <span className="rounded-3xl bg-emerald-50 px-4 py-2 text-emerald-700">On track</span>
              </div>
              <p className="text-slate-500 mt-4">Based on your latest activity and nutrition inputs, your daily wellness score is positive.</p>
            </div>

            <div className="grid gap-5">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Health Score</h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-4xl font-bold text-emerald-700">88</div>
                  <div>
                    <p className="text-slate-500">Wellness rating based on biometric and meal input.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                <h3 className="text-sm uppercase tracking-[0.3em] text-slate-400">Weekly Progress</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Hydration</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">72%</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Nutrition</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-900">83%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
