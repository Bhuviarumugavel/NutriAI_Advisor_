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
    calories = 250;
    protein = 10;
    carbs = 30;
    fat = 8;
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
      ? "Portion-based dietician estimate compiled from ingredients. Avoid adding processed sauces or excess oils."
      : "Estimated average metrics. For clinical accuracy, try providing a detailed text description."
  };
}

export async function analyzeMealText(foodText) {
  try {
    if (!model) {
      console.warn("Gemini model not initialized, using dietician fallback.");
      return getFallbackAnalysis(foodText);
    }

    const prompt = `
You are a Board-Certified Clinical Nutritionist and Dietician. 
Carefully analyze the following meal/food description and estimate its nutritional values.

Meal Description: "${foodText}"

Be highly precise and realistic in your estimates, drawing from standard food composition databases (e.g., USDA FoodData Central).
Provide a breakdown of the estimated ingredients and calculate:
- Total Calories (kcal)
- Protein (g)
- Carbohydrates (g)
- Fats (g)
- Dietary Fiber (g)

Return ONLY a valid JSON object. Do not wrap it in markdown block tags like \`\`\`json or add any leading/trailing text. Use this exact JSON structure:
{
  "food": "A clean, detailed title of the food and its primary ingredients",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "fiber": number,
  "suggestion": "Detailed, professional dietician advice for this meal (e.g. how to balance it better, portion control, or glycemic index tips)"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini analyzeMealText error:", error.message);
    return getFallbackAnalysis(foodText);
  }
}

export async function generateMealSuggestion(profile, dashboardData, localHour) {
  const profileInfo = profile || {};
  const current = dashboardData || {};
  const hour = localHour !== undefined && localHour !== null ? Number(localHour) : new Date().getHours();

  const userName = profileInfo.name || "User";
  let greeting = "Hello";
  if (hour < 12) {
    greeting = `Good morning, ${userName}!`;
  } else if (hour < 17) {
    greeting = `Good afternoon, ${userName}!`;
  } else if (hour < 21) {
    greeting = `Good evening, ${userName}!`;
  } else {
    greeting = `Good night, ${userName}!`;
  }

  const mealTime = hour < 12 ? "Breakfast" : hour < 16 ? "Lunch" : hour < 19 ? "Snack" : "Dinner";
  const hasNoMeals = !current.meals || current.meals.length === 0;

  try {
    if (!model) {
      return getProfileBasedFallbackSuggestion(profileInfo, current, hour, greeting, hasNoMeals);
    }

    const prompt = `
You are a Board-Certified Clinical Nutritionist and Dietician AI. Suggest the absolute best NEXT MEAL for this user based on their biometric stats, medical conditions, and daily nutrition targets.

GREETING CONTEXT:
- Local Hour of User: ${hour} (0-23 clock). Greet the user appropriately (e.g. "Good morning, ${userName}!" if morning, etc.) and include it in the "greeting" field.

USER PROFILE:
- Name: ${userName}
- Age: ${profileInfo.age || "unknown"}
- Gender: ${profileInfo.gender || "unknown"}
- Weight: ${profileInfo.weight || "unknown"} kg
- Height: ${profileInfo.height || "unknown"} cm
- Health Conditions: ${profileInfo.healthConditions?.length ? profileInfo.healthConditions.join(", ") : "None"}
- Activity Level: ${profileInfo.activityLevel || "moderate"}
- Goal: ${profileInfo.goal || "maintain weight"}

DAILY TARGETS:
- Calories: 2000 kcal
- Protein: 110g
- Carbs: 250g
- Fat: 65g
- Water: 2500ml

TODAY'S INTAKE SO FAR:
- Calories consumed: ${current.calories || 0} kcal
- Protein consumed: ${current.protein || 0}g
- Carbs consumed: ${current.carbs || 0}g
- Fat consumed: ${current.fat || 0}g
- Water consumed: ${current.water || 0}ml
- Meals logged: ${current.meals && current.meals.length > 0 ? JSON.stringify(current.meals) : "NO MEALS LOGGED TODAY"}

DIETARY INSTRUCTIONS:
- If NO MEALS LOGGED TODAY: Provide a healthy, time-appropriate default suggestion (e.g., a balanced Breakfast suggestion if morning, etc.) and gently add a reminder in the description asking the user to update/log their meal inputs regularly.
- If the user has Diabetes: Minimize glycemic impact. Avoid refined carbs, sweet fruits, and suggest fiber-rich complex carbs with lean protein.
- If the user has Hypertension: Suggest low-sodium options rich in potassium.
- If the user has Heart Disease or High Cholesterol: Avoid saturated and trans fats. Suggest unsaturated fats, omega-3, and high soluble fiber.
- If the user has Kidney Disease: Recommend controlled protein and potassium levels.
- Suggest a meal suitable for the current time of day: ${mealTime}.

Return ONLY a valid JSON object. Do not wrap in markdown blocks. Use this exact JSON format:
{
  "greeting": "Personalized time-appropriate greeting (e.g. Good morning, ${userName}!)",
  "mealName": "Name of the suggested meal",
  "description": "Portion size, ingredients list, simple preparation advice. (Include a request to update meal inputs regularly if no meals are logged today)",
  "reason": "Detailed medical and nutritional justification explaining why this meal is suggested given their health conditions and remaining daily macro targets",
  "estimatedNutrition": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number
  },
  "tips": [
    "Tip 1: Practical eating or timing advice",
    "Tip 2: Health condition-specific tip"
  ]
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
    return getProfileBasedFallbackSuggestion(profileInfo, current, hour, greeting, hasNoMeals);
  }
}

