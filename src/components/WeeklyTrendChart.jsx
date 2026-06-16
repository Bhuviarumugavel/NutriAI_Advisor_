"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function WeeklyTrendChart() {
  const data = [
    { day: "Mon", intake: 1900 },
    { day: "Tue", intake: 2100 },
    { day: "Wed", intake: 1800 },
    { day: "Thu", intake: 2200 },
    { day: "Fri", intake: 2100 },
    { day: "Sat", intake: 2300 },
    { day: "Sun", intake: 2000 },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-5">Weekly Calorie Trends</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="intake" stroke="#15803d" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
