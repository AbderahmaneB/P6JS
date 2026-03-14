"use client";

import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInfo } from "@/services/api";
import { UserInfo } from "@/data/mockData";
import { useState, useEffect, useCallback } from "react";

function formatDateFR(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}min`;
}

function formatGender(gender: string): string {
  return gender === "female" ? "Femme" : "Homme";
}

function formatHeight(cm: number): string {
  const meters = Math.floor(cm / 100);
  const rest = cm % 100;
  return `${meters}m${rest < 10 ? "0" : ""}${rest}`;
}

function calculateRestDays(createdAt: string, totalSessions: number): number {
  const start = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return totalDays - totalSessions;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    setIsLoading(true);
    setError(null);
    try {
      const info = await getUserInfo(user.token);
      setUserInfo(info);
    } catch {
      setError("Impossible de charger les données.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  const restDays = calculateRestDays(profile.createdAt, statistics.totalSessions);

  const statCards = [
    { label: "Temps total couru", value: formatDuration(statistics.totalDuration), unit: "" },
    { label: "Calories br\u00fbl\u00e9es", value: statistics.totalCalories.toLocaleString("fr-FR"), unit: "cal" },
    { label: "Distance totale parcourue", value: statistics.totalDistance, unit: "km" },
    { label: "Nombre de jours de repos", value: restDays.toString(), unit: "jours" },
    { label: "Nombre de sessions", value: statistics.totalSessions.toString(), unit: "sessions" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F2F3FF]">
      <Header />

      <main className="flex-1 px-[10%] py-8">
        <div className="flex gap-10">
          {/* Left column - Profile */}
          <div className="w-[420px] shrink-0">
            {/* Profile card */}
            <div className="mb-6 rounded-2xl border border-[#E0E0E0] bg-white px-10 py-10">
              <div className="flex items-center gap-5">
                <div className="h-[90px] w-[90px] overflow-hidden rounded-xl bg-gray-200">
                  {profile.profilePicture && (
                    <img
                      src={profile.profilePicture}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-[22px] font-semibold text-[#20253A]">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-[13px] text-[#74798C]">
                    Membre depuis le {formatDateFR(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile details */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white px-10 py-8">
              <h2 className="mb-5 text-[20px] font-semibold text-[#20253A]">
                Votre profil
              </h2>
              <hr className="mb-6 border-[#E0E0E0]" />
              <div className="space-y-5">
                <p className="text-[14px] text-[#20253A]">
                  <span className="text-[#74798C]">{"\u00C2"}ge : </span>
                  {profile.age}
                </p>
                <p className="text-[14px] text-[#20253A]">
                  <span className="text-[#74798C]">Genre : </span>
                  {formatGender(profile.gender)}
                </p>
                <p className="text-[14px] text-[#20253A]">
                  <span className="text-[#74798C]">Taille : </span>
                  {formatHeight(profile.height)}
                </p>
                <p className="text-[14px] text-[#20253A]">
                  <span className="text-[#74798C]">Poids : </span>
                  {profile.weight}kg
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Statistics */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-[22px] font-semibold text-[#20253A]">
                Vos statistiques
              </h2>
              <p className="text-[13px] text-[#74798C]">
                depuis le {formatDateFR(profile.createdAt)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl bg-[#0B23F4] px-6 py-6"
                >
                  <p className="text-[13px] font-medium text-white/80">
                    {card.label}
                  </p>
                  <p className="mt-3">
                    <span className="text-[32px] font-bold text-white">
                      {card.value}
                    </span>
                    {card.unit && (
                      <span className="ml-2 text-[16px] font-medium text-white/80">
                        {card.unit}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E0E0E0] bg-white px-[10%] py-5">
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-[#74798C]">
            &copy;Sportsee Tous droits r&eacute;serv&eacute;s
          </p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer text-[12px] text-[#74798C] transition-colors hover:text-[#0B23F4]">
              Conditions g&eacute;n&eacute;rales
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
