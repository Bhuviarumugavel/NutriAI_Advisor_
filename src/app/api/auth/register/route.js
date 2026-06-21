import { NextResponse } from "next/server";
import { createUserSheet, getUserByEmail } from "@/lib/db";
import { createAndSendVerification } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validation
    if (!body.email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(body.email);
    if (existingUser && existingUser.password) {
      // already fully registered
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(body.password, 10);

    const user = {
      userId: body.email.toLowerCase(),
      email: body.email.toLowerCase(),
      password: hashed,
      name: body.name,
      age: body.age || "",
      gender: body.gender || "",
      healthConditions: body.healthConditions || [],
      dietPreference: body.dietPreference || "",
      height: body.height || "",
      weight: body.weight || "",
      allergies: body.allergies || "",
      activityLevel: body.activityLevel || "moderate",
      goal: body.goal || "maintain",
      emailVerified: true
    };

    // Create or update profile with password, then send verification email
    await createUserSheet(user);

    // send verification email (uses a pluggable send function via env if available)
    try {
      const sendFn = global?.sendEmailFunction || null;
      await createAndSendVerification(user.email, sendFn);
    } catch (err) {
      console.warn("Failed to send verification email:", err.message || err);
    }

    return NextResponse.json({ success: true, email: user.email, message: "Profile created successfully" });
  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
