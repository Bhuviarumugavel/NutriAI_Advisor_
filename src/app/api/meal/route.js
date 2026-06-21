import { NextResponse } from "next/server";
import { saveMeal, saveMealByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    // Support both legacy userId and new email
    if (!body.userId && !body.email) {
      return NextResponse.json(
        { success: false, error: "email or userId is required" },
        { status: 400 }
      );
    }

    if (body.email) {
      await saveMealByEmail(body);
    } else {
      await saveMeal(body);
    }

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