import { useState } from "preact/hooks";
import TimerSetup from "./TimerSetup";
import TimerRun from "./TimerRun"; 

interface Props {
  lang: 'es' | 'en';
}

export default function PomodoroManager({ lang }: Props) {
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);

  return (
    <div className="w-full"> 
      
      {selectedMinutes === null ? (
        <TimerSetup lang={lang} onStart={(minutes) => setSelectedMinutes(minutes)} />
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