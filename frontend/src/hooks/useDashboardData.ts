"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInfo, getUserActivity } from "@/services/api";
import { UserInfo, RunningSession } from "@/data/mockData";

interface DashboardData {
  userInfo: UserInfo | null;
  recentSessions: RunningSession[];
  thisWeekSessions: RunningSession[];
  isLoading: boolean;
  error: string | null;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [recentSessions, setRecentSessions] = useState<RunningSession[]>([]);
  const [thisWeekSessions, setThisWeekSessions] = useState<RunningSession[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.token) return;

    setIsLoading(true);
    setError(null);

    try {
      const info = await getUserInfo(user.token);
      setUserInfo(info);

      const now = new Date();
      const thisMonday = getMonday(now);
      const thisSunday = new Date(thisMonday);
      thisSunday.setDate(thisMonday.getDate() + 6);

      // Last 4 weeks for charts
      const fourWeeksAgo = new Date(thisMonday);
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const recent = await getUserActivity(
        user.token,
        formatDate(fourWeeksAgo),
        formatDate(thisSunday)
      );
      setRecentSessions(recent);

      // This week only
      const thisWeek = recent.filter((s) => {
        const d = new Date(s.date);
        return d >= thisMonday && d <= thisSunday;
      });
      setThisWeekSessions(thisWeek);
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { userInfo, recentSessions, thisWeekSessions, isLoading, error };
}
