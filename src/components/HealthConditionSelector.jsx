"use client";

const conditions = [
  "Diabetes",
  "Heart Disease",
  "Hypertension",
  "Kidney Disease",
  "Celiac Disease",
  "High Cholesterol",
  "Obesity",
  "Other"
];

export default function HealthConditionSelector({ selected = [], onChange }) {
  const toggleCondition = (condition) => {
    if (!onChange) return;

    const next = selected.includes(condition)
      ? selected.filter((item) => item !== condition)
      : [...selected, condition];

    onChange(next);
  };

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 mt-4">
      {conditions.map((item) => {
        const active = selected.includes(item);

        return (
          <button
            key={item}
            type="button"
            onClick={() => toggleCondition(item)}
            className={`rounded-3xl border px-4 py-3 text-left text-sm transition ${
              active
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
