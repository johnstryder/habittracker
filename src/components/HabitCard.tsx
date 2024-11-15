import React from 'react';
import { Trophy, Flame, X } from 'lucide-react';
import type { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onCheck: (id: string) => void;
}

export default function HabitCard({ habit, onCheck }: HabitCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transform transition-all hover:scale-105">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{habit.name}</h3>
        <div className="flex items-center space-x-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="text-gray-600">{habit.streak} days</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {habit.type === 'good' ? (
            <Trophy className="w-5 h-5 text-sky-500" />
          ) : (
            <X className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm text-gray-500">
            {habit.type === 'good' ? 'Building' : 'Breaking'}
          </span>
        </div>
        
        <button
          onClick={() => onCheck(habit.id)}
          className={`px-4 py-2 rounded-md text-white ${
            habit.type === 'good'
              ? 'bg-sky-500 hover:bg-sky-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Check In
        </button>
      </div>
    </div>
  );
}