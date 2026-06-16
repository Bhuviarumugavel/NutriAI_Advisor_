export default function GoalProgress() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-l-4 border-blue-500">
      <h3 className="text-2xl font-bold text-slate-900">Goal Progress</h3>
      <p className="text-slate-600 mt-3">This meal covers 45% of your daily protein target.</p>
      <div className="mt-6 h-3 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full bg-blue-500" style={{ width: "45%" }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">Almost halfway to your protein goal today.</p>
    </div>
  );
}
