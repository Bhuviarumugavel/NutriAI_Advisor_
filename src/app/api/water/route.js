import { NextResponse } from "next/server";
import { saveWater } from "@/lib/excel";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    await saveWater(body);

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