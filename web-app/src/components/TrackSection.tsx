import React, { useState } from 'react';
import type { Track, Habit } from '../data/habits';
import { HabitCard } from './HabitCard';

interface TrackSectionProps {
  track: Track;
  habits: Habit[];
  completedHabits: Record<string, boolean>; // map of habitId -> boolean
  onToggle: (habitId: string) => void;
  onAdd: (title: string, duration: string, description: string) => void;
  onDelete: (habitId: string) => void;
}

export const TrackSection: React.FC<TrackSectionProps> = ({ track, habits, completedHabits, onToggle, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const progress = habits.filter(h => completedHabits[h.id]).length;
  const total = habits.length;
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newDuration) {
      onAdd(newTitle, newDuration, newDesc);
      setNewTitle('');
      setNewDuration('');
      setNewDesc('');
      setIsAdding(false);
    }
  };

  // Map the tailwind text colors to something visible in light mode
  // e.g. text-purple-400 -> text-purple-600 in light mode
  const getLightColor = (colorClass: string) => {
    return colorClass.replace('400', '600');
  };

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${getLightColor(track.color)} dark:${track.color}`}>
          {track.title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${track.color.replace('text-', 'bg-')}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{progress}/{total}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map(habit => (
          <HabitCard 
            key={habit.id}
            habit={habit}
            isCompleted={!!completedHabits[habit.id]}
            onToggle={() => onToggle(habit.id)}
            onDelete={() => onDelete(habit.id)}
            colorClass={track.color}
          />
        ))}

        {/* Add New Button / Form */}
        {isAdding ? (
          <form onSubmit={handleSubmit} className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 p-4 flex flex-col gap-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Habit Title" 
              className="bg-transparent border-b border-slate-300 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-500 pb-1"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Time (e.g. 5m)" 
                className="bg-transparent border-b border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-slate-500 pb-1 w-1/3"
                value={newDuration}
                onChange={e => setNewDuration(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Description (opt)" 
                className="bg-transparent border-b border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-slate-500 pb-1 flex-1"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!newTitle || !newDuration}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center min-h-[100px] rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 group"
          >
            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">+</span>
            <span className="text-xs font-mono uppercase tracking-wider">Add Habit</span>
          </button>
        )}
      </div>
    </div>
  );
};
