import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_APP_BUCKET = process.env.SUPABASE_APP_BUCKET || "nutriai-app-data";
const FALLBACK_DB_FILE = (process.env.VERCEL || process.env.VERCEL_ENV)
  ? path.join("/tmp", "fallback-db.json")
  : path.join(process.cwd(), "data", "fallback-db.json");

let supabase = null;

function isValidSupabaseKey(key) {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  if (!trimmed) return false;
  if (/^https?:\/\//i.test(trimmed)) return false;
  return trimmed.length > 20;
}

function getSupabaseClient() {
  if (!SUPABASE_URL || !isValidSupabaseKey(SUPABASE_SERVICE_ROLE_KEY)) return null;
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });
  }
  return supabase;
}

function hasSupabaseConfig() {
  return Boolean(SUPABASE_URL && isValidSupabaseKey(SUPABASE_SERVICE_ROLE_KEY));
}

function ensureFallbackDb() {
  const dir = path.dirname(FALLBACK_DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(FALLBACK_DB_FILE)) {
    const initial = { profiles: [], meals: [], water: [], uploads: [] };
    fs.writeFileSync(FALLBACK_DB_FILE, JSON.stringify(initial, null, 2), "utf8");
  }
}

function loadFallbackDb() {
  ensureFallbackDb();
  const raw = fs.readFileSync(FALLBACK_DB_FILE, "utf8");
  return raw ? JSON.parse(raw) : { profiles: [], meals: [], water: [], uploads: [] };
}

function saveFallbackDb(db) {
  ensureFallbackDb();
  fs.writeFileSync(FALLBACK_DB_FILE, JSON.stringify(db, null, 2), "utf8");
}

function normalizeHealthConditions(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === "string") {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

async function upsertProfile(profile) {
  console.log('[upsertProfile] Input profile:', { email: profile.email, hasPassword: !!profile.password, name: profile.name, userId: profile.userId });

  const data = {
    user_id: profile.userId,
    username: profile.username || profile.name,
    name: profile.name,
    email: profile.email ? String(profile.email).toLowerCase() : undefined,
    password: profile.password || undefined,
    age: profile.age || "",
    gender: profile.gender || "",
    health_conditions: normalizeHealthConditions(profile.healthConditions),
    diet_preference: profile.dietPreference || "",
    height: profile.height || "",
    weight: profile.weight || "",
    allergies: profile.allergies || "",
    activity_level: profile.activityLevel || "moderate",
    goal: profile.goal || "maintain",
    email_verified: profile.email_verified !== undefined ? profile.email_verified : (profile.emailVerified !== undefined ? profile.emailVerified : true)
  };
  console.log('[upsertProfile] Data object to save:', { user_id: data.user_id, email: data.email, hasPassword: !!data.password, email_verified: data.email_verified });

  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { error } = await client.from("profiles").upsert(data, { onConflict: "user_id" });
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  const db = loadFallbackDb();
  const lowerEmail = profile.email ? String(profile.email).toLowerCase() : null;
  const index = db.profiles.findIndex((item) => {
    if (profile.userId && item.user_id && item.user_id === profile.userId) return true;
    if (lowerEmail && item.email && String(item.email).toLowerCase() === lowerEmail) return true;
    return false;
  });
  if (index >= 0) {
    db.profiles[index] = { ...db.profiles[index], ...data };
  } else {
    console.log('[upsertProfile] Saving new profile with email:', data.email, 'and password:', !!data.password);
    db.profiles.push(data);
  }
  saveFallbackDb(db);
  return data;
}

async function getProfile(userId) {
  if (!userId) return null;

  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { data, error } = await client.from("profiles").select("*").eq("user_id", userId).maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  const db = loadFallbackDb();
  return db.profiles.find((profile) => profile.user_id === userId) || null;
}

async function insertMealRow(data) {
  const row = {
    user_id: data.userId,
    meal_type: data.mealType,
    food: data.food,
    calories: Number(data.calories) || 0,
    protein: Number(data.protein) || 0,
    carbs: Number(data.carbs) || 0,
    fat: Number(data.fat) || 0,
    fiber: Number(data.fiber) || 0,
    created_at: new Date().toISOString()
  };

  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { error } = await client.from("meals").insert(row);
    if (error) {
      throw new Error(error.message);
    }
    return row;
  }

  const db = loadFallbackDb();
  db.meals.push(row);
  saveFallbackDb(db);
  return row;
}

