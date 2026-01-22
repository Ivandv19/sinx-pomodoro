import { useState, useEffect } from "preact/hooks";
import TimerSetup from "./TimerSetup";
import TimerRun from "./TimerRun"; 

interface Props {
  lang?: 'es' | 'en';
}

const STORAGE_KEY = 'pomodoro_active_session';

export default function PomodoroManager({ lang = 'es' }: Props) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);

  // 🔥 Check for saved session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // 1. Check for running timer state first
      const timerState = localStorage.getItem('pomodoro_timer_state');
      if (timerState) {
          const state = JSON.parse(timerState);
          if (state.initialMinutes && !state.isSessionFinished) {
              setSelectedMinutes(state.initialMinutes);
              return;
          }
      }

      // 2. Fallback to just "active session" setup preference
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Auto-restore the session
        setSelectedMinutes(state.initialMinutes);
      }
    } catch (e) {
      console.error('Error loading saved session:', e);
    }
  }, []);

  return (
    <div className="w-full"> 
      
      {selectedMinutes === null ? (
        <TimerSetup 
            lang={lang}
            onStart={(minutes) => {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ initialMinutes: minutes }));
              setSelectedMinutes(minutes);
            }}
          />
      ) : (
        <TimerRun
            lang={lang}
            initialMinutes={selectedMinutes}
            onReset={() => setSelectedMinutes(null)}
          />
      )}
      
    </div>
  );
}