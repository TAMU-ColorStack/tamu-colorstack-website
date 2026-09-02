import "server-only";

import ICAL from "ical.js";

import type { CalendarDisplayEvent, EventCardTheme, WeekDay } from "@/lib/calendar-types";

export type { CalendarDisplayEvent, EventCardTheme, WeekDay } from "@/lib/calendar-types";

/** Public group calendar ID (same as embed `src`); override with GOOGLE_CALENDAR_ID. */
const DEFAULT_CALENDAR_ID =
  "aa9a103be92a0cedc650df8f8a8931357f3c988b0d8faf7120d3cc17b6f37eeb@group.calendar.google.com";

const DISPLAY_TIMEZONE = "America/Chicago";

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

const EVENT_IMAGES = {
  webdev: "/event-images/webdev.png",
  generalMeeting: "/event-images/general-meeting.jpg",
  leetrooms: "/event-images/leetrooms.png",
  default: "/event-images/default.png",
} as const;

const THEMES: readonly EventCardTheme[] = ["rose", "slate", "sand", "sage"];
const MOCK_REC_GAME_DAY_KEY = "2026-04-15";
const MOCK_REC_GAME_START_ISO = "2026-04-15T22:00:00-05:00";
const LINCOLN_REC_QUERY = "Lincoln Recreation Center, College Station, TX";

function resolveEventImage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("website development")) return EVENT_IMAGES.webdev;
  if (t.includes("general meeting")) return EVENT_IMAGES.generalMeeting;
  if (t.includes("leetrooms")) return EVENT_IMAGES.leetrooms;
  return EVENT_IMAGES.default;
}

type GCalEvent = {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { date?: string; dateTime?: string; timeZone?: string };
};

type GCalListResponse = {
  items?: GCalEvent[];
  error?: { code?: number; message?: string };
};

function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID?.trim() || DEFAULT_CALENDAR_ID;
}

export function getCalendarEmbedUrl(): string {
  const id = encodeURIComponent(getCalendarId());
  return `https://calendar.google.com/calendar/embed?src=${id}&ctz=America%2FChicago`;
}

function getDefaultPublicIcalUrl(): string {
  const id = encodeURIComponent(getCalendarId());
  return `https://calendar.google.com/calendar/ical/${id}/public/basic.ics`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: DISPLAY_TIMEZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTime(date: Date): string {
  return (
    new Intl.DateTimeFormat("en-US", {
      timeZone: DISPLAY_TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
    }).format(date) + " CT"
  );
}

const MAP_QUERY_BASE = "https://www.google.com/maps/search/?api=1&query=";
const ZACH_QUERY = "Zachry Engineering Education Complex, College Station, TX";
const RICH_214_QUERY = "RICH 214, College Station, TX";

function mapQueryUrl(query: string): string {
  return `${MAP_QUERY_BASE}${encodeURIComponent(query)}`;
}

function resolveLocationData(title: string, location: string | undefined): { label: string; mapUrl?: string } {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes("website development")) {
    return { label: "ZACH", mapUrl: mapQueryUrl(ZACH_QUERY) };
  }
  if (normalizedTitle.includes("general meeting")) {
    return { label: "RICH 214", mapUrl: mapQueryUrl(RICH_214_QUERY) };
  }
  if (normalizedTitle.includes("leetrooms")) {
    return { label: "ZACH", mapUrl: mapQueryUrl(ZACH_QUERY) };
  }
  if (normalizedTitle.includes("intramural") || normalizedTitle.includes("rec game")) {
    return { label: "Lincoln Rec Center", mapUrl: mapQueryUrl(LINCOLN_REC_QUERY) };
  }

  const loc = location?.trim();
  if (loc) {
    const short = loc.split(",")[0]?.trim() ?? loc;
    return {
      label: short.length > 36 ? `${short.slice(0, 33)}…` : short,
      mapUrl: mapQueryUrl(loc),
    };
  }
  return { label: "Club event" };
}

function startToDisplayFromApi(event: GCalEvent): { day: string; time: string } | null {
  const start = event.start;
  if (!start) return null;

  if (start.date) {
    const [y, m, d] = start.date.split("-").map(Number);
    const localMidnight = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    return { day: formatDay(localMidnight), time: "All day" };
  }

  if (start.dateTime) {
    const date = new Date(start.dateTime);
    if (Number.isNaN(date.getTime())) return null;
    return { day: formatDay(date), time: formatTime(date) };
  }

  return null;
}

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
    description: description.length > 420 ? `${description.slice(0, 417)}…` : description,
    location: locationData.label,
    mapUrl: locationData.mapUrl,
    theme: THEMES[index % THEMES.length] ?? "rose",
    image: resolveEventImage(title),
    htmlLink: item.htmlLink,
    startISO: item.start?.dateTime ?? item.start?.date,
    isPast: eventKey < todayKey,
  };
}

type Occurrence = {
  start: Date;
  isFullDay: boolean;
  event: ICAL.Event;
};

function eventUrl(ev: ICAL.Event): string | undefined {
  const raw = ev.component.getFirstPropertyValue("url");
  if (typeof raw === "string" && raw.startsWith("http")) return raw;
  return undefined;
}

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
    description: description.length > 420 ? `${description.slice(0, 417)}…` : description,
    location: locationData.label,
    mapUrl: locationData.mapUrl,
    theme: THEMES[index % THEMES.length] ?? "rose",
    image: resolveEventImage(title),
    htmlLink,
    startISO: occ.start.toISOString(),
    isPast: eventKey < todayKey,
  };
}

function buildMockRecGameEvent(dayKeyForMock: string, todayKey: string): CalendarDisplayEvent {
  const start = new Date(MOCK_REC_GAME_START_ISO);
  return {
    id: "mock-rec-game-wed-10pm",
    title: "Intramural Rec Basketball Game",
    day: formatDay(start),
    time: "10:00 PM CT",
    description:
      "Mock event: late-night intramural run at Lincoln Recreation Center. Bring athletic shoes and a water bottle.",
    location: "Lincoln Rec Center",
    mapUrl: mapQueryUrl(LINCOLN_REC_QUERY),
    theme: "sage",
    image: EVENT_IMAGES.default,
    startISO: MOCK_REC_GAME_START_ISO,
    isPast: dayKeyForMock < todayKey,
  };
}

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

  // One-time mock event for UI preview only (do not repeat in future weeks).
  if (weekKeys.includes(MOCK_REC_GAME_DAY_KEY)) {
    const mock = buildMockRecGameEvent(MOCK_REC_GAME_DAY_KEY, todayKey);
    const list = eventsByDay.get(MOCK_REC_GAME_DAY_KEY) ?? [];
    if (!list.some((event) => event.id === mock.id)) {
      list.push(mock);
      eventsByDay.set(MOCK_REC_GAME_DAY_KEY, list);
    }
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
