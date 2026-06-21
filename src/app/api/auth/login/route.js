import { NextResponse } from "next/server";
import { getUserByEmail, getDashboardDataByEmail } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Get user by email
    const user = await getUserByEmail(email.toLowerCase());
    if (!user) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }

    // Password check (bcrypt)
    if (!user.password) {
      return NextResponse.json({ success: false, error: "Password not set for this account" }, { status: 401 });
    }

    const match = await import('bcryptjs').then(mod => mod.compare(password, user.password));
    if (!match) {
      return NextResponse.json({ success: false, error: "Incorrect password" }, { status: 401 });
    }

    // Ensure email is verified (bypassed for development)
    if (user.email_verified === false) {
      console.log("[DEV] Bypassing email verification check for:", user.email);
    }

    // Get user dashboard data
    const data = await getDashboardDataByEmail(email.toLowerCase());

    return NextResponse.json({ 
      success: true, 
      email: user.email,
      name: user.name,
      profile: data?.profile || null,
      message: "Login successful" 
    });
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
