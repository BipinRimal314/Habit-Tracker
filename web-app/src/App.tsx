import { useHabitTracker } from './hooks/useHabitTracker';
import { useTheme } from './hooks/useTheme';
import { useDataExport } from './hooks/useDataExport';
import { tracks } from './data/habits';
import { TrackSection } from './components/TrackSection';
import { Heatmap } from './components/Heatmap';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const { completions, habits, toggleHabit, addHabit, removeHabit, getTodayDate } = useHabitTracker();
  const { theme, toggleTheme } = useTheme();
  const { downloadCSV } = useDataExport();
  const today = getTodayDate();
  
  const allowedEmail = import.meta.env.VITE_ALLOWED_EMAIL;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={(res) => login(res.access_token)} />;
  }

  if (allowedEmail && user.email !== allowedEmail) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <h1 className="text-xl font-bold text-red-500">Access Denied</h1>
          <p className="text-slate-600 dark:text-slate-300">
            The email <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">{user.email}</span> is not authorized to access this tracker.
          </p>
          <button
            onClick={logout}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Calculate today's progress
  const todayCompletions = completions[today] || {};
  // Only count completions for habits that currently exist
  const activeHabitIds = new Set(habits.map(h => h.id));
  const completedCount = Object.keys(todayCompletions).filter(id => todayCompletions[id] && activeHabitIds.has(id)).length;
  
  const progressPercentage = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 pb-20 selection:bg-emerald-500/30 transition-colors duration-300">
      {/* Header / Dashboard */}
      <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex justify-between items-start w-full md:w-auto">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Polymath Protocol
                </h1>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  INTP 5w4 // THE SLIGHT EDGE
                </p>
              </div>
              
              <div className="flex gap-2 md:hidden">
                <button 
                  onClick={() => downloadCSV(completions, habits)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  title="Export Data"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               {/* User Avatar */}
               <div className="hidden md:flex items-center gap-2 mr-2">
                 {user.picture && (
                   <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
                 )}
               </div>

              <button 
                onClick={() => downloadCSV(completions, habits)}
                className="hidden md:block p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Export to CSV"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button 
                onClick={toggleTheme}
                className="hidden md:block p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={logout}
                className="hidden md:block p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>

              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 leading-none">
                  {progressPercentage}%
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Daily Completion</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 w-full bg-slate-200 dark:bg-slate-900 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        
        {/* Heatmap Section */}
        <section className="bg-white/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/50 rounded-xl p-4 transition-colors duration-300">
          <Heatmap completions={completions} totalHabitsCount={habits.length} />
        </section>

        {/* Tracks */}
        <div className="space-y-2">
          {tracks.map(track => {
            const trackHabits = habits.filter(h => h.trackId === track.id);
            return (
              <TrackSection 
                key={track.id}
                track={track}
                habits={trackHabits}
                completedHabits={todayCompletions}
                onToggle={(habitId) => toggleHabit(habitId, today)}
                onAdd={(title, duration, description) => addHabit(title, duration, track.id, description)}
                onDelete={(habitId) => removeHabit(habitId)}
              />
            );
          })}
        </div>

      </main>

      <footer className="text-center py-8 text-slate-400 dark:text-slate-600 text-xs font-mono">
        <p>"We are what we repeatedly do. Excellence, then, is not an act, but a habit."</p>
      </footer>
    </div>
  );
}

export default App;