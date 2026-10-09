# Weekly Events Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the horizontal EventSlider carousel with a vertical 7-day weekly view that shows Mon–Sun of the current week, grays out past days with strikethrough event titles, and highlights today.

**Architecture:** The data layer (`calendar.ts`) computes the current week's Mon–Sun bounds, fetches/filters events to that window, and groups them into a `WeekDay[]` array with `isPast`/`isToday` computed server-side. A new `WeeklyEvents` client component renders the 7 stacked day rows with event pills and CSS-only hover popovers.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind CSS v4, ical.js, TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/calendar-types.ts` | Modify | Add `isPast` to `CalendarDisplayEvent`; add `WeekDay` type |
| `lib/calendar.ts` | Modify | `dayKey`, `getWeekDayKeys`, `buildWeekDays` helpers; update fetch functions to filter by week; change return type of `getUpcomingEvents` |
| `components/sections/WeeklyEvents.tsx` | Create | Renders 7 day rows with event pills, hover popovers, past/today/future states |
| `components/sections/Events.tsx` | Modify | Use `WeeklyEvents` and pass `days` instead of `events` |
| `components/sections/EventSlider.tsx` | Delete | Replaced by `WeeklyEvents` |

---

## Task 1: Update types

**Files:**
- Modify: `lib/calendar-types.ts`

- [ ] **Step 1: Replace the contents of `lib/calendar-types.ts`**

```ts
export type EventCardTheme = "rose" | "slate" | "sand" | "sage";

export type CalendarDisplayEvent = {
  id: string;
  title: string;
  day: string;
  time: string;
  description: string;
  location: string;
  mapUrl?: string;
  theme: EventCardTheme;
  image: string;
  htmlLink?: string;
  startISO?: string;
  isPast: boolean;
};

export type WeekDay = {
  key: string;        // YYYY-MM-DD in America/Chicago
  label: string;      // "Monday"
  shortDate: string;  // "Apr 21"
  isPast: boolean;
  isToday: boolean;
  events: CalendarDisplayEvent[];
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/calendar-types.ts
git commit -m "feat: add isPast to CalendarDisplayEvent and WeekDay type"
```

---

## Task 2: Refactor the calendar data layer

**Files:**
- Modify: `lib/calendar.ts`

This is the largest change. We replace the single-function approach with a pipeline:
1. `dayKey()` — maps any UTC Date → YYYY-MM-DD string in CT
2. `getWeekDayKeys()` — returns the 7 day-key strings for Mon–Sun of the current week
3. Updated `mapApiEvent` / `mapIcalOccurrence` — filter by week and compute `isPast`
4. `buildWeekDays()` — groups a flat `CalendarDisplayEvent[]` into `WeekDay[]`
5. `getUpcomingEvents()` — new return type `{ days: WeekDay[]; error: string | null }`

- [ ] **Step 1: Add `dayKey` and `getWeekDayKeys` helpers**

Add these two functions directly after the `DISPLAY_TIMEZONE` constant (line 14 of the current file):

```ts
function dayKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function getWeekDayKeys(now: Date): string[] {
  const dowStr = new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TIMEZONE,
    weekday: "short",
  }).format(now);
  const DOW_INDEX: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const dow = DOW_INDEX[dowStr] ?? 0;
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + (i - daysFromMonday) * 86400000);
    return dayKey(d);
  });
}
```

- [ ] **Step 2: Add `buildWeekDays` helper**

Add this function just before `getUpcomingEventsFromIcal`:

```ts
function buildWeekDays(events: CalendarDisplayEvent[], now: Date): WeekDay[] {
  const todayKey = dayKey(now);
  const weekKeys = getWeekDayKeys(now);

  const eventsByDay = new Map<string, CalendarDisplayEvent[]>();
  for (const event of events) {
    if (!event.startISO) continue;
    const k = dayKey(new Date(event.startISO));
    if (!eventsByDay.has(k)) eventsByDay.set(k, []);
    eventsByDay.get(k)!.push(event);
  }

  return weekKeys.map((k) => {
    const [year, month, day] = k.split("-").map(Number);
    const noon = new Date(Date.UTC(year!, month! - 1, day!, 12, 0, 0));
    return {
      key: k,
      label: new Intl.DateTimeFormat("en-US", {
        timeZone: DISPLAY_TIMEZONE,
        weekday: "long",
      }).format(noon),
      shortDate: new Intl.DateTimeFormat("en-US", {
        timeZone: DISPLAY_TIMEZONE,
        month: "short",
        day: "numeric",
      }).format(noon),
      isPast: k < todayKey,
      isToday: k === todayKey,
      events: (eventsByDay.get(k) ?? []).sort((a, b) => {
        if (!a.startISO || !b.startISO) return 0;
        return new Date(a.startISO).getTime() - new Date(b.startISO).getTime();
      }),
    };
  });
}
```

