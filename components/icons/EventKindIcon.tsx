type EventIconKind = "code" | "computer" | "people" | "basketball" | "volleyball";

function eventIconKind(title: string): EventIconKind {
  const t = title.toLowerCase();
  if (t.includes("leetrooms") || t.includes("leetcode") || t.includes("leet room")) {
    return "code";
  }
  if (t.includes("volleyball")) {
    return "volleyball";
  }
  if (t.includes("basketball") || t.includes("intramural") || t.includes("rec game")) {
    return "basketball";
  }
  if (t.includes("website development") || t.includes("web dev") || t.includes("web development")) {
    return "computer";
  }
  if (
    t.includes("general meeting") ||
    t.includes("chapter meeting") ||
    t.includes("all-hands") ||
    t.includes("town hall") ||
    (t.includes("meeting") && !t.includes("leet"))
  ) {
    return "people";
  }
  return "computer";
}

function iconLabel(kind: EventIconKind): string {
  switch (kind) {
    case "code":
      return "LeetRooms or coding session";
    case "computer":
      return "Web development or technical session";
    case "people":
      return "Meeting or community gathering";
    case "basketball":
      return "Intramural basketball game";
    case "volleyball":
      return "Intramural volleyball game";
    default:
      return "Event";
  }
}

const iconClass = "h-full w-full";

function SvgCode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SvgComputer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 18C21.1 18 21.99 17.1 21.99 16L22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SvgPeople({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SvgBasketball({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17.0898 11H21.9498C21.7898 9.38998 21.2398 7.88998 20.4098 6.59998C18.6798 7.42998 17.4198 9.04998 17.0898 11Z"
        fill="currentColor"
      />
      <path
        d="M6.9098 11C6.5798 9.04998 5.3198 7.42998 3.5898 6.59998C2.7598 7.88998 2.2098 9.38998 2.0498 11H6.9098Z"
        fill="currentColor"
      />
      <path
        d="M15.07 11C15.39 8.40999 16.95 6.20999 19.13 4.99999C17.53 3.36999 15.39 2.28999 13 2.04999V11H15.07Z"
        fill="currentColor"
      />
      <path
        d="M8.92963 11H10.9996V2.04999C8.60963 2.28999 6.45963 3.36999 4.86963 4.99999C7.04963 6.20999 8.60963 8.40999 8.92963 11Z"
        fill="currentColor"
      />
      <path
        d="M15.07 13H13V21.95C15.39 21.71 17.54 20.63 19.13 19C16.95 17.79 15.39 15.59 15.07 13Z"
        fill="currentColor"
      />
      <path
        d="M3.5898 17.4C5.3098 16.57 6.5798 14.94 6.9098 13H2.0498C2.2098 14.61 2.7598 16.11 3.5898 17.4Z"
        fill="currentColor"
      />
      <path
        d="M17.0898 13C17.4198 14.95 18.6798 16.57 20.4098 17.4C21.2398 16.11 21.7898 14.61 21.9498 13H17.0898Z"
        fill="currentColor"
      />
      <path
        d="M8.92963 13C8.60963 15.59 7.04963 17.79 4.86963 19C6.46963 20.63 8.60963 21.71 10.9996 21.95V13H8.92963Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SvgVolleyball({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4.01001C3.58 5.84001 2 8.73001 2 12C2 13.46 2.32 14.85 2.89 16.11L6 14.31V4.01001Z"
        fill="currentColor"
      />
      <path
        d="M11 11.42V2.04999C9.94 2.15999 8.93 2.42999 8 2.83999V13.16L11 11.42Z"
        fill="currentColor"
      />
      <path
        d="M12.0001 13.15L3.89014 17.83C4.50014 18.67 5.23014 19.42 6.07014 20.03L15.0001 14.89L12.0001 13.15Z"
        fill="currentColor"
      />
      <path
        d="M13 7.95996V11.42L21.11 16.1C21.53 15.17 21.81 14.17 21.93 13.12L13 7.95996Z"
        fill="currentColor"
      />
      <path
        d="M8.06982 21.2C9.27982 21.71 10.5998 22 11.9998 22C15.3398 22 18.2898 20.35 20.1098 17.84L16.9998 16.04L8.06982 21.2Z"
        fill="currentColor"
      />
      <path
        d="M21.92 10.81C21.37 6.17999 17.66 2.50999 13 2.04999V5.64999L21.92 10.81Z"
        fill="currentColor"
      />
    </svg>
  );
}

export type EventKindIconProps = {
  title: string;
  muted?: boolean;
  /** When true, the calendar day is over—no hover pop on the day strip. */
  isPastDay?: boolean;
  className?: string;
};

export function EventKindIcon({ title, muted, isPastDay = false, className = "" }: EventKindIconProps) {
  const kind = eventIconKind(title);
  const hoverFromDay = !isPastDay;

  const wrap = [
    "flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14 md:h-16 md:w-16",
    "origin-center -rotate-[5deg]",
    hoverFromDay
      ? [
          "motion-safe:drop-shadow-sm motion-safe:group-hover/day:drop-shadow-md",
          "motion-safe:transition-[transform,filter] motion-safe:duration-[600ms] motion-safe:ease-[cubic-bezier(0.25,0.1,0.28,1)]",
          "motion-safe:group-hover/day:scale-[1.1] motion-safe:group-hover/day:-rotate-[3deg]",
          "motion-reduce:transition-none motion-reduce:group-hover/day:scale-100 motion-reduce:group-hover/day:-rotate-[5deg]",
          muted
            ? "text-neutral-400 group-hover/day:text-neutral-500"
            : "text-neutral-600 group-hover/day:text-background/85",
        ].join(" ")
      : [muted ? "text-neutral-400" : "text-neutral-600"].join(" "),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (() => {
    switch (kind) {
      case "code":
        return <SvgCode className={iconClass} />;
      case "basketball":
        return <SvgBasketball className={iconClass} />;
      case "volleyball":
        return <SvgVolleyball className={iconClass} />;
      case "people":
        return <SvgPeople className={iconClass} />;
      default:
        return <SvgComputer className={iconClass} />;
    }
  })();

  return (
    <div className={wrap} role="img" aria-label={iconLabel(kind)}>
      {inner}
    </div>
  );
}
