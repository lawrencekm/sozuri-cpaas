"use client";

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Use dynamic import with no SSR to avoid hydration issues
const Chart = dynamic(() => import('./chart-inner'), { ssr: false });

// Define props interface
export interface ChartComponentProps {
  width?: string | number;
  height?: string | number;
  data: Array<{ name: string; messages: number }>;
}

// Export a wrapper component
export default function ChartComponent(props: ChartComponentProps) {
  return <Chart {...props} />;
} 