export default function MealAnalysisCard({ analysis, suggestion }) {
  const title = analysis?.food || "Grilled Chicken Salad";
  const calories = analysis?.calories ?? 350;
  const protein = analysis?.protein ?? 24;
  const carbs = analysis?.carbs ?? 15;
  const fat = analysis?.fat ?? 12;
  const fiber = analysis?.fiber ?? 4;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Latest analysis</p>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">{calories} kcal</span>
      </div>

      <p className="text-slate-500 mt-4">{suggestion || "Estimated nutritional values based on image and description."}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Protein:</span> {protein}g
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Carbs:</span> {carbs}g
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Fat:</span> {fat}g
        </div>
        <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Fiber:</span> {fiber}g
        </div>
      </div>
    </div>
  );
}