async function insertWaterRow(data) {
  const row = {
    user_id: data.userId,
    amount: Number(data.water) || 0,
    recorded_at: new Date().toISOString()
  };

  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { error } = await client.from("water").insert(row);
    if (error) {
      throw new Error(error.message);
    }
    return row;
  }

  const db = loadFallbackDb();
  db.water.push(row);
  saveFallbackDb(db);
  return row;
}

async function getMealRows(userId) {
  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { data, error } = await client.from("meals").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  }

  const db = loadFallbackDb();
  return db.meals.filter((row) => row.user_id === userId);
}

async function getWaterRows(userId) {
  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { data, error } = await client.from("water").select("*").eq("user_id", userId).order("recorded_at", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    return data || [];
  }

  const db = loadFallbackDb();
  return db.water.filter((row) => row.user_id === userId);
}

function parseJsonArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function normalizeProfileRow(row) {
  if (!row) return null;
  return {
    name: row.name || "",
    username: row.username || row.name || "",
    age: row.age || "",
    gender: row.gender || "",
    weight: row.weight || "",
    height: row.height || "",
    healthConditions: parseJsonArray(row.health_conditions),
    dietPreference: row.diet_preference || "",
    allergies: row.allergies || "",
    activityLevel: row.activity_level || "moderate",
    goal: row.goal || "maintain"
  };
}

function getTodayString(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function createUserSheet(user) {
  await upsertProfile(user);
  return { success: true };
}

export async function saveMeal(data) {
  if (!data.userId) {
    throw new Error("userId is required");
  }
  await insertMealRow(data);
  return { success: true };
}

export async function saveWater(data) {
  if (!data.userId) {
    throw new Error("userId is required");
  }
  await insertWaterRow(data);
  return { success: true };
}

function getWeeklyTrends(mealRows, waterRows) {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    last7Days.push(`${yyyy}-${mm}-${dd}`);
  }

  return last7Days.map(dateStr => {
    let cal = 0;
    let prot = 0;
    let carb = 0;
    let ft = 0;
    let wat = 0;

    mealRows.forEach(row => {
      const rowDate = getTodayString(row.created_at || row.date || "");
      if (rowDate === dateStr) {
        cal += Number(row.calories) || 0;
        prot += Number(row.protein) || 0;
        carb += Number(row.carbs) || 0;
        ft += Number(row.fat) || 0;
      }
    });

    waterRows.forEach(row => {
      const rowDate = getTodayString(row.recorded_at || row.recordedAt || row.date || "");
      if (rowDate === dateStr) {
        wat += Number(row.amount) || 0;
      }
    });

    const parts = dateStr.split('-');
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    return {
      date: dateStr,
      day: dayName,
      calories: cal,
      protein: prot,
      carbs: carb,
      fat: ft,
      water: wat
    };
  });
}

export async function getDashboardData(userId) {
  const profileRow = await getProfile(userId);
  const profile = normalizeProfileRow(profileRow);
  const mealRows = await getMealRows(userId);
  const waterRows = await getWaterRows(userId);

  const todayDate = new Date();
  const yyyy = todayDate.getFullYear();
  const mm = String(todayDate.getMonth() + 1).padStart(2, "0");
  const dd = String(todayDate.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let water = 0;
  const meals = [];

  mealRows.forEach((row) => {
    const rowDate = getTodayString(row.created_at || row.date || "");
    if (rowDate === today) {
      calories += Number(row.calories) || 0;
      protein += Number(row.protein) || 0;
      carbs += Number(row.carbs) || 0;
      fat += Number(row.fat) || 0;
      fiber += Number(row.fiber) || 0;
    }
    if (row.meal_type && row.meal_type !== "Water" && row.food) {
      meals.push({
        date: rowDate,
        mealType: row.meal_type,
        food: row.food,
        calories: Number(row.calories) || 0,
        protein: Number(row.protein) || 0,
        carbs: Number(row.carbs) || 0,
        fat: Number(row.fat) || 0,
        fiber: Number(row.fiber) || 0
      });
    }
  });

  waterRows.forEach((row) => {
    const rowDate = getTodayString(row.recorded_at || row.date || "");
    if (rowDate === today) {
      water += Number(row.amount) || 0;
    }
  });

  const weeklyData = getWeeklyTrends(mealRows, waterRows);

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    water,
    meals,
    profile,
    weeklyData
  };
}

