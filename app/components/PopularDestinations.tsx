
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Compass,
  Landmark,
  MapPin,
  Mountain,
  Trees,
  Waves,
  Heart,
} from "lucide-react";

import destinationsData from "@/app/data/popularDestinations.json";
import PrimaryButton from "./PrimaryButton";

type DestinationImage = {
  src: string;
  alt: string;
};

type Destination = {
  id: string;
  name: string;
  country: string;
  category: string;
  description: string[];
  images: DestinationImage[];
  icon: string;
  startingPrice: number;
  currency: string;
  duration: string;
  featured: boolean;
  href: string;
  cta: string;
};

type PopularDestinationsData = {
  tagline: string;
  heading: {
    light: string;
    bold: string;
  };
  description: string[];
  badge: string;
  labels: {
    featured: string;
    titlePrefix: string;
    titleConnector: string;
    tripDuration: string;
    startingPrice: string;
    priceSuffix: string;
    destinationCounter: string;
    selectorTitle: string;
  };
  button: {
    label: string;
    href: string;
  };
  destinations: Destination[];
};

const data = destinationsData as PopularDestinationsData;

const iconMap = {
  mountain: Mountain,
  waves: Waves,
  landmark: Landmark,
  trees: Trees,
  compass: Compass,
  heart: Heart,
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function PopularDestinations() {
  const [activeDestination, setActiveDestination] = useState(0);
  const [activeImage, setActiveImage] = useState(0);

  const reduceMotion = useReducedMotion();
  const destination = data.destinations[activeDestination];

  if (!destination) return null;

  const images = destination.images ?? [];
  const currentImage = images[activeImage] ?? images[0];

  const DestinationIcon =
    iconMap[destination.icon as keyof typeof iconMap] ?? Compass;

  const goToDestination = (index: number) => {
    const total = data.destinations.length;
    if (total === 0) return;

    setActiveDestination((index + total) % total);
    setActiveImage(0);
  };

  const goToImage = (index: number) => {
    if (images.length === 0) return;
    setActiveImage((index + images.length) % images.length);
  };

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);

  const imageVariants = {
    initial: {
      opacity: 0,
      scale: reduceMotion ? 1 : 1.06,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.7,
        ease,
      },
    },
    exit: {
      opacity: 0,
      scale: reduceMotion ? 1 : 0.98,
      transition: {
        duration: reduceMotion ? 0 : 0.25,
      },
    },
  };

  const textVariants = {
    initial: {
      opacity: 0,
      y: reduceMotion ? 0 : 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease,
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: reduceMotion ? 0 : -12,
      transition: {
        duration: reduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants = {
    initial: {
      opacity: 0,
      y: reduceMotion ? 0 : 16,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease,
      },
    },
  };

  return (
    <section
      id="destinations"
      className="relative overflow-hidden bg-[#f8f7f3] py-14 sm:py-18 lg:py-24"
    >
      {/* Decorative background animation */}
      <motion.div
        aria-hidden="true"
        animate={
          reduceMotion
            ? undefined
            : {
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#dce8d9]/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease,
          }}
          className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end"
        >
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <motion.span
                initial={reduceMotion ? false : { width: 0 }}
                whileInView={{ width: "2.25rem" }}
                viewport={{ once: true }}
                transition={{
                  duration: reduceMotion ? 0 : 0.6,
                  delay: 0.2,
                }}
                className="h-px bg-[#d16b45]"
              />

              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b75b38]">
                {data.tagline}
              </p>
            </div>

            <h2 className="text-4xl font-medium leading-[1.08] tracking-[-0.055em] text-[#252d4a] sm:text-5xl lg:text-6xl">
              {data.heading.light}{" "}
              <span className="font-serif italic text-[#b75b38]">
                {data.heading.bold}
              </span>
            </h2>
          </div>

          <div className="max-w-md">
            {data.description.map((paragraph, index) => (
              <p
                key={index}
                className="mb-2 text-sm leading-7 text-[#686b73] sm:text-base"
              >
                {paragraph}
              </p>
            ))}

          </div>
        </motion.div>

        {/* Main destination layout */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* LEFT: Destination image slider */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              ease,
            }}
            className="min-w-0"
          >
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative rounded-[1.75rem] shadow-xl shadow-black/5"
            >
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-[1.75rem] bg-[#e7e4dc] sm:aspect-[4/3.8] lg:aspect-[0.91/1]">
                <AnimatePresence mode="wait">
                  {currentImage && (
                    <motion.div
                      key={`${destination.id}-${currentImage.src}`}
                      variants={imageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentImage.src}
                        alt={currentImage.alt}
                        fill
                        priority={
                          activeDestination === 0 && activeImage === 0
                        }
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/5" />

                {/* Image badge */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.4,
                    delay: 0.2,
                  }}
                  className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md sm:left-7 sm:top-7"
                >
                  <span className="h-2 w-2 rounded-full bg-[#e5b68c]" />
                  {data.badge}
                </motion.div>

                {/* Image navigation */}
                {images.length > 1 && (
                  <div className="absolute right-5 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 sm:right-7">
                    <motion.button
                      whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                      type="button"
                      onClick={() => goToImage(activeImage - 1)}
                      aria-label="Previous destination image"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white hover:text-[#252d4a]"
                    >
                      <ArrowLeft size={18} />
                    </motion.button>

                    <motion.button
                      whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                      type="button"
                      onClick={() => goToImage(activeImage + 1)}
                      aria-label="Next destination image"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-white hover:text-[#252d4a]"
                    >
                      <ArrowRight size={18} />
                    </motion.button>
                  </div>
                )}

                {/* Image counter */}
                <div className="absolute right-5 top-5 rounded-full bg-black/25 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md sm:right-7 sm:top-7">
                  {String(activeImage + 1).padStart(2, "0")} /{" "}
                  {String(images.length).padStart(2, "0")}
                </div>

                {/* Image destination details */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
                    <MapPin size={14} />
                    {destination.country}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={destination.id}
                      initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.4,
                        ease,
                      }}
                    >
                      <h3 className="font-serif text-4xl italic tracking-tight sm:text-5xl lg:text-6xl">
                        {destination.name}
                      </h3>

                      <p className="mt-2 text-sm text-white/80">
                        {destination.category}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <motion.button
                    key={`${destination.id}-${image.src}`}
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.05, y: -2 }
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                    type="button"
                    onClick={() => goToImage(index)}
                    aria-label={`Show image ${index + 1} of ${destination.name}`}
                    aria-pressed={activeImage === index}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl transition-all duration-300 sm:h-24 sm:w-28 ${activeImage === index
                        ? "ring-2 ring-[#b75b38] ring-offset-2 ring-offset-[#f8f7f3]"
                        : "opacity-60 hover:opacity-100"
                      }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Destination navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-[#deddd5] pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#777982]">
                {data.labels.destinationCounter}{" "}
                <span className="ml-1 text-[#252d4a]">
                  {String(activeDestination + 1).padStart(2, "0")}
                </span>
                <span className="mx-1">/</span>
                {String(data.destinations.length).padStart(2, "0")}
              </p>

              <div className="flex gap-2">
                <motion.button
                  whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={() => goToDestination(activeDestination - 1)}
                  aria-label="Previous destination"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9d8d1] text-[#252d4a] transition hover:border-[#252d4a] hover:bg-[#252d4a] hover:text-white"
                >
                  <ArrowLeft size={18} />
                </motion.button>

                <motion.button
                  whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={() => goToDestination(activeDestination + 1)}
                  aria-label="Next destination"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#252d4a] text-white transition hover:bg-[#b75b38]"
                >
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Destination information */}
          <div className="flex min-w-0 flex-col justify-center lg:py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={destination.id}
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {/* Category */}
                <motion.div
                  variants={itemVariants}
                  className="mb-6 flex items-center gap-3"
                >
                  <motion.div
                    whileHover={reduceMotion ? undefined : { rotate: 10, scale: 1.1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e9e7dd] text-[#b75b38]"
                  >
                    <DestinationIcon size={23} strokeWidth={1.7} />
                  </motion.div>

                  <div>
                    {destination.featured && (
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b75b38]">
                        {data.labels.featured}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-[#777982]">
                      {destination.category}
                    </p>
                  </div>
                </motion.div>

                {/* Destination heading */}
                <motion.h3
                  variants={itemVariants}
                  className="max-w-xl text-4xl font-medium leading-[1.08] tracking-[-0.05em] text-[#252d4a] sm:text-5xl lg:text-6xl"
                >
                  {data.labels.titlePrefix}
                  <br />
                  {data.labels.titleConnector}{" "}
                  <span className="font-serif italic text-[#b75b38]">
                    {destination.name}.
                  </span>
                </motion.h3>

                {/* Location */}
                <motion.div
                  variants={itemVariants}
                  className="mt-5 flex items-center gap-2 text-sm text-[#777982]"
                >
                  <MapPin size={16} className="text-[#b75b38]" />
                  {destination.country}
                </motion.div>

                {/* Description list */}
                <motion.div
                  variants={itemVariants}
                  className="mt-7 space-y-4"
                >
                  {destination.description.map((paragraph, index) => (
                    <motion.div
                      key={`${destination.id}-description-${index}`}
                      initial={
                        reduceMotion ? false : { opacity: 0, x: -10 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.35,
                        delay: reduceMotion ? 0 : index * 0.08 + 0.1,
                      }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5e9de] text-[#4f7352]">
                        <Check size={12} strokeWidth={2.5} />
                      </span>

                      <p className="text-sm leading-7 text-[#686b73] sm:text-base">
                        {paragraph}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Trip details */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 grid grid-cols-2 gap-4 border-y border-[#deddd5] py-6"
                >
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#777982]">
                      <CalendarDays size={15} />
                      {data.labels.tripDuration}
                    </div>

                    <p className="text-lg font-semibold text-[#252d4a]">
                      {destination.duration}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#777982]">
                      {data.labels.startingPrice}
                    </p>

                    <p className="text-xl font-semibold tracking-tight text-[#252d4a] sm:text-2xl">
                      {formatPrice(
                        destination.startingPrice,
                        destination.currency
                      )}

                      <span className="ml-1 text-xs font-normal text-[#777982]">
                        {data.labels.priceSuffix}
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Destination CTA */}
                <motion.div variants={itemVariants} className="mt-6">
                  <PrimaryButton href={destination.href}>
                    {destination.cta}

                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </PrimaryButton>

                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Destination selector */}
            <div className="mt-10 border-t border-[#deddd5] pt-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#777982]">
                {data.labels.selectorTitle}
              </p>

              <div className="flex flex-wrap gap-2">
                {data.destinations.map((item, index) => {
                  const isActive = activeDestination === index;

                  return (
                    <motion.button
                      type="button"
                      key={item.id}
                      onClick={() => goToDestination(index)}
                      aria-pressed={isActive}
                      whileHover={
                        reduceMotion ? undefined : { scale: 1.05 }
                      }
                      whileTap={
                        reduceMotion ? undefined : { scale: 0.95 }
                      }
                      className={`relative rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors duration-300 ${isActive
                          ? "border-[#252d4a] bg-[#252d4a] text-white"
                          : "border-[#deddd5] bg-transparent text-[#686b73] hover:border-[#252d4a] hover:text-[#252d4a]"
                        }`}
                    >
                      {item.name}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
