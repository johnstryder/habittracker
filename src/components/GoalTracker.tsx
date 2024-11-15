import React, { useState } from 'react';
import { Target, TrendingUp, Plus, X } from 'lucide-react';
import type { Goal } from '../types';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

interface GoalTrackerProps {
  goals: Goal[];
  onUpdateGoal: (id: string, progress: number) => void;
}

export default function GoalTracker({ goals, onUpdateGoal }: GoalTrackerProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 0,
    deadline: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return;

    try {
      setLoading(true);
      await pb.collection('goals').create({
        title: newGoal.title,
        target: newGoal.target,
        current: 0,
        deadline: newGoal.deadline,
        user_id: pb.authStore.model?.id
      });

      // Reset form
      setNewGoal({
        title: '',
        target: 0,
        deadline: ''
      });
      setShowAddGoal(false);

      // Refresh goals list
      window.location.reload();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (goal: Goal, newProgress: number) => {
    try {
      await pb.collection('goals').update(goal.id, {
        current: newProgress
      });
      onUpdateGoal(goal.id, newProgress);
    } catch (error) {
      console.error('Error updating goal progress:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium text-gray-200">Goals</h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddGoal && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-200">New Goal</h3>
            <button
              onClick={() => setShowAddGoal(false)}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Goal Title
              </label>
              <input
                type="text"
                id="title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-300">
                Target Number
              </label>
              <input
                type="number"
                id="target"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
                Deadline
              </label>
              <input
                type="date"
                id="deadline"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No goals yet. Start by adding your first goal!</p>
        </div>
      ) : (
        goals.map(goal => (
          <div key={goal.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-sky-500" />
                <h3 className="text-lg font-medium text-gray-200">{goal.title}</h3>
              </div>
              <span className="text-sm text-gray-400">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <input
                    type="number"
                    value={goal.current}
                    onChange={(e) => handleProgressUpdate(goal, Number(e.target.value))}
                    className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200"
                    min="0"
                    max={goal.target}
                  />
                  <span className="text-gray-400">
                    / {goal.target}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {Math.round((goal.current / goal.target) * 100)}% Complete
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-sky-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}