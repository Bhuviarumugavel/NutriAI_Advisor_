import { NextResponse } from "next/server";
import { analyzeMealText, analyzeMealImage, generateMealSuggestion } from "@/lib/gemini";
import { getDashboardData, getDashboardDataByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let email = null;
    let userId = "demo-user";
    let analysis = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image");
      const foodText = formData.get("food") || "";
      email = formData.get("email");
      userId = formData.get("userId") || "demo-user";

      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        analysis = await analyzeMealImage(buffer, file.type);
      } else if (foodText) {
        analysis = await analyzeMealText(foodText);
      } else {
        return NextResponse.json({ success: false, error: "No food text or image provided" }, { status: 400 });
      }
    } else {
      const body = await req.json();
      email = body.email;
      userId = body.userId || "demo-user";
      
      if (body.food) {
        analysis = await analyzeMealText(body.food);
      } else {
        return NextResponse.json({ success: false, error: "No food text provided" }, { status: 400 });
      }
    }

    if (!analysis) {
      throw new Error("Unable to analyze meal");
    }

    if (analysis.unclear) {
      return NextResponse.json({
        success: true,
        unclear: true,
        message: "Image analysis was unclear. Please describe the meal manually."
      });
    }

    // Get user profile and dashboard data for personalized suggestions
    const dashboardData = email
      ? await getDashboardDataByEmail(email.toLowerCase())
      : await getDashboardData(userId);
    const profile = dashboardData?.profile || {};

    // Generate personalized meal suggestion based on profile
    const suggestion = await generateMealSuggestion(profile, {
      calories: (dashboardData?.calories || 0) + (analysis.calories || 0),
      protein: (dashboardData?.protein || 0) + (analysis.protein || 0),
      carbs: (dashboardData?.carbs || 0) + (analysis.carbs || 0),
      fat: (dashboardData?.fat || 0) + (analysis.fat || 0),
      water: dashboardData?.water || 0
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