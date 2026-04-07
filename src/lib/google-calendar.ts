import { google, calendar_v3 } from 'googleapis';

// --- Calendar Configuration ---

// 5 general bays — used for Free Bay bookings only
const RENTAL_BAYS = [
  { id: 'bays@tourqualitygolf.com', name: 'Hogan Bay' },
  { id: 'c_5f1f6fa68565221bc5e751649f8c671aa382db6660bd125ab97a342462e65a61@group.calendar.google.com', name: 'Members Bay' },
  { id: 'c_6f22b8efcf5657ac412fa70d2e5df3495b30be5a12891e97e75555c1d93ccc78@group.calendar.google.com', name: 'Nicklaus Bay' },
  { id: 'c_c77a1fb2d57dd246fad5cb7b979a7de260c643b913d7bda79175539e159df84e@group.calendar.google.com', name: 'Palmer Bay' },
  { id: 'c_97de1b63f827ff51d1748427b2948ade663f86fb65c8756f6107c9e009a1b9ac@group.calendar.google.com', name: 'Tiger Bay' },
];

// Dedicated lesson/fitting bay — used for Evaluation bookings only
const LESSON_BAY = [
  { id: 'c_206bd9092494e87bc89c3680039b4c7f5dee014e9f8888c936330e029a930175@group.calendar.google.com', name: 'Fitting & Lesson Bay' },
];

const INSTRUCTOR_CALENDARS = [
  { id: 'ross@tourqualitygolf.com', name: 'Ross MacDonald' },
  { id: 'zach@tourqualitygolf.com', name: 'Zachary Ketchum' },
];

const TIMEZONE = 'America/Chicago';
const OPEN_HOUR = 10; // 10:00 AM
const CLOSE_HOUR = 19; // 7:00 PM

// --- Auth ---

function getCredentials() {
  const raw = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!, 'base64').toString();
  return JSON.parse(raw);
}

function getAuthClient(impersonateEmail?: string) {
  const creds = getCredentials();
  const opts: ConstructorParameters<typeof google.auth.JWT>[0] = {
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  };
  if (impersonateEmail) {
    opts.subject = impersonateEmail;
  }
  return new google.auth.JWT(opts);
}

function getCalendar(impersonateEmail: string): calendar_v3.Calendar {
  const auth = getAuthClient(impersonateEmail);
  return google.calendar({ version: 'v3', auth });
}

// --- Slot Generation ---

function generateSlots(durationMinutes: number): string[] {
  const slots: string[] = [];
  const lastStartMinutes = (CLOSE_HOUR * 60) - durationMinutes;

  for (let minutes = OPEN_HOUR * 60; minutes <= lastStartMinutes; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    slots.push(`${displayHour}:${min.toString().padStart(2, '0')}${period}`);
  }

  return slots;
}

function parseSlotToDate(dateStr: string, timeStr: string): Date {
  // Parse "10:30am" or "1:00pm" into a Date object in Central Time
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) throw new Error(`Invalid time format: ${timeStr}`);

  let hour = parseInt(match[1]);
  const min = parseInt(match[2]);
  const period = match[3].toLowerCase();

  if (period === 'pm' && hour !== 12) hour += 12;
  if (period === 'am' && hour === 12) hour = 0;

  // Create date string in Central Time
  const iso = `${dateStr}T${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:00`;
  return new Date(iso);
}

// --- FreeBusy Query ---

interface BusyInterval {
  start: string;
  end: string;
}

function isSlotFree(slotStart: Date, slotEnd: Date, busyIntervals: BusyInterval[]): boolean {
  for (const busy of busyIntervals) {
    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);
    // Overlap: slot starts before busy ends AND slot ends after busy starts
    if (slotStart < busyEnd && slotEnd > busyStart) {
      return false;
    }
  }
  return true;
}

async function queryFreeBusy(
  calendarIds: string[],
  timeMin: string,
  timeMax: string,
  impersonateEmail: string
): Promise<Record<string, BusyInterval[]>> {
  const calendar = getCalendar(impersonateEmail);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: TIMEZONE,
      items: calendarIds.map(id => ({ id })),
    },
  });

  const result: Record<string, BusyInterval[]> = {};
  const calendars = response.data.calendars || {};

  for (const id of calendarIds) {
    const calData = calendars[id];
    result[id] = (calData?.busy || []).map(b => ({
      start: b.start || '',
      end: b.end || '',
    }));
  }

  return result;
}

// --- Public API ---

