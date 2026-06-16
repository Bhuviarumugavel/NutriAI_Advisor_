"use client";

import { useEffect, useState } from "react";
import HealthConditionSelector from "@/components/HealthConditionSelector";
import { getActiveUserId, setActiveUserId, normalizeHealthConditions } from "@/lib/userClient";

export default function UserProfileCard() {
  const [userId, setUserId] = useState(getActiveUserId());
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [healthConditions, setHealthConditions] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/dashboard?userId=${userId}`);
        const result = await response.json();

        if (result.success && result.dashboard) {
          const profile = result.dashboard.profile || {};
          setName(profile.name || "");
          setAge(profile.age || "");
          setGender(profile.gender || "");
          setWeight(profile.weight || "");
          setHeight(profile.height || "");
          setHealthConditions(normalizeHealthConditions(profile.healthConditions));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    setStatus("");
    setError("");

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name,
          age,
          gender,
          weight,
          height,
          healthConditions
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Unable to save profile.");
      }

      setActiveUserId(userId);
      setStatus("Profile saved successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Personal stats</p>
        <h2 className="text-3xl font-bold text-slate-900">Bio-Metric Input</h2>
        <p className="text-slate-500">Update your profile details for smarter recommendations.</p>
      </div>

      <div className="grid gap-4 mt-6 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-500">User ID</span>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="demo-user"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="John Doe"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500">Age</span>
          <input
            value={age}
            onChange={(event) => setAge(event.target.value)}
            placeholder="29"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500">Weight</span>
          <input
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            placeholder="72 kg"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500">Height</span>
          <input
            value={height}
            onChange={(event) => setHeight(event.target.value)}
            placeholder="175 cm"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="space-y-2 sm:col-span-2">
          <span className="text-sm text-slate-500">Gender</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Medical Conditions</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Optional</span>
        </div>
        <p className="text-sm text-slate-500 mt-1">Choose any conditions that apply.</p>
        <HealthConditionSelector selected={healthConditions} onChange={setHealthConditions} />
      </div>

      <div className="mt-6 space-y-3">
        {error && <div className="rounded-3xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {status && <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</div>}
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-base font-semibold text-white transition hover:bg-emerald-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}
