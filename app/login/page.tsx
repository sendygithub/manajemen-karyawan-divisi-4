"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Tujuan awal sebelum di-redirect ke login (dari proxy/middleware).
  const callbackUrl = searchParams.get("callbackUrl");

  function redirectAfterLogin(userEmail?: string | null, role?: string) {
    // Prioritas 1: callbackUrl yang aman (path internal, bukan /login).
    if (
      callbackUrl &&
      callbackUrl.startsWith("/") &&
      !callbackUrl.startsWith("/login") &&
      !callbackUrl.startsWith("/register")
    ) {
      router.push(callbackUrl);
      return;
    }

    // Prioritas 2: halaman khusus engineering.
    if (userEmail === "engineering@company.com") {
      router.push("/dashboard/engineering");
      return;
    }

    // Prioritas 2.5: user trading → langsung ke terminal /trading.
    if (userEmail === "trading@mygajah.com") {
      router.push("/trading");
      return;
    }

    // Prioritas 3: dashboard sesuai role.
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

      // Ambil session baru untuk tahu role & email.
      const { getSession } = await import("next-auth/react");
      const session = await getSession();

      redirectAfterLogin(
        session?.user?.email,
        session?.user?.role as string,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-white/10
            bg-gradient-to-b
            from-zinc-900
            to-zinc-950
            p-8
            shadow-2xl
            shadow-black/30
          "
        >
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>

            <p className="mt-2 text-sm text-zinc-500">Sign in to continue</p>
          </div>

          {/* FORM */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Email</label>

              <input
                type="email"
                placeholder="you@example.com"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-white/20
                  focus:bg-white/[0.05]
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm text-zinc-400">Password</label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  placeholder:text-zinc-600
                  focus:border-white/20
                  focus:bg-white/[0.05]
                "
                autoComplete="current-password"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-2xl
                bg-white
                py-3
                text-sm
                font-semibold
                text-black
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <div className="mt-6 text-center text-sm text-zinc-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-zinc-300 hover:text-white">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // useSearchParams() wajib dibungkus Suspense agar halaman bisa di-prerender.
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-zinc-500">
          Memuat...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
