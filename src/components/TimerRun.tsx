// src/components/TimerRun.tsx
import { usePomodoroStats } from '../hooks/usePomodoroStats';
import { useTimerLogic } from '../hooks/useTimerLogic';
import DailySummary from './DailySummary';
import { ui } from '../i18n/ui';

interface Props {
    lang: 'es' | 'en';
    initialMinutes: number;
    onReset: () => void;
}

export default function TimerRun({ lang, initialMinutes, onReset }: Props) {
  const t = ui[lang];

  // 1. Hook de Estadísticas (Persistencia)
  const { addSession, history, hours, minutes, sessionCount } = usePomodoroStats();

  // 2. Hook de Lógica del Timer (Engine)
  const {
      timeLeft,
      isActive,
      isSessionFinished,
      currentSession,
      currentSessionIndex,
      schedule,
      planStartTime,
      estimatedFinishTime,
      formatTime,
      formatHour,
      toggleTimer,
      getTheme
  } = useTimerLogic({
      initialMinutes,
      onSessionComplete: (type, mins, startTime) => {
          addSession(type, mins, startTime);
      }
  });

  // 3. Variables de Renderizado
  const theme = getTheme(currentSession.type);
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / currentSession.duration;
  const dashOffset = circumference - (progress * circumference);

  const getLabel = (type: string) => {
      // Map session types to translated labels
      if (type === 'focus') return t['timer.focus'];
      if (type === 'short') return t['timer.short'];
      if (type === 'long') return t['timer.long'];
      return type;
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in py-6">
      
      <div className="flex flex-col items-center space-y-12">
        
        {/* RELOJ VISUAL */}
        <div className="flex flex-col items-center justify-center space-y-8">
             <div className="text-center">
                <span className="text-sm font-bold opacity-50 tracking-widest uppercase">
                    {t['timer.run.current']}
                </span>
                <h2 className={`text-4xl font-black mt-2 ${theme.color} drop-shadow-sm`}>
                    {getLabel(currentSession.type)}
                </h2>
            </div>

            <div className="relative w-80 h-80 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280" role="img" aria-label="Temporizador Pomodoro">
                    <title>Temporizador Pomodoro</title>
                    <circle cx="140" cy="140" r={radius} stroke="currentColor" strokeWidth="12" fill="none" className="text-base-300 dark:text-base-content/10" />
                    <circle cx="140" cy="140" r={radius} stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round"
                        className={`transition-all duration-1000 ease-linear ${theme.stroke}`}
                        style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
                    />
                    <circle cx="140" cy="20"  r="4" className="fill-base-content/30" />
                    <circle cx="260" cy="140" r="4" className="fill-base-content/30" />
                    <circle cx="140" cy="260" r="4" className="fill-base-content/30" />
                    <circle cx="20"  cy="140" r="4" className="fill-base-content/30" />
                </svg>

                <div className="absolute flex flex-col items-center z-10">
                    <span className={`text-7xl font-mono font-bold tracking-tighter ${theme.color}`}>
                        {formatTime(timeLeft)}
                    </span>
                    {isSessionFinished && (
                        <span className="text-sm mt-2 uppercase font-bold animate-pulse text-base-content">
                            {t['timer.run.finished']}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex gap-6 items-center">
                {!isSessionFinished ? (
                    <button 
                        type="button"
                        className={`btn btn-lg h-16 px-10 rounded-full border-none shadow-xl hover:scale-105 transition-transform ${
                            isActive ? 'bg-base-200 text-base-content' : theme.bgButton
                        }`}
                        onClick={toggleTimer}
                    >
                        {isActive ? (
                            <span className="text-lg font-bold flex items-center gap-2">{t['timer.run.pause']}</span>
                        ) : (
                            <span className="text-lg font-bold flex items-center gap-2">{t['timer.run.resume']}</span>
                        )}
                    </button>
                ) : (
                    <button type="button" className={`btn btn-lg h-16 px-10 rounded-full border-none shadow-xl animate-bounce text-white ${theme.bgButton}`} onClick={onReset}>
                        {t['timer.run.new']}
                    </button>
                )}
                <button type="button" onClick={onReset} className="btn btn-circle btn-ghost opacity-40 hover:opacity-100 tooltip" data-tip={t['timer.run.cancel']}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        {/* AGENDA */}
        <div className="w-full bg-base-100/50 backdrop-blur-sm rounded-2xl p-6 border border-base-200 shadow-sm">
            <div className="mb-6 pb-4 border-b border-base-200 flex justify-between items-center">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold opacity-70">{t['timer.run.agenda']}</h3>
                    <span className="text-xs font-mono opacity-40">{t['timer.run.start']} {formatHour(planStartTime)}</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase opacity-50">{t['timer.run.end']}</span>
                        <span className="text-2xl font-black">{estimatedFinishTime}</span>
                    </div>
                </div>
            </div>
            <div className="relative flex items-center overflow-x-auto pb-4 hide-scrollbar scroll-smooth snap-x">
                <div className="absolute left-0 right-0 top-[1.2rem] h-0.5 bg-base-300 z-0"></div>
                {schedule.map((session, index) => {
                    const isPast = index < currentSessionIndex;
                    const isCurrent = index === currentSessionIndex;
                    const sTheme = getTheme(session.type);
                    return (
                        <div key={index} className={`relative flex-shrink-0 flex flex-col items-center px-6 snap-center transition-all ${isCurrent ? 'opacity-100 scale-105' : 'opacity-50'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 transition-colors z-10 mb-4 ${
                                isPast ? 'bg-success border-success' : 
                                isCurrent ? `${sTheme.bgButton} border-white shadow-lg` : 
                                'bg-base-100 border-base-300'
                            }`}>
                                {isPast && <svg className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <div className={`p-3 rounded-lg border-b-4 w-40 text-center ${isCurrent ? 'bg-base-200 shadow-md ' + sTheme.border : 'border-transparent'}`}>
                                <div className="flex flex-col items-center">
                                    <span className={`font-bold text-sm truncate w-full`}>{getLabel(session.type)}</span>
                                    <span className="font-mono text-xs opacity-60">{Math.floor(session.duration / 60)}m</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* SUMMARY STATS */}
        <DailySummary
            lang={lang}
            history={history} 
            hours={hours} 
            minutes={minutes} 
            count={sessionCount} 
        />

      </div>
    </div>
  );
}