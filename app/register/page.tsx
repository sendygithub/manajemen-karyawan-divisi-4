"use client";

import Link from "next/link";
import AuthInput from "@/components/AuthInput";
const AnyAuthInput = AuthInput as any;
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Register failed");

        return;
      }

      alert("Register success!");

      router.push("/login");
    } catch (error) {
      console.log(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div
          className="
            grid
            w-full
            max-w-6xl
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-gradient-to-b
            from-zinc-900
            to-zinc-950
            shadow-2xl
            shadow-black/30
            lg:grid-cols-2
          "
        >
          {/* LEFT SIDE */}
          <div
            className="
              relative
              hidden
              flex-col
              justify-between
              overflow-hidden
              border-r
              border-white/10
              p-14
              lg:flex
            "
          >
            {/* BACKGROUND EFFECT */}
            <div
              className="
                absolute
                -right-20
                -top-20
                h-72
                w-72
                rounded-full
                bg-white/5
                blur-3xl
              "
            />

            <div className="relative z-10">
              <div
                className="
                  mb-10
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-white
                  text-xl
                  font-bold
                  text-black
                "
              >
                S
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                Build modern
                <br />
                experiences faster.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-zinc-400">
                Create your account and manage your workflow with a clean and
                modern dashboard experience.
              </p>
            </div>

            <div className="relative z-10">
              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-5
                "
              >
                <p className="text-sm text-zinc-300">
                  “Simple UI creates better user focus.”
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  Product Design Team
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 lg:p-14">
            {/* HEADER */}
            <div className="mb-10">
              <h2 className="text-4xl font-bold tracking-tight">
                Create Account
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                Start managing your workspace today.
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="John Doe"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-500
          focus:bg-white/10
        "
              />

              <input
                className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-500
          focus:bg-white/10
        "
                type="email"
                placeholder="you@example.com"
                name="email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-500
          focus:bg-white/10
        "
                type="password"
                placeholder="••••••••"
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <input
                className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-4
          py-3
          text-white
          outline-none
          transition
          focus:border-blue-500
          focus:bg-white/10
        "
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              {/* BUTTON */}
              <button
                type="submit"
                onClick={handleSubmit}
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
                "
              >
                Create Account
              </button>
            </form>

            {/* FOOTER */}
            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="
                  text-white
                  transition
                  hover:text-zinc-300
                "
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
