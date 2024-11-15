import  { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HabitCard from '../components/HabitCard';
import CalendarView from '../components/Calendar';
import GoalTracker from '../components/GoalTracker';
import Journal from '../components/Journal';
import type { Habit, Goal, JournalEntry } from '../types';
import { format } from 'date-fns';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadHabits(),
        loadGoals(),
        loadJournalEntries()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHabits = async () => {
    try {
      const records = await pb.collection('habit_tracking').getFullList({
        filter: `user_id = "${pb.authStore.model?.id}"`,
        sort: '-created'
      });
      
      setHabits(records.map(record => ({
        id: record.id,
        name: record.title,
        type: record.habit_type === 'building' ? 'good' : 'bad',
        streak: record.streak_count,
        lastChecked: record.last_check_in
      })));
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const loadGoals = async () => {
    // Will implement once we create the goals collection
    setGoals([]);
  };

  const loadJournalEntries = async () => {
    try {
      const records = await pb.collection('journal_entries').getFullList({
        filter: `user_id = "${pb.authStore.model?.id}"`,
        sort: '-created'
      });
      
      setJournalEntries(records.map(record => ({
        id: record.id,
        date: record.entry_date,
        content: record.content
      })));
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const handleHabitCheck = async (id: string) => {
    try {
      const habit = await pb.collection('habit_tracking').getOne(id);
      const newStreak = habit.streak_count + 1;
      
      await pb.collection('habit_tracking').update(id, {
        streak_count: newStreak,
        last_check_in: format(new Date(), 'yyyy-MM-dd')
      });
      
      await loadHabits();
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const handleAddJournalEntry = async (content: string) => {
    try {
      await pb.collection('journal_entries').create({
        title: format(new Date(), 'yyyy-MM-dd'),
        content,
        entry_date: format(new Date(), 'yyyy-MM-dd'),
        user_id: pb.authStore.model?.id
      });
      
      await loadJournalEntries();
    } catch (error) {
      console.error('Error adding journal entry:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {habits.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400">
                <p>No habits yet. Start tracking your first habit!</p>
              </div>
            ) : (
              habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onCheck={handleHabitCheck}
                />
              ))
            )}
          </div>
        );
      case 'calendar':
        return <CalendarView habits={habits} />;
      case 'goals':
        return <GoalTracker goals={goals} onUpdateGoal={() => {}} />;
      case 'journal':
        return <Journal 
          entries={journalEntries} 
          onAddEntry={handleAddJournalEntry}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}