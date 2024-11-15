import React from 'react';
import { Target, TrendingUp } from 'lucide-react';
import type { Goal } from '../types';

interface GoalTrackerProps {
  goals: Goal[];
  onUpdateGoal: (id: string, progress: number) => void;
}

export default function GoalTracker({ goals, onUpdateGoal }: GoalTrackerProps) {
  return (
    <div className="space-y-6">
      {goals.map(goal => (
        <div key={goal.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-sky-500" />
              <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
            </div>
            <span className="text-sm text-gray-500">
              Deadline: {new Date(goal.deadline).toLocaleDateString()}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-gray-600">
                  {goal.current} / {goal.target}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {Math.round((goal.current / goal.target) * 100)}% Complete
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-sky-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(goal.current / goal.target) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}