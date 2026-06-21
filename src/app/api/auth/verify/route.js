import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.json({ success: false, error: "token is required" }, { status: 400 });
    }

    const row = await verifyToken(token);
    if (!row) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 });
    }

    return NextResponse.json({ success: true, email: row.email, message: "Email verified" });
  } catch (error) {
    console.error("VERIFY API ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
