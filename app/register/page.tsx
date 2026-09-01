"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1a1a2e_0%,_#09090b_70%)]">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-zinc-950/50 shadow-2xl shadow-black/40 backdrop-blur-md lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 p-14 lg:flex">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black">
                S
              </div>

              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
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
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm text-zinc-300">
                  "Simple UI creates better user focus."
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  Product Design Team
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 lg:p-14">
            <GlassCard className="border-0 bg-transparent shadow-none">
              <GlassCardHeader className="px-0">
                <GlassCardTitle className="text-4xl font-bold tracking-tight text-white">
                  Create Account
                </GlassCardTitle>
                <GlassCardDescription className="text-zinc-500">
                  Start managing your workspace today.
                </GlassCardDescription>
              </GlassCardHeader>

              <GlassCardContent className="px-0">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-zinc-400">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-zinc-400">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-blue-500"
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
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-zinc-400">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-blue-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white font-semibold text-black hover:bg-white/90"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </GlassCardContent>

              <GlassCardFooter className="px-0">
                <p className="text-center text-sm text-zinc-500">
                  Already have an account?{" "}
                  <Link href="/login" className="text-white hover:text-zinc-300">
                    Sign In
                  </Link>
                </p>
              </GlassCardFooter>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
