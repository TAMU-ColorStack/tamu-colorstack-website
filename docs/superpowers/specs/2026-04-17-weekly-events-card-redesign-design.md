# Weekly Events Card Redesign — Design Spec

**Date:** 2026-04-17  
**Branch:** weekly-Event-Cards  
**File:** `colorstack/components/sections/WeeklyEvents.tsx`

## Goal

Restyle the 7-day-row cards in the `WeeklyEvents` section to be more visually rich — inspired by a reference design showing colored card backgrounds, circular event images, and description text — while keeping the existing 7-day-row structure intact.

## What Changes

### DayRow — Card background & border

- Days **with events**: card background and border use a soft tint derived from the first event's `theme`:
  - `rose` → `bg-rose-50 border-rose-200`
  - `sand` → `bg-amber-50 border-amber-200`
  - `sage` → `bg-emerald-50 border-emerald-200`
  - `slate` → `bg-slate-50 border-slate-200`
- Days that are **today**: keep existing `bg-gold/[0.06] border-gold/30` treatment (takes precedence over theme tint)
- Days that are **past**: keep existing `bg-neutral-100 border-neutral-200` (no theme tint)
- Days with **no events**: keep white card, no theme color applied

### DayRow — Circular event image

- Shown only on days with events that are not past
- Renders the first event's `image` field as a circle, ~120px diameter (`w-[120px] h-[120px]`)
- Positioned on the far right of the card, vertically centered, with `object-cover rounded-full`
- Separated from the event content by a small gap; sits inside the card's right padding area
- Not shown on past days or empty days

### EventRow — Description text

- Add a `<p>` below the title with `line-clamp-2` and `text-sm text-neutral-600` (or muted on past days)
- Only rendered when `event.description` is non-empty
- Does not affect the time/add-to-calendar row (remains right-aligned at the top of the row)

### EventRow — Layout adjustment

Current layout: title and time on one horizontal row.  
New layout:
```
[Title (large bold)]          [Time]  [Add btn]
[Description (line-clamp-2)]
```
Title + time remain on the same row. Description sits below spanning full width.

### Left day column

- No structural change — day label and date stay in the left column
- Text color already adapts via `isPast` — no additional changes needed

### Empty days

- No visual change — slim white card, "No events" text, no image, no color

## What Does NOT Change

- 7-day-row structure (`WeekDay[]` → `DayRow` → `EventRow`)
- Hover lift + shadow animation
- "Add to Google Calendar" button behavior and visibility
- Past day strikethrough + muted text treatment
- Section header, description paragraph, background shimmer blobs
- Data model (`CalendarDisplayEvent`, `WeekDay`, `calendar.ts`)

## Implementation Scope

All changes are isolated to `WeeklyEvents.tsx`. No other files need to change.

1. Update `DayRow` to derive a background/border class from `day.events[0]?.theme` (when applicable)
2. Add circular `<img>` to `DayRow` right side, conditional on events present and not past
3. Update `EventRow` to render description below title with `line-clamp-2`
4. Adjust `EventRow` internal layout to accommodate description row

## Out of Scope

- Changing the data fetching layer (`calendar.ts`)
- Changing which image appears (first event's image is used as-is)
- Adding hover effects to the image
- Per-event images when multiple events exist in a day
