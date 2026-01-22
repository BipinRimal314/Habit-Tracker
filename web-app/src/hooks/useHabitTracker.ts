import { useState, useEffect } from 'react';
import type { Habit, Track, TrackId } from '../data/habits';
import { habits as defaultHabits, defaultTracks } from '../data/habits';
import { useAuth } from '../context/AuthContext';
import { GoogleSheetsService } from '../services/googleSheets';

// Format: { "YYYY-MM-DD": { "habit-id": true } }
type CompletionMap = Record<string, Record<string, boolean>>;

const STORAGE_KEY_COMPLETIONS = 'polymath-habit-tracker-v1';
const STORAGE_KEY_HABITS = 'polymath-habit-definitions-v1';
const STORAGE_KEY_TRACKS = 'polymath-track-definitions-v1';

export function useHabitTracker() {
  const { accessToken } = useAuth();
  const [completions, setCompletions] = useState<CompletionMap>({});
  const [habits, setHabits] = useState<Habit[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    // Load completions
    const savedCompletions = localStorage.getItem(STORAGE_KEY_COMPLETIONS);
    if (savedCompletions) {
      try {
        setCompletions(JSON.parse(savedCompletions));
      } catch (e) {
        console.error("Failed to parse completions", e);
      }
    }

    // Load habits
    const savedHabits = localStorage.getItem(STORAGE_KEY_HABITS);
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error("Failed to parse habits", e);
        setHabits(defaultHabits);
      }
    } else {
      setHabits(defaultHabits);
    }

    // Load tracks
    const savedTracks = localStorage.getItem(STORAGE_KEY_TRACKS);
    if (savedTracks) {
      try {
        setTracks(JSON.parse(savedTracks));
      } catch (e) {
        console.error("Failed to parse tracks", e);
        setTracks(defaultTracks);
      }
    } else {
      setTracks(defaultTracks);
    }

    setIsLoaded(true);
  }, []);

  // Sync with Google Sheets when authenticated
  useEffect(() => {
    if (!accessToken) return;

    const syncFromCloud = async () => {
      try {
        const cloudCompletions = await GoogleSheetsService.loadData(accessToken);
        // Merge with local? For now, Cloud is truth.
        setCompletions(cloudCompletions);
      } catch (error) {
        console.error("Failed to load from Google Sheets:", error);
      }
    };

    syncFromCloud();
  }, [accessToken]);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY_COMPLETIONS, JSON.stringify(completions));
  }, [completions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(habits));
  }, [habits, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY_TRACKS, JSON.stringify(tracks));
  }, [tracks, isLoaded]);

  const getTodayDate = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  };

  const toggleHabit = (habitId: string, date: string = getTodayDate()) => {
    const isNowComplete = !completions[date]?.[habitId];

    // Optimistic update
    setCompletions(prev => {
      const dayData = prev[date] || {};
      
      const newDayData = {
        ...dayData,
        [habitId]: isNowComplete
      };

      return {
        ...prev,
        [date]: newDayData
      };
    });

    // Sync to Cloud
    if (accessToken) {
      GoogleSheetsService.syncHabit(accessToken, date, habitId, isNowComplete)
        .catch(err => {
          console.error("Failed to sync to Sheets:", err);
          // Optional: Revert state if sync fails
        });
    }
  };

  const addHabit = (title: string, duration: string, trackId: TrackId, description: string = '') => {
    const newHabit: Habit = {
      id: `custom-${Date.now()}`,
      title,
      duration,
      description,
      trackId
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const removeHabit = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const addTrack = (title: string, color: string) => {
    const newTrack: Track = {
      id: `track-${Date.now()}` as TrackId,
      title,
      color
    };
    setTracks(prev => [...prev, newTrack]);
  };

  const removeTrack = (trackId: string) => {
    if (window.confirm('Are you sure? This will delete the track AND all its habits.')) {
      setTracks(prev => prev.filter(t => t.id !== trackId));
      setHabits(prev => prev.filter(h => h.trackId !== trackId));
    }
  };

  const isCompleted = (habitId: string, date: string = getTodayDate()) => {
    return !!completions[date]?.[habitId];
  };

  const getCompletionCount = (date: string = getTodayDate()) => {
    const dayData = completions[date] || {};
    // Only count habits that currently exist
    const activeHabitIds = new Set(habits.map(h => h.id));
    return Object.keys(dayData).filter(key => dayData[key] && activeHabitIds.has(key)).length;
  };

  return {
    habits,
    tracks,
    completions,
    toggleHabit,
    addHabit,
    removeHabit,
    addTrack,
    removeTrack,
    isCompleted,
    getCompletionCount,
    getTodayDate
  };
}
