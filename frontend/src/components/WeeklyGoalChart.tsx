"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface WeeklyGoalChartProps {
  sessionsCount: number;
  goal: number;
}

export default function WeeklyGoalChart({
  sessionsCount,
  goal,
}: WeeklyGoalChartProps) {
  const remaining = Math.max(goal - sessionsCount, 0);
  const data = [
    { name: "Réalisées", value: sessionsCount },
    { name: "Restantes", value: remaining },
  ];
  const COLORS = ["#0B23F4", "#C9CBFF"];

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-left w-full">
        <span className="text-[32px] font-bold text-[#0B23F4]">
          x{sessionsCount}
        </span>
        <span className="ml-2 text-[16px] text-[#8B8FF5]">
          sur objectif de {goal}
        </span>
      </div>
      <p className="mb-4 w-full text-left text-[13px] text-[#74798C]">
        Courses hebdomadaire réalisées
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "#74798C" }}
            formatter={(value: string, entry) => {
              const count =
                entry.payload && "value" in entry.payload
                  ? (entry.payload as { value: number }).value
                  : 0;
              return `${count} ${value.toLowerCase()}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
