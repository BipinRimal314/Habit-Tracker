import { useState } from 'react';
import { useHabitTracker } from './hooks/useHabitTracker';
import { useTheme } from './hooks/useTheme';
import { useDataExport } from './hooks/useDataExport';
import { TrackSection } from './components/TrackSection';
import { Heatmap } from './components/Heatmap';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RunningDog } from './components/RunningDog';

function App() {
  const { user, isLoading, login, logout } = useAuth();
  const { completions, habits, tracks, toggleHabit, addHabit, removeHabit, addTrack, removeTrack, getTodayDate } = useHabitTracker();
  const { theme, toggleTheme } = useTheme();
  const { downloadCSV } = useDataExport();
  const [isAddingTrack, setIsAddingTrack] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackColor, setNewTrackColor] = useState('text-enfp-primary');

  const today = getTodayDate();
  
  const allowedEmail = import.meta.env.VITE_ALLOWED_EMAIL;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-enfp-light dark:bg-enfp-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-enfp-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={(res) => login(res.access_token)} />;
  }

  if (allowedEmail && user.email !== allowedEmail) {
    return (
      <div className="min-h-screen bg-enfp-light dark:bg-enfp-dark flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-enfp-dark/50 border border-enfp-danger/20 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <h1 className="text-xl font-bold text-enfp-danger">Access Denied</h1>
          <p className="text-enfp-text dark:text-enfp-text-dark">
            The email <span className="font-mono bg-enfp-danger/10 px-1 rounded">{user.email}</span> is not authorized to access this tracker.
          </p>
          <button
            onClick={logout}
            className="text-enfp-muted hover:text-enfp-text dark:hover:text-enfp-text-dark underline"
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
    <div className="min-h-screen bg-enfp-light dark:bg-enfp-dark text-enfp-text dark:text-enfp-text-dark pb-20 selection:bg-enfp-secondary/50 transition-colors duration-300 overflow-x-hidden">
      {/* Header / Dashboard */}
      <header className="sticky top-0 z-10 border-b border-enfp-accent/20 bg-white/70 dark:bg-enfp-dark/80 backdrop-blur-md transition-colors duration-300 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex justify-between items-start w-full md:w-auto">
              <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-enfp-primary to-enfp-accent bg-clip-text text-transparent tracking-tight">
                  Sparkle Habits
                </h1>
                <p className="text-xs text-enfp-muted font-bold tracking-widest mt-1 uppercase">
                  ENFP 2w3 // The Happy Path
                </p>
              </div>
              
              <div className="flex gap-2 md:hidden">
                <button 
                  onClick={() => downloadCSV(completions, habits)}
                  className="p-2 rounded-xl bg-white dark:bg-white/5 text-enfp-text/70 dark:text-enfp-text-dark/70 shadow-sm"
                  title="Export Data"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-white dark:bg-white/5 text-enfp-text/70 dark:text-enfp-text-dark/70 shadow-sm"
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button 
                  onClick={logout}
                  className="p-2 rounded-xl bg-white dark:bg-white/5 text-enfp-text/70 dark:text-enfp-text-dark/70 shadow-sm"
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
                   <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-enfp-secondary shadow-md" />
                 )}
               </div>

              <button 
                onClick={() => downloadCSV(completions, habits)}
                className="hidden md:block p-2 rounded-xl bg-white dark:bg-white/5 text-enfp-text/70 dark:text-enfp-text-dark/70 hover:bg-enfp-primary/10 hover:text-enfp-primary transition-all shadow-sm hover:shadow"
                title="Export to CSV"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button 
                onClick={toggleTheme}
                className="hidden md:block p-2 rounded-xl bg-white dark:bg-white/5 text-enfp-text/70 dark:text-enfp-text-dark/70 hover:bg-enfp-primary/10 hover:text-enfp-primary transition-all shadow-sm hover:shadow"
                title="Toggle Theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={logout}
                className="hidden md:block p-2 rounded-xl bg-white dark:bg-white/5 text-enfp-text/70 dark:text-enfp-text-dark/70 hover:bg-enfp-primary/10 hover:text-enfp-primary transition-all shadow-sm hover:shadow"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>

              <div className="text-right">
                <div className="text-3xl font-black font-mono text-enfp-primary leading-none drop-shadow-sm">
                  {progressPercentage}%
                </div>
                <div className="text-[10px] text-enfp-muted uppercase tracking-wider font-bold">Daily Joy</div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-enfp-muted/20 mt-4 rounded-full overflow-hidden p-[1px]">
            <div 
              className="h-full bg-gradient-to-r from-enfp-secondary to-enfp-primary rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(251,113,133,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        
        {/* Heatmap Section */}
        <section className="bg-white/60 dark:bg-enfp-dark/40 border border-white/50 dark:border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-sm transition-colors duration-300">
          <Heatmap completions={completions} totalHabitsCount={habits.length} />
        </section>

        {/* Tracks */}
        <div className="space-y-4">
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
                onDeleteTrack={removeTrack}
              />
            );
          })}
        </div>

        {/* Add Track Section */}
        <div className="border-t border-enfp-accent/10 pt-8 mt-12 mb-20">
            {!isAddingTrack ? (
                <button 
                    onClick={() => setIsAddingTrack(true)}
                    className="flex items-center gap-2 text-sm text-enfp-muted hover:text-enfp-primary transition-colors mx-auto group"
                >
                    <span className="text-2xl group-hover:scale-125 transition-transform">✨</span> <span className="font-bold">Add New Track</span>
                </button>
            ) : (
                <form 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (newTrackTitle) {
                            addTrack(newTrackTitle, newTrackColor);
                            setNewTrackTitle('');
                            setIsAddingTrack(false);
                        }
                    }}
                    className="max-w-md mx-auto bg-white/50 dark:bg-enfp-dark/50 p-6 rounded-3xl shadow-lg border border-enfp-primary/10 space-y-4"
                >
                    <h3 className="text-lg font-bold text-enfp-text dark:text-enfp-text-dark text-center">Create New Track</h3>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Track Title (e.g. Self Care)" 
                            value={newTrackTitle}
                            onChange={(e) => setNewTrackTitle(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-enfp-muted/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-enfp-primary transition-all"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-xs text-enfp-muted mb-3 block font-bold uppercase tracking-wider">Color Theme</label>
                        <div className="flex gap-3 justify-center flex-wrap">
                            {[
                                'text-enfp-primary', 'text-enfp-secondary', 'text-enfp-accent', 
                                'text-enfp-success', 'text-sky-400', 'text-orange-400', 
                                'text-enfp-danger', 'text-pink-500'
                            ].map(color => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setNewTrackColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 shadow-sm ${color.replace('text-', 'bg-')} ${newTrackColor === color ? 'border-white dark:border-enfp-dark ring-2 ring-enfp-accent' : 'border-transparent'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setIsAddingTrack(false)}
                            className="px-4 py-2 text-sm text-enfp-muted hover:text-enfp-text dark:hover:text-enfp-text-dark transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!newTrackTitle}
                            className="px-6 py-2 text-sm bg-enfp-primary text-white rounded-xl font-bold hover:bg-rose-500 disabled:opacity-50 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            Create Track
                        </button>
                    </div>
                </form>
            )}
        </div>

      </main>

      <footer className="text-center py-8 text-enfp-muted/80 text-xs font-mono">
        <p>"Spread love everywhere you go."</p>
      </footer>
      
      <RunningDog />
    </div>
  );
}

export default App;