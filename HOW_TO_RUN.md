# NutriAI Advisor - How to Run and Use

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Windows PowerShell or Command Prompt

---

## 📋 Step 1: Install Dependencies

Open PowerShell and navigate to the project directory:

```powershell
cd "c:\Users\bhuan\Work\my project\NutriAI_Advisor"
npm install
```

Wait for all packages to install (this may take a few minutes).

---

## ▶️ Step 2: Start the Development Server

Run the development server:

```powershell
npm run dev
```

You should see:
```
   ▲ Next.js 15.5.19
   - Local:        http://localhost:3000
   - Network:      http://192.168.56.1:3000
   - Environments: .env.local

 ✓ Ready in 2.4s
```

---

## 🌐 Step 3: Access the Application

Open your web browser and go to:
```
http://localhost:3000
```

You will see the **Home Page** with 2 options.

---

## 📱 Application Features & How to Use

### 🏠 Home Page (First Screen)

Two options are available:

#### **Option 1: New User** (🆕 Create profile & get User ID)
- Click the "New User" button
- You'll be taken to the registration page
- Fill in all your personal information:
  - **Name**: Your full name
  - **Age**: Your age (1-120)
  - **Gender**: Select from Male, Female, Other
  - **Weight**: In kg
  - **Height**: In cm
  - **Activity Level**: Sedentary, Light, Moderate, Active, Very Active
  - **Goal**: Lose Weight, Maintain, or Gain Weight
  - **Health Conditions**: (Optional) Select any conditions that apply
  - **Diet Preference**: e.g., Vegetarian, Vegan, Keto

- Click **"Create Profile & Get User ID"**
- A **unique User ID** will be generated (e.g., `USER_1718698800000_ABC1XYZ2W`)
- **SAVE THIS ID** - You'll need it to login next time
- You'll be automatically redirected to the Dashboard

#### **Option 2: Existing User** (🔐 Login with User ID)
- Click the "Existing User" button
- Enter your **User ID** (the one you saved earlier)
- Click **"Login"**
- You'll be redirected to your Dashboard

---

## 📊 Dashboard (Main App)

Once logged in, you'll see:

### **Nutrition Summary Cards**
- **Calories Left**: Remaining calories for the day
- **Protein**: Protein consumed vs target
- **Hydration**: Water intake percentage

### **Daily Energy Ring**
- Visual representation of calories consumed vs target
- Shows remaining calories

### **AI Insight Card**
- Personalized meal suggestions from the nutrition AI
- Shows why this meal is recommended for you

### **Meal Suggestions**
- Get afternoon meal recommendations
- Shows estimated nutrition (Calories, Protein, Carbs, Fat)
- Click "Add this meal →" to log the meal

### **Water Hydration Tracker**
- Current water consumption (in ml)
- Percentage of daily goal (2.5L = 2500ml)
- Buttons to add/remove 100ml of water

### **Macro Progress**
- Visual bars for Protein, Carbs, and Fats
- Shows current vs target amounts

### **Weekly Trends**
- Chart showing your calorie intake for the past week

---

## 🍽️ AI Meal Page

Click on **"AI Meal"** in the bottom navigation.

### Features:
1. **Add Meal**
   - Enter food description (e.g., "Grilled chicken with rice and vegetables")
   - The AI will analyze the nutritional content
   - Shows estimated Calories, Protein, Carbs, Fat, Fiber

2. **Get Meal Suggestions**
   - Based on your profile and today's nutrition
   - AI suggests meals that fit your health conditions
   - Shows why each meal is recommended

3. **Track Your Meals**
   - All meals logged today are shown
   - View total nutrition accumulated

---

## 💧 Hydration Page

Click on **"Hydration"** in the bottom navigation.

### Features:
1. **Log Water Intake**
   - Buttons to quickly add/remove water (100ml increments)
   - Manual entry of water amount

2. **Daily Goal Tracking**
   - Target: 2.5L (2500ml) per day
   - Visual progress indicator
   - Percentage completion

3. **Weekly History**
   - See your hydration pattern over the week

---

## 👤 Profile Page

Click on **"Profile"** in the bottom navigation.

### Features:
1. **Edit Personal Information**
   - Update name, age, weight, height
   - Change gender and activity level
   - Update fitness goal

2. **Health Conditions**
   - Add/remove health conditions
   - The system provides personalized recommendations based on these

3. **Wellness Score**
   - Your current health score (0-100)
   - Weekly progress metrics
   - Hydration and Nutrition percentages

4. **Save Changes**
   - Click "Save Profile" to update your information

---

## 🔄 Navigation

At the bottom of the screen, you'll see:

- 🏠 **Dashboard** - Main nutrition overview
- 🍽️ **AI Meal** - Log meals and get suggestions
- 💧 **Hydration** - Track water intake
- 👤 **Profile** - Manage your information

Click any icon to navigate between pages.

---

## 🎯 Daily Workflow Example

### Morning:
1. Check Dashboard for daily goals
2. See AI meal suggestion for breakfast
3. Log breakfast meals

### Afternoon:
1. Check remaining calories
2. Get AI suggestion for lunch
3. Log lunch and water intake

### Evening:
1. Log dinner
2. Check hydration progress
3. Update profile if needed
4. Review daily trends

---

## 🐛 Troubleshooting

### "Server is not responding"
- Make sure you're running `npm run dev` in the terminal
- Check that it says "Ready in X.Xs"
- Try refreshing the browser (F5)

### "User not found" error on login
- Double-check your User ID spelling (they are case-sensitive)
- Make sure you copied it correctly when you created the account

### "Failed to create profile"
- Fill in all required fields (marked with *)
- Ensure valid inputs:
  - Age: 1-120
  - Weight: Greater than 20kg
  - Height: Greater than 100cm
- Try again

### Styles look broken
- This is normal on first load
- Refresh the page (F5)
- Make sure CSS is compiled (you should see "Compiled" in terminal)

---

## 📊 API Endpoints (For Reference)

The app has these API routes:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard` | GET | Get nutrition data |
| `/api/user` | POST | Create/update user profile |
| `/api/meal` | POST | Log a meal |
| `/api/water` | POST | Log water intake |
| `/api/analyze` | POST | Analyze food nutrition |

---

## 💾 Data Storage

- **New Users**: Data is stored locally in `data/fallback-db.json`
- **Your User ID**: Stored in browser's localStorage
- **Meal Logs**: Stored daily with timestamp
- **Profile**: Persists across sessions

---

## 🛑 Stopping the Server

In the PowerShell terminal, press:
```
Ctrl + C
```

Type `Y` if asked to confirm.

---

## 🔐 Your User ID

**Format**: `USER_[timestamp]_[random_code]`

**Example**: `USER_1718698800000_ABC1XYZ2W`

- Save it somewhere safe
- Use it to login on any device
- Share it with no one

---

## 📞 Support

If you encounter any issues:

1. Check that all dependencies are installed: `npm install`
2. Ensure the server is running: `npm run dev`
3. Clear browser cache and refresh
4. Check the browser console for errors (F12)
5. Look at terminal output for error messages

---

## 🎉 You're All Set!

Your NutriAI Advisor is ready to help you track nutrition and improve your health!

Happy tracking! 🥗💪
