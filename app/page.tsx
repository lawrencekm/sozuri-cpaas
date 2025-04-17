import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to onboarding page
  redirect("/onboarding")
}
