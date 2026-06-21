"use client";

import { useEffect, useState } from "react";

export default function VerifyPage({ searchParams }) {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function run() {
      const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") : searchParams?.token;
      if (!token) {
        setStatus("error");
        setMessage("Missing token");
        return;
      }
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();
        if (data.success) {
          setStatus("success");
          setMessage("Email verified successfully. You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.message || String(err));
      }
    }
    run();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      {status === "checking" && <p>Checking token...</p>}
      {status === "success" && <p className="text-green-600">{message}</p>}
      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  );
}
