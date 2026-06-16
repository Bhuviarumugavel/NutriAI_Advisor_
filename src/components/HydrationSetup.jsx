"use client";

import { useEffect, useState } from "react";

const presets = [250, 330, 500, 750, 1000];

export default function HydrationSetup() {
  const [bottleMl, setBottleMl] = useState(500);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const saved = window.localStorage.getItem("hydrationSetup");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.bottleMl === "number") {
          setBottleMl(parsed.bottleMl);
        }
        if (typeof parsed.count === "number") {
          setCount(parsed.count);
        }
      } catch (error) {
        // ignore parse issue
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "hydrationSetup",
      JSON.stringify({ bottleMl, count, total: bottleMl * count })
    );
  }, [bottleMl, count]);

  const total = bottleMl * count;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Water bottle setup</p>
          <h2 className="text-2xl font-bold text-slate-900">Set your bottle size</h2>
        </div>
      </div>

      <p className="mt-4 text-slate-500">Choose the bottle volume and count so daily hydration is easy to log.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">Bottle size (ml)</span>
          <select
            value={bottleMl}
            onChange={(event) => setBottleMl(Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          >
            {presets.map((size) => (
              <option key={size} value={size}>
                {size} ml
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-sm font-semibold text-slate-700">Bottle count per day</span>
          <input
            type="number"
            min="1"
            value={count}
            onChange={(event) => setCount(Number(event.target.value) || 1)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-emerald-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5">
        <p className="text-sm text-slate-500">Daily water target generated automatically</p>
        <p className="mt-3 text-3xl font-bold text-emerald-700">{total} ml</p>
      </div>
    </div>
  );
}
