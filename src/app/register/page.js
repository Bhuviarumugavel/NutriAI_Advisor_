"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setActiveUserId } from "@/lib/userClient";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
    weight: "",
    height: "",
    healthConditions: [],
    dietPreference: "",
    activityLevel: "moderate",
    goal: "maintain"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const healthOptions = ["Diabetes", "Heart Disease", "Hypertension", "Kidney Disease", "Celiac Disease", "High Cholesterol", "Obesity"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleHealthCondition = (condition) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.age || formData.age < 1 || formData.age > 120) {
      setError("Please enter a valid age");
      return;
    }

    if (!formData.weight || formData.weight < 20) {
      setError("Please enter a valid weight");
      return;
    }

    if (!formData.height || formData.height < 100) {
      setError("Please enter a valid height");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          height: formData.height,
          healthConditions: formData.healthConditions,
          dietPreference: formData.dietPreference,
          activityLevel: formData.activityLevel,
          goal: formData.goal
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create profile");
      }

      setShowSuccess(true);
      setActiveUserId(formData.email.trim().toLowerCase());

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to create profile");
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            <div className="text-6xl">✅</div>
            <h2 className="text-2xl font-bold text-slate-900">Profile Created!</h2>
            
            <div className="bg-emerald-50 rounded-2xl p-6 space-y-2">
              <p className="text-sm text-slate-600">Your registered email:</p>
              <p className="text-2xl font-bold text-emerald-600 break-all">{formData.email}</p>
            </div>

            <p className="text-slate-600">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
            ← Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Your Profile</h1>
          <p className="text-slate-600">Tell us about yourself for personalized recommendations</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="25"
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={formData.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very-active">Very Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Biometrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Biometrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="175"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Goal</label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain</option>
                    <option value="gain">Gain Weight</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Health Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Health Conditions (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {healthOptions.map(condition => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleHealthCondition(condition)}
                    className={`py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                      formData.healthConditions.includes(condition)
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Preference */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Diet Preference</label>
              <input
                type="text"
                name="dietPreference"
                value={formData.dietPreference}
                onChange={handleInputChange}
                placeholder="e.g., Vegetarian, Vegan, Keto"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-lg"
            >
              {loading ? "Creating Profile..." : "Create Profile & Get User ID"}
            </button>

            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
