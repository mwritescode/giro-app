const WEEKDAYS_SHORT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
const WEEKDAYS_LONG = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
const MONTHS_SHORT = [
  "gen",
  "feb",
  "mar",
  "apr",
  "mag",
  "giu",
  "lug",
  "ago",
  "set",
  "ott",
  "nov",
  "dic",
];
const MONTHS_LONG = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];

function parse(iso: string): Date {
  const [datePart, timePart = "00:00"] = iso.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

export function formatPrice(cents: number): string {
  return cents === 0 ? "Gratis" : `€${cents / 100}`;
}

export function formatTime(iso: string): string {
  const date = parse(iso);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function formatDayShort(iso: string): string {
  const date = parse(iso);
  return `${WEEKDAYS_SHORT[date.getDay()]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

export function formatDayLong(iso: string): string {
  const date = parse(iso);
  return `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()} ${MONTHS_LONG[date.getMonth()]}`;
}

export function formatSession(iso: string): string {
  return `${formatDayShort(iso)} · ${formatTime(iso)}`;
}

export function formatAges(ageMin: number, ageMax: number): string {
  return `${ageMin}–${ageMax} anni`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest} minuti`;
  }
  const hourLabel = hours === 1 ? "1 ora" : `${hours} ore`;
  return rest === 0 ? hourLabel : `${hourLabel} e ${rest} minuti`;
}

export function formatDateRange(dates: string[]): string {
  if (dates.length === 0) {
    return "Qualsiasi data";
  }
  if (dates.length === 1) {
    const date = parse(dates[0]);
    return `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  }
  const first = parse(dates[0]);
  const last = parse(dates[dates.length - 1]);
  if (first.getMonth() === last.getMonth()) {
    return `${first.getDate()}–${last.getDate()} ${MONTHS_SHORT[last.getMonth()]}`;
  }
  return `${first.getDate()} ${MONTHS_SHORT[first.getMonth()]} – ${last.getDate()} ${MONTHS_SHORT[last.getMonth()]}`;
}

export function isoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function upcomingWeekend(from = new Date()): string[] {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  const daysUntilSaturday = (6 - date.getDay() + 7) % 7;
  const saturday = new Date(date);
  saturday.setDate(date.getDate() + daysUntilSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  return [isoDate(saturday), isoDate(sunday)];
}