export async function getAllUsers() {
  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { data, error } = await client.from("profiles").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return (data || []).map((row) => ({ userId: row.user_id, ...normalizeProfileRow(row) }));
  }

  const db = loadFallbackDb();
  return db.profiles.map((row) => ({ userId: row.user_id, ...normalizeProfileRow(row) }));
}

export async function uploadAppFile(userId, fileName, fileBuffer, contentType) {
  if (!userId || !fileName) {
    throw new Error("userId and fileName are required");
  }

  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const storagePath = `uploads/${userId}/${Date.now()}-${fileName}`;
    const { error } = await client.storage.from(SUPABASE_APP_BUCKET).upload(storagePath, fileBuffer, {
      contentType,
      upsert: true
    });
    if (error) {
      throw new Error(error.message);
    }
    const { data: urlData, error: urlError } = client.storage.from(SUPABASE_APP_BUCKET).getPublicUrl(storagePath);
    if (urlError) {
      throw new Error(urlError.message);
    }
    return { path: storagePath, publicUrl: urlData.publicUrl };
  }

  const uploadsDir = (process.env.VERCEL || process.env.VERCEL_ENV)
    ? path.join("/tmp", "uploads", userId)
    : path.join(process.cwd(), "public", "uploads", "fallback", userId);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const localPath = path.join(uploadsDir, `${Date.now()}-${fileName}`);
  fs.writeFileSync(localPath, fileBuffer);
  const publicUrl = (process.env.VERCEL || process.env.VERCEL_ENV)
    ? `/api/placeholder-uploads?path=${encodeURIComponent(localPath)}`
    : `/${path.relative(path.join(process.cwd(), "public"), localPath).replace(/\\/g, "/")}`;
  return { path: localPath, publicUrl };
}

// EMAIL-BASED AUTHENTICATION FUNCTIONS

export async function getUserByEmail(email) {
  if (!email) return null;

  const db = loadFallbackDb();
  const user = db.profiles.find((p) => p.email && p.email.toLowerCase() === email.toLowerCase());
  return user || null;
}

export async function getDashboardDataByEmail(email) {
  if (!email) return null;

  const user = getUserByEmail(email);
  if (!user) return null;

  // Use email to find meals and water data
  const db = loadFallbackDb();
  const mealRows = db.meals.filter((m) => m.email && m.email.toLowerCase() === email.toLowerCase()) || [];
  const waterRows = db.water.filter((w) => w.email && w.email.toLowerCase() === email.toLowerCase()) || [];

  const todayDate = new Date();
  const yyyy = todayDate.getFullYear();
  const mm = String(todayDate.getMonth() + 1).padStart(2, "0");
  const dd = String(todayDate.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let water = 0;
  const meals = [];

  mealRows.forEach((row) => {
    const rowDate = getTodayString(row.created_at || row.date || "");
    if (rowDate === today) {
      calories += Number(row.calories) || 0;
      protein += Number(row.protein) || 0;
      carbs += Number(row.carbs) || 0;
      fat += Number(row.fat) || 0;
      fiber += Number(row.fiber) || 0;
    }
    if (row.meal_type && row.meal_type !== "Water" && row.food) {
      meals.push({
        date: rowDate,
        mealType: row.meal_type,
        food: row.food,
        calories: Number(row.calories) || 0,
        protein: Number(row.protein) || 0,
        carbs: Number(row.carbs) || 0,
        fat: Number(row.fat) || 0,
        fiber: Number(row.fiber) || 0
      });
    }
  });

  waterRows.forEach((row) => {
    const rowDate = getTodayString(row.recorded_at || row.date || "");
    if (rowDate === today) {
      water += Number(row.amount) || 0;
    }
  });

  const profile = {
    name: user.name || "",
    email: user.email || "",
    age: user.age || "",
    gender: user.gender || "",
    weight: user.weight || "",
    height: user.height || "",
    healthConditions: parseJsonArray(user.health_conditions),
    dietPreference: user.diet_preference || "",
    allergies: user.allergies || "",
    activityLevel: user.activity_level || "moderate",
    goal: user.goal || "maintain"
  };

  const weeklyData = getWeeklyTrends(mealRows, waterRows);

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    water,
    meals,
    profile,
    weeklyData
  };
}

