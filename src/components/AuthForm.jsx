"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setActiveUserId } from "@/lib/userClient";

export default function AuthForm({ mode = "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    age: "",
    gender: "",
    healthConditions: "",
    dietPreference: "",
    height: "",
    weight: "",
    allergies: "",
    userId: "",
    email: "",
    password: ""
  });

  function update(field, value) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const payload = {
          email: form.email,
          password: form.password,
          name: form.name,
          username: form.username || form.name,
          age: form.age,
          gender: form.gender,
          healthConditions: form.healthConditions
            ? form.healthConditions.split(",").map((s) => s.trim())
            : [],
          dietPreference: form.dietPreference,
          height: form.height,
          weight: form.weight,
          allergies: form.allergies
        };

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Registration failed");
        // backend returns email on success
        setActiveUserId(data.email || data.userId || form.email);
        router.push("/dashboard");
      } else {
        // login
        const payload = { email: form.email, password: form.password };
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Login failed");
        setActiveUserId(data.email || data.userId || form.email);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h2 className="text-2xl mb-4">{mode === "register" ? "Register" : "Login"}</h2>

      {mode === "login" ? (
        <>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className="w-full mb-3 p-2 border"
          />

          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            className="w-full mb-3 p-2 border"
          />
        </>
      ) : (
        <>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            className="w-full mb-3 p-2 border"
          />

          <label className="block mb-2">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            className="w-full mb-3 p-2 border"
          />

          <label className="block mb-2">Name</label>
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
            className="w-full mb-3 p-2 border"
          />

          <label className="block mb-2">Username (optional)</label>
          <input
            value={form.username}
            onChange={(e) => update("username", e.target.value)}
            className="w-full mb-3 p-2 border"
          />

          <label className="block mb-2">Age</label>
          <input value={form.age} onChange={(e) => update("age", e.target.value)} className="w-full mb-3 p-2 border" />

          <label className="block mb-2">Gender</label>
          <input value={form.gender} onChange={(e) => update("gender", e.target.value)} className="w-full mb-3 p-2 border" />

          <label className="block mb-2">Health Conditions (comma separated)</label>
          <input
            value={form.healthConditions}
            onChange={(e) => update("healthConditions", e.target.value)}
            className="w-full mb-3 p-2 border"
          />

          <label className="block mb-2">Diet Preference</label>
          <input value={form.dietPreference} onChange={(e) => update("dietPreference", e.target.value)} className="w-full mb-3 p-2 border" />

          <label className="block mb-2">Height</label>
          <input value={form.height} onChange={(e) => update("height", e.target.value)} className="w-full mb-3 p-2 border" />

          <label className="block mb-2">Weight</label>
          <input value={form.weight} onChange={(e) => update("weight", e.target.value)} className="w-full mb-3 p-2 border" />

          <label className="block mb-2">Allergies</label>
          <input value={form.allergies} onChange={(e) => update("allergies", e.target.value)} className="w-full mb-3 p-2 border" />
        </>
      )}

      {error && <div className="text-red-600 mb-3">{error}</div>}

      <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? "Please wait..." : mode === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
}
