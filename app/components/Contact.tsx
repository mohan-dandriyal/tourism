"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import Image from "next/image";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";

import data from "@/app/data/contact.json";

/* -------------------------------------------------------------------------- */
/*  Fonts (next/font needs static options, so these stay in code)             */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*  Types: describe the JSON so every part of the UI can come from it         */
/* -------------------------------------------------------------------------- */

type Theme = {
  navy: string;
  terracotta: string;
  cream: string;
  muted: string;
  line: string;
  olive: string;
  tile: string;
  surface: string;
  blush: string;
  oliveSoft: string;
  successBg: string;
  successBorder: string;
};

type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "number"
  | "textarea";

type FieldConfig = {
  name: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  width?: "half" | "full";
  min?: string;
  max?: string;
  rows?: number;
  defaultValue?: string;
  autoComplete?: string;
};

type DetailConfig = {
  id: string;
  icon?: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  description?: string;
};

type ContactContent = {
  id?: string;
  theme?: Partial<Theme>;
  tagline?: string;
  heading: { light?: string; bold?: string };
  description?: string;
  image?: string;
  imageAlt?: string;
  card?: {
    icon?: string;
    chipIcon?: string;
    chip?: string;
    footnote?: string;
  };
  badge?: { title?: string; description?: string };
  details?: DetailConfig[];
  responseNote?: { icon?: string; title?: string; text?: string };
  form: {
    eyebrow?: string;
    title: string;
    description?: string;
    endpoint?: string;
    method?: string;
    fields: FieldConfig[];
    submitLabel: string;
    submittingLabel?: string;
    submitIcon?: string;
    errorMessage?: string;
    note?: string;
  };
  success: {
    title: string;
    description?: string;
    resetLabel?: string;
  };
};

type Status = "idle" | "submitting" | "success" | "error";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const content = data.contact as ContactContent;

const DEFAULT_THEME: Theme = {
  navy: "#252D4A",
  terracotta: "#BD5938",
  cream: "#FAF9F6",
  muted: "#777A83",
  line: "#E8E3DB",
  olive: "#8A9B79",
  tile: "#F2F0E9",
  surface: "#FFFFFF",
  blush: "#E5B5A4",
  oliveSoft: "#E8EDE4",
  successBg: "#F0F4EC",
  successBorder: "#DCE5D4",
};

// Icon names usable anywhere in contact.json.
const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  email: Mail,
  phone: Phone,
  "map-pin": MapPin,
  location: MapPin,
  calendar: CalendarDays,
  users: Users,
  compass: Compass,
  clock: Clock3,
  send: Send,
  message: MessageCircle,
};

const getIcon = (name?: string, fallback?: LucideIcon) =>
  (name ? ICONS[name] : undefined) ?? fallback;

const FIELD_ICON_ELEMENTS: Record<string, ReactNode> = Object.fromEntries(
  Object.entries(ICONS).map(([name, Icon]) => [
    name,
    <Icon key={name} className="h-4 w-4" aria-hidden="true" />,
  ]),
);

