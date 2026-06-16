import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import os from "os";
import { createClient } from "@supabase/supabase-js";

const TEMP_FILE = path.join(os.tmpdir(), "NutriAI_Data.xlsx");

// Supabase storage configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "nutriai-data";
const SUPABASE_FILEPATH = process.env.SUPABASE_FILEPATH || "NutriAI_Data.xlsx";

let supabase = null;
function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });
  }
  return supabase;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

async function getWorkbook() {
  ensureDataDir();
  const workbook = new ExcelJS.Workbook();

  try {
    // Try to load from Supabase storage first (preferred for persistent storage)
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.storage.from(SUPABASE_BUCKET).download(SUPABASE_FILEPATH);
        if (!error && data) {
          const arrayBuffer = await data.arrayBuffer();
          await workbook.xlsx.load(Buffer.from(arrayBuffer));
          return workbook;
        }
      } catch (supErr) {
        console.error("Supabase download error:", supErr.message);
      }
    }

    // Fallback: if a temp file exists from a previous runtime, load it.
    if (fs.existsSync(TEMP_FILE)) {
      await workbook.xlsx.readFile(TEMP_FILE);
    }
  } catch (err) {
    console.error("Error reading Excel file, creating fresh workbook:", err.message);
  }

  return workbook;
}

function createSheetHeader(sheet, user) {
  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "MealType", key: "mealType", width: 12 },
    { header: "Food", key: "food", width: 30 },
    { header: "Calories", key: "calories", width: 10 },
    { header: "Protein", key: "protein", width: 10 },
    { header: "Carbs", key: "carbs", width: 10 },
    { header: "Fat", key: "fat", width: 10 },
    { header: "Fiber", key: "fiber", width: 10 },
    { header: "Water", key: "water", width: 10 }
  ];

  if (user) {
    writeProfileDetails(sheet, user);
  }
}

function writeProfileDetails(sheet, user) {
  if (!user) return;

  sheet.getCell("K1").value = "Name";
  sheet.getCell("L1").value = user.name || "";

  sheet.getCell("K2").value = "Age";
  sheet.getCell("L2").value = user.age || "";

  sheet.getCell("K3").value = "Gender";
  sheet.getCell("L3").value = user.gender || "";

  sheet.getCell("K4").value = "Weight";
  sheet.getCell("L4").value = user.weight || "";

  sheet.getCell("K5").value = "Height";
  sheet.getCell("L5").value = user.height || "";

  sheet.getCell("K6").value = "HealthConditions";
  sheet.getCell("L6").value = Array.isArray(user.healthConditions)
    ? user.healthConditions.join(", ")
    : user.healthConditions || "";

  sheet.getCell("K7").value = "ActivityLevel";
  sheet.getCell("L7").value = user.activityLevel || "moderate";

  sheet.getCell("K8").value = "Goal";
  sheet.getCell("L8").value = user.goal || "maintain";
}

function readProfileDetails(sheet) {
  if (!sheet) return null;

  const parseConditions = (value) => {
    if (!value) return [];
    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  return {
    name: sheet.getCell("L1").value || "",
    age: sheet.getCell("L2").value || "",
    gender: sheet.getCell("L3").value || "",
    weight: sheet.getCell("L4").value || "",
    height: sheet.getCell("L5").value || "",
    healthConditions: parseConditions(sheet.getCell("L6").value),
    activityLevel: sheet.getCell("L7").value || "moderate",
    goal: sheet.getCell("L8").value || "maintain"
  };
}

async function saveWorkbook(workbook) {
  // Try uploading to Supabase storage (preferred)
  const client = getSupabaseClient();
  if (client) {
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      // Upload with upsert
      const { error } = await client.storage.from(SUPABASE_BUCKET).upload(SUPABASE_FILEPATH, Buffer.from(buffer), {
        upsert: true
      });
      if (!error) return;
      console.error("Supabase upload error:", error.message);
    } catch (err) {
      console.error("Failed to upload workbook to Supabase:", err.message);
    }
  }

  // Ensure a writable location — write to temp file to avoid EROFS on deployments
  try {
    await workbook.xlsx.writeFile(TEMP_FILE);
  } catch (err) {
    // As a last resort, try writing to the repo location (may fail on serverless)
    ensureDataDir();
    await workbook.xlsx.writeFile(filePath);
  }
}

async function getOrCreateSheet(userId, user) {
  const workbook = await getWorkbook();
  let sheet = workbook.getWorksheet(userId);

  if (!sheet) {
    sheet = workbook.addWorksheet(userId);
    createSheetHeader(sheet, user);
    await saveWorkbook(workbook);
  }

  return { workbook, sheet };
}

export async function createUserSheet(user) {
  const workbook = await getWorkbook();
  let sheet = workbook.getWorksheet(user.userId);

  if (!sheet) {
    sheet = workbook.addWorksheet(user.userId);
    createSheetHeader(sheet, user);
  } else {
    writeProfileDetails(sheet, user);
  }

  await saveWorkbook(workbook);
  return { success: true };
}

export async function saveMeal(data) {
  const { workbook, sheet } = await getOrCreateSheet(data.userId);

  sheet.addRow({
    date: new Date().toLocaleDateString(),
    mealType: data.mealType,
    food: data.food,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
    fiber: data.fiber,
    water: ""
  });

  await saveWorkbook(workbook);
  return { success: true };
}

export async function saveWater(data) {
  const { workbook, sheet } = await getOrCreateSheet(data.userId);

  sheet.addRow({
    date: new Date().toLocaleDateString(),
    mealType: "Water",
    food: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    fiber: "",
    water: data.water
  });

  await saveWorkbook(workbook);
  return { success: true };
}

export async function getDashboardData(userId) {
  const workbook = await getWorkbook();
  const sheet = workbook.getWorksheet(userId);

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;
  let water = 0;
  const meals = [];

  if (!sheet) {
    return {
      calories,
      protein,
      carbs,
      fat,
      fiber,
      water,
      meals,
      profile: null
    };
  }

  const today = new Date().toLocaleDateString();

  sheet.eachRow((row, index) => {
    if (index > 1) {
      const rowDate = String(row.getCell(1).value || "");
      const mealType = String(row.getCell(2).value || "");
      const food = String(row.getCell(3).value || "");
      const cal = Number(row.getCell(4).value || 0);
      const prot = Number(row.getCell(5).value || 0);
      const carb = Number(row.getCell(6).value || 0);
      const f = Number(row.getCell(7).value || 0);
      const fib = Number(row.getCell(8).value || 0);
      const wat = Number(row.getCell(9).value || 0);

      // Only count today's data for dashboard totals
      if (rowDate === today) {
        calories += cal;
        protein += prot;
        carbs += carb;
        fat += f;
        fiber += fib;
        water += wat;
      }

      // Collect meal history
      if (mealType && mealType !== "Water" && food) {
        meals.push({
          date: rowDate,
          mealType,
          food,
          calories: cal,
          protein: prot,
          carbs: carb,
          fat: f,
          fiber: fib
        });
      }
    }
  });

  return {
    calories,
    protein,
    carbs,
    fat,
    fiber,
    water,
    meals,
    profile: readProfileDetails(sheet)
  };
}

export async function getAllUsers() {
  const workbook = await getWorkbook();
  const users = [];

  workbook.eachSheet((sheet) => {
    const profile = readProfileDetails(sheet);
    if (profile) {
      users.push({
        userId: sheet.name,
        ...profile
      });
    }
  });

  return users;
}
