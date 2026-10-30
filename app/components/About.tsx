
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Headset,
  MapPin,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import data from "@/app/data/about.json";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const COLORS = {
  navy: "#252D4A",
  accent: "#BD5938",
  background: "#FAF9F6",
  muted: "#777A83",
  line: "#E8E3DB",
  olive: "#8A9B79",
  tile: "#F2F0E9",
};

type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type AboutData = {
  tagline: string;
  heading: {
    light: string;
    bold: string;
  };
  description: string[];
  images: {
    main: { src: string; alt: string };
    secondary: { src: string; alt: string };
  };
  badge: { text: string };
  rating: { value: string; label: string };
  features: Feature[];
  founder: {
    name: string;
    role: string;
    image: { src: string; alt: string };
  };
  cta?: {
    href: string;
    label: string;
  };
  contact: {
    href: string;
    label: string;
    phone: string;
  };
  stats?: {
    id: string;
    value: number;
    decimals: number;
    suffix: string;
    label: string;
  }[];
};

const content = data as AboutData;

const iconMap: Record<string, LucideIcon> = {
  compass: Compass,
  "map-pinned": MapPin,
  "map-pin": MapPin,
  wallet: Wallet,
  headset: Headset,
  "shield-check": ShieldCheck,
};

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

/* Image with a scroll-triggered reveal and a graceful fallback. */
function RevealImage({
  src,
  alt,
  sizes,
  className = "",
  delay = 0,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={`group relative isolate overflow-hidden bg-[#E9E5DC] ${className}`}
    >
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#F2F0E9] p-4 text-center text-[#777A83]">
          <Compass size={30} aria-hidden="true" />
          <span className="text-xs">
            Image unavailable
          </span>
        </div>
      ) : (
        <motion.div
          className="absolute inset-0"
          initial={reduceMotion ? false : { scale: 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE, delay }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
          />
        </motion.div>
      )}
    </motion.div>
  );
}

