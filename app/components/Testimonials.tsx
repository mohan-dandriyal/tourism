
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, MapPin, Quote, Star } from "lucide-react";
import data from "@/app/data/testimonials.json";

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

const { tagline, heading, description, summary, cta, testimonials } = data;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const COLORS = {
  navy: "#252D4A",
  terracotta: "#BD5938",
  cream: "#FAF9F6",
  muted: "#777A83",
  line: "#E8E3DB",
  olive: "#8A9B79",
};

const TILTS = [-1.6, 1.2, -0.9, 1.7, -1.3, 0.9];

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE },
  },
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Stars({
  count,
  className = "h-4 w-4",
}: {
  count: number;
  className?: string;
}) {
  return (
    <span
      className="flex gap-0.5"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={className}
          style={{
            fill: i < count ? COLORS.terracotta : "transparent",
            color: i < count ? COLORS.terracotta : COLORS.line,
          }}
        />
      ))}
    </span>
  );
}

/* Counts up once when scrolled into view */
function CountUp({
  value,
  decimals = 1,
}: {
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduce) {
      setN(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: setN,
    });

    return () => controls.stop();
  }, [inView, value, reduce]);

  return <span ref={ref}>{n.toFixed(decimals)}</span>;
}

/* Round portrait with initials fallback */
function Avatar({
  name,
  src,
  alt,
}: {
  name: string;
  src: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <span
      className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-full border-2"
      style={{
        borderColor: COLORS.navy,
        background: `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.olive})`,
      }}
    >
      {failed ? (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">
          {initials(name)}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="48px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </span>
  );
}

type Testimonial = (typeof testimonials)[number];

function Postcard({
  t,
  index,
}: {
  t: Testimonial;
  index: number;
}) {
  const tilt = TILTS[index % TILTS.length];

  return (
    <motion.figure
      initial={{ opacity: 0, y: 44, rotate: tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.75,
        ease: EASE,
        delay: (index % 2) * 0.12,
      }}
      whileHover={{
        rotate: 0,
        y: -8,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 20,
        },
      }}
      className="relative mb-9 break-inside-avoid rounded-md p-6 pt-9 shadow-[0_26px_50px_-24px_rgba(37,45,74,0.30)]"
      style={{
        backgroundColor: COLORS.cream,
        color: COLORS.navy,
        border: `1px solid ${COLORS.line}`,
      }}
    >
      {/* Decorative tape */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(189,89,56,0.28)",
        }}
      />

      {/* Postage stamp */}
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 flex h-14 w-12 flex-col items-center justify-center gap-1 border-2 border-dashed"
        style={{
          borderColor: `${COLORS.navy}80`,
          backgroundColor: "#F0E8DC",
          color: COLORS.navy,
        }}
      >
        <MapPin className="h-4 w-4" />
        <span className="h-px w-6" style={{ backgroundColor: COLORS.navy }} />
        <span className="h-px w-4" style={{ backgroundColor: COLORS.navy }} />
      </span>

      <Quote
        className="h-8 w-8"
        style={{
          fill: "rgba(189,89,56,0.15)",
          color: COLORS.terracotta,
        }}
        aria-hidden="true"
      />

      <blockquote
        className="mt-3 text-[17px] leading-relaxed"
        style={{ color: "#555967" }}
      >
        &ldquo;{t.quote}&rdquo;
      </blockquote>

      <div className="mt-4">
        <Stars count={t.rating} />
      </div>

      <figcaption
        className="mt-5 flex items-center gap-3 border-t-2 border-dashed pt-5"
        style={{ borderColor: `${COLORS.navy}25` }}
      >
        <Avatar name={t.name} src={t.image.src} alt={t.image.alt} />

        <span className="min-w-0">
          <span className="block truncate text-base font-semibold">
            {t.name}
          </span>

          <span
            className="block truncate text-sm"
            style={{ color: COLORS.muted }}
          >
            {t.location}
          </span>

          <span
            className={`${script.className} block truncate text-base leading-tight`}
            style={{ color: COLORS.terracotta }}
          >
            {t.trip}
          </span>
        </span>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="testimonials"
        className={`${body.className} relative scroll-mt-24 overflow-x-clip py-12 sm:py-18 lg:py-20`}
        style={{
          backgroundColor: COLORS.cream,
          color: COLORS.navy,
        }}
      >
        {/* Decorative flight path */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-10 h-[34rem] w-full"
        >
          <path
            d="M-20 520 C 250 380, 420 580, 640 360 S 1020 100, 1240 220"
            fill="none"
            stroke="rgba(37,45,74,0.12)"
            strokeWidth="2"
            strokeDasharray="6 12"
          />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            {/* Left: heading and rating summary */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <motion.span
                variants={rise}
                className="inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: "#F0EDE6",
                  color: COLORS.navy,
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full ring-2"
                  style={{
                    backgroundColor: COLORS.terracotta,
                    boxShadow: `0 0 0 3px rgba(189,89,56,0.15)`,
                  }}
                />
                {tagline}
              </motion.span>

              <h2 className="mt-6">
                <motion.span
                  variants={rise}
                  className={`${script.className} block text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]`}
                  style={{ color: COLORS.terracotta }}
                >
                  {heading.light}
                </motion.span>

                <motion.span
                  variants={rise}
                  className={`${display.className} mt-1 block text-[clamp(3rem,6.5vw,5.5rem)] font-bold leading-[0.95] tracking-tight`}
                  style={{ color: COLORS.navy }}
                >
                  {heading.bold}
                </motion.span>
              </h2>

              <motion.p
                variants={rise}
                className="mt-6 max-w-md text-lg leading-relaxed"
                style={{ color: COLORS.muted }}
              >
                {description}
              </motion.p>

              {/* Rating summary */}
              <motion.div
                variants={rise}
                className="mt-8 max-w-md rounded-2xl border p-6"
                style={{
                  borderColor: COLORS.line,
                  backgroundColor: "#F2F0E9",
                }}
              >
                <div className="flex items-center gap-5">
                  <p
                    className={`${display.className} text-7xl leading-none tracking-wide`}
                    style={{ color: COLORS.navy }}
                  >
                    <CountUp value={summary.value} />
                  </p>

                  <div>
                    <Stars count={5} className="h-5 w-5" />

                    <p
                      className="mt-1 text-sm"
                      style={{ color: COLORS.muted }}
                    >
                      {summary.total}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {summary.breakdown.map((row, i) => (
                    <li
                      key={row.stars}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className="flex w-8 items-center gap-1"
                        style={{ color: COLORS.navy }}
                      >
                        {row.stars}
                        <Star
                          className="h-3.5 w-3.5"
                          style={{
                            fill: COLORS.terracotta,
                            color: COLORS.terracotta,
                          }}
                          aria-hidden="true"
                        />
                      </span>

                      <span
                        role="img"
                        aria-label={`${row.percent}% gave ${row.stars} stars`}
                        className="h-2 flex-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: COLORS.line }}
                      >
                        <motion.span
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: row.percent / 100 }}
                          viewport={{ once: true, amount: 0.8 }}
                          transition={{
                            duration: 1,
                            ease: EASE,
                            delay: 0.3 + i * 0.1,
                          }}
                          className="block h-full origin-left rounded-full"
                          style={{ backgroundColor: COLORS.terracotta }}
                        />
                      </span>

                      <span
                        className="w-9 text-right"
                        style={{ color: COLORS.muted }}
                      >
                        {row.percent}%
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA */}
              <motion.div variants={rise} className="mt-8">
                <Link
                  href={cta.href}
                  className="group inline-flex items-center gap-3 rounded-full border-2 py-2 pl-6 pr-2 text-base font-semibold transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4"
                  style={{
                    borderColor: COLORS.navy,
                    backgroundColor: COLORS.navy,
                    color: COLORS.cream,
                    boxShadow: "0 14px 30px -15px rgba(37,45,74,0.5)",
                  }}
                >
                  {cta.label}

                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-45"
                    style={{
                      backgroundColor: COLORS.cream,
                      color: COLORS.terracotta,
                    }}
                  >
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: postcard wall */}
            <div className="columns-1 gap-8 pt-4 sm:columns-2">
              {testimonials.map((t, i) => (
                <Postcard key={t.id} t={t} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
