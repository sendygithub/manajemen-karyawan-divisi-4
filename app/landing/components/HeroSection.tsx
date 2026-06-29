"use client";

import { motion } from "framer-motion";
import { COMPANY_INFO, WELCOME_MESSAGE } from "../mock-data";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#09090b]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
            <span className="text-sm text-zinc-400 font-medium tracking-wide">
              {COMPANY_INFO.division}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {COMPANY_INFO.name}
          </h1>

          <p className="mt-4 text-lg md:text-xl text-zinc-500 max-w-xl leading-relaxed">
            {COMPANY_INFO.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-semibold text-sm transition hover:opacity-90"
            >
              Login
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] text-zinc-300 font-medium transition-all border border-white/10"
            >
              Tentang Kami
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-sm text-zinc-500 mt-1">Departemen</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold text-white">115</div>
              <div className="text-sm text-zinc-500 mt-1">Karyawan</div>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <div className="text-3xl font-bold text-white">94.7%</div>
              <div className="text-sm text-zinc-500 mt-1">Kehadiran</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Hero Image / Skeleton */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Photo placeholder with skeleton */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 shadow-2xl shadow-black/30">
            {/* Skeleton grid simulating a group photo */}
            <div className="aspect-[4/3] relative overflow-hidden">
              {/* Decorative circles representing people */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-4 p-8">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/[0.03] animate-pulse ring-2 ring-white/10" />
                      <div className="w-10 h-2 rounded bg-white/[0.03] animate-pulse" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/80 via-transparent to-transparent" />

              {/* Quote overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <blockquote className="text-zinc-300 text-sm md:text-base italic font-light leading-relaxed">
                  {WELCOME_MESSAGE.quote}
                </blockquote>
                <p className="text-zinc-500 text-xs mt-2">
                  — {WELCOME_MESSAGE.author}
                </p>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-4 -right-4 bg-zinc-900 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/10 shadow-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-400" />
              <span className="text-xs text-zinc-400">115+ Anggota Tim</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-zinc-600 tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-4 h-4 text-zinc-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
