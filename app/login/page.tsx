"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Invalid credentials");

      return;
    }

    const session = await getSession();

    if (session?.user.role === "ADMIN") {
      router.push("/dashboard/admin");
    }

    if (session?.user.role === "EMPLOYEE") {
      router.push("/dashboard/employee");
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
              />
            </div>

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-500">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="submit"
                className="
                  text-zinc-400
                  transition
                  hover:text-white
                "
              >
                Forgot Password?
              </button>
            </div>

            {/* BUTTON */}
            <button
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
              "
            >
              Sign In
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="
                text-white
                transition
                hover:text-zinc-300
              "
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
