import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HabitCard from './components/HabitCard';
import CalendarView from './components/Calendar';
import GoalTracker from './components/GoalTracker';
import Journal from './components/Journal';
import LandingPage from './components/LandingPage';
import AuthCallback from './components/OAuthCallback';
import type { Habit, Goal, JournalEntry } from './types';
import { format } from 'date-fns';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!pb.authStore.isValid) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

// Main dashboard component
function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [journalEntries, setJournalEntries] = React.useState<JournalEntry[]>([]);

  React.useEffect(() => {
    // Load initial data
    loadHabits();
    loadGoals();
    loadJournalEntries();
  }, []);

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
    try {
      const records = await pb.collection('goals').getFullList({
        filter: `user_id = "${pb.authStore.model?.id}"`,
        sort: '-created'
      });
      
      setGoals(records.map(record => ({
        id: record.id,
        title: record.title,
        target: record.target,
        current: record.current,
        deadline: record.deadline
      })));
    } catch (error) {
      console.error('Error loading goals:', error);
    }
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
      
      loadHabits(); // Reload habits to get updated data
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
      
      loadJournalEntries(); // Reload entries to get the new one
    } catch (error) {
      console.error('Error adding journal entry:', error);
    }
  };

  const handleUpdateGoal = async (id: string, progress: number) => {
    try {
      await pb.collection('goals').update(id, {
        current: progress
      });
      
      loadGoals(); // Reload goals to get updated data
    } catch (error) {
      console.error('Error updating goal:', error);
    }
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
        return <GoalTracker goals={goals} onUpdateGoal={handleUpdateGoal} />;
      case 'journal':
        return <Journal entries={journalEntries} onAddEntry={handleAddJournalEntry} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}

// Main App component with routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}