"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Plane } from "lucide-react";
import data from "@/app/data/hero.json";

const script = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["italic", "normal"],
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const { eyebrow, heading, description, stats, slides } = data;

const EASE = [0.22, 1, 0.36, 1];
const AUTOPLAY_MS = 6000;
const TICK_MS = 50;

const COLORS = {
  navy: "#252D4A",
  terracotta: "#BD5938",
  cream: "#FAF9F6",
  muted: "#777A83",
  line: "#E8E3DB",
  olive: "#8A9B79",
};

const LEFT_GRADIENT = [
  "linear-gradient(90deg, rgba(37,45,74,0.96) 0%, rgba(37,45,74,0.84) 30%, rgba(37,45,74,0.48) 58%, rgba(37,45,74,0.06) 88%)",
  "linear-gradient(35deg, rgba(189,89,56,0.26) 0%, rgba(189,89,56,0.10) 28%, rgba(189,89,56,0) 52%)",
].join(", ");

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const rise = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const scriptIn = {
  hidden: {
    opacity: 0,
    y: 40,
    rotate: -4,
    filter: "blur(10px)",
  },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};

const lettersContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035 },
  },
};

const letter = {
  hidden: { y: "110%" },
  show: {
    y: "0%",
    transition: { duration: 0.6, ease: EASE },
  },
};

