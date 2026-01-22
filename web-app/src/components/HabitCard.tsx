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
        cursor-pointer group relative overflow-hidden rounded-2xl border transition-all duration-300
        border-enfp-muted/20 bg-white/60 hover:border-enfp-primary/30 hover:shadow-lg hover:shadow-enfp-primary/10
        dark:border-white/10 dark:bg-white/5 dark:hover:border-enfp-primary/30 dark:hover:shadow-${colorClass.split('-')[1]}-900/20
        ${isCompleted ? 'opacity-70 dark:opacity-100 dark:border-opacity-50 dark:bg-opacity-30 grayscale dark:grayscale-0' : ''}
      `}
    >
      <div 
        onClick={onToggle}
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 ${isCompleted ? 'bg-enfp-success' : 'bg-enfp-muted/20 dark:bg-white/10 group-hover:bg-enfp-primary/50 dark:group-hover:bg-enfp-primary/50'}`} 
      />
      
      <div className="flex items-start justify-between pl-4 py-1">
        <div className="flex-1" onClick={onToggle}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-sm tracking-wide ${isCompleted ? 'text-enfp-muted line-through decoration-enfp-primary/50' : 'text-enfp-text dark:text-enfp-text-dark'}`}>
              {habit.title}
            </h3>
            <span className="text-[10px] font-bold text-enfp-muted dark:text-enfp-muted/80 bg-enfp-muted/10 px-2 py-0.5 rounded-full border border-enfp-muted/10">
              {habit.duration}
            </span>
          </div>
          <p className={`text-xs ${isCompleted ? 'text-enfp-muted/80' : 'text-enfp-text/70 dark:text-enfp-text-dark/70'}`}>
            {habit.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <div 
            onClick={onToggle}
            className={`
              flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300
              ${isCompleted 
                ? 'border-enfp-success bg-enfp-success text-white dark:text-enfp-dark' 
                : 'border-enfp-muted/30 dark:border-white/20 bg-white/50 dark:bg-white/5 text-transparent group-hover:border-enfp-primary dark:group-hover:border-enfp-primary'}
            `}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-enfp-muted hover:text-enfp-danger dark:hover:text-enfp-danger p-1"
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