export async function getAvailableSlots(
  date: string,
  type: 'free-bay' | 'evaluation'
): Promise<string[]> {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
  if (dayOfWeek === 0) return []; // Sunday — closed

  const durationMinutes = type === 'free-bay' ? 30 : 60;
  const candidateSlots = generateSlots(durationMinutes);

  // Use CDT offset (-05:00) for Central Daylight Time; this is close enough for April 2026
  // In production, use a proper timezone library for exact DST handling
  const timeMin = new Date(`${date}T${OPEN_HOUR.toString().padStart(2, '0')}:00:00.000-05:00`).toISOString();
  const timeMax = new Date(`${date}T${CLOSE_HOUR.toString().padStart(2, '0')}:00:00.000-05:00`).toISOString();

  // Free Bay uses the 5 rental bays; Evaluation uses the dedicated Fitting & Lesson Bay
  const baysForType = type === 'free-bay' ? RENTAL_BAYS : LESSON_BAY;

  // Query bay availability (impersonate bays@ to access all bay calendars)
  const bayIds = baysForType.map(b => b.id);
  const bayBusy = await queryFreeBusy(bayIds, timeMin, timeMax, 'bays@tourqualitygolf.com');

  // For evaluations, also query instructor availability
  let instructorBusy: Record<string, BusyInterval[]> = {};
  if (type === 'evaluation') {
    for (const inst of INSTRUCTOR_CALENDARS) {
      const busy = await queryFreeBusy([inst.id], timeMin, timeMax, inst.id);
      instructorBusy[inst.id] = busy[inst.id] || [];
    }
  }

  const availableSlots: string[] = [];

  for (const slot of candidateSlots) {
    const slotStart = parseSlotToDate(date, slot);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

    // Check if at least one bay (of the correct type) is free
    const bayFree = baysForType.some(bay =>
      isSlotFree(slotStart, slotEnd, bayBusy[bay.id] || [])
    );
    if (!bayFree) continue;

    // For evaluations, also check if at least one instructor is free
    if (type === 'evaluation') {
      const instructorFree = INSTRUCTOR_CALENDARS.some(inst =>
        isSlotFree(slotStart, slotEnd, instructorBusy[inst.id] || [])
      );
      if (!instructorFree) continue;
    }

    availableSlots.push(slot);
  }

  return availableSlots;
}

export interface BookingParams {
  date: string;
  time: string;
  type: 'free-bay' | 'evaluation';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BookingResult {
  success: true;
  bayName: string;
  instructorName?: string;
  bayEventId: string;
  instructorEventId?: string;
}

export async function bookSlot(params: BookingParams): Promise<BookingResult> {
  const { date, time, type, firstName, lastName, email, phone, notes } = params;
  const durationMinutes = type === 'free-bay' ? 30 : 60;

  const slotStart = parseSlotToDate(date, time);
  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

  // Use CDT offset (-05:00) for Central Daylight Time; this is close enough for April 2026
  // In production, use a proper timezone library for exact DST handling
  const timeMin = new Date(`${date}T${OPEN_HOUR.toString().padStart(2, '0')}:00:00.000-05:00`).toISOString();
  const timeMax = new Date(`${date}T${CLOSE_HOUR.toString().padStart(2, '0')}:00:00.000-05:00`).toISOString();

  // Re-check bay availability — use correct bay group for booking type
  const baysForType = type === 'free-bay' ? RENTAL_BAYS : LESSON_BAY;
  const bayIds = baysForType.map(b => b.id);
  const bayBusy = await queryFreeBusy(bayIds, timeMin, timeMax, 'bays@tourqualitygolf.com');

  const freeBays = baysForType.filter(bay =>
    isSlotFree(slotStart, slotEnd, bayBusy[bay.id] || [])
  );

  if (freeBays.length === 0) {
    throw new Error('SLOT_TAKEN');
  }

  // Pick a random available bay
  const selectedBay = freeBays[Math.floor(Math.random() * freeBays.length)];

  // For evaluations, also find a free instructor
  let selectedInstructor: typeof INSTRUCTOR_CALENDARS[0] | undefined;
  if (type === 'evaluation') {
    const instructorBusy: Record<string, BusyInterval[]> = {};
    for (const inst of INSTRUCTOR_CALENDARS) {
      const busy = await queryFreeBusy([inst.id], timeMin, timeMax, inst.id);
      instructorBusy[inst.id] = busy[inst.id] || [];
    }

    const freeInstructors = INSTRUCTOR_CALENDARS.filter(inst =>
      isSlotFree(slotStart, slotEnd, instructorBusy[inst.id] || [])
    );

    if (freeInstructors.length === 0) {
      throw new Error('SLOT_TAKEN');
    }

    selectedInstructor = freeInstructors[Math.floor(Math.random() * freeInstructors.length)];
  }

  // Create event on bay calendar
  const summary = type === 'free-bay'
    ? `Free Bay - ${firstName} ${lastName}`
    : `Performance Evaluation - ${firstName} ${lastName}`;

  const description = [
    `Email: ${email}`,
    `Phone: ${phone}`,
    notes ? `Notes: ${notes}` : '',
    type === 'evaluation' && selectedInstructor ? `Instructor: ${selectedInstructor.name}` : '',
    `Bay: ${selectedBay.name}`,
  ].filter(Boolean).join('\n');

  const startDateTime = slotStart.toISOString();
  const endDateTime = slotEnd.toISOString();

  const bayCalendar = getCalendar('bays@tourqualitygolf.com');
  const bayEvent = await bayCalendar.events.insert({
    calendarId: selectedBay.id,
    requestBody: {
      summary,
      description,
      start: { dateTime: startDateTime, timeZone: TIMEZONE },
      end: { dateTime: endDateTime, timeZone: TIMEZONE },
    },
  });

  // Create event on instructor calendar (evaluations only)
  let instructorEventId: string | undefined;
  if (type === 'evaluation' && selectedInstructor) {
    const instCalendar = getCalendar(selectedInstructor.id);
    const instEvent = await instCalendar.events.insert({
      calendarId: selectedInstructor.id,
      requestBody: {
        summary,
        description,
        start: { dateTime: startDateTime, timeZone: TIMEZONE },
        end: { dateTime: endDateTime, timeZone: TIMEZONE },
      },
    });
    instructorEventId = instEvent.data.id || undefined;
  }

  return {
    success: true,
    bayName: selectedBay.name,
    instructorName: selectedInstructor?.name,
    bayEventId: bayEvent.data.id || '',
    instructorEventId,
  };
}
