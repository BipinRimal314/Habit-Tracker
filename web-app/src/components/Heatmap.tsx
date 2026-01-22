import React from 'react';

interface HeatmapProps {
  completions: Record<string, Record<string, boolean>>;
  totalHabitsCount: number;
}

export const Heatmap: React.FC<HeatmapProps> = ({ completions, totalHabitsCount }) => {
  // Generate last 28 days (4 weeks)
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-bold text-enfp-muted uppercase tracking-widest pl-1">Consistency Love</h3>
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {days.map(date => {
          const dayData = completions[date] || {};
          const count = Object.values(dayData).filter(Boolean).length;
          const intensity = Math.min(count / totalHabitsCount, 1);
          
          let colorClass = 'bg-enfp-muted/20 dark:bg-white/5';
          if (count > 0) colorClass = 'bg-rose-300 dark:bg-rose-900/60';
          if (intensity > 0.3) colorClass = 'bg-rose-400 dark:bg-rose-800/80';
          if (intensity > 0.6) colorClass = 'bg-enfp-primary dark:bg-rose-600'; // rose-500
          if (intensity > 0.9) colorClass = 'bg-rose-600 dark:bg-rose-500';

          return (
            <div 
              key={date}
              title={`${date}: ${count} habits`}
              className={`w-4 h-10 rounded-full transition-all duration-300 ${colorClass} hover:scale-110`}
              style={{ opacity: count === 0 ? 0.4 : 1 }}
            />
          );
        })}
      </div>
    </div>
  );
};