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
