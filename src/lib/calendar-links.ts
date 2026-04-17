const LOCATION = '6006 S Sheridan Rd, Suite A, Tulsa, OK 74145';

function parseDateTime(dateStr: string, timeStr: string): Date {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return new Date(dateStr + 'T12:00:00');

  let hour = parseInt(match[1]);
  const min = parseInt(match[2]);
  const period = match[3].toLowerCase();

  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  // Create date in Central Time (approximate with -05:00 CDT offset)
  return new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00.000-05:00`);
}

function toGCalFormat(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function toICSFormat(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function openGoogleCalendar(
  title: string,
  dateStr: string,
  timeStr: string,
  durationMinutes: number,
  details?: string
) {
  const start = parseDateTime(dateStr, timeStr);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toGCalFormat(start)}/${toGCalFormat(end)}`,
    details: details || '',
    location: LOCATION,
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}

export function downloadICS(
  title: string,
  dateStr: string,
  timeStr: string,
  durationMinutes: number,
  details?: string
) {
  const start = parseDateTime(dateStr, timeStr);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TQG//Booking//EN',
    'BEGIN:VEVENT',
    `DTSTART:${toICSFormat(start)}`,
    `DTEND:${toICSFormat(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${LOCATION}`,
    details ? `DESCRIPTION:${details}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tqg-booking.ics';
  a.click();
  URL.revokeObjectURL(url);
}
