import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HabitCard from './components/HabitCard';
import CalendarView from './components/Calendar';
import GoalTracker from './components/GoalTracker';
import Journal from './components/Journal';
import type { Habit, Goal, JournalEntry } from './types';
import { format } from 'date-fns';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Daily Exercise',
      type: 'good',
      streak: 5,
      lastChecked: format(new Date(), 'yyyy-MM-dd'),
    },
    {
      id: '2',
      name: 'No Smoking',
      type: 'bad',
      streak: 42,
      lastChecked: format(new Date(), 'yyyy-MM-dd'),
    },
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Read 24 Books This Year',
      target: 24,
      current: 8,
      deadline: '2024-12-31',
    },
    {
      id: '2',
      title: 'Meditate 100 Days',
      target: 100,
      current: 45,
      deadline: '2024-06-30',
    },
  ]);

  const [journalEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date().toISOString(),
      content: 'Today was a productive day. I managed to stick to my exercise routine and avoided any triggers for my bad habits.',
    },
  ]);

  const handleHabitCheck = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id
        ? { ...habit, streak: habit.streak + 1, lastChecked: format(new Date(), 'yyyy-MM-dd') }
        : habit
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onCheck={handleHabitCheck}
              />
            ))}
          </div>
        );
      case 'calendar':
        return <CalendarView habits={habits} />;
      case 'goals':
        return <GoalTracker goals={goals} onUpdateGoal={() => {}} />;
      case 'journal':
        return <Journal entries={journalEntries} onAddEntry={() => {}} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;