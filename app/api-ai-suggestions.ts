// Simulated AI Suggestions API route for dashboard
import { NextResponse } from 'next/server'

export async function GET() {
  // Simulate AI insights with mock data
  const suggestions = [
    {
      id: 1,
      title: "Best Send Time",
      message: "Your campaign 'Spring Promo' is likely to perform 18% better if scheduled at 10:00 AM tomorrow.",
      action: "Schedule now",
      tags: ["Best Time", "Predicted Engagement"],
      ai: true
    },
    {
      id: 2,
      title: "Inactive Audience",
      message: "You have 1,200 inactive contacts. AI recommends sending a re-engagement message this week.",
      action: "Send Re-engagement",
      tags: ["Audience", "AI Recommendation"],
      ai: true
    }
  ]
  return NextResponse.json({ suggestions })
}
