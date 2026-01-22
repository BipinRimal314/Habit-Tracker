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
  onDeleteTrack?: (trackId: string) => void;
}

export const TrackSection: React.FC<TrackSectionProps> = ({ track, habits, completedHabits, onToggle, onAdd, onDelete, onDeleteTrack }) => {
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

  // Explicit map for Tailwind to scan
  const bgMap: Record<string, string> = {
    'text-purple-400': 'bg-purple-400',
    'text-pink-400': 'bg-pink-400',
    'text-orange-400': 'bg-orange-400',
    'text-emerald-400': 'bg-emerald-400',
    'text-blue-400': 'bg-blue-400',
    'text-cyan-400': 'bg-cyan-400',
    'text-red-400': 'bg-red-400',
    'text-yellow-400': 'bg-yellow-400',
    'text-enfp-primary': 'bg-enfp-primary',
    'text-enfp-secondary': 'bg-enfp-secondary',
    'text-enfp-accent': 'bg-enfp-accent',
    'text-enfp-success': 'bg-enfp-success',
    'text-enfp-danger': 'bg-enfp-danger',
  };

  const textLightMap: Record<string, string> = {
    'text-purple-400': 'text-purple-600',
    'text-pink-400': 'text-pink-600',
    'text-orange-400': 'text-orange-600',
    'text-emerald-400': 'text-emerald-600',
    'text-blue-400': 'text-blue-600',
    'text-cyan-400': 'text-cyan-600',
    'text-red-400': 'text-red-600',
    'text-yellow-400': 'text-yellow-600',
    'text-enfp-primary': 'text-enfp-primary',
    'text-enfp-secondary': 'text-amber-500', // darker amber for text
    'text-enfp-accent': 'text-violet-600',
    'text-enfp-success': 'text-emerald-600',
    'text-enfp-danger': 'text-red-600',
  };

  const bgColor = bgMap[track.color] || 'bg-enfp-muted';
  const lightTextColor = textLightMap[track.color] || 'text-enfp-text';

  return (
    <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 group/track">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${lightTextColor} dark:${track.color}`}>
            {track.title}
          </h2>
          {onDeleteTrack && (
            <button
              onClick={() => onDeleteTrack(track.id)}
              className="opacity-0 group-hover/track:opacity-100 transition-opacity text-enfp-muted hover:text-enfp-danger p-1"
              title="Delete Track"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 bg-enfp-muted/20 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${bgColor}`} 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs font-bold text-enfp-muted">{progress}/{total}</span>
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
          <form onSubmit={handleSubmit} className="rounded-2xl border-2 border-dashed border-enfp-muted/30 bg-white/40 dark:bg-white/5 p-4 flex flex-col gap-3">
            <input 
              autoFocus
              type="text" 
              placeholder="Habit Title" 
              className="bg-transparent border-b-2 border-enfp-muted/20 text-sm font-bold text-enfp-text dark:text-enfp-text-dark focus:outline-none focus:border-enfp-primary pb-1 placeholder:font-normal"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Time" 
                className="bg-transparent border-b-2 border-enfp-muted/20 text-xs text-enfp-text dark:text-enfp-text-dark focus:outline-none focus:border-enfp-primary pb-1 w-1/3"
                value={newDuration}
                onChange={e => setNewDuration(e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Description (opt)" 
                className="bg-transparent border-b-2 border-enfp-muted/20 text-xs text-enfp-text dark:text-enfp-text-dark focus:outline-none focus:border-enfp-primary pb-1 flex-1"
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-1">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs font-bold text-enfp-muted hover:text-enfp-text transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!newTitle || !newDuration}
                className="text-xs font-bold bg-enfp-text dark:bg-white text-white dark:text-enfp-dark px-3 py-1.5 rounded-lg disabled:opacity-50 hover:scale-105 transition-transform"
              >
                Add
              </button>
            </div>
          </form>
        ) : (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex flex-col items-center justify-center min-h-[100px] rounded-2xl border-2 border-dashed border-enfp-muted/20 hover:border-enfp-primary/50 bg-white/30 dark:bg-white/5 text-enfp-muted hover:text-enfp-primary transition-all duration-200 group"
          >
            <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">✨</span>
            <span className="text-xs font-bold uppercase tracking-wider">Add Habit</span>
          </button>
        )}
      </div>
    </div>
  );
};