import { NextResponse } from "next/server";
import { getDashboardData, getDashboardDataByEmail } from "@/lib/db";
import { generateMealSuggestion } from "@/lib/gemini";
import {
  DAILY_TARGETS,
  generateNutritionSummary,
  generateMealRecommendation,
  calculateWellnessScore
} from "@/lib/nutrition";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    const dashboard = email
      ? await getDashboardDataByEmail(email.toLowerCase())
      : await getDashboardData(userId || "demo-user");

    const summary = generateNutritionSummary({
      ...dashboard,
      water: dashboard?.water || 0
    });

    // Basic rule-based suggestion
    const basicSuggestion = generateMealRecommendation(dashboard.profile, dashboard);

    // AI-powered personalized suggestion based on profile
    let aiSuggestion = null;
    try {
      aiSuggestion = await generateMealSuggestion(dashboard.profile, dashboard);
    } catch (err) {
      console.error("AI suggestion error:", err.message);
    }

    const healthScore = calculateWellnessScore(dashboard);

    return NextResponse.json({
      success: true,
      targets: DAILY_TARGETS,
      dashboard,
      summary,
      suggestion: basicSuggestion,
      aiSuggestion,
      healthScore
    });

  } catch (error) {
    console.error("DASHBOARD API ERROR:", error);
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