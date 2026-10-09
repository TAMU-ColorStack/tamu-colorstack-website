"use client";

import type { WeekDay, CalendarDisplayEvent } from "@/lib/calendar-types";
import Image from "next/image";
import { useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

const FALLBACK_DESCRIPTION =
  "Join the community for this week's session. Come ready to learn, ask questions, and connect with other members.";

const SECTION_INTRO =
  "Join us for weeks filled with Workshops, Hands-on Sessions, Rec Games, and more!";

/** Reliable scroll reveal (CSS view timelines are inconsistent across browsers). */
function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
  style,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  /** Stagger when multiple items share the same intersection moment */
  delayMs?: number;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      setVisible(true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            reveal();
            break;
          }
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    observer.observe(el);

    // Already in view on load (common for hero-adjacent content): show without waiting for scroll
    const check = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.top < vh * 0.92 && r.bottom > vh * 0.05) {
        observer.disconnect();
        requestAnimationFrame(reveal);
      }
    };
    check();
    requestAnimationFrame(check);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transform-gpu transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${visible ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"} ${className}`}
      style={{
        ...(style && typeof style === "object" ? style : {}),
        ...(visible && delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : {}),
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

function ordinalDay(n: number): string {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** `day.key` (YYYY-MM-DD) → heading like "April 7th". */
function formatEventHeadingDate(dayKey: string): string {
  const [ys, ms, ds] = dayKey.split("-");
  const y = Number(ys);
  const m = Number(ms) - 1;
  const d = Number(ds);
  if (!y || m < 0 || !d) return "";
  const date = new Date(Date.UTC(y, m, d, 12, 0, 0));
  const month = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(date);
  return `${month} ${ordinalDay(d)}`;
}

function EventDescription({
  desc,
  fullText,
  muted,
}: {
  desc: string;
  fullText: string;
  muted: boolean;
}) {
  const t = desc.trim();
  const m = t.match(/^(.{8,220}?[.!?])(\s+)([\s\S]+)$/);
  const bodyMuted = muted ? "text-neutral-400" : "text-neutral-700";
  const briefMuted = muted ? "text-neutral-400" : "text-neutral-600";

  if (m?.[1] && m[3]?.trim()) {
    const lead = m[1].trim();
    const rest = m[3].trim();
    return (
      <>
        <p className={`mt-2 text-base leading-relaxed ${bodyMuted}`}>{rest}</p>
        <p className={`mt-2 text-sm leading-snug ${briefMuted}`}>{lead}</p>
      </>
    );
  }

  return <p className={`mt-2 text-base leading-relaxed ${bodyMuted}`}>{fullText}</p>;
}

function EventBlock({
  event,
  isPastDay,
  dayKey,
}: {
  event: CalendarDisplayEvent;
  isPastDay: boolean;
  dayKey: string;
}) {
  const muted = isPastDay || event.isPast;
  const desc = event.description?.trim() ?? "";
  const loc = event.location?.trim() ?? "";
  const fullText = desc || FALLBACK_DESCRIPTION;
  const headingDate = formatEventHeadingDate(dayKey);

  return (
    <article
      className={`group/event border-b border-neutral-100 py-5 last:border-b-0 sm:py-6 ${
        muted ? "text-neutral-400" : ""
      }`}
    >
      <div className="flex w-full min-w-0 flex-row items-start gap-6 sm:gap-7 md:gap-10">
        <div className="min-w-0 flex-1">
          <h3
            className={`font-sans text-xl font-bold leading-tight tracking-tight sm:text-2xl ${
              muted
                ? "line-through decoration-neutral-300"
                : "text-background transition-colors duration-500 ease-out group-hover/event:text-[#5c0a0a]"
            }`}
          >
            {event.title}
          </h3>
          <EventDescription desc={desc} fullText={fullText} muted={muted} />

          <div
            className={`mt-4 ${
              muted ? "text-neutral-400" : "text-neutral-700"
            }`}
          >
            <p className="font-sans text-sm font-bold tabular-nums sm:text-base">{headingDate}</p>
            <p className="mt-0.5 font-sans text-sm font-medium tabular-nums leading-snug sm:text-[0.95rem]">
              {event.time}
            </p>
            {loc ? (
              <p
                className={`mt-1 text-xs font-semibold uppercase leading-snug tracking-wide sm:text-[0.7rem] ${
                  muted ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {loc}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end pt-0.5 sm:pt-1">
          <div
            className={[
              "relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl sm:h-40 sm:w-40 md:h-44 md:w-44",
              muted ? "opacity-70 grayscale" : "",
              !isPastDay
                ? "motion-safe:shadow-sm motion-safe:transition-[transform,box-shadow] motion-safe:duration-[600ms] motion-safe:ease-[cubic-bezier(0.25,0.1,0.28,1)] motion-safe:group-hover/day:scale-[1.06] motion-safe:group-hover/day:shadow-md motion-reduce:transition-none motion-reduce:group-hover/day:scale-100"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Image
              src={event.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 176px"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function DayCard({ day }: { day: WeekDay }) {
  const stateClasses = day.isPast
    ? "border-neutral-200 bg-neutral-100/90"
    : day.isToday
      ? "border-gold/35 bg-neutral-50/95 shadow-[0_1px_0_rgba(201,162,39,0.12)] ring-1 ring-gold/20"
      : "border-neutral-200/90 bg-neutral-50/95";

  const dateStripClasses = day.isPast
    ? "border-neutral-200 bg-neutral-200/40 text-neutral-500"
    : day.isToday
      ? "border-gold/25 bg-gold/[0.07] text-background"
      : "border-neutral-100 bg-neutral-50/80 text-background";

  const interactiveDay = !day.isPast;

  return (
    <div
      className={`group/day transform-gpu overflow-hidden rounded-3xl border ${stateClasses} ${
        interactiveDay
          ? "motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-[650ms] motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-1 motion-safe:hover:border-gold/25 motion-safe:hover:shadow-xl motion-safe:hover:shadow-gold/10"
          : "motion-safe:transition-opacity motion-safe:duration-500 motion-safe:ease-out"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div
          className={`flex shrink-0 flex-row items-center gap-4 border-b px-6 py-5 md:w-60 md:flex-col md:items-start md:justify-center md:border-b-0 md:border-r md:py-10 md:pl-8 md:pr-6 lg:w-64 ${dateStripClasses}`}
        >
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold leading-none md:text-3xl">{day.label}</span>
            <span
              className={`mt-3 text-base font-medium tabular-nums ${
                day.isPast ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              {day.shortDate}
            </span>
          </div>
        </div>

        <div className="flex min-h-[6rem] flex-1 flex-col justify-center px-5 py-4 md:min-h-[7rem] md:px-9 md:py-8">
          {day.events.map((event) => (
            <EventBlock key={event.id} event={event} isPastDay={day.isPast} dayKey={day.key} />
          ))}
        </div>
      </div>
    </div>
  );
}

export type WeeklyEventsProps = {
  days: WeekDay[];
  fetchError: string | null;
};

export function WeeklyEvents({ days, fetchError }: WeeklyEventsProps) {
  return (
    <section
      id="events"
      className="relative w-full overflow-hidden bg-background px-6 py-16 text-foreground sm:px-10 sm:py-20 md:py-24 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 right-[8%] h-80 w-80 rounded-full bg-gold/[0.14] blur-3xl motion-safe:animate-events-shimmer motion-reduce:animate-none motion-reduce:opacity-25" />
        <div className="absolute -bottom-28 left-0 h-72 w-[28rem] max-w-[90vw] rounded-full bg-white/[0.06] blur-3xl motion-safe:animate-events-shimmer motion-safe:[animation-delay:3.5s] motion-reduce:animate-none motion-reduce:opacity-20" />
      </div>

      <div className="relative mx-auto max-w-[1100px]">
        <ScrollReveal className="max-w-2xl">
          <h2 className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-[2.85rem]">
            This Week&apos;s Events
          </h2>
          <p className="mt-5 text-base leading-relaxed text-foreground/85 sm:text-lg">{SECTION_INTRO}</p>
        </ScrollReveal>

        {fetchError ? (
          <ScrollReveal
            className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-950"
            role="alert"
          >
            <p className="font-semibold text-background">Calendar couldn&apos;t load</p>
            <p className="mt-2 text-neutral-700">{fetchError}</p>
          </ScrollReveal>
        ) : null}

        <div className="mt-10 flex flex-col gap-5 md:mt-12 md:gap-7">
          {days
            .filter((day) => day.events.length > 0)
            .map((day) => (
              <ScrollReveal key={day.key}>
                <DayCard day={day} />
              </ScrollReveal>
            ))}
        </div>
      </div>
    </section>
  );
}
