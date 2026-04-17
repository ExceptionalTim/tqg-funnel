'use client';
import { useState, useMemo, useCallback, useEffect } from 'react';

interface CalendarWidgetProps {
  onDateTimeSelect: (date: Date, time: string) => void;
  maxHeight?: number;
  bookingType: 'free-bay' | 'evaluation';
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarWidget({ onDateTimeSelect, maxHeight = 600, bookingType }: CalendarWidgetProps) {
  const today = new Date();
  const centralHour = parseInt(
    today.toLocaleString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', hour12: false })
  );

  const defaultDate = new Date(today);
  // If past closing time (7 PM Central), advance to tomorrow
  if (centralHour >= 19) {
    defaultDate.setDate(defaultDate.getDate() + 1);
  }
  // Skip Sunday
  if (defaultDate.getDay() === 0) {
    defaultDate.setDate(defaultDate.getDate() + 1);
  }

  const [currentMonth, setCurrentMonth] = useState(defaultDate.getMonth());
  const [currentYear, setCurrentYear] = useState(defaultDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Fetch availability when selectedDate or bookingType changes
  useEffect(() => {
    if (!selectedDate) return;

    const day = selectedDate.getDay();
    if (day === 0) {
      setAvailableSlots([]);
      return;
    }

    const dateStr = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    setLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);

    fetch(`/api/availability?date=${dateStr}&type=${bookingType}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setSlotsError(data.error);
        } else {
          setAvailableSlots(data.slots || []);
        }
      })
      .catch(() => setSlotsError('Failed to load availability. Please try again.'))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, bookingType]);

  const daysInMonth = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);
  const firstDay = useMemo(() => getFirstDayOfMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  const isDateDisabled = useCallback((day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    // Past dates
    if (date < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return true;
    // Sundays
    if (date.getDay() === 0) return true;
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
    setSelectedTime(selectedTime === time ? null : time);
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

  const selectedDayLabel = selectedDate
    ? `${DAYS_OF_WEEK[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}`
    : '';

  const canGoPrev = currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  return (
    <div className="w-full max-w-4xl bg-surface-container-low p-8 md:p-10 rounded-xl border border-outline-variant/10 shadow-2xl" style={{ maxHeight: `${maxHeight}px`, overflow: 'auto' }}>
      <h2 className="text-2xl font-bold text-on-surface mb-6" style={{ fontFamily: "'Open Sans', sans-serif" }}>
        Select a Date &amp; Time
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Calendar Grid */}
        <div className="space-y-4">
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

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {DAYS_OF_WEEK.map(d => <div key={d} className="py-1">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
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
          {loadingSlots ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
              <p className="text-on-surface-variant text-sm">Loading availability...</p>
            </div>
          ) : slotsError ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-error text-3xl mb-3 block">error</span>
              <p className="text-on-surface-variant text-sm mb-3">{slotsError}</p>
              <button
                onClick={() => {
                  // Re-trigger fetch by toggling selectedDate
                  const d = new Date(selectedDate);
                  setSelectedDate(new Date(d));
                }}
                className="text-primary underline text-sm"
              >
                Try again
              </button>
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-on-surface-variant text-sm italic">No availability on this date.</p>
          ) : (
            <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: '380px' }}>
              {availableSlots.map(time => (
                <div key={time} className="flex gap-2 items-stretch">
                  <button
                    onClick={() => handleTimeClick(time)}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-center border transition-all duration-200 text-sm
                      ${selectedTime === time
                        ? 'bg-transparent text-primary-container border-primary-container'
                        : 'bg-surface-container-high text-on-surface border-outline-variant/20 hover:border-primary/50'
                      }`}
                  >
                    {time}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${selectedTime === time ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0'}`}>
                    <button
                      onClick={() => onDateTimeSelect(selectedDate, time)}
                      className="h-full py-3 px-6 rounded-lg font-bold text-sm bg-primary-container text-on-primary-container shadow-md hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-tight whitespace-nowrap"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