- [ ] **Step 3: Update `mapApiEvent` signature and body**

Replace the existing `mapApiEvent` function with:

```ts
function mapApiEvent(
  item: GCalEvent,
  index: number,
  todayKey: string,
  weekKeySet: Set<string>,
): CalendarDisplayEvent | null {
  if (!item.id || item.status === "cancelled") return null;
  const title = item.summary?.trim() || "Untitled event";
  const startISO = item.start?.dateTime ?? item.start?.date;
  if (!startISO) return null;

  const startDate = new Date(
    startISO.includes("T") ? startISO : `${startISO}T12:00:00Z`,
  );
  const eventKey = dayKey(startDate);
  if (!weekKeySet.has(eventKey)) return null;

  const when = startToDisplayFromApi(item);
  if (!when) return null;

  const rawDesc = item.description?.trim();
  const description = rawDesc ? stripHtml(rawDesc) : "";
  const locationData = resolveLocationData(title, item.location);

  return {
    id: item.id,
    title,
    day: when.day,
    time: when.time,
    description: description.length > 280 ? `${description.slice(0, 277)}…` : description,
    location: locationData.label,
    mapUrl: locationData.mapUrl,
    theme: THEMES[index % THEMES.length] ?? "rose",
    image: resolveEventImage(title),
    htmlLink: item.htmlLink,
    startISO: item.start?.dateTime ?? item.start?.date,
    isPast: eventKey < todayKey,
  };
}
```

- [ ] **Step 4: Update `mapIcalOccurrence` signature and body**

Replace the existing `mapIcalOccurrence` function with:

```ts
function mapIcalOccurrence(
  occ: Occurrence,
  index: number,
  todayKey: string,
): CalendarDisplayEvent {
  const ev = occ.event;
  const title = (ev.summary || "").trim() || "Untitled event";
  const day = formatDay(occ.start);
  const time = occ.isFullDay ? "All day" : formatTime(occ.start);

  const rawDesc = (ev.description || "").trim();
  const description = rawDesc ? stripHtml(rawDesc) : "";
  const locationData = resolveLocationData(title, ev.location);

  const htmlLink = eventUrl(ev);
  const id = `${ev.uid}-${occ.start.toISOString()}`;
  const eventKey = dayKey(occ.start);

  return {
    id,
    title,
    day,
    time,
    description: description.length > 280 ? `${description.slice(0, 277)}…` : description,
    location: locationData.label,
    mapUrl: locationData.mapUrl,
    theme: THEMES[index % THEMES.length] ?? "rose",
    image: resolveEventImage(title),
    htmlLink,
    startISO: occ.start.toISOString(),
    isPast: eventKey < todayKey,
  };
}
```

- [ ] **Step 5: Update `collectIcalOccurrences` to filter by week**

Replace the existing `collectIcalOccurrences` function with:

