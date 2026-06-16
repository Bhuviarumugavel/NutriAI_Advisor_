import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import MealPlanPrompt from "@/components/MealPlanPrompt";
import MealAnalysisCard from "@/components/MealAnalysisCard";
import GoalProgress from "@/components/GoalProgress";

export default function MealPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Navbar title="AI Meal Analysis" subtitle="Upload meals or describe food for smart guidance" />

      <main className="mx-auto max-w-6xl p-5 space-y-6">
        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
          <MealPlanPrompt />
          <div className="space-y-5">
            <MealAnalysisCard />
            <GoalProgress />
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
