"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";

const QUICK_LOGIN = [
  {
    label: "Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "ADMIN",
  },
  { label: "HR", email: "hr@company.com", password: "hr123", role: "HR" },
  {
    label: "Manager",
    email: "manager@company.com",
    password: "manager123",
    role: "MANAGER",
  },
  {
    label: "Employee",
    email: "ahmad@company.com",
    password: "employee123",
    role: "EMPLOYEE",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

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
    } else if (session?.user.role === "HR") {
      router.push("/dashboard/hr");
    } else if (session?.user.role === "MANAGER") {
      router.push("/dashboard/manager");
    } else if (session?.user.role === "EMPLOYEE") {
      router.push("/dashboard/employee");
    }
  }

  async function handleQuickLogin(
    email: string,
    password: string,
    label: string,
  ) {
    setLoading(label);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Quick login failed");
      setLoading(null);
      return;
    }

    const session = await getSession();

    if (session?.user.role === "ADMIN") {
      router.push("/dashboard/admin");
    } else if (session?.user.role === "HR") {
      router.push("/dashboard/hr");
    } else if (session?.user.role === "MANAGER") {
      router.push("/dashboard/manager");
    } else if (session?.user.role === "EMPLOYEE") {
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

          {/* QUICK LOGIN */}
          <div className="mt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Quick Login
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {QUICK_LOGIN.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  disabled={loading === item.label}
                  onClick={() =>
                    handleQuickLogin(item.email, item.password, item.label)
                  }
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-3
                    py-2.5
                    text-xs
                    font-medium
                    text-zinc-400
                    transition
                    hover:border-white/20
                    hover:bg-white/[0.06]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading === item.label ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <span className="block text-[10px] uppercase tracking-wider text-zinc-600">
                        {item.role}
                      </span>
                      <span className="block">{item.label}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
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
