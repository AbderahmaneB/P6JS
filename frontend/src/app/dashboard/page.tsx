"use client";

import Header from "@/components/Header";
import WeeklyDistanceChart from "@/components/WeeklyDistanceChart";
import HeartRateChart from "@/components/HeartRateChart";
import WeeklyGoalChart from "@/components/WeeklyGoalChart";
import { useDashboardData } from "@/hooks/useDashboardData";

function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCurrentWeekRange(): { start: string; end: string; label: string } {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + (day === 0 ? -6 : 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return {
    start: monday.toISOString().split("T")[0],
    end: sunday.toISOString().split("T")[0],
    label: `Du ${fmt(monday)} au ${fmt(sunday)}`,
  };
}

function getLast4WeeksRange(): string {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);
  start.setDate(start.getDate() - 28);

  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${fmt(start)} - ${fmt(end)}`;
}

export default function DashboardPage() {
  const { userInfo, recentSessions, thisWeekSessions, isLoading, error } =
    useDashboardData();

  const weekRange = getCurrentWeekRange();
  const last4Range = getLast4WeeksRange();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F3FF]">
        <div className="text-[16px] text-[#74798C]">Chargement...</div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F3FF]">
        <div className="text-[16px] text-red-500">
          {error || "Erreur de chargement"}
        </div>
      </div>
    );
  }

  const { profile, statistics } = userInfo;

  const thisWeekDistance = thisWeekSessions
    .reduce((sum, s) => sum + s.distance, 0)
    .toFixed(1);
  const thisWeekDuration = thisWeekSessions.reduce(
    (sum, s) => sum + s.duration,
    0
  );
  const weeklyGoal = 6;

  return (
    <div className="min-h-screen bg-[#F2F3FF]">
      <Header />

      <main className="px-[10%] py-8">
        {/* AI Coach banner */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white px-8 py-5">
          <div className="flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L20.25 6.25L23 5L20.25 3.75L19 1L17.75 3.75L15 5L17.75 6.25L19 9Z" fill="#0B23F4"/>
              <path d="M19 15L17.75 17.75L15 19L17.75 20.25L19 23L20.25 20.25L23 19L20.25 17.75L19 15Z" fill="#0B23F4"/>
              <path d="M11.5 9.5L9 4L6.5 9.5L1 12L6.5 14.5L9 20L11.5 14.5L17 12L11.5 9.5Z" fill="#0B23F4"/>
            </svg>
            <p className="text-[14px] font-medium text-[#0B23F4]">
              Posez vos questions sur votre programme, vos performances ou vos
              objectifs.
            </p>
          </div>
          <button className="cursor-pointer whitespace-nowrap rounded-[10px] bg-[#0B23F4] px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#0919C5]">
            Lancer une conversation
          </button>
        </div>

        {/* User profile section */}
        <div className="mb-10 flex items-center gap-6 rounded-2xl bg-white px-8 py-6 shadow-sm">
          <div className="h-[80px] w-[80px] overflow-hidden rounded-xl bg-gray-200">
            {profile.profilePicture && (
              <img
                src={profile.profilePicture}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-semibold text-[#20253A]">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-[13px] text-[#74798C]">
              Membre depuis le {formatDateFR(profile.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[13px] text-[#74798C]">
              Distance totale parcourue
            </p>
            <div className="flex items-center gap-3 rounded-[10px] bg-[#0B23F4] px-5 py-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5C15.5 2.4 14.6 1.5 13.5 1.5C12.4 1.5 11.5 2.4 11.5 3.5C11.5 4.6 12.4 5.5 13.5 5.5ZM9.8 8.9L7 23H9.1L10.9 15L13 17V23H15V15.5L12.9 13.5L13.5 10.5C14.8 12 16.8 13 19 13V11C17.1 11 15.5 10 14.7 8.6L13.7 7C13.3 6.4 12.7 6 12 6C11.7 6 11.5 6.1 11.2 6.1L6 8.3V13H8V9.6L9.8 8.9Z"
                  fill="white"
                />
              </svg>
              <span className="text-[18px] font-bold text-white">
                {statistics.totalDistance} km
              </span>
            </div>
          </div>
        </div>

        {/* Performance charts */}
        <h2 className="mb-6 text-[22px] font-semibold text-[#20253A]">
          Vos dernières performances
        </h2>
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WeeklyDistanceChart
            sessions={recentSessions}
            dateRange={last4Range}
          />
          <HeartRateChart sessions={recentSessions} dateRange={last4Range} />
        </div>

        {/* This week section */}
        <h2 className="mb-1 text-[22px] font-semibold text-[#20253A]">
          Cette semaine
        </h2>
        <p className="mb-6 text-[13px] text-[#74798C]">{weekRange.label}</p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Donut chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <WeeklyGoalChart
              sessionsCount={thisWeekSessions.length}
              goal={weeklyGoal}
            />
          </div>

          {/* Stats cards */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="flex-1 rounded-xl bg-white p-6 shadow-sm">
              <p className="text-[13px] text-[#74798C]">
                Durée d&apos;activité
              </p>
              <p className="mt-2">
                <span className="text-[28px] font-bold text-[#0B23F4]">
                  {thisWeekDuration}
                </span>
                <span className="ml-2 text-[14px] text-[#74798C]">
                  minutes
                </span>
              </p>
            </div>
            <div className="flex-1 rounded-xl bg-white p-6 shadow-sm">
              <p className="text-[13px] text-[#74798C]">Distance</p>
              <p className="mt-2">
                <span className="text-[28px] font-bold text-[#FF0101]">
                  {thisWeekDistance}
                </span>
                <span className="ml-2 text-[14px] text-[#74798C]">
                  kilomètres
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-[#E0E0E0] px-[10%] py-5">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#74798C]">
            &copy;Sportsee Tous droits réservés
          </p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer text-[12px] text-[#74798C] transition-colors hover:text-[#0B23F4]">
              Conditions générales
            </span>
            <span className="cursor-pointer text-[12px] text-[#74798C] transition-colors hover:text-[#0B23F4]">
              Contact
            </span>
            <svg
              width="16"
              height="14"
              viewBox="0 0 32 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0" y="12" width="5" height="14" rx="2" fill="#FF0101" />
              <rect x="9" y="6" width="5" height="20" rx="2" fill="#FF0101" />
              <rect x="18" y="0" width="5" height="26" rx="2" fill="#FF0101" />
              <rect x="27" y="8" width="5" height="18" rx="2" fill="#FF0101" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}
