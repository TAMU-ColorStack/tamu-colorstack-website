# Weekly Events Redesign

**Date:** 2026-04-17  
**Branch:** weekly-Event-Cards  

---

## Summary

Replace the horizontal `EventSlider` carousel with a vertical `WeeklyEvents` component that shows the current week (Monday–Sunday) as stacked day rows. Only events from the current week are fetched. Past days are grayed out with crossed-out event titles. Today is subtly highlighted. Empty days show a "No events" placeholder.

---

## Layout & Structure

- Section keeps the same white background, `max-w-[1400px]` container, padding, and serif/font styles as the existing `EventSlider`
- Heading: **"This Week's Events"** — serif bold, same style as current "Events Calendar" heading
- Drop the "Explore all" CTA and Google Calendar embed link entirely
- No horizontal scroll, no nav arrows, no dot indicators
- 7 stacked day rows (Mon–Sun), each a rounded rectangle card
- Each row has two zones:
  - **Left label** (~120px): weekday name (e.g. "Monday") + short date (e.g. "Apr 21")
  - **Right content area**: horizontally arranged event pills, or quiet "No events" text if empty

---

## Event Pills

- Each event is a small pill/chip: color dot + event title + time
- No images
- Color coding (consistent with existing themes):
  - General Meeting → rose
  - Website Development → sage
  - Leetrooms → sand
  - Intramural → slate
- Hovering a pill shows a small popover with location and "Add to calendar" link (reuses existing `buildGCalUrl` logic)

---

## Day States

| State | Background | Text | Event titles |
|---|---|---|---|
| Past day | `bg-neutral-100` | `text-neutral-400` | `line-through` |
| Today | White + gold left border (`border-l-4 border-gold`) + "Today" badge | Normal | Normal |
| Future day | White | Normal | Normal |
| Empty (any) | Same as state above | `text-neutral-400` "No events" | — |

---

## Data Layer

### Time window
Fetch only Mon–Sun of the current week (in `America/Chicago` timezone). `timeMin` = Monday 00:00:00, `timeMax` = Sunday 23:59:59.

### Return shape
`getUpcomingEvents` returns events grouped by ISO day index (0 = Monday … 6 = Sunday) as `WeekDay[]`:

```ts
type WeekDay = {
  date: Date;           // midnight local of this day
  label: string;        // "Monday", "Tuesday", etc.
  shortDate: string;    // "Apr 21"
  isPast: boolean;      // entire day is before today's date
  isToday: boolean;
  events: CalendarDisplayEvent[];
};
```

### `CalendarDisplayEvent` changes
- Add `isPast: boolean` — computed server-side (true if event's day < today's date in CT)
- All other fields unchanged

### Fetch paths
Both the iCal and Google Calendar API v3 paths are retained. Only the time window and grouping logic change.

---

## Components

| File | Change |
|---|---|
| `lib/calendar-types.ts` | Add `isPast: boolean` to `CalendarDisplayEvent`; add `WeekDay` type |
| `lib/calendar.ts` | Change time window to current week Mon–Sun; group events into `WeekDay[]`; compute `isPast` server-side |
| `components/sections/WeeklyEvents.tsx` | New client component — renders 7 day rows with pills, states, popover |
| `components/sections/Events.tsx` | Update to call new data shape and render `WeeklyEvents` |
| `components/sections/EventSlider.tsx` | Delete (replaced) |

---

## Out of Scope

- Calendar embed / full calendar view (deferred per Axe)
- Intramural events (calendar not set up yet)
- Any changes to other sections (Hero, Officers, etc.)
