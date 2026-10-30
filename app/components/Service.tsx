"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  Check,
  Compass,
  Headset,
  MapPinned,
  Mountain,
  Plane,
  type LucideIcon,
} from "lucide-react";

import data from "@/app/data/service.json";

/* Typography matching the About section */
const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

/* Theme matching the About section */
const COLORS = {
  navy: "#252D4A",
  accent: "#BD5938",
  background: "#FAF9F6",
  muted: "#777A83",
  line: "#E8E3DB",
  olive: "#8A9B79",
  tile: "#F2F0E9",
};

const { tagline, heading, description, services } = data.section;

type Service = (typeof services)[number];

const iconMap: Record<string, LucideIcon> = {
  "map-pinned": MapPinned,
  mountain: Mountain,
  headset: Headset,
  compass: Compass,
};

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const rise: Variants = {
  hidden: {
    opacity: 0,
    y: 26,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE,
    },
  },
};

/* Service image with graceful fallback */
function ServiceImage({
  src,
  alt,
  Icon,
  scale,
}: {
  src: string;
  alt: string;
  Icon: LucideIcon;
  scale: MotionValue<number>;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
        style={{
          backgroundColor: COLORS.tile,
          color: COLORS.accent,
        }}
      >
        <Icon className="h-14 w-14" aria-hidden="true" />

        {process.env.NODE_ENV !== "production" && (
          <span className="break-all text-xs">
            Missing file: public{src}
          </span>
        )}
      </div>
    );
  }

  return (
    <motion.div style={{ scale }} className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        onError={() => setFailed(true)}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </motion.div>
  );
}

function ServiceCard({
  service,
  index,
  total,
  progress,
  stack,
}: {
  service: Service;
  index: number;
  total: number;
  progress: MotionValue<number>;
  stack: boolean;
}) {
  const Icon = iconMap[service.icon] ?? Compass;
  const flip = index % 2 === 1;

  /* Preserve the original stacking animation */
  const targetScale = 1 - (total - 1 - index) * 0.04;

  const stackScale = useTransform(
    progress,
    [index / total, 1],
    [1, targetScale]
  );

  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.25, 1]
  );

  return (
    <div
      ref={cardRef}
      className="pb-8 lg:sticky lg:pb-10"
      style={{
        top: `calc(6.5rem + ${index * 1.25}rem)`,
      }}
    >
      <motion.article
        aria-labelledby={`service-${service.id}`}
        style={{ scale: stack ? stackScale : 1 }}
        className={`group relative grid origin-top overflow-hidden rounded-[2rem] border bg-white shadow-[0_30px_60px_-30px_rgba(37,45,74,0.16)] ${flip
            ? "lg:grid-cols-[0.95fr_1.05fr]"
            : "lg:grid-cols-[1.05fr_0.95fr]"
          }`}
        initial={false}
        whileHover={{ borderColor: COLORS.line }}
      >
        {/* Service copy */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className={`flex flex-col p-7 sm:p-10 lg:p-12 ${flip ? "lg:order-2" : ""
            }`}
          style={{ borderColor: COLORS.line }}
        >
          <motion.div
            variants={rise}
            className="flex items-center justify-between"
          >
            <motion.span
              whileHover={{ rotate: -6, scale: 1.08 }}
              transition={{ duration: 0.3 }}
              className="flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300"
              style={{
                borderColor: COLORS.line,
                backgroundColor: COLORS.tile,
                color: COLORS.accent,
              }}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </motion.span>

            <span
              aria-hidden="true"
              className={`${serif.className} text-6xl font-semibold leading-none text-transparent sm:text-7xl`}
              style={{
                WebkitTextStroke: `1.5px ${COLORS.accent}`,
              }}
            >
              {service.number}
            </span>
          </motion.div>

          <motion.p
            variants={rise}
            className={`${serif.className} mt-6 text-2xl italic`}
            style={{ color: COLORS.accent }}
          >
            {service.subtitle}
          </motion.p>

          <motion.h3
            id={`service-${service.id}`}
            variants={rise}
            className={`${sans.className} mt-1 text-[clamp(2.1rem,3.8vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.045em]`}
            style={{ color: COLORS.navy }}
          >
            {service.title}
          </motion.h3>

          <motion.p
            variants={rise}
            className="mt-4 max-w-lg text-base leading-8 sm:text-lg"
            style={{ color: COLORS.muted }}
          >
            {service.shortDescription}
          </motion.p>

          {/* Service features */}
          <motion.ul
            variants={rise}
            className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2"
          >
            {service.features.map((feature: string) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-[15px] font-medium leading-snug"
                style={{ color: COLORS.navy }}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: COLORS.tile,
                    color: COLORS.olive,
                  }}
                >
                  <Check
                    className="h-3 w-3"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                </span>

                {feature}
              </li>
            ))}
          </motion.ul>

          {/* Service CTA */}
          <motion.div variants={rise} className="mt-8">
            {/* <PrimaryButton href={service.cta.href ?? ""}>
              {service.cta.label}

              <span
                className="flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover/cta:rotate-45"
                style={{
                  backgroundColor: COLORS.background,
                  color: COLORS.navy,
                }}
              >
                <ArrowUpRight
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            </PrimaryButton> */}
          </motion.div>
        </motion.div>

        {/* Service photo and benefits */}
        <div
          className={`group relative order-first min-h-[300px] ${flip ? "lg:order-1" : "lg:order-none"
            }`}
        >
          <ServiceImage
            src={service.image}
            alt={service.imageAlt}
            Icon={Icon}
            scale={imageScale}
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#252D4A]/85 via-[#252D4A]/10 to-transparent"
          />

          <ul className="absolute inset-x-5 bottom-5 space-y-2 sm:inset-x-7 sm:bottom-7">
            {service.benefits.map((benefit: string) => (
              <li
                key={benefit}
                className="flex w-fit max-w-full items-center gap-2.5 rounded-full border border-white/30 bg-[#252D4A]/35 px-4 py-2 text-sm font-medium text-white backdrop-blur-md"
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS.accent }}
                />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </div>
  );
}

