"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Helper to check device type from user agent
function getDeviceType(): string {
  if (typeof window === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// Helper to fetch user's country using free geo IP APIs with timeout
async function fetchCountry(): Promise<string> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2500); // 2.5s timeout
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.country_name || "Unknown";
  } catch {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 2500);
      const res2 = await fetch("https://ip-api.com/json/", { signal: controller.signal });
      clearTimeout(id);
      if (!res2.ok) throw new Error();
      const data2 = await res2.json();
      return data2.country || "Unknown";
    } catch {
      return "Unknown";
    }
  }
}

export default function AnalyticsTracker() {
  const trackerRan = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || trackerRan.current) return;
    trackerRan.current = true;

    // Check if Supabase is properly configured
    const isSupabaseConfigured = 
      !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-url.supabase.co";

    if (!isSupabaseConfigured) {
      console.warn("Supabase Analytics Tracker: Environment variables are not configured. Tracking is disabled (Demo Mode).");
      return;
    }

    const trackVisit = async () => {
      try {
        // 1. Get or create a unique Visitor ID
        let visitorId = localStorage.getItem("portfolio_visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
          localStorage.setItem("portfolio_visitor_id", visitorId);
        }

        // 2. Determine client information
        const device = getDeviceType();
        const country = await fetchCountry();

        // 3. Check session state (sessionStorage lasts for the browser tab session)
        const sessionActive = sessionStorage.getItem("portfolio_session_active") === "true";

        // 4. Call track_visit RPC function on Supabase
        const { data, error } = await supabase.rpc("track_visit", {
          p_visitor_id: visitorId,
          p_country: country,
          p_device: device,
          p_is_new_session: !sessionActive,
        });

        console.log("TRACK VISIT DATA:", data, "ERROR:", error);

        if (error) {
          console.error("Analytics Tracker - Failed to register visit:", error.message);
          return;
        }

        // Mark session active if it was successfully tracked
        if (!sessionActive) {
          sessionStorage.setItem("portfolio_session_active", "true");
        }

        // 5. Heartbeat logic
        let lastHeartbeatTime = Date.now();
        const HEARTBEAT_INTERVAL = 30000; // 30 seconds

        const sendHeartbeat = async () => {
          if (document.visibilityState === "hidden") return;
          try {
            await supabase.rpc("track_visit", {
              p_visitor_id: visitorId,
              p_country: country,
              p_device: device,
              p_is_new_session: false,
            });
            lastHeartbeatTime = Date.now();
          } catch (e) {
            console.error("Analytics Tracker - Error sending heartbeat:", e);
          }
        };

        const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        // Instantly trigger heartbeat if user returns from inactiveness
        const handleVisibilityChange = () => {
          if (document.visibilityState === "visible" && Date.now() - lastHeartbeatTime > HEARTBEAT_INTERVAL) {
            sendHeartbeat();
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
          clearInterval(intervalId);
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
      } catch (err) {
        console.error("Analytics Tracker - Initialization error:", err);
      }
    };

    trackVisit();
  }, []);

  return null;
}
