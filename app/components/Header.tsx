"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  LogIn,
  Menu,
  Phone,
  Send,
  X,
  type LucideIcon,
} from "lucide-react";

import data from "@/app/data/header.json";
import PrimaryButton from "./PrimaryButton";

const { logo, nav, actions } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

const icons: Record<string, LucideIcon> = {
  phone: Phone,
  send: Send,
  "arrow-right": ArrowRight,
  "log-in": LogIn,
};

const ContactIcon = icons[actions.contact.icon] ?? Phone;

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#252D4A]";

const list: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: -14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

const mobileList: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const mobileItem: Variants = {
  hidden: { opacity: 0, x: -18 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE },
  },
};

/** Returns the section id for hash links ("#about" or "/#about"), else null. */
function getSectionId(href: string) {
  const index = href.indexOf("#");
  return index === -1 ? null : href.slice(index + 1) || null;
}

// Route matching for normal (non-hash) links.
function isActiveRoute(pathname: string, href: string) {
  const normalizedHref = href.split("?")[0].split("#")[0];

  if (normalizedHref === "" || normalizedHref === "/") {
    return pathname === "/";
  }

  return (
    pathname === normalizedHref ||
    pathname.startsWith(`${normalizedHref}/`)
  );
}

// Every section id the scroll-spy should track (nav sections + contact).
const TRACKED_IDS = Array.from(
  new Set(
    [...nav.map((n) => n.href), actions.contact.href]
      .map(getSectionId)
      .filter((id): id is string => Boolean(id)),
  ),
);

