import React from 'react';
import type { Habit } from '../data/habits';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
  colorClass: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onToggle, onDelete, colorClass }) => {
  return (
    <div 
      className={`
        cursor-pointer group relative overflow-hidden rounded-xl border transition-all duration-300
        border-slate-200 bg-white/50 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/50
        dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-600 dark:hover:shadow-${colorClass.split('-')[1]}-900/20
        ${isCompleted ? 'opacity-70 dark:opacity-100 dark:border-opacity-50 dark:bg-opacity-30 grayscale dark:grayscale-0' : ''}
      `}
    >
      <div 
        onClick={onToggle}
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400 dark:group-hover:bg-slate-600'}`} 
      />
      
      <div className="flex items-start justify-between pl-3">
        <div className="flex-1" onClick={onToggle}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-sm tracking-wide ${isCompleted ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
              {habit.title}
            </h3>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {habit.duration}
            </span>
          </div>
          <p className={`text-xs ${isCompleted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
            {habit.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div 
            onClick={onToggle}
            className={`
              flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300
              ${isCompleted 
                ? 'border-emerald-500 bg-emerald-500 text-white dark:text-slate-900' 
                : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-transparent group-hover:border-slate-400 dark:group-hover:border-slate-500'}
            `}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-slate-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 p-1"
            title="Remove habit"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
             </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
