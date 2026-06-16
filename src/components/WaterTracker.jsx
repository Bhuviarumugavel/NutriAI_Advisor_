"use client";

import { Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { getActiveUserId } from "@/lib/userClient";

export default function WaterTracker() {
  const USER_ID = getActiveUserId();
  const [consumed, setConsumed] = useState(1800);
  const [goal, setGoal] = useState(2500);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("hydrationSetup");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.total === "number") {
          setGoal(parsed.total);
        }
      } catch (error) {
        // ignore parse error
      }
    }
  }, []);

  const progress = Math.round((consumed / goal) * 100);

  const saveWater = async (nextConsumed) => {
    try {
      const response = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          water: nextConsumed
        })
      });

      const data = await response.json();
      if (!data.success) {
        setStatus(data.error || "Unable to save water data.");
        return;
      }
      setStatus("Water intake saved.");
    } catch (error) {
      setStatus(error.message || "Water save failed.");
    }
  };

  const updateConsumed = async (delta) => {
    const nextConsumed = Math.max(0, consumed + delta);
    setConsumed(nextConsumed);
    await saveWater(nextConsumed);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Hydration</p>
        <h2 className="text-3xl font-bold text-slate-900">Water Intake</h2>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">You have consumed</p>
        <p className="mt-4 text-4xl font-bold text-emerald-700">{(consumed / 1000).toFixed(1)}L</p>
        <p className="text-sm text-slate-500">of your {(goal / 1000).toFixed(1)}L goal</p>
        <div className="mt-6 h-3 rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-500">{Math.min(progress, 100)}% complete</p>
      </div>

      {status && <p className="mt-4 rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => updateConsumed(-100)}
          className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-red-50 px-4 py-3 text-slate-700 transition hover:bg-red-100"
        >
          <Minus />
          Remove 100ml
        </button>
        <button
          type="button"
          onClick={() => updateConsumed(100)}
          className="inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700"
        >
          <Plus />
          Add 100ml
        </button>
      </div>
    </div>
  );
}
