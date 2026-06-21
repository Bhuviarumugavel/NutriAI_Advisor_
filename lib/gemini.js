import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const model = genAI
  ? genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  : null;

function getFallbackAnalysis(foodText) {
  const normalized = String(foodText || "").toLowerCase();

  const foodMap = {
    egg: { calories: 70, protein: 6, carbs: 1, fat: 5, fiber: 0 },
    eggs: { calories: 140, protein: 12, carbs: 2, fat: 10, fiber: 0 },
    apple: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4 },
    banana: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1 },
    chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.6 },
    oats: { calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4 },
    oatmeal: { calories: 150, protein: 5, carbs: 27, fat: 2.5, fiber: 4 },
    yogurt: { calories: 100, protein: 10, carbs: 7, fat: 3, fiber: 0 },
    milk: { calories: 42, protein: 3.4, carbs: 5, fat: 1, fiber: 0 },
    tofu: { calories: 144, protein: 15, carbs: 3, fat: 9, fiber: 1 },
    paneer: { calories: 265, protein: 18, carbs: 1.2, fat: 20, fiber: 0 },
    fish: { calories: 206, protein: 22, carbs: 0, fat: 12, fiber: 0 },
    salmon: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 },
    salad: { calories: 35, protein: 1.2, carbs: 7, fat: 0.2, fiber: 2 },
    bread: { calories: 80, protein: 3, carbs: 15, fat: 1, fiber: 1 },
    idli: { calories: 58, protein: 2, carbs: 12, fat: 0.2, fiber: 0.8 },
    dosa: { calories: 120, protein: 3, carbs: 18, fat: 3, fiber: 1 },
    sambar: { calories: 70, protein: 3, carbs: 12, fat: 1, fiber: 2 },
    chutney: { calories: 25, protein: 0.5, carbs: 4, fat: 0.4, fiber: 1 },
    roti: { calories: 71, protein: 2.5, carbs: 12, fat: 1, fiber: 1.5 },
    chapati: { calories: 71, protein: 2.5, carbs: 12, fat: 1, fiber: 1.5 },
    dal: { calories: 100, protein: 7, carbs: 16, fat: 1, fiber: 3 },
    lentil: { calories: 100, protein: 7, carbs: 16, fat: 1, fiber: 3 },
    quinoa: { calories: 120, protein: 4, carbs: 21, fat: 2, fiber: 2.8 },
    avocado: { calories: 160, protein: 2, carbs: 8.5, fat: 15, fiber: 7 },
    broccoli: { calories: 55, protein: 4, carbs: 11, fat: 0.6, fiber: 5 },
    spinach: { calories: 23, protein: 3, carbs: 3.6, fat: 0.4, fiber: 2.2 },
    potato: { calories: 130, protein: 3, carbs: 30, fat: 0.2, fiber: 3 },
    sweet_potato: { calories: 103, protein: 2, carbs: 24, fat: 0.1, fiber: 4 },
    pasta: { calories: 220, protein: 8, carbs: 43, fat: 1.3, fiber: 2.5 },
    steak: { calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0 },
    burger: { calories: 350, protein: 17, carbs: 30, fat: 18, fiber: 2 },
    pizza: { calories: 285, protein: 12, carbs: 36, fat: 10, fiber: 2 },
  };

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let matchCount = 0;

  Object.entries(foodMap).forEach(([keyword, nutrients]) => {
    if (normalized.includes(keyword)) {
      calories += nutrients.calories;
      protein += nutrients.protein;
      carbs += nutrients.carbs;
      fat += nutrients.fat;
      fiber += nutrients.fiber;
      matchCount++;
    }
  });

  if (matchCount === 0) {
    calories = 200;
    protein = 8;
    carbs = 25;
    fat = 6;
    fiber = 3;
  }

  return {
    food: foodText,
    calories: Math.round(calories),
    protein: Number(protein.toFixed(1)),
    carbs: Number(carbs.toFixed(1)),
    fat: Number(fat.toFixed(1)),
    fiber: Number(fiber.toFixed(1)),
    suggestion: matchCount > 0
      ? "Nutrition estimated from recognized food items. For best accuracy, try the AI analysis."
      : "Could not identify specific foods. Showing average estimates."
  };
}

