"use client";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts';

interface ChartData {
  name: string;
  messages: number;
}

interface ChartWrapperProps {
  data: ChartData[];
  width?: string | number;
  height?: string | number;
}

// Custom tooltip component with enhanced styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[120px]">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Messages:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {payload[0].value.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartWrapper({
  data,
  width = "100%",
  height = "100%"
}: ChartWrapperProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--gray-200))"
          strokeOpacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 12,
            fill: 'hsl(var(--gray-600))',
            fontWeight: 500
          }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fontSize: 12,
            fill: 'hsl(var(--gray-600))',
            fontWeight: 500
          }}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            fill: 'hsl(var(--primary))',
            fillOpacity: 0.1,
            radius: 4
          }}
        />
        <Bar
          dataKey="messages"
          fill="hsl(var(--primary))"
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}