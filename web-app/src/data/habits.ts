export type TrackId = 'ml' | 'music' | 'body' | 'mind';

export interface Habit {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g. "5 mins"
  trackId: TrackId;
}

export interface Track {
  id: TrackId;
  title: string;
  color: string;
}

export const defaultTracks: Track[] = [
  { id: 'ml', title: 'Machine Learning', color: 'text-purple-400' },
  { id: 'music', title: 'Music (Piano & Vocal)', color: 'text-pink-400' },
  { id: 'body', title: 'Body (Dance & Calisthenics)', color: 'text-orange-400' },
  { id: 'mind', title: 'Mind & Systems', color: 'text-emerald-400' },
];

export const habits: Habit[] = [
  // ML
  { id: 'ml-read', title: 'Read 1 Abstract', description: 'Abstract + Conclusion of one paper.', duration: '5m', trackId: 'ml' },
  { id: 'ml-code', title: 'One Function Rule', description: 'Write or refactor one Python function.', duration: '15m', trackId: 'ml' },
  { id: 'ml-math', title: 'Math Micro-Dose', description: 'One Linear Algebra/Calculus problem.', duration: '10m', trackId: 'ml' },
  
  // Music
  { id: 'music-scales', title: 'Scales & Arpeggios', description: 'Rigorous mechanical warm-up.', duration: '5m', trackId: 'music' },
  { id: 'music-sight', title: 'Sight Read 4 Bars', description: 'Pattern recognition focus.', duration: '5m', trackId: 'music' },
  { id: 'music-improv', title: 'Improvise', description: 'Constraint-based (e.g. black keys only).', duration: '5m', trackId: 'music' },
  { id: 'music-pitch', title: 'Pitch Matching', description: 'Hum a note, check tuner, adjust.', duration: '5m', trackId: 'music' },
  { id: 'music-verse', title: 'One Verse', description: 'Sing and record one verse.', duration: '5m', trackId: 'music' },

  // Body
  { id: 'body-iso', title: 'Isolation Drills', description: 'Chest/Hip/Shoulder isolations.', duration: '5m', trackId: 'body' },
  { id: 'body-groove', title: 'One Song Groove', description: 'Move without choreography.', duration: '3m', trackId: 'body' },
  { id: 'body-gtg', title: 'Grease the Groove', description: '5 pushups or 2 pullups.', duration: '1m', trackId: 'body' },
  { id: 'body-joint', title: 'Joint Mobility', description: 'Wrists and shoulders.', duration: '5m', trackId: 'body' },

  // Mind
  { id: 'mind-2min', title: '2-Minute Entry', description: 'Start a dreaded task for just 2 mins.', duration: '2m', trackId: 'mind' },
  { id: 'mind-journal', title: 'Brain Dump', description: 'Clear the noise before sleep.', duration: '5m', trackId: 'mind' },
];
