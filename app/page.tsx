"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight, Zap, Cpu, Shield } from "lucide-react";
import Link from "next/link";

/* =========================
   MAIN PAGE
========================= */

export default function Page() {
  return (
    <main className="bg-[#0c0c0e] text-white overflow-x-hidden relative">
      <Atmosphere />
      <Navbar />
      <Hero />
      <ParallaxIntro />
      <Metrics />
      <TechGrid />
      <Showcase />
      <Footer />
    </main>
  );
}

/* =========================
   ATMOSPHERE LAYER
========================= */

function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay noise" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
    </div>
  );
}

/* =========================
   NAVBAR
========================= */

function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 w-full z-40 px-8 py-5 backdrop-blur-md bg-black/20 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="tracking-[0.3em] text-sm font-light">AEROXIS</div>

        <nav className="hidden md:flex gap-8 text-xs text-white/60">
          <a>
            <Link href="#vision">VISION test</Link>
          </a>
          <Link href="#tech">TECH</Link>
          <Link href="#performance">PERFORMANCE</Link>
          <Link href="#ecosystem">ECOSYSTEM</Link>
        </nav>

        <Link
          href="http://localhost:3000/login"
          className="border border-white/20 px-4 py-2 text-xs tracking-widest hover:bg-white hover:text-black transition"
        >
          klik
        </Link>
      </div>
    </motion.header>
  );
}

/* =========================
   HERO CINEMATIC
========================= */

function Hero() {
  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06),transparent_60%)]" />

      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute w-[900px] h-[900px] border border-cyan-500/10 rounded-full"
      />

      <div className="text-center z-10">
        <motion.h1
          initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2 }}
          className="text-[12vw] md:text-[7vw] font-semibold tracking-tighter"
        >
          AEROXIS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/40 text-xs tracking-[0.3em] mt-6"
        >
          THE FUTURE IS NOT DRIVEN. IT THINKS.
        </motion.p>
      </div>

      <div className="absolute bottom-10 text-white/30 text-xs tracking-widest animate-bounce">
        SCROLL TO INITIATE EXPERIENCE
      </div>
    </section>
  );
}

/* =========================
   PARALLAX INTRO
========================= */

function ParallaxIntro() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={ref}
      className="h-[120vh] flex items-center justify-center relative"
    >
      <motion.div
        style={{ y: y1 }}
        className="absolute text-white/5 text-[10vw] font-bold"
      >
        NEURAL
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute text-white/10 text-[6vw] font-light"
      >
        MOBILITY
      </motion.div>

      <div className="max-w-xl text-center z-10 px-6">
        <p className="text-white/50 text-sm leading-relaxed">
          AEROXIS is an autonomous intelligence ecosystem designed to redefine
          motion, perception, and control in next-generation mobility systems.
        </p>
      </div>
    </section>
  );
}

/* =========================
   METRICS
========================= */

function Metrics() {
  const data = [
    ["0–100 KM/H", "1.8s"],
    ["POWER OUTPUT", "1200 HP"],
    ["AI LATENCY", "0.003ms"],
  ];

  return (
    <section className="py-40 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-10">
        {data.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: i * 0.15 }}
            className="p-10 border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="text-3xl font-semibold text-cyan-300">{m[1]}</div>
            <div className="text-xs tracking-[0.3em] text-white/40 mt-2">
              {m[0]}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =========================
   TECH GRID
========================= */

function TechGrid() {
  const items = [
    {
      title: "Solid-State Battery",
      desc: "Ultra-dense energy architecture for extreme range.",
      icon: Zap,
    },
    {
      title: "Neural Autonomy",
      desc: "Self-learning predictive driving intelligence.",
      icon: Cpu,
    },
    {
      title: "Carbon Monocoque",
      desc: "Aerospace-grade structural integrity.",
      icon: Shield,
    },
  ];

  return (
    <section className="py-40 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-10 border border-white/10 bg-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-cyan-500/5" />

            <item.icon className="text-cyan-300 mb-6" />

            <h3 className="text-lg font-medium tracking-tight">{item.title}</h3>

            <p className="text-white/40 text-sm mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =========================
   SHOWCASE (SCROLL STORY)
========================= */

function Showcase() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const index = useTransform(scrollYProgress, [0, 1], [0, 2]);

  const scenes = [
    "PERCEPTION SYSTEMS ONLINE",
    "TRAJECTORY PREDICTION ACTIVE",
    "FULL AUTONOMOUS CONTROL ENGAGED",
  ];

  return (
    <section ref={ref} className="h-[250vh] relative">
      <div className="sticky top-1/2 -translate-y-1/2 text-center px-6">
        <motion.h2 className="text-4xl md:text-6xl font-light tracking-tight">
          {scenes[Math.round(Number(index.get()))]}
        </motion.h2>

        <p className="text-white/40 text-sm mt-6">
          Scroll-driven neural experience layer
        </p>
      </div>
    </section>
  );
}

/* =========================
   FOOTER
========================= */

function Footer() {
  return (
    <footer className="relative py-40 border-t border-white/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 z-10 relative">
        <div>
          <h3 className="tracking-[0.3em]">AEROXIS</h3>
          <p className="text-white/40 text-sm mt-4">
            Engineering autonomous velocity systems beyond human limits.
          </p>
        </div>

        <div className="text-white/40 text-sm space-y-2">
          <p>VISION</p>
          <p>TECH</p>
          <p>ECOSYSTEM</p>
          <p>CAREERS</p>
        </div>

        <div className="text-white/40 text-sm space-y-2">
          <p>INSTAGRAM</p>
          <p>LINKEDIN</p>
          <p>X</p>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[12vw] text-white/5 font-bold tracking-tighter">
        AEROXIS
      </div>
    </footer>
  );
}
