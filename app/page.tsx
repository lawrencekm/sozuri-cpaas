import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to overview page
  redirect("/overview")
}