function getProfileBasedFallbackSuggestion(profile, current, localHour, greeting, hasNoMeals) {
  const conditions = (profile.healthConditions || []).map(c => c.toLowerCase());
  const proteinLeft = Math.max(110 - (current.protein || 0), 0);
  const caloriesLeft = Math.max(2000 - (current.calories || 0), 0);

  // Time-appropriate defaults
  let mealName = "Grilled Chicken Breast with Brown Rice";
  let description = "150g grilled chicken, 1/2 cup cooked brown rice, and steamed asparagus.";
  let reason = "High in lean protein and complex carbs to support your daily requirements without spiking insulin.";
  const tips = ["Avoid cooking with high-fat oils", "Add lemon juice to asparagus for taste"];

  if (localHour < 12) {
    // Breakfast segment (Morning)
    if (conditions.includes("diabetes")) {
      mealName = "Veggie Egg White Scramble";
      description = "Scrambled whites of 3 eggs with spinach, tomatoes, and mushrooms. Serve with 1 slice of whole-grain toast.";
      reason = "High in protein and soluble fiber to slow glucose absorption and keep blood sugar levels stable.";
      tips.push("Use avocado oil in tiny amounts");
    } else if (conditions.includes("heart disease") || conditions.includes("high cholesterol")) {
      mealName = "Oatmeal with Walnuts & Flaxseeds";
      description = "1/2 cup rolled oats cooked in unsweetened almond milk, topped with 1 tbsp ground flaxseeds and a few walnuts.";
      reason = "Oats supply beta-glucan fiber which helps reduce cholesterol levels, while walnuts provide healthy omega-3 fatty acids.";
      tips.push("Do not add refined honey or syrup");
    } else {
      mealName = "Greek Yogurt and Berries";
      description = "1 cup plain non-fat Greek yogurt with 1/2 cup mixed fresh berries and 1 tbsp chia seeds.";
      reason = "Provides high quality protein and antioxidants to boost morning metabolism.";
      tips.push("Stir in a scoop of vanilla protein powder for extra macros");
    }
  } else if (localHour < 17) {
    // Lunch segment (Afternoon)
    if (conditions.includes("diabetes")) {
      mealName = "Baked Salmon Salad";
      description = "120g baked salmon over mixed leafy greens, cucumbers, tomatoes, and a light vinaigrette dressing.";
      reason = "Healthy omega-3 fatty acids from salmon support heart health, and greens offer low-glycemic, fiber-rich nourishment.";
    } else if (conditions.includes("hypertension")) {
      mealName = "No-Salt Lentil & Spinach Soup";
      description = "Freshly prepared brown lentils cooked with celery, carrots, spinach, herbs, and lemon juice (no added table salt).";
      reason = "Lentils are high in potassium which helps lower blood pressure, and herbs add delicious sodium-free flavor.";
    } else {
      mealName = "Quinoa and Grilled Chicken Bowl";
      description = "120g grilled chicken breast over 1/2 cup cooked quinoa, mixed bell peppers, and avocado slices.";
      reason = "Perfect macronutrient balance of lean protein, complex carbs, and healthy fats for sustained midday energy.";
    }
  } else {
    // Snack or Dinner segment (Evening/Night)
    if (conditions.includes("diabetes")) {
      mealName = "Stir-Fried Tofu & Broccoli";
      description = "150g firm tofu stir-fried with plenty of broccoli florets and snap peas, flavored with garlic and ginger.";
      reason = "Lower calorie and lower carb meal to avoid evening blood glucose spikes while keeping protein high.";
    } else if (conditions.includes("obesity")) {
      mealName = "Baked Cod with Asparagus";
      description = "150g white cod fish baked with herbs, served alongside roasted asparagus spears and a small green salad.";
      reason = "Very low in calories but highly satiating due to the high volume of fiber and lean protein.";
    } else {
      mealName = "Lemon Herb Salmon";
      description = "140g salmon fillet baked with lemon and dill, served with steamed broccoli.";
      reason = "High in omega-3 fatty acids and protein to support cellular repair and overnight recovery.";
    }
  }

  // Handle case when no meals are logged yet
  if (hasNoMeals) {
    description = `🥗 [Default Time-based Suggestion] ${description}\n\n📢 Reminder: You have not logged any meals yet today. Please remember to update your meal inputs regularly in the 'AI Meal' tab so we can track and analyze your nutrition and water intake accurately!`;
    reason = `No meals have been logged yet today. Displaying default time-based suggestion. ${reason}`;
    tips.unshift("Please update your meal logs regularly!");
  }

  return {
    greeting,
    mealName,
    description,
    reason,
    estimatedNutrition: {
      calories: Math.min(caloriesLeft, 450),
      protein: Math.min(proteinLeft, 30),
      carbs: 35,
      fat: 10
    },
    tips: tips
  };
}

export async function analyzeMealImage(imageBuffer, mimeType) {
  try {
    if (!model) {
      console.warn("Gemini model not initialized, using dietician fallback.");
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