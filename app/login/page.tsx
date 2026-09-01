"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassCardFooter,
} from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl");

  function redirectAfterLogin(userEmail?: string | null, role?: string) {
    if (
      callbackUrl &&
      callbackUrl.startsWith("/") &&
      !callbackUrl.startsWith("/login") &&
      !callbackUrl.startsWith("/register")
    ) {
      router.push(callbackUrl);
      return;
    }

    if (userEmail === "engineering@company.com") {
      router.push("/dashboard/engineering");
      return;
    }

    if (userEmail === "trading@mygajah.com") {
      router.push("/trading");
      return;
    }

    switch (role) {
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "HR":
        router.push("/dashboard/hr");
        break;
      case "MANAGER":
        router.push("/dashboard/manager");
        break;
      default:
        router.push("/dashboard/employee");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        alert("Invalid credentials");
        return;
      }

      const { getSession } = await import("next-auth/react");
      const session = await getSession();

      redirectAfterLogin(session?.user?.email, session?.user?.role as string);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1a1a2e_0%,_#09090b_70%)]">
      <div className="flex min-h-screen items-center justify-center p-6">
        <GlassCard className="w-full max-w-md border-white/10 bg-white/[0.07] shadow-2xl shadow-black/40">
          <GlassCardHeader>
            <GlassCardTitle className="text-3xl font-bold tracking-tight text-white">
              Welcome Back
            </GlassCardTitle>
            <GlassCardDescription className="text-zinc-500">
              Sign in to continue
            </GlassCardDescription>
          </GlassCardHeader>

          <GlassCardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-white/20"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-zinc-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-zinc-600 focus:border-white/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white font-semibold text-black hover:bg-white/90"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </GlassCardContent>

          <GlassCardFooter>
            <p className="text-center text-sm text-zinc-500">
              Belum punya akun?{" "}
              <Link href="/register" className="text-zinc-300 hover:text-white">
                Daftar di sini
              </Link>
            </p>
          </GlassCardFooter>
        </GlassCard>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_#1a1a2e_0%,_#09090b_70%)] text-zinc-500">
          Memuat...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
