export default function GoalProgress({ analysis }) {
  const protein = analysis?.protein || 0;
  const target = 110; // Default protein target
  const percent = Math.min(Math.round((protein / target) * 100), 100);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-l-4 border-blue-500">
      <h3 className="text-2xl font-bold text-slate-900">Goal Progress</h3>
      <p className="text-slate-600 mt-3">
        {protein > 0 
          ? `This meal covers ${percent}% of your daily protein target (${protein}g of ${target}g).`
          : `Analyze a meal to see how much of your daily protein target (${target}g) it covers.`
        }
      </p>
      <div className="mt-6 h-3 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full rounded-full bg-blue-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-500">
        {protein > 0 
          ? (percent >= 100 ? "Protein goal reached for this meal!" : `${target - protein}g remaining to reach daily goal.`)
          : "Protein target coverage tracker."
        }
      </p>
    </div>
  );
}