const SubmitIcon = getIcon(content.form.submitIcon, Send);
const CardIcon = getIcon(content.card?.icon, Compass);
const ChipIcon = getIcon(content.card?.chipIcon, MapPin);
const NoteIcon = getIcon(content.responseNote?.icon, Clock3);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const buildInitialValues = (fields: FieldConfig[]) =>
  Object.fromEntries(
    fields.map((field) => [field.name, field.defaultValue ?? ""]),
  ) as Record<string, string>;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ContactSection() {
  const reduce = useReducedMotion();

  const theme: Theme = useMemo(
    () => ({ ...DEFAULT_THEME, ...content.theme }),
    [],
  );

  const { form: formConfig, success, card, badge, responseNote } = content;
  const details = content.details ?? [];

  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(formConfig.fields),
  );
  const [status, setStatus] = useState<Status>("idle");
  const [imageFailed, setImageFailed] = useState(false);

  const updateField = (name: string, value: string) => {
    setValues((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setValues(buildInitialValues(formConfig.fields));
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (status === "submitting") return;

    // No endpoint in contact.json: demo mode, show the success state.
    if (!formConfig.endpoint) {
      setStatus("success");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch(formConfig.endpoint, {
        method: formConfig.method ?? "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const ringStyle = {
    "--tw-ring-color": theme.terracotta,
  } as CSSProperties;

  const isSubmitting = status === "submitting";

  return (
    <MotionConfig reducedMotion="user">
      <section
        id={content.id ?? "contact"}
        className={`${body.className} relative overflow-hidden py-12 sm:py-18 lg:py-20`}
      >
        {/* Decorative background details */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: theme.olive, opacity: 0.12 }}
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Section heading */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-14 max-w-3xl text-center lg:mb-20"
          >
            {content.tagline && (
              <motion.span
                variants={reveal}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{
                  borderColor: theme.line,
                  backgroundColor: theme.tile,
                  color: theme.navy,
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: theme.terracotta }}
                />
                {content.tagline}
              </motion.span>
            )}

            <h2 className="mt-6 leading-[0.98]">
              {content.heading.light && (
                <motion.span
                  variants={reveal}
                  className={`${script.className} block text-[clamp(2.5rem,5vw,4.5rem)] italic`}
                  style={{ color: theme.terracotta }}
                >
                  {content.heading.light}
                </motion.span>
              )}

              {content.heading.bold && (
                <motion.span
                  variants={reveal}
                  className={`${display.className} mt-2 block text-[clamp(3rem,7vw,6rem)] font-bold tracking-tight`}
                  style={{ color: theme.navy }}
                >
                  {content.heading.bold}
                </motion.span>
              )}
            </h2>

            {content.description && (
              <motion.p
                variants={reveal}
                className="mx-auto mt-6 max-w-2xl text-base leading-8 sm:text-lg"
                style={{ color: theme.muted }}
              >
                {content.description}
              </motion.p>
            )}
          </motion.div>

          <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* Left column */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="space-y-7"
            >
              {/* Image card */}
              <motion.div
                variants={reveal}
                className="group relative min-h-[330px] overflow-hidden rounded-3xl sm:min-h-[420px]"
                style={{ backgroundColor: theme.navy }}
              >
                {content.image && !imageFailed ? (
                  <Image
                    src={content.image}
                    alt={content.imageAlt ?? ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(145deg, ${theme.navy}, ${theme.olive}, ${theme.terracotta})`,
                    }}
                  />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${theme.navy}F2, ${theme.navy}33, transparent)`,
                  }}
                />

                {CardIcon && (
                  <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md">
                    <CardIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  {card?.chip && (
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: theme.cream,
                        color: theme.navy,
                      }}
                    >
                      {ChipIcon && (
                        <ChipIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {card.chip}
                    </span>
                  )}

                  {badge?.title && (
                    <h3
                      className={`${display.className} mt-4 max-w-md text-4xl font-bold leading-tight text-white sm:text-5xl`}
                    >
                      {badge.title}
                      {badge.description && (
                        <span
                          className="block"
                          style={{ color: theme.blush }}
                        >
                          {badge.description}
                        </span>
                      )}
                    </h3>
                  )}

                  {card?.footnote && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
                      <span
                        aria-hidden="true"
                        className="h-px w-9"
                        style={{ backgroundColor: theme.terracotta }}
                      />
                      {card.footnote}
                    </div>
                  )}
                </div>

                <motion.div
                  aria-hidden="true"
                  animate={
                    reduce ? undefined : { rotate: [0, 8, 0], y: [0, -6, 0] }
                  }
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-6 top-6 hidden h-16 w-16 items-center justify-center rounded-full border border-white/40 text-white sm:flex"
                >
                  <ArrowDownRight className="h-7 w-7" />
                </motion.div>
              </motion.div>

              {/* Contact details */}
              {details.length > 0 && (
                <motion.div
                  variants={reveal}
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
                >
                  {details.map((item) => {
                    const Icon =
                      getIcon(item.icon ?? item.id, MessageCircle) ??
                      MessageCircle;

                    return (
                      <motion.a
                        key={item.id}
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        whileHover={reduce ? undefined : { x: 5 }}
                        className="group flex items-start gap-4 rounded-2xl border p-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{
                          backgroundColor: theme.surface,
                          borderColor: theme.line,
                          outlineColor: theme.terracotta,
                        }}
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: theme.tile,
                            color: theme.terracotta,
                          }}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className="block text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{ color: theme.muted }}
                          >
                            {item.label}
                          </span>

                          <span
                            className="mt-1 block break-words text-base font-semibold"
                            style={{ color: theme.navy }}
                          >
                            {item.value}
                          </span>

                          {item.description && (
                            <span
                              className="mt-1 block text-sm leading-6"
                              style={{ color: theme.muted }}
                            >
                              {item.description}
                            </span>
                          )}
                        </span>

                        <ArrowUpRight
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                          style={{ color: theme.terracotta }}
                        />
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}

              {/* Response-time note */}
              {responseNote && (responseNote.title || responseNote.text) && (
                <motion.div
                  variants={reveal}
                  className="flex items-center gap-3 px-1"
                >
                  {NoteIcon && (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: theme.oliveSoft,
                        color: theme.olive,
                      }}
                    >
                      <NoteIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}

                  <p
                    className="text-sm leading-6"
                    style={{ color: theme.muted }}
                  >
                    {responseNote.title && (
                      <span
                        className="font-semibold"
                        style={{ color: theme.navy }}
                      >
                        {responseNote.title}
                      </span>
                    )}{" "}
                    {responseNote.text}
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Right column: enquiry form */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
              className="rounded-3xl border p-6 sm:p-8 lg:p-10"
              style={{
                borderColor: theme.line,
                backgroundColor: theme.surface,
                boxShadow: "0 24px 70px -45px rgba(37,45,74,0.3)",
              }}
            >
              <div className="mb-8">
                {formConfig.eyebrow && (
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.2em]"
                    style={{ color: theme.terracotta }}
                  >
                    {formConfig.eyebrow}
                  </span>
                )}

                <h3
                  className={`${display.className} mt-3 text-4xl font-bold leading-tight sm:text-5xl`}
                  style={{ color: theme.navy }}
                >
                  {formConfig.title}
                </h3>

                {formConfig.description && (
                  <p
                    className="mt-3 text-sm leading-7 sm:text-base"
                    style={{ color: theme.muted }}
                  >
                    {formConfig.description}
                  </p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="rounded-2xl border p-6 sm:p-8"
                    style={{
                      backgroundColor: theme.successBg,
                      borderColor: theme.successBorder,
                    }}
                    role="status"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="h-12 w-12"
                      style={{ color: theme.olive }}
                    />

                    <h4
                      className={`${display.className} mt-5 text-3xl font-bold`}
                      style={{ color: theme.navy }}
                    >
                      {success.title}
                    </h4>

                    {success.description && (
                      <p
                        className="mt-3 leading-7"
                        style={{ color: theme.muted }}
                      >
                        {success.description}
                      </p>
                    )}

                    {success.resetLabel && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="mt-6 text-sm font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                        style={{
                          color: theme.terracotta,
                          outlineColor: theme.terracotta,
                        }}
                      >
                        {success.resetLabel}
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    aria-busy={isSubmitting}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-5 sm:grid-cols-2"
                  >
                    {formConfig.fields.map((field) => (
                      <Field
                        key={field.name}
                        field={field}
                        value={values[field.name] ?? ""}
                        onChange={(v) => updateField(field.name, v)}
                        theme={theme}
                        ringStyle={ringStyle}
                        disabled={isSubmitting}
                      />
                    ))}

                    <div className="space-y-4 sm:col-span-2">
                      {status === "error" && formConfig.errorMessage && (
                        <p
                          role="alert"
                          className="rounded-xl border px-4 py-3 text-sm"
                          style={{
                            borderColor: theme.terracotta,
                            color: theme.terracotta,
                          }}
                        >
                          {formConfig.errorMessage}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-sm font-semibold transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                        style={{
                          backgroundColor: theme.navy,
                          color: theme.cream,
                          outlineColor: theme.terracotta,
                        }}
                      >
                        {isSubmitting && formConfig.submittingLabel
                          ? formConfig.submittingLabel
                          : formConfig.submitLabel}

                        {SubmitIcon && (
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
                            style={{
                              backgroundColor: theme.terracotta,
                              color: "#FFFFFF",
                            }}
                          >
                            <SubmitIcon className="h-4 w-4" aria-hidden="true" />
                          </span>
                        )}
                      </button>

                      {formConfig.note && (
                        <p
                          className="text-center text-xs leading-5"
                          style={{ color: theme.muted }}
                        >
                          {formConfig.note}
                        </p>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field: renders any entry from form.fields                                 */
/* -------------------------------------------------------------------------- */

function Field({
  field,
  value,
  onChange,
  theme,
  ringStyle,
  disabled,
}: {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  theme: Theme;
  ringStyle: CSSProperties;
  disabled?: boolean;
}) {
  const id = `contact-${field.name}`;
  const type = field.type ?? "text";
  const icon = field.icon ? FIELD_ICON_ELEMENTS[field.icon] : undefined;

  const sharedStyle: CSSProperties = {
    ...ringStyle,
    borderColor: theme.line,
    backgroundColor: theme.cream,
    color: theme.navy,
  };

  const sharedClass =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 disabled:opacity-70";

  return (
    <div className={field.width === "half" ? "" : "sm:col-span-2"}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold"
        style={{ color: theme.navy }}
      >
        {field.label}
        {field.required && (
          <span aria-hidden="true" style={{ color: theme.terracotta }}>
            {" "}
            *
          </span>
        )}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          required={field.required}
          disabled={disabled}
          className={`${sharedClass} resize-y`}
          style={sharedStyle}
        />
      ) : (
        <span className="relative block">
          {icon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: theme.muted }}
            >
              {icon}
            </span>
          )}

          <input
            id={id}
            name={field.name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            min={field.min}
            max={field.max}
            autoComplete={field.autoComplete}
            disabled={disabled}
            className={`${sharedClass} ${icon ? "pl-11" : ""}`}
            style={sharedStyle}
          />
        </span>
      )}
    </div>
  );
}