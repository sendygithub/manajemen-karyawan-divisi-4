"use client";

import { motion } from "framer-motion";
import { COMPANY_INFO, WELCOME_MESSAGE } from "../mock-data";
import { ArrowRight, ArrowDown } from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Departemen", value: "3" },
  { label: "Karyawan", value: "115" },
  { label: "Kehadiran", value: "94.7%" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#121110] text-[#F4F1EA]">
      {/* Subtle tread-line texture, not a generic dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #F5B700 0px, #F5B700 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center w-full">
        {/* LEFT: content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ID-badge style eyebrow, not a generic pill */}
          <div className="inline-flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#F5B700] text-black font-black text-xs tracking-tighter">
              GT
            </div>
            <span className="w-px h-4 bg-white/15" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#B8B5AC] font-medium">
              {COMPANY_INFO.division}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#F5B700]/80 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5B700] animate-pulse" />
              Sistem Aktif
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-black leading-[0.95] tracking-tight uppercase">
            {COMPANY_INFO.name}
          </h1>
          <div className="mt-5 h-1 w-16 bg-[#F5B700]" />

          <p className="mt-6 text-lg text-[#B8B5AC] max-w-lg leading-relaxed">
            {COMPANY_INFO.description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#F5B700] text-black font-bold text-sm tracking-wide transition hover:bg-[#FFC91A]"
            >
              Masuk ke Sistem
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-[#E5E2D8] font-medium text-sm border border-white/15 hover:border-white/30 transition"
            >
              Tentang Kami
            </a>
          </div>

          {/* Dashboard ticker instead of floating stat cards */}
          <div className="mt-16 flex flex-wrap items-stretch divide-x divide-white/10 border-t border-white/10 pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 first:pl-0">
                <div className="font-mono text-2xl font-bold text-[#F5B700]">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-[#75726A] mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: signature elephant + tire-tread mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* outer rotating tread ring — reads as a tire, moves like an idle wheel */}
            <motion.svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="200"
                cy="200"
                r="188"
                fill="none"
                stroke="#F5B700"
                strokeOpacity="0.15"
                strokeWidth="2"
              />
              {Array.from({ length: 48 }).map((_, i) => {
                const angle = (i / 48) * 2 * Math.PI;
                const x1 = 200 + 178 * Math.cos(angle);
                const y1 = 200 + 178 * Math.sin(angle);
                const x2 = 200 + 196 * Math.cos(angle);
                const y2 = 200 + 196 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#F5B700"
                    strokeOpacity="0.25"
                    strokeWidth="2"
                  />
                );
              })}
            </motion.svg>

            {/* inner static dashed ring */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-[78%] h-[78%] m-auto"
            >
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#F5B700"
                strokeOpacity="0.3"
                strokeWidth="1.5"
                strokeDasharray="6 10"
              />
            </svg>

            {/* core disc with elephant mark */}
            <div className="relative w-[58%] h-[58%] rounded-full bg-gradient-to-b from-[#1C1A17] to-[#0D0C0B] border border-[#F5B700]/25 shadow-[0_0_60px_-10px_rgba(245,183,0,0.25)] flex items-center justify-center">
              <svg
                viewBox="0 0 240 200"
                className="w-[62%] h-[62%]"
                fill="none"
              >
                <g
                  stroke="#F5B700"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* ear */}
                  <path d="M62 78 C40 70 30 95 42 118 C50 133 70 136 82 126" />
                  {/* head + body */}
                  <path d="M82 126 C60 118 55 90 78 72 C98 57 128 55 150 66 C176 78 188 104 182 128 C178 144 164 154 148 156 L70 156 C55 156 44 148 40 134" />
                  {/* trunk */}
                  <path d="M182 118 C196 116 206 124 206 138 C206 150 196 158 186 156" />
                  {/* legs */}
                  <path d="M78 156 L76 178" />
                  <path d="M108 156 L106 178" />
                  <path d="M140 156 L142 178" />
                  <path d="M162 154 L166 176" />
                  {/* tail */}
                  <path d="M40 134 C30 138 26 148 32 156" />
                  {/* tusk */}
                  <path d="M148 128 C154 134 154 142 148 146" strokeWidth="3" />
                </g>
                <circle cx="118" cy="94" r="3.5" fill="#F5B700" />
              </svg>
            </div>
          </div>

          {/* floating quote badge, reuses your existing content instead of decoration */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-auto md:right-2 md:translate-x-0 bg-[#0D0C0B] border border-white/10 rounded-xl px-4 py-3 max-w-[240px] shadow-xl"
          >
            <p className="text-xs text-[#D9D6CC] italic leading-relaxed">
              &ldquo;{WELCOME_MESSAGE.quote}&rdquo;
            </p>
            <p className="text-[11px] text-[#F5B700] mt-1.5 font-medium">
              — {WELCOME_MESSAGE.author}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] text-[#6B6862] tracking-[0.25em] uppercase">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 text-[#6B6862]" />
      </motion.div>
    </section>
  );
}
