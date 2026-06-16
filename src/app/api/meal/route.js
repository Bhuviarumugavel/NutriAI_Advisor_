import { NextResponse } from "next/server";
import { saveMeal } from "@/lib/excel";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    await saveMeal(body);

    return NextResponse.json({
      success: true,
      message: "Meal saved successfully"
    });

  } catch (error) {
    console.error("MEAL API ERROR:", error);
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