export async function analyzeMealText(foodText) {
  try {
    if (!model) {
      console.log("Gemini not available, using fallback analysis");
      return getFallbackAnalysis(foodText);
    }

    const prompt = `
You are a nutrition expert. Analyze the following food/meal and estimate its nutritional content.

Food: ${foodText}

Return ONLY valid JSON (no markdown, no backticks), in this exact format:
{
  "food": "descriptive name of the food",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "suggestion": "brief health tip about this meal"
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("Gemini analyzeMealText error:", error.message);
    return getFallbackAnalysis(foodText);
  }
}

export async function generateMealSuggestion(profile, dashboardData) {
  const profileInfo = profile || {};
  const current = dashboardData || {};

  try {
    if (!model) {
      return getProfileBasedFallbackSuggestion(profileInfo, current);
    }

    const prompt = `
You are a professional nutritionist AI advisor.

USER PROFILE:
- Name: ${profileInfo.name || "User"}
- Age: ${profileInfo.age || "unknown"}
- Gender: ${profileInfo.gender || "unknown"}
- Weight: ${profileInfo.weight || "unknown"}
- Height: ${profileInfo.height || "unknown"}
- Health Conditions: ${profileInfo.healthConditions?.length ? profileInfo.healthConditions.join(", ") : "None"}
- Activity Level: ${profileInfo.activityLevel || "moderate"}
- Goal: ${profileInfo.goal || "maintain weight"}

TODAY'S INTAKE SO FAR:
- Calories consumed: ${current.calories || 0} / 2000 target
- Protein consumed: ${current.protein || 0}g / 110g target
- Carbs consumed: ${current.carbs || 0}g / 250g target
- Fat consumed: ${current.fat || 0}g / 65g target
- Water consumed: ${current.water || 0}ml / 2500ml target

Based on the user's profile AND their current nutritional intake today, suggest their NEXT MEAL.
Consider their health conditions carefully when making suggestions.

Return ONLY valid JSON (no markdown, no backticks):
{
  "mealName": "name of the suggested meal",
  "description": "brief description of the meal",
  "reason": "why this meal is good for this specific user profile",
  "estimatedNutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "tips": ["tip1", "tip2"]
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.error("Gemini generateMealSuggestion error:", error.message);
    return getProfileBasedFallbackSuggestion(profileInfo, current);
  }
}

function getProfileBasedFallbackSuggestion(profile, current) {
  const conditions = (profile.healthConditions || []).map(c => c.toLowerCase());
  const proteinLeft = Math.max(110 - (current.protein || 0), 0);
  const caloriesLeft = Math.max(2000 - (current.calories || 0), 0);

  let mealName = "Grilled Chicken with Vegetables";
  let description = "A balanced meal with lean protein and fiber-rich vegetables.";
  let reason = "This meal provides a good balance of protein and nutrients to meet your daily goals.";
  const tips = [];

  if (conditions.includes("diabetes")) {
    mealName = "Grilled Fish with Quinoa and Steamed Broccoli";
    description = "Low-glycemic meal with lean protein, complex carbs, and fiber.";
    reason = "Low glycemic index foods help manage blood sugar levels. The fiber from broccoli and quinoa slows digestion.";
    tips.push("Avoid white rice and refined carbs");
    tips.push("Include fiber with every meal to control blood sugar spikes");
  } else if (conditions.includes("heart disease") || conditions.includes("high cholesterol")) {
    mealName = "Baked Salmon with Spinach Salad";
    description = "Heart-healthy omega-3 rich meal with leafy greens.";
    reason = "Omega-3 fatty acids from salmon support heart health and help lower bad cholesterol.";
    tips.push("Choose baked or steamed over fried foods");
    tips.push("Include omega-3 rich foods like fish, walnuts, and flaxseed");
  } else if (conditions.includes("hypertension")) {
    mealName = "Lentil Soup with Fresh Herbs";
    description = "Low-sodium, potassium-rich meal that supports blood pressure management.";
    reason = "Lentils are rich in potassium and magnesium, which help regulate blood pressure naturally.";
    tips.push("Avoid added salt — use herbs and spices for flavor");
    tips.push("Include potassium-rich foods like bananas, lentils, and sweet potatoes");
  } else if (conditions.includes("obesity")) {
    mealName = "Tofu Stir-Fry with Mixed Vegetables";
    description = "High-protein, low-calorie meal to support weight management.";
    reason = "High protein keeps you full longer, while vegetables add fiber with minimal calories.";
    tips.push("Eat slowly and mindfully to recognize fullness cues");
    tips.push("Prioritize protein and vegetables, reduce refined carbs");
  } else if (conditions.includes("kidney disease")) {
    mealName = "Egg White Omelette with Bell Peppers";
    description = "Low-sodium, moderate protein meal suitable for kidney health.";
    reason = "Controlled protein and low sodium support kidney function without overloading.";
    tips.push("Monitor protein portions to avoid kidney strain");
    tips.push("Stay hydrated but follow doctor-recommended fluid limits");
  }

  if (proteinLeft > 30 && tips.length < 2) {
    tips.push(`You still need about ${Math.round(proteinLeft)}g of protein today`);
  }
  if (caloriesLeft > 500 && tips.length < 3) {
    tips.push(`You have about ${Math.round(caloriesLeft)} calories remaining today`);
  }

  return {
    mealName,
    description,
    reason,
    estimatedNutrition: {
      calories: Math.min(caloriesLeft, 500),
      protein: Math.min(proteinLeft, 35),
      carbs: 30,
      fat: 12
    },
    tips: tips.length > 0 ? tips : ["Stay hydrated throughout the day", "Include colorful vegetables in every meal"]
  };
}

export async function analyzeMealImage(imageBuffer, mimeType) {
  try {
    if (!model) {
      console.log("Gemini not available, returning default fallback analysis");
      return getFallbackAnalysis("Uploaded Image Meal");
    }

    const prompt = `
You are a nutrition expert. Analyze this meal image and estimate its nutritional content.
If the image is unclear or not a meal, return a JSON response with "unclear": true.
Otherwise, identify the food items and return a JSON response with this exact format (no markdown, no backticks, no comments, no extra text):
{
  "food": "descriptive name of the food items found in the image",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "suggestion": "brief health tip about this meal"
}
`;

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(imageBuffer).toString("base64"),
          mimeType: mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini analyzeMealImage error:", error.message);
    return { unclear: true, error: error.message };
  }
}