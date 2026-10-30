
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bebas_Neue, Kaushan_Script, Outfit } from "next/font/google";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { ArrowUpRight, Clock, Compass, Heart, MapPin, Star, Users } from "lucide-react";
import data from "@/app/data/tours.json";

/* Same three voices as the hero: brush script, condensed capitals, clean sans */
const script = Kaushan_Script({ subsets: ["latin"], weight: "400" });
const condensed = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const body = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

const { tagline, heading, description, currency, limit, filters, tours, cta } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

/* Filter tabs: "All" plus every category that actually has tours */
const tabs = [
  { id: "all", label: "All tours", count: 0 },
  ...filters
    .map((f) => ({ ...f, count: tours.filter((t) => t.category === f.id).length }))
    .filter((f) => f.count > 0),
];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

type Tour = (typeof tours)[number];

function TourCard({
  tour,
  saved,
  onToggleSave,
}: {
  tour: Tour;
  saved: boolean;
  onToggleSave: (id: string) => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: EASE }}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-[#0b1f3a]/10 bg-white shadow-[0_24px_44px_-28px_rgba(11,31,58,0.55)] transition-shadow duration-300 hover:shadow-[0_34px_60px_-28px_rgba(11,31,58,0.65)] focus-within:ring-4 focus-within:ring-[#0a84ff]/60"
    >
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-[#0b1f3a]">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0565d9] to-[#1596ec] p-4 text-center text-white/90">
            <Compass className="h-12 w-12" aria-hidden="true" />
            {process.env.NODE_ENV !== "production" && (
              <span className="break-all text-xs">Missing file: public{tour.image}</span>
            )}
          </div>
        ) : (
          <Image
            src={tour.image}
            alt={tour.imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-110 motion-reduce:transition-none"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/75 via-transparent to-[#0b1f3a]/15"
        />

        {tour.badge && (
          <span className="absolute left-4 top-4 rounded-full border-2 border-[#0b1f3a] bg-[#ffe600] px-3.5 py-1 text-sm font-bold text-[#0b1f3a] shadow-md">
            {tour.badge}
          </span>
        )}

        {/* Save button (sits above the card's link) */}
        <button
          type="button"
          onClick={() => onToggleSave(tour.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${tour.title} from saved tours` : `Save ${tour.title}`}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0b1f3a] shadow-md backdrop-blur transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
        >
          <motion.span
            key={String(saved)}
            initial={{ scale: saved ? 0.4 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 12 }}
            className="flex"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${saved ? "fill-[#ff4d5e] text-[#ff4d5e]" : ""}`}
              aria-hidden="true"
            />
          </motion.span>
        </button>

        <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-md">
          <MapPin className="h-4 w-4 text-[#ffe600]" aria-hidden="true" />
          {tour.location}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#0a84ff]" aria-hidden="true" />
            {tour.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-[#0a84ff]" aria-hidden="true" />
            {tour.groupSize}
          </span>
        </div>

        <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#132938]">
          <Link
            href={tour.href}
            className="outline-none after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {tour.title}
          </Link>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
          <Star className="h-4 w-4 fill-[#ffc400] text-[#ffc400]" aria-hidden="true" />
          <span className="font-semibold text-[#132938]">{tour.rating.toFixed(1)}</span>
          <span>({tour.reviews} reviews)</span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 border-t-2 border-dashed border-[#0b1f3a]/15 pt-5">
          <div className="mt-5">
            {tour.oldPrice && (
              <span className="block text-sm text-slate-400 line-through">{money(tour.oldPrice)}</span>
            )}
            <span className="flex items-baseline gap-1.5">
              <span className={`${condensed.className} text-5xl leading-none tracking-wide text-[#0a84ff]`}>
                {money(tour.price)}
              </span>
              <span className="text-sm text-slate-500">per person</span>
            </span>
          </div>

          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#0b1f3a] bg-gradient-to-br from-[#0565d9] to-[#1596ec] text-white shadow-[0_10px_24px_-8px_rgba(5,101,217,0.8)] transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function LatestTours() {
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState<string[]>([]);

  const visible =
    filter === "all" ? tours.slice(0, limit) : tours.filter((t) => t.category === filter);

  const toggleSave = (id: string) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="tours"
        className={`${body.className} relative scroll-mt-24 overflow-x-clip bg-[#f5faff] py-20 text-[#132938] lg:py-28`}
      >
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16"
          >
            <div>
              <motion.span
                variants={rise}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#0a84ff]/30 bg-[#0a84ff]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#0565d9]"
              >
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#ffe600] ring-2 ring-[#ffe600]/40" />
                {tagline}
              </motion.span>

              <h2 className="mt-6">
                <motion.span
                  variants={rise}
                  className={`${script.className} block text-[clamp(2.6rem,6vw,5rem)] leading-[1.05]`}
                >
                  {heading.light}
                </motion.span>
                <motion.span
                  variants={rise}
                  className={`${condensed.className} mt-1 block text-[clamp(3.2rem,8vw,6.5rem)] uppercase leading-[0.95] tracking-wide text-[#0a84ff]`}
                >
                  {heading.bold}
                </motion.span>
              </h2>
            </div>

            <motion.p variants={rise} className="max-w-md text-lg leading-relaxed text-slate-600">
              {description}
            </motion.p>
          </motion.div>

          {/* Filters + saved counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:mt-12"
          >
            <div
              role="group"
              aria-label="Filter tours by category"
              className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t) => {
                const isActive = t.id === filter;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setFilter(t.id)}
                    aria-pressed={isActive}
                    className={`relative isolate shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff] ${
                      isActive ? "text-white" : "text-slate-600 hover:text-[#132938]"
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="tour-filter-pill"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full border-2 border-[#0b1f3a] bg-gradient-to-r from-[#0565d9] to-[#1596ec]"
                        transition={{ type: "spring", stiffness: 450, damping: 36 }}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full border border-[#0b1f3a]/15 bg-white"
                      />
                    )}
                    {t.label}
                    {t.id !== "all" && (
                      <span className={`ml-1.5 text-xs ${isActive ? "text-white/80" : "text-slate-400"}`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p
              aria-live="polite"
              className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-600"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${saved.length ? "fill-[#ff4d5e] text-[#ff4d5e]" : ""}`}
                aria-hidden="true"
              />
              {saved.length} saved
            </p>
          </motion.div>

          {/* Tour cards */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  saved={saved.includes(tour.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* View all */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12 flex justify-center"
          >
            <Link
              href={cta.href}
              className="group inline-flex items-center gap-3 rounded-full border-2 border-[#0b1f3a] bg-gradient-to-r from-[#0565d9] to-[#1596ec] py-2 pl-7 pr-2 text-base font-semibold text-white shadow-[0_14px_30px_-10px_rgba(5,101,217,0.8)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a84ff]"
            >
              {cta.label}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0565d9] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}