```ts
function collectIcalOccurrences(
  icsText: string,
  weekKeySet: Set<string>,
): Occurrence[] {
  const jcal = ICAL.parse(icsText);
  const root = new ICAL.Component(jcal);
  const vevents = root.getAllSubcomponents("vevent");
  const out: Occurrence[] = [];

  const windowStart = new Date(Date.now() - 8 * 86400000);
  const windowEnd = new Date(Date.now() + 8 * 86400000);

  for (const ve of vevents) {
    const ev = new ICAL.Event(ve);
    if (ev.isRecurrenceException()) continue;

    const status = ve.getFirstPropertyValue("status");
    if (status === "CANCELLED") continue;

    if (ev.isRecurring()) {
      const iter = ev.iterator();
      let guard = 0;
      while (guard++ < 400) {
        const time = iter.next();
        if (iter.complete || !time) break;
        const start = time.toJSDate();
        if (start.getTime() < windowStart.getTime()) continue;
        if (start.getTime() > windowEnd.getTime()) break;
        if (!weekKeySet.has(dayKey(start))) continue;
        out.push({ start, isFullDay: Boolean(time.isDate), event: ev });
      }
    } else {
      const start = ev.startDate.toJSDate();
      if (Number.isNaN(start.getTime())) continue;
      if (
        start.getTime() < windowStart.getTime() ||
        start.getTime() > windowEnd.getTime()
      )
        continue;
      if (!weekKeySet.has(dayKey(start))) continue;
      out.push({ start, isFullDay: Boolean(ev.startDate.isDate), event: ev });
    }
  }

  return out;
}
```

- [ ] **Step 6: Update `getUpcomingEventsFromIcal`**

Replace with:

```ts
async function getUpcomingEventsFromIcal(
  feedUrl: string,
  weekKeySet: Set<string>,
  todayKey: string,
): Promise<{ events: CalendarDisplayEvent[]; error: string | null }> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 300 } });
    if (!res.ok) {
      return {
        events: [],
        error: `Could not load calendar feed (${res.status}). If the calendar is private, add ICAL_FEED_URL (secret iCal link) or use GOOGLE_CALENDAR_API_KEY.`,
      };
    }
    const text = await res.text();
    const occurrences = collectIcalOccurrences(text, weekKeySet);
    occurrences.sort((a, b) => a.start.getTime() - b.start.getTime());
    const events = occurrences.map((occ, i) => mapIcalOccurrence(occ, i, todayKey));
    return { events, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { events: [], error: `Calendar feed failed: ${message}` };
  }
}
```

- [ ] **Step 7: Update `getUpcomingEventsFromApi`**

Replace with:

```ts
async function getUpcomingEventsFromApi(
  weekKeySet: Set<string>,
  todayKey: string,
): Promise<{ events: CalendarDisplayEvent[]; error: string | null }> {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY?.trim();
  if (!apiKey) return { events: [], error: "Missing API key" };

  const calendarId = encodeURIComponent(getCalendarId());
  const timeMin = new Date(Date.now() - 7 * 86400000).toISOString();
  const timeMax = new Date(Date.now() + 7 * 86400000).toISOString();

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("timeMin", timeMin);
  url.searchParams.set("timeMax", timeMax);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("maxResults", "50");

  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  const data = (await res.json()) as GCalListResponse;

  if (!res.ok) {
    const msg = data.error?.message ?? res.statusText;
    return { events: [], error: `Could not load calendar (${res.status}): ${msg}` };
  }

  const items = data.items ?? [];
  const events: CalendarDisplayEvent[] = [];
  let i = 0;
  for (const item of items) {
    const mapped = mapApiEvent(item, i, todayKey, weekKeySet);
    if (mapped) {
      events.push(mapped);
      i++;
    }
  }
  return { events, error: null };
}
```

- [ ] **Step 8: Replace `getUpcomingEvents` with updated signature**

Replace the entire exported `getUpcomingEvents` function with:

