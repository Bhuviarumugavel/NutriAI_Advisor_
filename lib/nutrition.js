export const DAILY_TARGETS = {
  calories: 2000,
  protein: 110,
  carbs: 250,
  fat: 65,
  fiber: 30,
  water: 2500
};

export function calculateCaloriesLeft(
  targetCalories,
  consumedCalories,
  burnedCalories = 0
) {
  return targetCalories - consumedCalories + burnedCalories;
}

export function calculateMacroProgress(
  consumed,
  target
) {
  return Math.min(
    Math.round((consumed / target) * 100),
    100
  );
}

export function calculateWaterProgress(
  consumed,
  target
) {
  return Math.min(
    Math.round((consumed / target) * 100),
    100
  );
}

export function getNutritionStatus(
  value,
  target
) {
  const percentage = (value / target) * 100;

  if (percentage < 50)
    return "Low";

  if (percentage < 90)
    return "Good";

  if (percentage <= 110)
    return "Optimal";

  return "High";
}

export function generateNutritionSummary(data) {
  return {
    caloriesStatus: getNutritionStatus(
      data.calories,
      DAILY_TARGETS.calories
    ),

    proteinStatus: getNutritionStatus(
      data.protein,
      DAILY_TARGETS.protein
    ),

    carbsStatus: getNutritionStatus(
      data.carbs,
      DAILY_TARGETS.carbs
    ),

    fatStatus: getNutritionStatus(
      data.fat,
      DAILY_TARGETS.fat
    ),

    waterStatus: getNutritionStatus(
      data.water,
      DAILY_TARGETS.water
    )
  };
}

export function mealCompletionPercentage(
  currentProtein,
  targetProtein
) {
  return Math.round(
    (currentProtein / targetProtein) * 100
  );
}

export function remainingProtein(
  currentProtein,
  targetProtein
) {
  return Math.max(
    targetProtein - currentProtein,
    0
  );
}

export function remainingCalories(
  currentCalories,
  targetCalories
) {
  return Math.max(
    targetCalories - currentCalories,
    0
  );
}

export function generateMealRecommendation(profile, dashboard) {
  const proteinTarget = DAILY_TARGETS.protein;
  const waterTarget = DAILY_TARGETS.water;
  const proteinRatio = proteinTarget > 0 ? dashboard.protein / proteinTarget : 0;
  const waterRatio = waterTarget > 0 ? dashboard.water / waterTarget : 0;

  const suggestions = [];

  if (proteinRatio < 0.6) {
    suggestions.push("Increase your intake with high-protein meals such as chicken, fish, lentils, or tofu.");
  } else if (proteinRatio < 1) {
    suggestions.push("You are on track with protein — add a balanced high-protein meal to finish strong.");
  } else {
    suggestions.push("Great job on protein intake — keep choosing lean sources and maintain hydration.");
  }

  if (waterRatio < 0.6) {
    suggestions.push("Drink more water today to support digestion and nutrient delivery.");
  } else {
    suggestions.push("Hydration is good — keep sipping water consistently.");
  }

  if (profile?.healthConditions?.length) {
    const conditions = profile.healthConditions.map((condition) => condition.toLowerCase());

    if (conditions.includes("diabetes")) {
      suggestions.push("Prefer low-glycemic, high-fiber meals with lean protein.");
    }
    if (conditions.includes("heart disease") || conditions.includes("high cholesterol")) {
      suggestions.push("Choose heart-healthy proteins like fish, chicken, legumes, and avoid fried foods.");
    }
    if (conditions.includes("hypertension") || conditions.includes("kidney disease")) {
      suggestions.push("Keep sodium low and stay hydrated with gentle water intake throughout the day.");
    }
    if (conditions.includes("obesity")) {
      suggestions.push("A smaller, protein-rich meal with vegetables will support your weight goals.");
    }
  }

  return suggestions.join(" ");
}
