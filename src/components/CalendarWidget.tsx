'use client';
import { useState, useMemo, useCallback } from 'react';

// ============================================================
// TODO: GOOGLE WORKSPACE CALENDAR API INTEGRATION
// Replace the mock availability data below with a real API call
// to Google Calendar API using the organization's shared calendar.
//
// Required: googleapis npm package + service account credentials
// Endpoint: calendar.events.list({ calendarId: 'YOUR_CALENDAR_ID' })
// The API should return busy/free slots for the selected date range.
// ============================================================

interface CalendarWidgetProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  maxHeight?: number;
}

// Mock availability data — replace with Google Calendar API response
const fullDaySlots = [
  '10:00am', '10:30am', '11:00am', '11:30am', '12:00pm', '12:30pm', 
  '1:00pm', '1:30pm', '2:00pm', '2:30pm', '3:00pm', '3:30pm', 
  '4:00pm', '4:30pm', '5:00pm', '5:30pm', '6:00pm'
];

const MOCK_AVAILABILITY: Record<string, string[]> = {
  'Mon': fullDaySlots,
  'Tue': fullDaySlots,
  'Wed': fullDaySlots,
  'Thu': fullDaySlots,
  'Fri': fullDaySlots,
  'Sat': fullDaySlots,
  'Sun': [], // Closed Sundays
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarWidget({ onDateTimeSelect, maxHeight = 600 }: CalendarWidgetProps) {
  const today = new Date();
  const isSunday = today.getDay() === 0;

  // Default to today, unless today is Sunday, then default to tomorrow (Monday)
  const defaultDate = new Date(today);
  if (isSunday) {
    defaultDate.setDate(defaultDate.getDate() + 1);
  }

  const [currentMonth, setCurrentMonth] = useState(defaultDate.getMonth());
  const [currentYear, setCurrentYear] = useState(defaultDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const isDateDisabled = useCallback((day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = DAYS_OF_WEEK[date.getDay()];
    // Past dates or no availability
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
    if (!MOCK_AVAILABILITY[dayName] || MOCK_AVAILABILITY[dayName].length === 0) return true;
    return false;
  }, [currentYear, currentMonth, today]);

  const isSelectedDay = useCallback((day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth &&
           selectedDate.getFullYear() === currentYear;
  }, [selectedDate, currentMonth, currentYear]);

  const isTodayDay = useCallback((day: number) => {
    return today.getDate() === day &&
           today.getMonth() === currentMonth &&
           today.getFullYear() === currentYear;
  }, [today, currentMonth, currentYear]);

  const handleDayClick = (day: number) => {
    if (isDateDisabled(day)) return;
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    setSelectedTime(null);
  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
    if (selectedDate) {
      onDateTimeSelect(selectedDate, time);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get available times for the selected date
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    const dayName = DAYS_OF_WEEK[selectedDate.getDay()];
    return MOCK_AVAILABILITY[dayName] || [];
  }, [selectedDate]);

  const selectedDayLabel = selectedDate
    ? `${DAYS_OF_WEEK[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}`
    : '';

  // Prevent navigating to past months
  const canGoPrev = currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  return (
    <div className="w-full max-w-4xl bg-surface-container-low p-8 md:p-10 rounded-xl border border-outline-variant/10 shadow-2xl" style={{ maxHeight: `${maxHeight}px`, overflow: 'auto' }}>
      <h2 className="text-2xl font-bold text-on-surface mb-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        Select a Date &amp; Time
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Calendar Grid */}
        <div className="space-y-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevMonth}
              disabled={!canGoPrev}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${canGoPrev ? 'bg-surface-container-high hover:bg-surface-variant' : 'opacity-30 cursor-not-allowed'}`}
            >
              <span className="material-symbols-outlined text-primary">chevron_left</span>
            </button>
            <h3 className="text-lg font-bold text-on-surface" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {DAYS_OF_WEEK.map(d => <div key={d} className="py-1">{d}</div>)}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {/* Day buttons */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const disabled = isDateDisabled(day);
              const selected = isSelectedDay(day);
              const isToday = isTodayDay(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(day)}
                  disabled={disabled}
                  className={`aspect-square flex flex-col items-center justify-center rounded-full text-sm font-semibold transition-colors relative
                    ${selected ? 'bg-primary-container text-on-primary-container shadow-lg font-bold' : ''}
                    ${disabled ? 'text-on-surface-variant opacity-30 cursor-not-allowed' : ''}
                    ${!selected && !disabled ? 'hover:bg-primary/10' : ''}
                  `}
                >
                  <span>{day}</span>
                  {isToday && !selected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-secondary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Timezone */}
          <div className="pt-4 space-y-1">
            <h4 className="text-xs font-bold text-on-surface" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              Time zone
            </h4>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-base">public</span>
              <span>Central Time — US &amp; Canada</span>
            </div>
          </div>
        </div>

        {/* Right: Time Slots */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-on-surface mb-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {selectedDayLabel}
          </h3>
          {availableTimes.length === 0 ? (
            <p className="text-on-surface-variant text-sm italic">No availability on this date.</p>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '380px' }}>
              {availableTimes.map(time => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-center border transition-all text-sm
                    ${selectedTime === time
                      ? 'bg-primary-container text-on-primary-container border-primary-container shadow-md'
                      : 'bg-surface-container-high text-on-surface border-outline-variant/20 hover:border-primary/50'
                    }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
