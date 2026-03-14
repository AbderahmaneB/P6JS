"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RunningSession } from "@/data/mockData";

interface WeeklyDistanceChartProps {
  sessions: RunningSession[];
  dateRange: string;
}

interface WeekData {
  name: string;
  km: number;
  label: string;
}

function fmt(d: Date) {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }).replace("/", ".");
}

function groupByWeek(sessions: RunningSession[]): WeekData[] {
  const weeks: { [key: string]: { total: number; start: Date } } = {};
  sessions.forEach((s) => {
    const date = new Date(s.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const key = weekStart.toISOString().split("T")[0];
    if (!weeks[key]) weeks[key] = { total: 0, start: weekStart };
    weeks[key].total += s.distance;
  });

  const sorted = Object.entries(weeks).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  const last4 = sorted.slice(-4);
  return last4.map((w, i) => {
    const start = w[1].start;
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      name: `S${i + 1}`,
      km: Math.round(w[1].total * 10) / 10,
      label: `${fmt(start)} au ${fmt(end)}`,
    };
  });
}

function computeAverage(data: WeekData[]): number {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, d) => sum + d.km, 0);
  return Math.round(total / data.length);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const { km, label } = payload[0].payload as WeekData;
  return (
    <div style={{
      background: "#1A1A2E",
      borderRadius: 12,
      padding: "12px 16px",
      color: "white",
      minWidth: 140,
    }}>
      <p style={{ fontSize: 12, color: "#A0A0B0", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700 }}>{String(km).replace(".", ",")} km</p>
    </div>
  );
}

export default function WeeklyDistanceChart({
  sessions,
  dateRange,
}: WeeklyDistanceChartProps) {
  const data = groupByWeek(sessions);
  const avg = computeAverage(data);

  return (
    <div className="flex h-[484px] flex-col rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-[#0B23F4]">
          {avg}km en moyenne
        </h3>
        <div className="flex items-center gap-2 text-[12px] text-[#20253A]">
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[10px] border border-[#20253A] font-normal">&lt;</button>
          <span>{dateRange}</span>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[10px] border border-[#20253A] font-normal">&gt;</button>
        </div>
      </div>
      <p className="mb-6 text-[12px] text-[#74798C]">
        Total des kilomètres 4 dernières semaines
      </p>
      <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#74798C" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#74798C" }}
            domain={[0, (dataMax: number) => Math.ceil((dataMax * 1.15) / 10) * 10]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "#74798C" }}
            payload={[{ value: "Km", type: "circle", color: "#C9CBFF" }]}
          />
          <Bar dataKey="km" fill="#C9CBFF" radius={[30, 30, 30, 30]} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