```ts
export async function getUpcomingEvents(): Promise<{
  days: WeekDay[];
  error: string | null;
}> {
  const now = new Date();
  const todayKey = dayKey(now);
  const weekKeys = getWeekDayKeys(now);
  const weekKeySet = new Set(weekKeys);

  let result: { events: CalendarDisplayEvent[]; error: string | null };

  const customIcal = process.env.ICAL_FEED_URL?.trim();
  if (customIcal) {
    result = await getUpcomingEventsFromIcal(customIcal, weekKeySet, todayKey);
  } else if (process.env.GOOGLE_CALENDAR_API_KEY?.trim()) {
    try {
      result = await getUpcomingEventsFromApi(weekKeySet, todayKey);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      result = { events: [], error: `Calendar API request failed: ${message}` };
    }
  } else {
    const publicIcal = getDefaultPublicIcalUrl();
    result = await getUpcomingEventsFromIcal(publicIcal, weekKeySet, todayKey);
    if (result.error && result.events.length === 0) {
      result = {
        events: [],
        error: `${result.error} You can set ICAL_FEED_URL to your calendar's "secret address in iCal format", or set GOOGLE_CALENDAR_API_KEY for the Calendar API.`,
      };
    }
  }

  return { days: buildWeekDays(result.events, now), error: result.error };
}
```

Also add `WeekDay` to the re-export at line 7:

```ts
export type { CalendarDisplayEvent, EventCardTheme, WeekDay } from "@/lib/calendar-types";
```

- [ ] **Step 9: Verify TypeScript compiles**

```bash
cd colorstack && npx tsc --noEmit
```

Expected: no errors. If there are errors, they'll be about mismatched types — fix before committing.

- [ ] **Step 10: Commit**

```bash
git add colorstack/lib/calendar.ts
git commit -m "feat: refactor calendar to return current week grouped by day"
```

---

## Task 3: Create WeeklyEvents component

**Files:**
- Create: `colorstack/components/sections/WeeklyEvents.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
"use client";

import type { WeekDay, CalendarDisplayEvent, EventCardTheme } from "@/lib/calendar-types";

const PILL_THEME: Record<EventCardTheme, { dot: string; bg: string; text: string }> = {
  rose: { dot: "bg-rose-400", bg: "bg-rose-50", text: "text-rose-900" },
  sage: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-900" },
  sand: { dot: "bg-amber-400", bg: "bg-amber-50", text: "text-amber-900" },
  slate: { dot: "bg-slate-400", bg: "bg-slate-100", text: "text-slate-800" },
};

function CalendarPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 14v4M10 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function buildGCalUrl(event: CalendarDisplayEvent): string {
  const params = new URLSearchParams({ action: "TEMPLATE", text: event.title });
  if (event.startISO) {
    const start = new Date(event.startISO);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    params.set("dates", `${fmt(start)}/${fmt(end)}`);
  }
  if (event.description) params.set("details", event.description);
  if (event.location) params.set("location", event.location);
  return `https://calendar.google.com/calendar/render?${params}`;
}

