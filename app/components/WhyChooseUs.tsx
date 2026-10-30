
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Headset,
  MapPin,
  Wallet,
} from "lucide-react";

import whyChooseUsData from "@/app/data/why_choose_us.json";

const iconMap = {
  compass: Compass,
  "map-pin": MapPin,
  wallet: Wallet,
  headset: Headset,
};

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion();
  const data = whyChooseUsData;

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };

  return (
    <section
      id="why-choose-us"
      className="relative overflow-hidden bg-white py-12 sm:py-18 lg:py-20"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#e9e7dd]/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-2 lg:items-end"
        >
          <motion.div variants={fadeUp}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-9 bg-[#b75b38]" />
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b75b38]">
                {data.tagline}
              </p>
            </div>

            <h2 className="max-w-2xl text-4xl font-medium leading-[1.08] tracking-[-0.055em] text-[#252d4a] sm:text-5xl lg:text-6xl">
              {data.heading.light}{" "}
              <span className="font-serif italic text-[#b75b38]">
                {data.heading.accent}
              </span>
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="max-w-xl text-sm leading-7 text-[#686b73] sm:text-base lg:justify-self-end lg:pl-8"
          >
            {data.description}
          </motion.p>
        </motion.div>

        {/* Image and features */}
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left image panel */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.7 }}
            className="relative min-w-0"
          >
            <div className="relative min-h-[430px] overflow-hidden rounded-[1.75rem] bg-[#e9e7dd] sm:min-h-[540px] lg:h-full">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#171d31]/80 via-[#171d31]/10 to-transparent" />

              {/* Floating experience badge */}
              <div className="absolute right-5 top-5 max-w-[190px] rounded-2xl border border-white/30 bg-white/90 p-5 shadow-xl backdrop-blur-md sm:right-7 sm:top-7">
                <p className="font-serif text-4xl font-medium tracking-tight text-[#b75b38]">
                  {data.badge.value}
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#252d4a]">
                  {data.badge.label}
                </p>
              </div>

              {/* Image caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md">
                  <Compass size={23} strokeWidth={1.5} />
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  Every journey has a story
                </p>

                <h3 className="max-w-sm font-serif text-3xl italic leading-tight sm:text-4xl">
                  Let&apos;s make yours unforgettable.
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Right feature list */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex min-w-0 flex-col justify-center"
          >
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b75b38]">
                The difference is in the details
              </p>
            </div>

            <div className="divide-y divide-[#e8e6df] border-y border-[#e8e6df]">
              {data.features.map((feature) => {
                const Icon =
                  iconMap[feature.icon as keyof typeof iconMap] ?? Compass;

                return (
                  <motion.article
                    key={feature.id}
                    variants={fadeUp}
                    className="group flex gap-4 py-6 sm:gap-6 sm:py-7"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f1efe8] text-[#b75b38] transition-all duration-300 group-hover:bg-[#252d4a] group-hover:text-white sm:h-14 sm:w-14">
                      <Icon size={23} strokeWidth={1.6} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold tracking-tight text-[#252d4a] sm:text-xl">
                          {feature.title}
                        </h3>

                        <span className="text-xs font-semibold tracking-widest text-[#b75b38]">
                          {feature.number}
                        </span>
                      </div>

                      <p className="max-w-lg text-sm leading-7 text-[#777982]">
                        {feature.description}
                      </p>
                    </div>

                    <CheckCircle2
                      size={19}
                      className="mt-1 hidden shrink-0 text-[#8b9b79] transition-transform duration-300 group-hover:scale-110 sm:block"
                    />
                  </motion.article>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <Link
                href={data.cta.href}
                className="group inline-flex min-h-14 items-center justify-center gap-3 self-start rounded-full bg-[#252d4a] px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#b75b38]"
              >
                {data.cta.label}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <p className="max-w-[190px] text-xs leading-5 text-[#777982]">
                Thoughtfully planned trips. Meaningful memories.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Statistics */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-20 text-center grid grid-cols-1 gap-5 border-t border-[#e8e6df] pt-8 sm:grid-cols-3 sm:gap-8 lg:mt-24 lg:pt-10"
        >
          {data.stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="flex items-center gap-4 sm:block"
            >
              <p className="min-w-[110px] font-serif text-4xl tracking-tight text-[#252d4a] sm:mb-2 sm:text-5xl">
                {stat.value}
              </p>
              <p className="text-sm text-[#777982]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
