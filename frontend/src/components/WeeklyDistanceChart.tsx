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
  bg: number;
}

function groupByWeek(sessions: RunningSession[]): WeekData[] {
  const weeks: { [key: string]: number } = {};
  sessions.forEach((s) => {
    const date = new Date(s.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const key = weekStart.toISOString().split("T")[0];
    weeks[key] = (weeks[key] || 0) + s.distance;
  });

  const sorted = Object.entries(weeks).sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  const last4 = sorted.slice(-4);
  return last4.map((w, i) => ({
    name: `S${i + 1}`,
    km: Math.round(w[1] * 10) / 10,
    bg: Math.round(w[1] * 10) / 10 + 3,
  }));
}

function computeAverage(data: WeekData[]): number {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, d) => sum + d.km, 0);
  return Math.round(total / data.length);
}

export default function WeeklyDistanceChart({
  sessions,
  dateRange,
}: WeeklyDistanceChartProps) {
  const data = groupByWeek(sessions);
  const avg = computeAverage(data);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-[#20253A]">
          {avg}km en moyenne
        </h3>
        <div className="flex items-center gap-2 text-[12px] text-[#74798C]">
          <button className="cursor-pointer hover:text-[#0B23F4]">&lt;</button>
          <span>{dateRange}</span>
          <button className="cursor-pointer hover:text-[#0B23F4]">&gt;</button>
        </div>
      </div>
      <p className="mb-6 text-[12px] text-[#74798C]">
        Total des kilomètres 4 dernières semaines
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barGap={-1} barSize={20}>
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
            unit=""
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value, name) => {
              if (name === "bg") return [null, null];
              return [`${value} km`, "Distance"];
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "#74798C" }}
            payload={[{ value: "Km", type: "circle", color: "#0B23F4" }]}
          />
          <Bar dataKey="bg" fill="#C9CBFF" radius={[4, 4, 0, 0]} />
          <Bar dataKey="km" fill="#0B23F4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
