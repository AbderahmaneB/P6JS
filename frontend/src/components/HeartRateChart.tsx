"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { RunningSession } from "@/data/mockData";

interface HeartRateChartProps {
  sessions: RunningSession[];
  dateRange: string;
}

interface DayData {
  name: string;
  min: number;
  max: number;
  avg: number;
}

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getLast7Days(sessions: RunningSession[]): DayData[] {
  const sorted = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const last7 = sorted.slice(0, 7).reverse();

  return last7.map((s, i) => ({
    name: DAYS[i % 7],
    min: s.heartRate.min,
    max: s.heartRate.max,
    avg: s.heartRate.average,
  }));
}

function computeAvgBPM(sessions: RunningSession[]): number {
  if (sessions.length === 0) return 0;
  const total = sessions.reduce((sum, s) => sum + s.heartRate.average, 0);
  return Math.round(total / sessions.length);
}

export default function HeartRateChart({
  sessions,
  dateRange,
}: HeartRateChartProps) {
  const data = getLast7Days(sessions);
  const avgBPM = computeAvgBPM(sessions);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-[#FF0101]">
          {avgBPM} BPM
        </h3>
        <div className="flex items-center gap-2 text-[12px] text-[#74798C]">
          <button className="cursor-pointer hover:text-[#FF0101]">&lt;</button>
          <span>{dateRange}</span>
          <button className="cursor-pointer hover:text-[#FF0101]">&gt;</button>
        </div>
      </div>
      <p className="mb-6 text-[12px] text-[#74798C]">
        Fréquence cardiaque moyenne
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} barGap={2} barSize={12}>
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
            domain={[120, "auto"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            formatter={(value, name) => {
              const label =
                name === "min"
                  ? "Min"
                  : name === "max"
                    ? "Max"
                    : "Moyenne";
              return [`${value} bpm`, label];
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "#74798C" }}
            formatter={(value: string) => {
              if (value === "min") return "Min";
              if (value === "max") return "Max BPM";
              return "Moy BPM";
            }}
          />
          <Bar dataKey="min" fill="#FFCDD2" radius={[3, 3, 0, 0]} />
          <Bar dataKey="max" fill="#FF0101" radius={[3, 3, 0, 0]} />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#D0D0D0"
            strokeWidth={2}
            dot={{ fill: "#0B23F4", r: 4, strokeWidth: 0 }}
            activeDot={{ fill: "#0B23F4", r: 5, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
