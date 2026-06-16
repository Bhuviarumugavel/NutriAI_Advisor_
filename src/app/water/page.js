import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import WaterTracker from "@/components/WaterTracker";
import HydrationSetup from "@/components/HydrationSetup";

export default function WaterPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <Navbar title="Hydration" subtitle="Set bottle goals and track daily water" />

      <main className="mx-auto max-w-6xl p-5 space-y-6">
        <HydrationSetup />
        <WaterTracker />
      </main>

      <BottomNav />
    </div>
  );
}