export default function Services() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stack, setStack] = useState(false);

  /* Enable the stacking effect only on large screens */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      setStack(mq.matches && !reduce);
    };

    update();
    mq.addEventListener("change", update);

    return () => {
      mq.removeEventListener("change", update);
    };
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="service"
        className={`${sans.className} relative scroll-mt-24 overflow-x-clip py-12 sm:py-18 lg:py-20`}
      >
        {/* Decorative compass watermark */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-16"
          style={{ color: "rgba(189,89,56,0.06)" }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{
            duration: 80,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <Compass
            className="h-[30rem] w-[30rem]"
            strokeWidth={0.5}
          />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* Section header */}
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
                className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.25em] sm:text-sm"
                style={{ color: COLORS.accent }}
              >
                <span
                  aria-hidden="true"
                  className="h-[2px] w-11"
                  style={{ backgroundColor: COLORS.accent }}
                />

                {tagline}
              </motion.span>

              <h2 className="mt-6">
                <motion.span
                  variants={rise}
                  className={`${serif.className} block text-[clamp(2.6rem,6vw,5rem)] leading-[1.05]`}
                  style={{ color: COLORS.navy }}
                >
                  {heading.light}
                </motion.span>

                <motion.span
                  variants={rise}
                  className={`${serif.className} mt-1 block text-[clamp(3.2rem,8vw,6.5rem)] font-medium italic leading-[0.95] tracking-[-0.04em]`}
                  style={{ color: COLORS.accent }}
                >
                  {heading.bold}
                </motion.span>
              </h2>
            </div>

            <motion.div
              variants={rise}
              className="flex items-start gap-4"
            >
              <motion.span
                aria-hidden="true"
                className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: COLORS.tile,
                  color: COLORS.accent,
                }}
                animate={
                  reduce
                    ? undefined
                    : { y: [0, -6, 0], rotate: [0, 6, 0] }
                }
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <Plane className="h-5 w-5" />
              </motion.span>

              <p
                className="max-w-md text-base leading-8 sm:text-lg"
                style={{ color: COLORS.muted }}
              >
                {description}
              </p>
            </motion.div>
          </motion.div>

          {/* Sticky service cards */}
          <div ref={containerRef} className="mt-14 lg:mt-20">
            {services.map((service: Service, index: number) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                total={services.length}
                progress={scrollYProgress}
                stack={stack}
              />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}