export default function Header() {
  const pathname = usePathname();

  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const open = openPathname === pathname;
  const [hoveredState, setHoveredState] = useState<{
    pathname: string;
    value: string;
  } | null>(null);
  const hovered = hoveredState?.pathname === pathname ? hoveredState.value : null;
  const setHovered = (value: string | null) => {
    setHoveredState(value ? { pathname, value } : null);
  };
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(
    TRACKED_IDS[0] ?? null,
  );

  const barRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);
  const lockTimerRef = useRef<number | undefined>(undefined);
  const computeRef = useRef<() => void>(() => { });

  const getOffset = useCallback(
    () => (barRef.current?.offsetHeight ?? 72) + 24,
    [],
  );

  // Scroll-spy: highlight the section currently under the header.
  useEffect(() => {
    let ticking = false;

    const compute = () => {
      ticking = false;

      setScrolled(window.scrollY > 20);

      if (lockedRef.current) return;

      const offset = getOffset();
      const existing = TRACKED_IDS.filter((id) =>
        document.getElementById(id),
      );

      if (existing.length === 0) return;

      let current = existing[0];

      for (const id of existing) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }

      // At the very bottom, the last section wins even if it is short.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (atBottom) {
        current = existing[existing.length - 1];
      }

      setActiveId(current);
    };

    computeRef.current = compute;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(compute);
    };

    compute();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(lockTimerRef.current);
    };
  }, [getOffset, pathname]);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPathname(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Close the mobile menu when switching to desktop.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpenPathname(null);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Smooth-scroll to a section, offset by the header height.
  const handleAnchorClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      setOpenPathname(null);

      const id = getSectionId(href);
      const target = id ? document.getElementById(id) : null;

      // Not a section on this page: let the browser/Next handle it.
      if (!id || !target) return;

      event.preventDefault();

      const top =
        target.getBoundingClientRect().top + window.scrollY - getOffset() + 24;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // Highlight the clicked item immediately and pause the spy while scrolling.
      setActiveId(id);
      lockedRef.current = true;
      window.clearTimeout(lockTimerRef.current);

      window.scrollTo({
        top: Math.max(top, 0),
        behavior: reduceMotion ? "auto" : "smooth",
      });

      window.history.replaceState(null, "", `#${id}`);

      lockTimerRef.current = window.setTimeout(
        () => {
          lockedRef.current = false;
          computeRef.current();
        },
        reduceMotion ? 50 : 800,
      );
    },
    [getOffset],
  );

  const isItemActive = (href: string) => {
    const id = getSectionId(href);
    return id ? activeId === id : isActiveRoute(pathname, href);
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className={`sticky top-0 z-50 w-full border-b antialiased transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${scrolled
            ? "border-neutral-200/80 bg-white/95 shadow-md backdrop-blur-xl"
            : "border-transparent bg-white shadow-sm"
          }`}
      >
        <div
          ref={barRef}
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10"
        >
          {/* Logo */}
          <Link
            href={logo.href}
            aria-label={logo.alt}
            className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <Image
                src={logo.image}
                alt={logo.alt}
                width={160}
                height={160}
                priority
                className="h-12 w-auto object-contain sm:h-14"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main navigation" className="hidden lg:block">
            <motion.ul
              variants={list}
              initial="hidden"
              animate="show"
              className="flex items-center gap-1"
              onMouseLeave={() => setHovered(null)}
            >
              {nav.map((n) => {
                const active = isItemActive(n.href);

                // Only ONE item renders the shared-layout pill:
                // the hovered item, or the active item when nothing is hovered.
                const highlighted = hovered ? hovered === n.href : active;

                return (
                  <motion.li key={n.href} variants={item}>
                    <Link
                      href={n.href}
                      aria-current={active ? "location" : undefined}
                      onClick={(e) => handleAnchorClick(e, n.href)}
                      onMouseEnter={() => setHovered(n.href)}
                      onFocus={() => setHovered(n.href)}
                      onBlur={() => setHovered(null)}
                      className={`relative isolate block whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-medium tracking-[0.01em] transition-colors duration-300 ${FOCUS_RING} xl:px-4 ${active
                          ? "text-[#A64A2B]"
                          : "text-neutral-700 hover:text-[#A64A2B]"
                        }`}
                    >
                      {highlighted && (
                        <motion.span
                          layoutId="header-active-indicator"
                          aria-hidden="true"
                          className={`absolute inset-0 -z-10 rounded-full ${active ? "" : "bg-orange-500/10"
                            }`}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 36,
                          }}
                        />
                      )}

                      {n.label}

                      {/* Active underline */}
                      {active && (
                        <motion.span
                          layoutId="header-active-underline"
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-0.5 xl:inset-x-4 h-0.5 rounded-full bg-[#BD5938]"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* Desktop Contact Button */}
          <motion.div
            variants={list}
            initial="hidden"
            animate="show"
            className="hidden items-center lg:flex"
          >
            <motion.div variants={item} className="relative">
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-orange-500"
                animate={
                  scrolled
                    ? { scale: 1, opacity: 0 }
                    : { scale: [1, 1.3], opacity: [0.3, 0] }
                }
                transition={{
                  duration: 2.2,
                  ease: "easeOut",
                  repeat: scrolled ? 0 : Infinity,
                }}
              />

              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                <PrimaryButton href={actions.contact.href}>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[700%]"
                  />

                  <ContactIcon
                    className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                    aria-hidden="true"
                  />

                  <span className="relative">{actions.contact.label}</span>
                </PrimaryButton>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Mobile Toggle */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpenPathname(open ? null : pathname)}
            aria-expanded={open}
            aria-controls="header-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={`rounded-md p-2 text-[#252D4A] lg:hidden ${FOCUS_RING}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {open ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="header-mobile-menu"
              key="header-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden border-t border-neutral-200 bg-white shadow-lg lg:hidden"
            >
              <motion.div
                variants={mobileList}
                initial="hidden"
                animate="show"
                className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain px-6 pb-6 pt-3"
              >
                <ul>
                  {nav.map((n) => {
                    const active = isItemActive(n.href);

                    return (
                      <motion.li
                        key={n.href}
                        variants={mobileItem}
                        className="border-b border-neutral-100 last:border-none"
                      >
                        <Link
                          href={n.href}
                          aria-current={active ? "location" : undefined}
                          onClick={(e) => handleAnchorClick(e, n.href)}
                          className={`flex items-center justify-between rounded-md px-3 py-3 text-base font-semibold transition-colors duration-300 ${FOCUS_RING} ${active
                              ? "bg-[#BD5938]/10 text-[#A64A2B]"
                              : "text-neutral-700 hover:bg-neutral-50 hover:text-[#A64A2B]"
                            }`}
                        >
                          <span>{n.label}</span>

                          {active && (
                            <motion.span
                              layoutId="mobile-active-indicator"
                              aria-hidden="true"
                              className="h-2 w-2 rounded-full bg-[#BD5938]"
                            />
                          )}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                <motion.div variants={mobileItem} className="mt-5">
                  <Link
                    href={actions.contact.href}
                    onClick={(e) => handleAnchorClick(e, actions.contact.href)}
                    className={`flex items-center justify-center gap-2 rounded-full border-2 border-white bg-[image:var(--grad-sunset)] px-5 py-3 text-sm font-bold tracking-[0.01em] text-white shadow-md transition-opacity hover:opacity-90 ${FOCUS_RING}`}
                  >
                    <ContactIcon className="h-4 w-4" aria-hidden="true" />

                    {actions.contact.label}
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent stripe */}
        <motion.div
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          style={{ originX: 0 }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-[image:var(--grad-sunset)]"
        />
      </motion.header>
    </MotionConfig>
  );
}