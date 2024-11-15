
import ReactCalendar from 'react-calendar';
import { format } from 'date-fns';
import type { Habit } from '../types';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  habits: Habit[];
}

export default function CalendarView({ habits }: CalendarViewProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium text-gray-200 mb-6">Habit Calendar</h2>
      <div>
        <ReactCalendar
          className="w-full bg-transparent border-0"
          tileContent={({ date }) => {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const habitsDone = habits.filter(h => h.lastChecked === formattedDate);
            
            return habitsDone.length > 0 ? (
              <div className="flex justify-center items-center mt-1">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              </div>
            ) : null;
          }}
        />
      </div>
    </div>
  );
}