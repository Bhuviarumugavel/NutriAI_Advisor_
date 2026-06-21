import { NextResponse } from "next/server";
import { saveWater, saveWaterByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.userId && !body.email) {
      return NextResponse.json(
        { success: false, error: "email or userId is required" },
        { status: 400 }
      );
    }

    if (body.email) {
      await saveWaterByEmail(body);
    } else {
      await saveWater(body);
    }

    return NextResponse.json({
      success: true,
      message: "Water data saved"
    });

  } catch (error) {
    console.error("WATER API ERROR:", error);
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