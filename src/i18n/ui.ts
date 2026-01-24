
// 1. Definimos los idiomas
export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

// 2. Aquí van tus textos (Clave : Traducción)
export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.blog': 'Blog',
    
    // Hero
    'hero.title': 'Domina tu tiempo',
    'hero.subtitle': 'Ya sea que estés, estudiando o creando, el método Pomodoro es tu mejor aliado.',
    'hero.span.coding': 'programando',
    'hero.span.studying': 'estudiando',
    'hero.span.creating': 'creando',
    'hero.focus.title': 'Máxima Concentración',
    'hero.focus.subtitle': 'El mundo puede esperar.',

    // Timer
    'timer.focus': 'Enfoque',
    'timer.short': 'Descanso',
    'timer.long': 'Descanso',
    'timer.setup.title': 'Configura tu Ciclo',
    'timer.setup.subtitle': 'Elige los minutos de enfoque:',
    'timer.setup.btn.start': 'Empezar a concentrarme',
    'timer.setup.btn.start.disabled': 'Selecciona un tiempo...',
    'timer.run.pause': '⏸ Pausar',
    'timer.run.resume': '▶ Continuar',
    'timer.run.new': 'Nuevo Plan ↺',
    'timer.run.cancel': 'Cancelar Plan',
    'timer.run.current': 'Bloque Actual',
    'timer.run.agenda': 'Agenda de Hoy',
    'timer.run.start': 'Inicio:',
    'timer.run.end': 'Fin Aprox:',
    'timer.run.finished': 'Terminado',
    
    // Timer Setup (Specific)
    'timer.setup.cycles': 'ciclos',
    'timer.setup.summary': 'Resumen del Plan',
    'timer.setup.break': 'Descanso',
    'timer.setup.finish': 'Fin',
    'stats.progress.title': 'Tu Progreso de Hoy',
    'stats.realTime': 'Tiempo de Enfoque Real',
    'stats.completedSessions': 'sesiones completadas',
    'stats.log.title': 'Log de Actividad',
    'stats.log.empty': 'Tu historial está vacío hoy. ¡A darle!',

    // Stats
    'stats.today': 'Hoy',
    'stats.focus': 'Foco',
    'stats.hours': 'Horas',
    'stats.minutes': 'Mins',
    'stats.sessions': 'Sesiones',

    // Footer
    'footer.whatis': '¿Qué es Pomodoro?',
    'footer.slogan': 'Herramienta de productividad. Sin distracciones, solo enfoque.',
    'footer.developed': 'Desarrollado por',
    'footer.rights': 'Todos los derechos reservados',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    
    // Hero
    'hero.title': 'Master your time',
    'hero.subtitle': 'Whether you are, studying or creating, the Pomodoro method is your best ally.',
    'hero.span.coding': 'coding',
    'hero.span.studying': 'studying',
    'hero.span.creating': 'creating',
    'hero.focus.title': 'Deep Focus',
    'hero.focus.subtitle': 'The world can wait.',

    // Timer
    'timer.focus': 'Focus',
    'timer.short': 'Break',
    'timer.long': 'Break',
    'timer.setup.title': 'Setup your Cycle',
    'timer.setup.subtitle': 'How much time do you have?', // Changed from previous "Setup your Cycle" to match question
    'timer.setup.btn.start': 'Start Session',
    'timer.setup.btn.start.disabled': 'Select time...',
    'timer.run.pause': '⏸ Pause',
    'timer.run.resume': '▶ Resume',
    'timer.run.new': 'New Plan ↺',
    'timer.run.cancel': 'Cancel Plan',
    'timer.run.current': 'Current Block',
    'timer.run.agenda': "Today's Agenda",
    'timer.run.start': 'Start:',
    'timer.run.end': 'End approx:',
    'timer.run.finished': 'Finished',
    
    // Timer Setup (Specific)
    'timer.setup.cycles': 'cycles',
    'timer.setup.summary': 'Plan Summary',
    'timer.setup.break': 'Break',
    'timer.setup.finish': 'End',
    'stats.progress.title': "Today's Progress",
    'stats.realTime': 'Actual Focus Time',
    'stats.completedSessions': 'sessions completed',
    'stats.log.title': 'Activity Log',
    'stats.log.empty': "Your history is empty today. Let's go!",

    // Stats
    'stats.today': 'Today',
    'stats.focus': 'Focus',
    'stats.hours': 'Hours',
    'stats.minutes': 'Mins',
    'stats.sessions': 'Sessions',

    // Footer
    'footer.whatis': 'What is Pomodoro?',
    'footer.slogan': 'Productivity tool. No distractions, just focus.',
    'footer.developed': 'Developed by',
    'footer.rights': 'All rights reserved',
  },
} as const;