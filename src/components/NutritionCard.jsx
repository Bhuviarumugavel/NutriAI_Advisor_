export default function NutritionCard({ title, current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <span className="text-sm text-slate-500">{current}g / {total}g</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
