import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { TradingTerminal } from "@/components/trading/terminal";

export const metadata: Metadata = {
  title: "Trading Terminal",
  description: "Paper trading dengan data pasar realtime (Binance · gold-api · Yahoo Finance)",
};

export default async function TradingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/trading");
  }
  return <TradingTerminal />;
}
