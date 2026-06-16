"use client";

import { useEffect, useState } from "react";
import { getActiveUserId } from "@/lib/userClient";

export default function ProfileSavedCard() {
  const USER_ID = getActiveUserId();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`/api/dashboard?userId=${USER_ID}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Unable to load profile data.");
        }

        setProfile(result.dashboard.profile || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
        <p className="text-sm text-slate-500">Loading profile summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Profile saved</p>
          <h2 className="text-2xl font-bold text-slate-900">Health summary</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Saved</span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Health condition</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.healthConditions?.length ? profile.healthConditions.join(", ") : "None selected"}</p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Protein goal</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">110g</p>
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Current user</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.name || "Demo User"}</p>
        </div>
      </div>
    </div>
  );
}
