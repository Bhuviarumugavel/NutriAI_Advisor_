"use client";

import { Bell } from "lucide-react";

export default function Navbar({ title = "Command Center", subtitle = "Your daily health overview" }) {
  return (
    <div className="bg-white px-5 py-5 shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Good morning</p>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700 shadow-sm">
          <Bell size={20} />
        </div>
      </div>
    </div>
  );
}
