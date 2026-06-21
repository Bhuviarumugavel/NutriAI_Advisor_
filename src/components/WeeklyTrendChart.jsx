"use client";

import { useState } from "react";
import { 
  BarChart, Bar, 
  LineChart, Line, 
  AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer 
} from "recharts";

const placeholderData = [
  { day: "Mon", calories: 1900, protein: 95, carbs: 210, fat: 58, water: 1800 },
  { day: "Tue", calories: 2100, protein: 115, carbs: 260, fat: 68, water: 2200 },
  { day: "Wed", calories: 1800, protein: 85, carbs: 220, fat: 55, water: 1500 },
  { day: "Thu", calories: 2200, protein: 120, carbs: 250, fat: 70, water: 2500 },
  { day: "Fri", calories: 2000, protein: 105, carbs: 240, fat: 62, water: 2100 },
  { day: "Sat", calories: 2300, protein: 110, carbs: 280, fat: 75, water: 2800 },
  { day: "Sun", calories: 1950, protein: 98, carbs: 230, fat: 60, water: 2000 },
];

export default function WeeklyTrendChart({ weeklyData }) {
  const [activeTab, setActiveTab] = useState("nutrition");
  const chartData = weeklyData && weeklyData.length > 0 ? weeklyData : placeholderData;

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("nutrition")}
          className={`py-3 px-6 text-sm font-semibold transition border-b-2 ${
            activeTab === "nutrition"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          🥗 Nutrition (Calories & Macros)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hydration")}
          className={`py-3 px-6 text-sm font-semibold transition border-b-2 ${
            activeTab === "hydration"
              ? "border-emerald-600 text-emerald-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          💧 Water Hydration Trends
        </button>
      </div>

      <div className="h-80 w-full">
        {activeTab === "nutrition" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" orientation="left" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} label={{ value: 'Calories (kcal)', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' } }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} label={{ value: 'Macros (g)', angle: 90, position: 'insideRight', fill: '#64748b', style: { textAnchor: 'middle' } }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36}/>
              <Bar yAxisId="left" dataKey="calories" name="Calories (kcal)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar yAxisId="right" dataKey="protein" name="Protein (g)" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={15} />
              <Bar yAxisId="right" dataKey="carbs" name="Carbs (g)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={15} />
              <Bar yAxisId="right" dataKey="fat" name="Fat (g)" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={15} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} label={{ value: 'Water (ml)', angle: -90, position: 'insideLeft', fill: '#64748b', style: { textAnchor: 'middle' } }} />
              <Tooltip formatter={(value) => [`${value} ml`, 'Water Intake']} />
              <Area type="monotone" dataKey="water" name="Water Intake" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorWater)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