const thumbIn = {
  hidden: { opacity: 0, x: 60, scale: 0.9 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

/* Image fallback component */
function Photo({ src, alt, sizes, priority = false }) {
  const [failure, setFailure] = useState({ src: null, failed: false });
  const failed = failure.src === src && failure.failed;

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.terracotta}, ${COLORS.cream})`,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailure({ src, failed: true })}
      className="object-cover"
    />
  );
}

const pad = (n) => String(n).padStart(2, "0");

export default function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const progress = useMotionValue(0);

  useEffect(() => {
    if (paused || reduce || slides.length <= 1) return;

    const id = window.setInterval(() => {
      const next = progress.get() + TICK_MS / AUTOPLAY_MS;

      if (next >= 1) {
        progress.set(0);
        setIndex((i) => (i + 1) % slides.length);
      } else {
        progress.set(next);
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [paused, reduce, progress]);

  const goTo = (i) => {
    progress.set(0);
    setIndex(i);
  };

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, {
    stiffness: 60,
    damping: 20,
  });

  const sy = useSpring(my, {
    stiffness: 60,
    damping: 20,
  });

  const bgX = useTransform(sx, [-0.5, 0.5], [16, -16]);
  const bgY = useTransform(sy, [-0.5, 0.5], [10, -10]);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const current = slides[index];

  if (!current) return null;

  const words = heading.bold.split(" ");

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="hero"
        className={`${body.className} relative`}
        style={{ backgroundColor: COLORS.cream }}
      >
        {/* Hero image area */}
        <div
          className="relative isolate min-h-[680px] overflow-hidden lg:min-h-[700px]"
          onMouseMove={onMove}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => {
            setPaused(false);
            mx.set(0);
            my.set(0);
          }}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Background image container */}
          <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-5 -z-30">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.18 }}
                animate={{ opacity: 1, scale: 1.04 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 1.1, ease: EASE },
                  scale: { duration: 9, ease: "linear" },
                }}
                className="absolute inset-0"
              >
                <Photo
                  src={current.image}
                  alt={current.alt}
                  sizes="100vw"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navy and terracotta gradient overlays */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20"
            style={{ backgroundImage: LEFT_GRADIENT }}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 lg:hidden"
            style={{ backgroundColor: "rgba(37,45,74,0.38)" }}
          />

          {/* Terracotta atmospheric glow */}
          <motion.div
            aria-hidden="true"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.48, 0.25],
            }}
            transition={{
              duration: 7,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-80 w-80 rounded-full blur-3xl"
            style={{ backgroundColor: COLORS.terracotta }}
          />

          {/* Animated decorative plane */}
          <motion.div
            aria-hidden="true"
            initial={{ x: "-10vw" }}
            animate={{ x: "110vw", y: [0, -18, 0, 14, 0] }}
            transition={{
              x: { duration: 26, ease: "linear", repeat: Infinity },
              y: { duration: 8, ease: "easeInOut", repeat: Infinity },
            }}
            className="pointer-events-none absolute left-0 top-12 z-10 hidden md:block"
            style={{ color: COLORS.cream }}
          >
            <Plane className="h-6 w-6 drop-shadow-lg" />
          </motion.div>

          {/* Main content grid */}
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-44 pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-10 lg:pb-48 lg:pt-20">
            {/* Left content block */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="max-w-xl"
            >
              {/* Eyebrow badge */}
              <motion.p
                variants={rise}
                className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur"
                style={{
                  borderColor: "rgba(250,249,246,0.3)",
                  backgroundColor: "rgba(250,249,246,0.10)",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: COLORS.terracotta }}
                    animate={{
                      scale: [1, 2.6],
                      opacity: [0.7, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      ease: "easeOut",
                      repeat: Infinity,
                    }}
                  />
                  <span
                    className="relative h-2 w-2 rounded-full"
                    style={{ backgroundColor: COLORS.terracotta }}
                  />
                </span>
                {eyebrow}
              </motion.p>

              <h1>
                {/* Script heading */}
                <motion.span
                  variants={scriptIn}
                  className={`${script.className} block text-[clamp(3.5rem,8vw,6.5rem)] font-medium italic leading-none`}
                  style={{ color: COLORS.cream }}
                >
                  {heading.script}
                </motion.span>

                {/* Main bold title with staggered letter animation */}
                <motion.span
                  variants={lettersContainer}
                  className={`${display.className} mt-1 block text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-wide`}
                  style={{
                    color: COLORS.cream,
                    textShadow: "0 3px 12px rgba(0,0,0,0.35)",
                  }}
                >
                  <span className="sr-only">{heading.bold}</span>
                  {words.map((w, wi) => (
                    <span key={`${w}-${wi}`} aria-hidden="true">
                      <span className="inline-block overflow-hidden whitespace-nowrap align-bottom">
                        {w.split("").map((ch, ci) => (
                          <motion.span
                            key={`${ch}-${ci}`}
                            variants={letter}
                            className="inline-block"
                          >
                            {ch}
                          </motion.span>
                        ))}
                      </span>
                      {wi < words.length - 1 && " "}
                    </span>
                  ))}
                </motion.span>
              </h1>

              {/* Description paragraph */}
              <motion.p
                variants={rise}
                className="mt-6 max-w-md text-base leading-relaxed"
                style={{ color: "rgba(250,249,246,0.9)" }}
              >
                {description}
              </motion.p>

              {/* Stats row */}
              <motion.div
                variants={rise}
                className="mt-10 flex flex-wrap gap-x-9 gap-y-4 border-t pt-6"
                style={{ borderColor: "rgba(250,249,246,0.25)" }}
              >
                {stats.map((s) => (
                  <div key={s.label}>
                    <p
                      className={`${display.className} text-3xl font-bold leading-none`}
                      style={{ color: COLORS.cream }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="mt-1 text-xs font-medium uppercase tracking-[0.14em]"
                      style={{ color: "rgba(250,249,246,0.7)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right destination thumbnail cards */}
            <motion.ul
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.5,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              aria-label="Choose a destination photo"
              className="flex gap-3 overflow-x-auto p-2 lg:flex-col lg:overflow-visible"
            >
              {slides.map((s, i) => {
                const isActive = i === index;
                return (
                  <motion.li key={s.id} variants={thumbIn} className="shrink-0">
                    <motion.button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Show ${s.title}: ${s.alt}`}
                      aria-current={isActive ? "true" : undefined}
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      whileHover={{
                        scale: isActive ? 1.1 : 1.05,
                        y: -3,
                      }}
                      whileTap={{ scale: 0.96 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 22,
                      }}
                      className="relative block aspect-[4/3] w-32 overflow-hidden rounded-xl border-2 transition-[border-color,opacity,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:w-44"
                      style={{
                        borderColor: isActive
                          ? COLORS.cream
                          : "rgba(250,249,246,0.35)",
                        opacity: isActive ? 1 : 0.78,
                        boxShadow: isActive
                          ? "0 18px 40px -16px rgba(0,0,0,0.55)"
                          : "none",
                      }}
                    >
                      <Photo src={s.image} alt="" sizes="176px" />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                      />
                      <span className="absolute bottom-2 left-3 right-3 truncate text-left text-xs font-bold text-white">
                        {s.title}
                      </span>
                      {isActive && (
                        <motion.span
                          aria-hidden="true"
                          style={{
                            scaleX: progress,
                            backgroundColor: COLORS.terracotta,
                          }}
                          className="absolute inset-x-0 bottom-0 h-1 origin-left"
                        />
                      )}
                    </motion.button>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>

          {/* Slide counter and pagination dots */}
          <div className="absolute bottom-24 left-6 z-20 flex items-center gap-4 lg:bottom-28 lg:left-1/2 lg:-translate-x-1/2">
            <div
              aria-hidden="true"
              className="flex h-5 items-center gap-2 overflow-hidden text-xs font-bold tabular-nums text-white"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={index}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="block"
                >
                  {pad(index + 1)}
                </motion.span>
              </AnimatePresence>
              <span className="text-white/60">/ {pad(slides.length)}</span>
            </div>

            <div className="flex gap-2">
              {slides.map((s, i) => (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to ${s.title}`}
                  aria-current={i === index ? "true" : undefined}
                  layout
                  animate={{ width: i === index ? 24 : 8 }}
                  whileHover={{ scale: 1.25 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                  }}
                  className="h-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  style={{
                    backgroundColor:
                      i === index
                        ? COLORS.terracotta
                        : "rgba(250,249,246,0.6)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Decorative SVG curve divider leading into the next section */}
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
              ease: EASE,
            }}
            className="pointer-events-none absolute -bottom-px left-0 z-10 h-14 w-full lg:h-24"
            style={{ fill: COLORS.cream }}
          >
            <path d="M0 120 V70 L30 62 L70 74 L120 58 L170 70 L230 52 L290 66 L350 50 L410 64 L470 46 L540 62 L600 48 L670 64 L740 44 L810 60 L880 46 L950 62 L1020 48 L1090 66 L1160 50 L1230 68 L1300 54 L1370 66 L1440 56 V120 Z" />
          </motion.svg>
        </div>
      </section>
    </MotionConfig>
  );
}