"use client";

import { useEffect, useState } from "react";
import { getActiveUserId } from "@/lib/userClient";

export default function useActiveUserId() {
  const [userId, setUserId] = useState(getActiveUserId());

  useEffect(() => {
    const handleUserIdChange = () => {
      setUserId(getActiveUserId());
    };

    window.addEventListener("nutriActiveUserIdChanged", handleUserIdChange);
    return () => {
      window.removeEventListener("nutriActiveUserIdChanged", handleUserIdChange);
    };
  }, []);

  return userId;
}
