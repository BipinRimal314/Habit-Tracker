import { useEffect, useState, useMemo } from 'react';

const PUNS = {
  morning: [
    "Fur-st things first: habits!",
    "Unleash the day!",
    "Ready to paw-ty?",
    "A new day to be grrr-eat!",
    "Wakey wakey, eggs and bakey!"
  ],
  day: [
    "Stay fur-cused!",
    "You're doing pawsome!",
    "Work hard, nap hard.",
    "No procrastin-tail-tion!",
    "Chase your goals (like squirrels)!",
    "You are a good boy/girl!"
  ],
  evening: [
    "Rough day? Shake it off.",
    "Paws and reflect.",
    "Almost time to curl up.",
    "Good habits = Good treats.",
    "Unwind and de-shed the stress."
  ],
  night: [
    "Dream of chasing squirrels...",
    "Rest those paws.",
    "Sleep tight, don't let the bed bugs bite.",
    "Recharging zoomies...",
    "Shhh... I'm hunting dreams."
  ]
};

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

export const RunningDog = () => {
  const [position, setPosition] = useState(-20);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [pun, setPun] = useState('');
  const [showPun, setShowPun] = useState(false);

  // Determine time of day
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 11) setTimeOfDay('morning');
      else if (hour >= 11 && hour < 17) setTimeOfDay('day');
      else if (hour >= 17 && hour < 22) setTimeOfDay('evening');
      else setTimeOfDay('night');
    };
    
    updateTime();
    const timer = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  // Movement Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        const speed = timeOfDay === 'night' ? 0.1 : 0.25; 
        let next = prev + speed * direction;
        
        if (next > 120) {
          setDirection(-1);
          next = 120;
          if (Math.random() > 0.5) triggerPun(); 
        } else if (next < -20) {
          setDirection(1);
          next = -20;
          if (Math.random() > 0.5) triggerPun();
        }
        
        return next;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [direction, timeOfDay]);

  const triggerPun = () => {
    const options = PUNS[timeOfDay];
    const randomPun = options[Math.floor(Math.random() * options.length)];
    setPun(randomPun);
    setShowPun(true);
    setTimeout(() => setShowPun(false), 4000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
        if (Math.random() > 0.7) triggerPun();
    }, 10000);
    return () => clearInterval(interval);
  }, [timeOfDay]);

  const colors = useMemo(() => {
    switch (timeOfDay) {
      case 'morning': return { coat: '#d4a373', dark: '#1f2937', collar: '#f472b6', eye: 'white' };
      case 'day': return { coat: '#ca8a04', dark: '#1e1b4b', collar: '#ef4444', eye: 'white' };
      case 'evening': return { coat: '#b45309', dark: '#4c1d95', collar: '#8b5cf6', eye: 'white' };
      case 'night': return { coat: '#78716c', dark: '#1c1917', collar: '#6366f1', eye: '#fef3c7' };
    }
  }, [timeOfDay]);

  return (
    <div 
      className="fixed top-0 pointer-events-none z-50 transition-transform duration-100 ease-linear"
      style={{ 
        left: `${position}%`,
        transform: `scaleX(${direction})`,
        top: '25px'
      }}
    >
      <div className="relative w-16 h-16">
        <div 
            className={`absolute top-16 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-2 px-4 whitespace-nowrap shadow-lg transition-all duration-300 origin-top ${showPun ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={{ transform: `translateX(-50%) scaleX(${direction})` }} 
        >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-l-2 border-t-2 border-slate-200 dark:border-slate-600 rotate-45"></div>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200" style={{ transform: `scaleX(${direction})` }}>
                {pun}
            </p>
        </div>

        <div className={`w-full h-full ${timeOfDay === 'night' ? 'animate-bounce-slow' : 'animate-bounce-fast'}`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
            <path d="M20 55 Q 10 45, 15 35" stroke={colors.dark} strokeWidth="8" strokeLinecap="round" className="origin-bottom animate-wag" />
            <rect x="28" y="65" width="10" height="20" rx="5" fill={colors.dark} className="animate-run-leg-2" />
            <rect x="58" y="65" width="10" height="20" rx="5" fill={colors.dark} className="animate-run-leg-1" />
            <g transform="rotate(-2 50 50)">
                <rect x="20" y="40" width="55" height="35" rx="12" fill={colors.coat} />
                <path d="M25 40 L70 40 L65 60 L30 60 Z" fill={colors.dark} opacity="0.9" />
            </g>
            <rect x="22" y="68" width="10" height="18" rx="5" fill={colors.coat} className="animate-run-leg-1" />
            <rect x="52" y="68" width="10" height="18" rx="5" fill={colors.coat} className="animate-run-leg-2" />
            <g className={timeOfDay === 'night' ? 'animate-nod-slow' : 'animate-wiggle'}>
                <circle cx="70" cy="48" r="15" fill={colors.coat} />
                <rect x="65" y="30" width="28" height="25" rx="10" fill={colors.coat} />
                <rect x="85" y="42" width="12" height="10" rx="4" fill={colors.dark} />
                <circle cx="95" cy="45" r="3" fill="#111" />
                <path d="M72 32 L68 15 L80 32 Z" fill={colors.dark} />
                <path d="M85 32 L89 15 L77 32 Z" fill={colors.dark} />
                {timeOfDay === 'night' ? (
                    <g>
                        <path d="M75 42 Q 78 45, 81 42" stroke={colors.eye} strokeWidth="2" fill="none" />
                        <path d="M84 42 Q 87 45, 90 42" stroke={colors.eye} strokeWidth="2" fill="none" />
                    </g>
                ) : (
                    <g>
                        <circle cx="78" cy="40" r="2.5" fill={colors.eye} />
                        <circle cx="78" cy="40" r="1" fill="#000" />
                        <circle cx="87" cy="40" r="2.5" fill={colors.eye} />
                        <circle cx="87" cy="40" r="1" fill="#000" />
                    </g>
                )}
                {timeOfDay !== 'night' && (
                     <path d="M88 52 Q 92 60, 86 60" fill="#f43f5e" stroke="#be123c" strokeWidth="0.5" />
                )}
            </g>
            <rect x="68" y="52" width="15" height="5" rx="2" fill={colors.collar} />
            <circle cx="75" cy="57" r="2" fill="#fbbf24" />
          </svg>
        </div>
      </div>
    </div>
  );
};