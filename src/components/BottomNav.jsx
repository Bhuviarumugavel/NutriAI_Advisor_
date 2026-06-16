"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaHome, FaUtensils, FaTint, FaUser } from "react-icons/fa";

export default function BottomNav() {
  const pathname = usePathname();
  const tabs = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "AI Meal", path: "/meal", icon: <FaUtensils /> },
    { name: "Hydration", path: "/water", icon: <FaTint /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl">
      <div className="mx-auto flex max-w-3xl justify-between px-4 py-3">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex flex-col items-center gap-1 rounded-3xl px-4 py-2 transition ${
              pathname === tab.path
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-emerald-600"
            }`}
          >
            {tab.icon}
            <span className="text-[11px] font-semibold">{tab.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