export async function createUserByEmail(userData) {
  const email = userData.email?.toLowerCase();
  if (!email) throw new Error("Email is required");

  // Check if email already exists
  const existing = getUserByEmail(email);
  if (existing) throw new Error("Email already registered");

  const db = loadFallbackDb();
  
  const newUser = {
    email,
    password: userData.password,
    name: userData.name || "",
    age: userData.age || "",
    gender: userData.gender || "",
    health_conditions: normalizeHealthConditions(userData.healthConditions),
    diet_preference: userData.dietPreference || "",
    height: userData.height || "",
    weight: userData.weight || "",
    allergies: userData.allergies || "",
    activity_level: userData.activityLevel || "moderate",
    goal: userData.goal || "maintain",
    created_at: new Date().toISOString()
  };

  db.profiles.push(newUser);
  saveFallbackDb(db);
  return newUser;
}

export async function saveMealByEmail(data) {
  if (!data.email) {
    throw new Error("Email is required");
  }

  const row = {
    email: data.email.toLowerCase(),
    meal_type: data.mealType,
    food: data.food,
    calories: Number(data.calories) || 0,
    protein: Number(data.protein) || 0,
    carbs: Number(data.carbs) || 0,
    fat: Number(data.fat) || 0,
    fiber: Number(data.fiber) || 0,
    created_at: new Date().toISOString()
  };

  const db = loadFallbackDb();
  db.meals.push(row);
  saveFallbackDb(db);
  return row;
}

export async function saveWaterByEmail(data) {
  if (!data.email) {
    throw new Error("Email is required");
  }

  const row = {
    email: data.email.toLowerCase(),
    amount: Number(data.water) || 0,
    recorded_at: new Date().toISOString()
  };

  const db = loadFallbackDb();
  db.water.push(row);
  saveFallbackDb(db);
  return row;
}

// EMAIL VERIFICATION FUNCTIONS

export async function setVerificationToken(email, token, expires) {
  if (!email || !token) {
    throw new Error("Email and token are required");
  }

  const lowerEmail = String(email).toLowerCase();
  
  // Supabase path
  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { error } = await client
      .from("profiles")
      .update({
        verification_token: token,
        verification_expires: expires.toISOString(),
        email_verified: false
      })
      .ilike("email", lowerEmail);
    if (error) throw new Error(error.message);
    return { success: true };
  }

  // Fallback DB path
  const db = loadFallbackDb();
  const profile = db.profiles.find((p) => p.email && p.email.toLowerCase() === lowerEmail);
  if (profile) {
    profile.verification_token = token;
    profile.verification_expires = expires.toISOString();
    profile.email_verified = false;
    saveFallbackDb(db);
  } else {
    console.warn("[setVerificationToken] Profile not found for email:", email);
  }
  return { success: true };
}

export async function verifyEmailToken(token) {
  if (!token) {
    throw new Error("Token is required");
  }

  // Supabase path
  if (hasSupabaseConfig()) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("verification_token", token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return { success: false, error: "Invalid or expired token" };

    const now = new Date();
    const expires = new Date(data.verification_expires);
    if (now > expires) {
      return { success: false, error: "Token has expired" };
    }

    const { error: updateError } = await client
      .from("profiles")
      .update({ email_verified: true, verification_token: null })
      .eq("user_id", data.user_id);
    if (updateError) throw new Error(updateError.message);
    return { success: true, email: data.email };
  }

  // Fallback DB path
  const db = loadFallbackDb();
  const profile = db.profiles.find((p) => p.verification_token === token);
  if (!profile) {
    return { success: false, error: "Invalid or expired token" };
  }

  const now = new Date();
  const expires = new Date(profile.verification_expires);
  if (now > expires) {
    return { success: false, error: "Token has expired" };
  }

  profile.email_verified = true;
  profile.verification_token = null;
  saveFallbackDb(db);
  return { success: true, email: profile.email };
}