function EventPill({
  event,
  isPastDay,
}: {
  event: CalendarDisplayEvent;
  isPastDay: boolean;
}) {
  const t = PILL_THEME[event.theme];
  return (
    <div className="group/pill relative">
      <div
        className={`inline-flex cursor-default select-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
          isPastDay ? "bg-neutral-200 text-neutral-400" : `${t.bg} ${t.text}`
        }`}
      >
        {!isPastDay && <span className={`h-2 w-2 shrink-0 rounded-full ${t.dot}`} />}
        <span className={isPastDay ? "line-through" : ""}>{event.title}</span>
        <span className="text-xs opacity-70">{event.time}</span>
      </div>
      <div
        className="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-20 w-52 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs opacity-0 shadow-lg transition-opacity duration-150 group-hover/pill:pointer-events-auto group-hover/pill:opacity-100"
        role="tooltip"
      >
        <p className="font-semibold text-neutral-900">{event.location}</p>
        <a
          href={buildGCalUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 font-semibold text-background hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <CalendarPlusIcon className="shrink-0" />
          Add to calendar
        </a>
      </div>
    </div>
  );
}

function DayRow({ day }: { day: WeekDay }) {
  const rowClass = [
    "flex overflow-hidden rounded-2xl border",
    day.isPast
      ? "border-neutral-200 bg-neutral-100"
      : day.isToday
        ? "border-neutral-100 bg-white border-l-4 border-l-gold"
        : "border-neutral-100 bg-white",
  ].join(" ");

  return (
    <div className={rowClass}>
      <div
        className={`flex w-28 shrink-0 flex-col justify-center px-4 py-4 sm:w-36 ${
          day.isPast ? "text-neutral-400" : "text-neutral-900"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-semibold">{day.label}</span>
          {day.isToday && (
            <span className="rounded-full bg-gold px-1.5 py-0.5 text-xs font-semibold text-background">
              Today
            </span>
          )}
        </div>
        <span
          className={`mt-0.5 text-xs ${day.isPast ? "text-neutral-400" : "text-neutral-500"}`}
        >
          {day.shortDate}
        </span>
      </div>

      <div
        className={`flex flex-1 flex-wrap items-center gap-2 border-l px-4 py-4 ${
          day.isPast ? "border-neutral-200" : "border-neutral-100"
        }`}
      >
        {day.events.length === 0 ? (
          <span className="text-sm text-neutral-400">No events</span>
        ) : (
          day.events.map((event) => (
            <EventPill key={event.id} event={event} isPastDay={day.isPast} />
          ))
        )}
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
      className="relative w-full overflow-hidden bg-white px-6 py-16 text-neutral-900 sm:px-10 sm:py-20 md:py-24 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 right-[10%] h-72 w-72 rounded-full bg-gold/15 blur-3xl motion-safe:animate-events-shimmer motion-reduce:animate-none motion-reduce:opacity-30" />
        <div className="absolute -bottom-24 left-[5%] h-80 w-80 rounded-full bg-background/[0.06] blur-3xl motion-safe:animate-events-shimmer motion-safe:[animation-delay:3s] motion-reduce:animate-none motion-reduce:opacity-25" />
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <h2 className="font-serif text-4xl font-bold leading-[1.1] tracking-tight text-background motion-safe:animate-events-header-in motion-reduce:animate-none motion-reduce:opacity-100 sm:text-5xl md:text-[2.75rem]">
          This Week&apos;s Events
        </h2>
        <p className="mt-5 text-base leading-relaxed text-neutral-700 motion-safe:animate-events-header-in motion-safe:[animation-delay:120ms] motion-safe:[animation-fill-mode:both] motion-reduce:animate-none motion-reduce:opacity-100 sm:text-lg">
          Join our community for workshops, hands-on sessions, and networking
          events designed to build your skills and connections in tech.
        </p>

        {fetchError ? (
          <div
            className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm text-amber-950"
            role="alert"
          >
            <p className="font-semibold text-background">
              Calendar couldn&apos;t load
            </p>
            <p className="mt-2 text-neutral-700">{fetchError}</p>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3">
          {days.map((day, index) => (
            <div
              key={day.key}
              style={{ animationDelay: `${120 + index * 50}ms` }}
              className="motion-safe:animate-events-card-in motion-safe:[animation-fill-mode:both] motion-reduce:animate-none motion-reduce:opacity-100"
            >
              <DayRow day={day} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd colorstack && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add colorstack/components/sections/WeeklyEvents.tsx
git commit -m "feat: add WeeklyEvents component with 7-day rows and event pills"
```

---

## Task 4: Wire up Events.tsx

**Files:**
- Modify: `colorstack/components/sections/Events.tsx`

- [ ] **Step 1: Replace the contents of `Events.tsx`**

```tsx
import { WeeklyEvents } from "@/components/sections/WeeklyEvents";
import { getUpcomingEvents } from "@/lib/calendar";

export default async function Events() {
  const { days, error } = await getUpcomingEvents();
  return <WeeklyEvents days={days} fetchError={error} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd colorstack && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add colorstack/components/sections/Events.tsx
git commit -m "feat: wire Events to WeeklyEvents component"
```

---

## Task 5: Delete EventSlider

**Files:**
- Delete: `colorstack/components/sections/EventSlider.tsx`

- [ ] **Step 1: Delete the file**

```bash
rm colorstack/components/sections/EventSlider.tsx
```

- [ ] **Step 2: Confirm no remaining imports**

```bash
grep -r "EventSlider" colorstack/components colorstack/app colorstack/lib
```

Expected: no output.

- [ ] **Step 3: Final TypeScript check**

```bash
cd colorstack && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove EventSlider replaced by WeeklyEvents"
```

---

## Self-Review Notes

- All 5 spec requirements covered: 7-day layout, past-day grayout, strikethrough, today highlight, no "Explore all" link
- `WeekDay.key` used consistently across `calendar.ts` and `WeeklyEvents.tsx` — no name drift
- `isPast` computed server-side in both `mapApiEvent` and `mapIcalOccurrence` using the same `dayKey < todayKey` comparison
- `buildWeekDays` produces exactly 7 entries regardless of event count
- No `Date` objects in `WeekDay` — safe to pass from RSC to client component
- No test framework exists in this project — TDD steps omitted
