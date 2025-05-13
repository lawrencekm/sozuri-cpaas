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

export default function ChartWrapper({ 
  data, 
  width = "100%", 
  height = "100%" 
}: ChartWrapperProps) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="messages" fill="#2563eb" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
} 