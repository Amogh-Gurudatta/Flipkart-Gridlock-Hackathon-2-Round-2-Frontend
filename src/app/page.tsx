import { redirect } from "next/navigation";

// Root "/" immediately lands on the Forecast Map — no login needed for demo
export default function RootPage() {
  redirect("/map");
}