/* Feature row styled to match the supplied screenshot. */
function FeatureRow({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const Icon = iconMap[feature.icon] ?? Compass;

  return (
    <motion.li
      variants={fadeUp}
      className="grid grid-cols-[56px_minmax(0,1fr)_20px] items-start gap-4 border-b py-6 sm:grid-cols-[68px_minmax(0,1fr)_22px] sm:gap-6 sm:py-7"
      style={{ borderColor: COLORS.line }}
    >
      <motion.span
        whileHover={{ rotate: -5, scale: 1.04 }}
        transition={{ duration: 0.25 }}
        className="flex h-14 w-14 items-center justify-center rounded-[19px] sm:h-[68px] sm:w-[68px]"
        style={{
          backgroundColor: COLORS.tile,
          color: COLORS.accent,
        }}
      >
        <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
      </motion.span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3
            className="text-lg font-bold leading-snug tracking-[-0.035em] sm:text-[22px]"
            style={{ color: COLORS.navy }}
          >
            {feature.title}
          </h3>

          <span
            className="text-xs font-bold tracking-[0.15em]"
            style={{ color: COLORS.accent }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <p
          className="mt-3 text-[15px] leading-7 sm:text-base"
          style={{ color: COLORS.muted }}
        >
          {feature.description}
        </p>
      </div>

      <CheckCircle2
        size={21}
        className="mt-1"
        style={{ color: COLORS.olive }}
        strokeWidth={2}
        aria-hidden="true"
      />
    </motion.li>
  );
}

export default function About() {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="about"
        className={`${sans.className} relative overflow-hidden py-12 sm:py-18 lg:py-20`}
        style={{
          backgroundColor: COLORS.background,
          color: COLORS.navy,
        }}
      >
        {/* Subtle decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#BD5938]/[0.035] blur-3xl"
        />

        <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 xl:px-16">
          {/* Heading and introduction */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-14 lg:mb-24"
          >
            <motion.div
              variants={fadeUp}
              className="mb-7 flex items-center gap-4"
            >
              <span
                className="h-[2px] w-11"
                style={{ backgroundColor: COLORS.accent }}
              />

              <span
                className="text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
                style={{ color: COLORS.accent }}
              >
                {content.tagline}
              </span>
            </motion.div>

            <div className="grid items-end gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
              <motion.h2
                variants={fadeUp}
                className="max-w-4xl text-[clamp(2.8rem,5.8vw,5.4rem)] leading-[1.02] tracking-[-0.065em]"
              >
                <span>{content.heading.light} </span>

                <span
                  className={`${serif.className} font-medium italic tracking-[-0.045em]`}
                  style={{ color: COLORS.accent }}
                >
                  {content.heading.bold}
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="max-w-xl pb-1 text-base leading-8 sm:text-lg"
                style={{ color: COLORS.muted }}
              >
                {content.description[0]}
              </motion.p>
            </div>
          </motion.div>

          {/* Main image and feature list */}
          <div className="grid items-start gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 xl:gap-20">
            {/* Image column */}
            <div className="relative min-w-0 pb-5 sm:pb-7">
              <RevealImage
                src={content.images.main.src}
                alt={content.images.main.alt}
                sizes="(min-width: 1024px) 43vw, 92vw"
                className="aspect-[4/4.5] w-full rounded-t-[34px] rounded-b-sm sm:aspect-[4/4.1]"
              />

              {/* Experience badge */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="absolute right-3 top-5 min-w-[158px] rounded-[20px] bg-white/95 px-5 py-5 shadow-[0_12px_40px_rgba(37,45,74,0.12)] sm:right-6 sm:top-8 sm:min-w-[220px] sm:px-6 sm:py-6"
              >
                <p
                  className={`${serif.className} text-4xl font-semibold leading-none sm:text-5xl`}
                  style={{ color: COLORS.accent }}
                >
                  {content.rating.value}
                </p>

                <p
                  className="mt-3 max-w-[170px] text-xs font-bold leading-5 sm:text-sm"
                  style={{ color: COLORS.navy }}
                >
                  {content.rating.label}
                </p>
              </motion.div>

              {/* Secondary image */}
              {content.images.secondary?.src && (
                <div className="absolute -bottom-1 -right-2 hidden w-[34%] sm:block lg:-right-5">
                  <RevealImage
                    src={content.images.secondary.src}
                    alt={content.images.secondary.alt}
                    sizes="(min-width: 1024px) 15vw, 30vw"
                    delay={0.2}
                    className="aspect-square rounded-full border-[6px] border-[#FAF9F6] shadow-[0_12px_35px_rgba(37,45,74,0.12)]"
                  />
                </div>
              )}
            </div>

            {/* Features column */}
            <div className="min-w-0 lg:pt-0">
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="mb-6 text-xs font-bold uppercase tracking-[0.24em] sm:mb-8 sm:text-sm"
                style={{ color: COLORS.accent }}
              >
                The difference is in the details
              </motion.p>

              <motion.ul
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
                className="border-t"
                style={{ borderColor: COLORS.line }}
              >
                {content.features.map((feature, index) => (
                  <FeatureRow
                    key={feature.id}
                    feature={feature}
                    index={index}
                  />
                ))}
              </motion.ul>

              {/* Contact and CTA */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-9"
              >
                <Link
                  href={content.contact.href}
                  className="group inline-flex items-center gap-3 text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: COLORS.navy }}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: COLORS.tile,
                      color: COLORS.accent,
                    }}
                  >
                    <Headset size={19} aria-hidden="true" />
                  </span>

                  <span>
                    <span className="block text-xs font-normal" style={{ color: COLORS.muted }}>
                      {content.contact.label}
                    </span>
                    <span className="mt-0.5 block">{content.contact.phone}</span>
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Optional statistics strip, rendered only when stats exist */}
          {content.stats && content.stats.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4 lg:mt-28"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.line,
              }}
            >
              {content.stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  variants={fadeUp}
                  className="bg-white/70 px-4 py-7 sm:px-6 sm:py-9"
                >
                  <p
                    className={`${serif.className} text-4xl font-semibold sm:text-5xl`}
                    style={{ color: COLORS.accent }}
                  >
                    {stat.value.toLocaleString()}
                    {stat.suffix}
                  </p>

                  <p
                    className="mt-2 text-xs font-semibold uppercase tracking-[0.13em]"
                    style={{ color: COLORS.muted }}
                  >
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
