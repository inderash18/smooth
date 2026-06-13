"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { animate } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
}

function AnimatedCounter({ value }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => setCount(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function PortfolioStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const isSupabaseConfigured = typeof window !== "undefined" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-url.supabase.co";

  const [stats, setStats] = useState(() => {
    return isSupabaseConfigured
      ? { totalVisitors: 0, totalPageViews: 0 }
      : { totalVisitors: 12547, totalPageViews: 24122 };
  });
  const [onlineCount, setOnlineCount] = useState(() => {
    return isSupabaseConfigured ? 0 : 7;
  });
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);
  const [hasError, setHasError] = useState(false);

  // Real-time Supabase Listeners
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    let analyticsChannel: RealtimeChannel | undefined;
    let visitorsChannel: RealtimeChannel | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const recountOnlineUsers = async () => {
      try {
        const inactivityWindow = new Date(Date.now() - 60000).toISOString();
        const { count, error } = await supabase
          .from("visitors")
          .select("*", { count: "exact", head: true })
          .gte("last_seen", inactivityWindow);

        console.log("ONLINE COUNT DATA:", count, "ERROR:", error);

        if (error) throw error;

        if (isMounted && count !== null) {
          setOnlineCount(count);
        }
      } catch (err) {
        console.error("Supabase Analytics - Error counting online users:", err);
      }
    };

    const fetchInitialStats = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // 1. Fetch total visitors & total page views
        const { data: statsData, error: statsError } = await supabase
          .from("analytics")
          .select("total_visitors, total_page_views")
          .eq("id", "stats")
          .single();

        console.log("DATA:", statsData, "ERROR:", statsError);

        if (statsError) throw statsError;

        if (isMounted && statsData) {
          setStats({
            totalVisitors: statsData.total_visitors || 0,
            totalPageViews: statsData.total_page_views || 0,
          });
        }

        // 2. Count current online users
        await recountOnlineUsers();

      } catch (err) {
        console.error("Supabase Analytics - Error fetching stats:", err);
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialStats();

    // 3. Set up Realtime subscriptions
    try {
      // Listen to total statistics changes (inserts/updates)
      analyticsChannel = supabase
        .channel("realtime-analytics-stats")
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "analytics", filter: "id=eq.stats" },
          (payload: { new: { total_visitors?: number; total_page_views?: number } }) => {
            if (isMounted && payload.new) {
              setStats({
                totalVisitors: payload.new.total_visitors || 0,
                totalPageViews: payload.new.total_page_views || 0,
              });
            }
          }
        )
        .subscribe();

      // Listen to any changes in the visitors table to recount online users
      visitorsChannel = supabase
        .channel("realtime-visitors-list")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "visitors" },
          () => {
            recountOnlineUsers();
          }
        )
        .subscribe();

      // Recount online users every 30 seconds to clean up inactive heartbeats
      intervalId = setInterval(recountOnlineUsers, 30000);

    } catch (realtimeErr) {
      console.error("Supabase Analytics - Realtime subscription setup failed:", realtimeErr);
    }

    return () => {
      isMounted = false;
      if (analyticsChannel) supabase.removeChannel(analyticsChannel);
      if (visitorsChannel) supabase.removeChannel(visitorsChannel);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSupabaseConfigured]);

  return (
    <section 
      ref={sectionRef} 
      id="stats" 
      className="py-24 relative overflow-hidden bg-bg"
    >
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 text-center"
        >
          <span className="label-mono text-accent mb-3 block">Live Metrics</span>
          <h2 className="text-4xl md:text-5xl font-black text-text uppercase tracking-tight">
            Portfolio Stats
          </h2>
        </motion.div>

        {/* Premium Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="w-full max-w-[800px] glass-card p-10 md:p-12 relative overflow-hidden border border-border group"
        >
          {/* Subtle Accent Glow Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-secondary text-xs uppercase tracking-widest font-extrabold animate-pulse">
                Syncing live database...
              </p>
            </div>
          ) : hasError ? (
            <div className="text-center py-8">
              <p className="text-red-500 font-bold mb-2">Failed to load statistics.</p>
              <button 
                onClick={() => {
                  // Re-trigger the listener by resetting configuration flag
                  window.location.reload();
                }}
                className="px-5 py-2 rounded-full border border-border text-xs font-bold hover:bg-border/25 transition-colors cursor-pointer text-text"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative z-10">
              
              {/* Stat 1: Total Visitors */}
              <div className="flex flex-col items-center text-center md:border-r border-border/40 md:pr-4">
                <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-4">
                  Total Visitors
                </span>
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-text mb-2">
                  <AnimatedCounter value={stats.totalVisitors} />
                </span>
                <span className="text-xs text-secondary/80 font-medium">
                  Unique instances
                </span>
              </div>

              {/* Stat 2: Online Now */}
              <div className="flex flex-col items-center text-center md:border-r border-border/40 md:px-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                  </span>
                  <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest">
                    Online Now
                  </span>
                </div>
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-accent mb-2">
                  <AnimatedCounter value={onlineCount} />
                </span>
                <span className="text-xs text-secondary/80 font-medium">
                  Active in last minute
                </span>
              </div>

              {/* Stat 3: Total Page Views */}
              <div className="flex flex-col items-center text-center md:pl-4">
                <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-4">
                  Page Views
                </span>
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-text mb-2">
                  <AnimatedCounter value={stats.totalPageViews} />
                </span>
                <span className="text-xs text-secondary/80 font-medium">
                  Total browser visits
                </span>
              </div>

            </div>
          )}

          {!isSupabaseConfigured && !isLoading && !hasError && (
            <div className="mt-8 text-center relative z-10 border-t border-border/30 pt-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent/10 text-accent">
                Demo Mode (Supabase Unconfigured)
              </span>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
