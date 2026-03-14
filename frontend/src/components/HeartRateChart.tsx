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
    <div className="flex h-[484px] flex-col rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-[18px] font-semibold text-[#FF0101]">
          {avgBPM} BPM
        </h3>
        <div className="flex items-center gap-2 text-[12px] text-[#20253A]">
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[10px] border border-[#20253A] font-normal">&lt;</button>
          <span>{dateRange}</span>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[10px] border border-[#20253A] font-normal">&gt;</button>
        </div>
      </div>
      <p className="mb-6 text-[12px] text-[#74798C]">
        Fréquence cardiaque moyenne
      </p>
      <div className="flex-1">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} barGap={4} barSize={20}>
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
            payload={[
              { value: "Min", type: "circle", color: "#FFCDD2" },
              { value: "Max BPM", type: "circle", color: "#FF0101" },
              { value: "Moy BPM", type: "circle", color: "#0B23F4" },
            ]}
          />
          <Bar dataKey="min" fill="#FFCDD2" radius={[30, 30, 30, 30]} />
          <Bar dataKey="max" fill="#FF0101" radius={[30, 30, 30, 30]} />
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
    </div>
  );
}
