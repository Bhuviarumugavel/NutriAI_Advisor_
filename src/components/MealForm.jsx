"use client";

import { Camera, FileText } from "lucide-react";

export default function MealForm() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Camera size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upload Meal Image</h2>
            <p className="text-slate-500 mt-2">Snap a photo and let the AI estimate nutritional values.</p>
          </div>
        </div>
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
          Drag & drop your meal image here or <button className="font-semibold text-emerald-600">browse files</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            <FileText size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Describe Your Meal</h2>
            <p className="text-slate-500 mt-2">Type a quick summary or paste your recipe.</p>
          </div>
        </div>
        <textarea
          className="mt-8 h-36 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-900 focus:border-emerald-500 focus:outline-none"
          placeholder="E.g. grilled chicken salad with avocado and quinoa"
        />
      </div>
    </div>
  );
}
