# Weekly Events Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the 7 day-row cards in `WeeklyEvents` with themed colored backgrounds, circular event images, and description text below each event title.

**Architecture:** All changes are isolated to `colorstack/components/sections/WeeklyEvents.tsx`. A new `THEME_CARD` lookup maps `EventCardTheme` values to Tailwind bg/border classes. `DayRow` gains a circular image slot on the far right. `EventRow` gains a description paragraph below the title row.

**Tech Stack:** React, Tailwind CSS, TypeScript

---

## Files

- Modify: `colorstack/components/sections/WeeklyEvents.tsx`

---

### Task 1: Add themed card backgrounds to `DayRow`

**Files:**
- Modify: `colorstack/components/sections/WeeklyEvents.tsx`

- [ ] **Step 1: Add `THEME_CARD` lookup table**

Open `colorstack/components/sections/WeeklyEvents.tsx`. After the existing `EVENT_THEME` constant (line 5), add:

```tsx
const THEME_CARD: Record<EventCardTheme, { bg: string; border: string }> = {
  rose: { bg: "bg-rose-50", border: "border-rose-200" },
  sage: { bg: "bg-emerald-50", border: "border-emerald-200" },
  sand: { bg: "bg-amber-50", border: "border-amber-200" },
  slate: { bg: "bg-slate-50", border: "border-slate-200" },
};
```

- [ ] **Step 2: Update `DayRow` to derive background from first event's theme**

Replace the `DayRow` function (currently lines 73–113) with:

```tsx
function DayRow({ day }: { day: WeekDay }) {
  const firstEvent = day.events[0];
  const themeCard = firstEvent && !day.isPast ? THEME_CARD[firstEvent.theme] : null;

  const rowClass = [
    "flex overflow-hidden rounded-2xl border transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md",
    day.isPast
      ? "border-neutral-200 bg-neutral-100"
      : day.isToday
        ? "border-gold/30 bg-gold/[0.06] motion-safe:hover:shadow-gold/10"
        : themeCard
          ? `${themeCard.border} ${themeCard.bg}`
          : "border-neutral-100 bg-white",
  ].join(" ");

  return (
    <div className={rowClass}>
      <div
        className={`flex w-36 shrink-0 flex-col justify-center px-6 py-10 sm:w-44 ${
          day.isPast ? "text-neutral-400" : "text-neutral-900"
        }`}
      >
        <span className="text-base font-semibold">{day.label}</span>
        <span className={`mt-1 text-sm ${day.isPast ? "text-neutral-400" : "text-neutral-500"}`}>
          {day.shortDate}
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col justify-center divide-y border-l px-8 ${
          day.isPast ? "border-neutral-200 divide-neutral-200" : "border-neutral-100 divide-neutral-100"
        }`}
      >
        {day.events.length === 0 ? (
          <span className="py-10 text-base text-neutral-400">No events</span>
        ) : (
          day.events.map((event) => (
            <EventRow key={event.id} event={event} isPastDay={day.isPast} />
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify in browser**

The dev server should already be running at `http://localhost:3000`. Navigate to the `#events` section. Days with events should now show a soft colored background (rose-50, amber-50, emerald-50, or slate-50) matching their first event's theme. Past days should remain neutral gray. Empty days should remain white.

- [ ] **Step 4: Commit**

```bash
git add colorstack/components/sections/WeeklyEvents.tsx
git commit -m "feat: apply themed card backgrounds to WeeklyEvents day rows"
```

---

### Task 2: Add circular event image to `DayRow`

**Files:**
- Modify: `colorstack/components/sections/WeeklyEvents.tsx`

- [ ] **Step 1: Add image slot to `DayRow`**

Inside the `DayRow` return, add an image element as the last sibling inside the outer `<div className={rowClass}>`, after the events list `<div>`. The full updated `DayRow` return:

```tsx
  return (
    <div className={rowClass}>
      <div
        className={`flex w-36 shrink-0 flex-col justify-center px-6 py-10 sm:w-44 ${
          day.isPast ? "text-neutral-400" : "text-neutral-900"
        }`}
      >
        <span className="text-base font-semibold">{day.label}</span>
        <span className={`mt-1 text-sm ${day.isPast ? "text-neutral-400" : "text-neutral-500"}`}>
          {day.shortDate}
        </span>
      </div>

      <div
        className={`flex flex-1 flex-col justify-center divide-y border-l px-8 ${
          day.isPast ? "border-neutral-200 divide-neutral-200" : "border-neutral-100 divide-neutral-100"
        }`}
      >
        {day.events.length === 0 ? (
          <span className="py-10 text-base text-neutral-400">No events</span>
        ) : (
          day.events.map((event) => (
            <EventRow key={event.id} event={event} isPastDay={day.isPast} />
          ))
        )}
      </div>

      {firstEvent && !day.isPast && (
        <div className="flex shrink-0 items-center pr-6">
          <img
            src={firstEvent.image}
            alt=""
            aria-hidden
            className="h-[120px] w-[120px] rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
```

- [ ] **Step 2: Verify in browser**

Navigate to `#events`. Days with upcoming events should show a 120px circular image on the far right of the card. Past days and empty days should show no image.

- [ ] **Step 3: Commit**

```bash
git add colorstack/components/sections/WeeklyEvents.tsx
git commit -m "feat: add circular event image to WeeklyEvents day rows"
```

---

### Task 3: Add description text below event title in `EventRow`

**Files:**
- Modify: `colorstack/components/sections/WeeklyEvents.tsx`

- [ ] **Step 1: Update `EventRow` layout to include description**

Replace the `EventRow` function (currently lines 35–71) with:

```tsx
function EventRow({
  event,
  isPastDay,
}: {
  event: CalendarDisplayEvent;
  isPastDay: boolean;
}) {
  const t = EVENT_THEME[event.theme];
  return (
    <div className="group/row relative flex w-full flex-col gap-1 py-4">
      <div className="flex items-start justify-between gap-6">
        <span
          className={`text-2xl font-bold leading-snug ${
            isPastDay ? "line-through text-neutral-400" : t.title
          }`}
        >
          {event.title}
        </span>
        <div className="flex shrink-0 items-center gap-3 pt-1">
          <span className={`text-base ${isPastDay ? "text-neutral-400" : "text-neutral-500"}`}>
            {event.time}
          </span>
          {!isPastDay && (
            <a
              href={buildGCalUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-background focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              aria-label={`Add ${event.title} to calendar`}
            >
              <CalendarPlusIcon className="shrink-0" />
              Add
            </a>
          )}
        </div>
      </div>
      {event.description && (
        <p
          className={`line-clamp-2 text-sm leading-relaxed ${
            isPastDay ? "text-neutral-400" : "text-neutral-600"
          }`}
        >
          {event.description}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `#events`. Each event row should show the title + time on the first line, with a 2-line-clamped description paragraph below. Events without a description should show only the title row (no empty gap). Past events should show the description in muted gray, not strikethrough.

- [ ] **Step 3: Commit**

```bash
git add colorstack/components/sections/WeeklyEvents.tsx
git commit -m "feat: show event description below title in WeeklyEvents"
```
