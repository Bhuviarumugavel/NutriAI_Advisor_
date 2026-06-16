import { NextResponse } from "next/server";
import { analyzeMealText, generateMealSuggestion } from "@/lib/gemini";
import { getDashboardData } from "@/lib/excel";

export async function POST(req) {
  try {
    const body = await req.json();
    const userId = body.userId || "demo-user";

    // Analyze the food
    const analysis = await analyzeMealText(body.food);

    // Get user profile and dashboard data for personalized suggestions
    const dashboardData = await getDashboardData(userId);
    const profile = dashboardData.profile || {};

    // Generate personalized meal suggestion based on profile
    const suggestion = await generateMealSuggestion(profile, {
      calories: (dashboardData.calories || 0) + (analysis.calories || 0),
      protein: (dashboardData.protein || 0) + (analysis.protein || 0),
      carbs: (dashboardData.carbs || 0) + (analysis.carbs || 0),
      fat: (dashboardData.fat || 0) + (analysis.fat || 0),
      water: dashboardData.water || 0
    });

    return NextResponse.json({
      success: true,
      analysis,
      suggestion
    });

  } catch (error) {
    console.error("ANALYZE API ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      {
        status: 500
      }
    );
  }
}