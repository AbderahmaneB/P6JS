"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface TrainingSession {
  day: string;
  name: string;
  description: string;
  duration: number;
}

interface TrainingWeek {
  week: number;
  sessions: TrainingSession[];
}

interface TrainingPlan {
  weeks: TrainingWeek[];
}

type Step = "intro" | "objective" | "date" | "result";

function generateICS(plan: TrainingPlan, startDate: string): string {
  const DAY_OFFSETS: Record<string, number> = {
    Lundi: 0, Mardi: 1, Mercredi: 2, Jeudi: 3,
    Vendredi: 4, Samedi: 5, Dimanche: 6,
  };

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SportSee//Training Plan//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  const base = new Date(startDate);
  const dayOfWeek = base.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  base.setDate(base.getDate() + diffToMonday);

  plan.weeks.forEach((week) => {
    week.sessions.forEach((session) => {
      const offset = (week.week - 1) * 7 + (DAY_OFFSETS[session.day] ?? 0);
      const sessionDate = new Date(base);
      sessionDate.setDate(base.getDate() + offset);

      const dateStr = sessionDate.toISOString().replace(/[-:]/g, "").slice(0, 8);
      const uid = `${dateStr}-${session.name.replace(/\s/g, "")}-${Math.random().toString(36).slice(2)}@sportsee`;

      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTART;VALUE=DATE:${dateStr}`,
        `DTEND;VALUE=DATE:${dateStr}`,
        `SUMMARY:${session.name} (${session.duration}min)`,
        `DESCRIPTION:${session.description}`,
        `CATEGORIES:Sport,Course`,
        "BEGIN:VALARM",
        "TRIGGER:-PT30M",
        "ACTION:DISPLAY",
        `DESCRIPTION:Rappel : ${session.name}`,
        "END:VALARM",
        "END:VEVENT"
      );
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function downloadICS(plan: TrainingPlan, startDate: string) {
  const content = generateICS(plan, startDate);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.href = url;
  a.download = `sportsee-plan-${dateTag}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function CalendarIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="12" width="44" height="36" rx="4" stroke="#0B23F4" strokeWidth="2" fill="none"/>
      <line x1="6" y1="22" x2="50" y2="22" stroke="#0B23F4" strokeWidth="2"/>
      <line x1="18" y1="6" x2="18" y2="16" stroke="#0B23F4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="38" y1="6" x2="38" y2="16" stroke="#0B23F4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 29l2.5 2.5 5-5" stroke="#0B23F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 38l2.5 2.5 5-5" stroke="#0B23F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M29 29l2.5 2.5 5-5" stroke="#0B23F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M29 38l2.5 2.5 5-5" stroke="#0B23F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="20" stroke="#0B23F4" strokeWidth="2" fill="none"/>
      <circle cx="28" cy="28" r="12" stroke="#0B23F4" strokeWidth="2" fill="none"/>
      <circle cx="28" cy="28" r="4" fill="#0B23F4"/>
      <line x1="28" y1="8" x2="28" y2="14" stroke="#0B23F4" strokeWidth="2" strokeLinecap="round"/>
      <path d="M36 20l4-4m0 0h-4m4 0v4" stroke="#0B23F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WeekAccordion({ week }: { week: TrainingWeek }) {
  const [open, setOpen] = useState(week.week === 1);

  return (
    <div className="rounded-2xl border border-[#E8E8F0] bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-[18px] font-bold text-[#20253A]">
          Semaine {week.week}
        </span>
        <span className="text-[20px] text-[#0B23F4]">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 flex flex-col gap-3">
          {week.sessions.map((session, i) => (
            <div key={i} className="rounded-xl border border-[#E8E8F0] bg-[#FAFAFA] p-4">
              <p className="mb-1 text-[12px] text-[#74798C]">{session.day}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[16px] font-semibold text-[#20253A]">{session.name}</p>
                  <p className="text-[12px] text-[#74798C]">{session.description}</p>
                </div>
                <span className="ml-4 rounded-full bg-[#F2F3FF] px-3 py-1 text-[12px] font-medium text-[#0B23F4] whitespace-nowrap">
                  {session.duration}min
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrainingPlanPage() {
  const [step, setStep] = useState<Step>("intro");
  const [objective, setObjective] = useState("");
  const [startDate, setStartDate] = useState("");
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generatePlan() {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/training-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, startDate }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Erreur lors de la génération.");
        setIsLoading(false);
        return;
      }

      setPlan(data.plan);
      setStep("result");
    } catch {
      setError("Erreur réseau, veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F2F3FF]">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12 w-full">

        {step === "intro" && (
          <div className="w-full max-w-4xl rounded-2xl bg-white px-16 py-14 text-center shadow-sm">
            <div className="flex justify-center"><CalendarIcon /></div>
            <h1 className="mt-6 text-[24px] font-bold text-[#20253A]">
              Créez votre planning d&apos;entraînement intelligent
            </h1>
            <p className="mt-3 text-[14px] leading-relaxed text-[#74798C]">
              Notre IA vous aide à bâtir un planning 100&nbsp;% personnalisé selon vos objectifs,
              votre niveau et votre emploi du temps.
            </p>
            <button
              onClick={() => setStep("objective")}
              className="mt-8 rounded-full bg-[#0B23F4] px-10 py-3.5 text-[14px] font-medium text-white hover:bg-[#0919C5]"
            >
              Commencer
            </button>
          </div>
        )}

        {step === "objective" && (
          <div className="w-full max-w-4xl rounded-2xl bg-white px-16 py-14 text-center shadow-sm">
            <div className="flex justify-center"><TargetIcon /></div>
            <h2 className="mt-6 text-[22px] font-bold text-[#20253A]">
              Quel est votre objectif principal&nbsp;?
            </h2>
            <p className="mt-2 text-[13px] text-[#74798C]">
              Choisissez l&apos;objectif qui vous motive le plus
            </p>
            <div className="mt-6 text-left">
              <label className="mb-1 block text-[12px] text-[#74798C]">Objectif</label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                maxLength={200}
                placeholder="Ex : Courir un 10km, perdre du poids, améliorer mon endurance…"
                className="w-full rounded-xl border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#20253A] outline-none focus:border-[#0B23F4]"
              />
            </div>
            <button
              onClick={() => setStep("date")}
              disabled={objective.trim().length === 0}
              className="mt-6 w-full rounded-full bg-[#0B23F4] py-3.5 text-[14px] font-medium text-white hover:bg-[#0919C5] disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}

        {step === "date" && (
          <div className="w-full max-w-4xl rounded-2xl bg-white px-16 py-14 text-center shadow-sm">
            <div className="flex justify-center"><CalendarIcon /></div>
            <h2 className="mt-6 text-[22px] font-bold text-[#20253A]">
              Quand souhaitez vous commencer votre programme&nbsp;?
            </h2>
            <p className="mt-2 text-[13px] text-[#74798C]">
              Générer un programme d&apos;une semaine à partir de la date de votre choix
            </p>
            <div className="mt-6 text-left">
              <label className="mb-1 block text-[12px] text-[#74798C]">Date de début</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-[#E0E0E0] px-4 py-3 text-[14px] text-[#20253A] outline-none focus:border-[#0B23F4]"
              />
            </div>
            {error && (
              <p className="mt-3 text-[13px] text-red-500">{error}</p>
            )}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setStep("objective")}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E0E0E0] text-[#20253A] hover:border-[#0B23F4] hover:text-[#0B23F4]"
              >
                ←
              </button>
              <button
                onClick={generatePlan}
                disabled={!startDate || isLoading}
                className="flex-1 rounded-full bg-[#0B23F4] py-3.5 text-[14px] font-medium text-white hover:bg-[#0919C5] disabled:opacity-50"
              >
                {isLoading ? "Génération en cours…" : "Générer mon planning"}
              </button>
            </div>
          </div>
        )}

        {step === "result" && plan && (
          <div className="w-full max-w-xl">
            <div className="mb-6 text-center">
              <h2 className="text-[24px] font-bold text-[#20253A]">
                Votre planning de la semaine
              </h2>
              <p className="mt-1 text-[13px] text-[#74798C]">
                Important pour définir un programme adapté
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {plan.weeks.map((week) => (
                <WeekAccordion key={week.week} week={week} />
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => downloadICS(plan, startDate)}
                className="flex-1 rounded-full border-2 border-[#0B23F4] py-3.5 text-[14px] font-medium text-[#0B23F4] hover:bg-[#F2F3FF]"
              >
                Télécharger
              </button>
              <button
                onClick={() => {
                  setPlan(null);
                  setStep("objective");
                  setObjective("");
                  setStartDate("");
                }}
                className="flex-1 rounded-full bg-[#0B23F4] py-3.5 text-[14px] font-medium text-white hover:bg-[#0919C5]"
              >
                Régénérer un programme
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
