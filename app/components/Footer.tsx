
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { motion, useReducedMotion } from "framer-motion";

import footerData from "@/app/data/footer.json";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-footer-heading",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-footer-body",
});

const content = footerData.footer;

const contactIcons: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Footer() {
  const reduceMotion = useReducedMotion();

  const reveal = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease,
      },
    },
  };

  const mutedText = {
    color: content.mutedTextColor,
  };

  const accentText = {
    color: content.accentColor,
  };

  const borderStyle = {
    borderColor: content.borderColor,
  };

  return (
    <footer
      style={{
        backgroundColor: content.backgroundColor,
        color: content.textColor,
      }}
      className={`${headingFont.variable} ${bodyFont.variable} overflow-hidden`}
    >
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand */}
          <motion.div
            className="lg:col-span-4"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <Link
              href={content.brand.homeHref}
              aria-label={content.brand.imageAlt}
              className="group inline-flex items-center"
            >
              <Image
                src={content.brand.logoImage}
                alt={content.brand.imageAlt}
                width={180}
                height={64}
                className="h-22 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p
              style={mutedText}
              className="mt-6 max-w-sm text-sm leading-7"
            >
              {content.brand.description}
            </p>

            {/* Social links */}
            <nav
              aria-label={content.accessibility.socialLinksLabel}
              className="mt-7 flex flex-wrap gap-3"
            >
              {content.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  style={borderStyle}
                  className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold transition-all duration-300 hover:bg-white/70"
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color =
                      content.accentColor;
                    event.currentTarget.style.borderColor =
                      content.accentColor;
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color =
                      content.textColor;
                    event.currentTarget.style.borderColor =
                      content.borderColor;
                  }}
                >
                  {social.shortLabel}

                  <ArrowUpRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Navigation columns */}
          {content.columns.map((column, index) => (
            <motion.div
              key={column.id}
              className="lg:col-span-2"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                delay: reduceMotion ? 0 : index * 0.08,
              }}
            >
              <h3 className="mb-6 font-[family-name:var(--font-footer-heading)] text-2xl font-semibold">
                {column.title}
              </h3>

              <ul className="space-y-4">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={mutedText}
                      className="group inline-flex items-center gap-2 text-sm transition-colors duration-300 hover:opacity-100"
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color =
                          content.accentColor;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color =
                          content.mutedTextColor;
                      }}
                    >
                      <span>{item.label}</span>

                      <ArrowUpRight
                        size={13}
                        aria-hidden="true"
                        className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact information */}
          <motion.div
            className="lg:col-span-4"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <h3 className="mb-6 font-[family-name:var(--font-footer-heading)] text-2xl font-semibold">
              {content.contact.title}
            </h3>

            <ul
              aria-label={content.accessibility.contactLinksLabel}
              className="space-y-5"
            >
              {content.contact.items.map((item) => {
                const Icon = contactIcons[item.icon];

                return (
                  <li
                    key={item.id}
                    className="flex items-start gap-3"
                  >
                    {Icon && (
                      <Icon
                        size={18}
                        aria-hidden="true"
                        style={accentText}
                        className="mt-0.5 shrink-0"
                      />
                    )}

                    <a
                      href={item.href}
                      target={
                        item.icon === "map-pin"
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        item.icon === "map-pin"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      aria-label={`${item.label}: ${item.value}`}
                      style={mutedText}
                      className="break-words text-sm leading-6 transition-colors duration-300 hover:opacity-100"
                      onMouseEnter={(event) => {
                        event.currentTarget.style.color =
                          content.accentColor;
                      }}
                      onMouseLeave={(event) => {
                        event.currentTarget.style.color =
                          content.mutedTextColor;
                      }}
                    >
                      {item.value}
                    </a>
                  </li>
                );
              })}
            </ul>

            <Link
              href={content.contact.cta.href}
              style={{
                ...accentText,
                borderColor: content.borderColor,
              }}
              className="group mt-7 inline-flex items-center gap-3 border-b pb-2 text-sm font-semibold transition-colors duration-300"
            >
              {content.contact.cta.label}

              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>

        {/* Bottom footer */}
        <motion.div
          style={borderStyle}
          className="mt-14 border-t pt-7 sm:mt-16"
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 12,
          }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: reduceMotion ? 0 : 0.6,
            ease,
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p
              style={mutedText}
              className="text-xs leading-6"
            >
              {content.bottom.copyrightPrefix}{" "}
              {content.bottom.year} {content.brand.name}.{" "}
              {content.bottom.copyrightSuffix}{" "}
              {content.bottom.tagline}
            </p>

            
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
