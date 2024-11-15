import React from 'react';
import ReactCalendar from 'react-calendar';
import { format } from 'date-fns';
import type { Habit } from '../types';

interface CalendarViewProps {
  habits: Habit[];
}

export default function CalendarView({ habits }: CalendarViewProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Habit Calendar</h2>
      <div className="calendar-container">
        <ReactCalendar
          className="rounded-lg border-none shadow-sm"
          tileClassName="rounded-full"
          tileContent={({ date }) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const habitsDone = habits.filter(h => h.lastChecked === formattedDate);
            
            return habitsDone.length > 0 ? (
              <div className="flex justify-center items-center">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              </div>
            ) : null;
          }}
        />
      </div>
    </div>
  );
}