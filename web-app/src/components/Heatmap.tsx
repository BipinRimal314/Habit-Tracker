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
      <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest">Consistency Grid</h3>
      <div className="flex gap-1">
        {days.map(date => {
          const dayData = completions[date] || {};
          const count = Object.values(dayData).filter(Boolean).length;
          const intensity = Math.min(count / totalHabitsCount, 1);
          
          let colorClass = 'bg-slate-200 dark:bg-slate-800';
          if (count > 0) colorClass = 'bg-emerald-200 dark:bg-emerald-900';
          if (intensity > 0.3) colorClass = 'bg-emerald-300 dark:bg-emerald-700';
          if (intensity > 0.6) colorClass = 'bg-emerald-400 dark:bg-emerald-500';
          if (intensity > 0.9) colorClass = 'bg-emerald-500 dark:bg-emerald-400';

          return (
            <div 
              key={date}
              title={`${date}: ${count} habits`}
              className={`w-3 h-8 rounded-sm transition-all duration-300 ${colorClass}`}
              style={{ opacity: count === 0 ? 0.5 : 1 }}
            />
          );
        })}
      </div>
    </div>
  );
};
