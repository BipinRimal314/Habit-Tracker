import type { Habit } from '../data/habits';

export function useDataExport() {
  
  const downloadCSV = (
    completions: Record<string, Record<string, boolean>>,
    habits: Habit[]
  ) => {
    // 1. Get all unique dates from completions, sorted descending
    const dates = Object.keys(completions).sort().reverse();
    if (dates.length === 0) {
      alert("No data to export yet!");
      return;
    }

    // 2. Build Header Row
    // Date, Completion %, [Habit 1 Title], [Habit 2 Title], ...
    const header = ['Date', 'Completion %', ...habits.map(h => `"${h.title}"`)];
    
    // 3. Build Data Rows
    const rows = dates.map(date => {
      const dayData = completions[date] || {};
      
      // Calculate completion % for this day
      // Note: This calculates based on CURRENT habits. 
      // Historical accuracy depends on if you deleted habits, but this is simple.
      const completedCount = Object.values(dayData).filter(Boolean).length;
      const percentage = habits.length > 0 
        ? Math.round((completedCount / habits.length) * 100) 
        : 0;

      const habitStatuses = habits.map(h => {
        return !!dayData[h.id] ? 'TRUE' : 'FALSE';
      });

      return [date, `${percentage}%`, ...habitStatuses].join(',');
    });

    // 4. Combine and Trigger Download
    const csvContent = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `polymath_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadCSV };
}
