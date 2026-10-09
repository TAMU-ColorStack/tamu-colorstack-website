import { WeeklyEvents } from "@/components/sections/WeeklyEvents";
import { getUpcomingEvents } from "@/lib/calendar";

export default async function Events() {
  const { days, error } = await getUpcomingEvents();
  return <WeeklyEvents days={days} fetchError={error} />;
}