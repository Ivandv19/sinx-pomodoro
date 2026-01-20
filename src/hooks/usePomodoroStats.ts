// src/hooks/usePomodoroStats.ts
import { useState, useEffect } from "preact/hooks";

export type SessionType = "focus" | "short" | "long";

export interface LogEntry {
  id: number;
  type: SessionType;
  minutes: number;
  startTime: string;
  endTime: string;
}

export function usePomodoroStats() {
  // 🔥 CAMBIO: Inicialización "Lazy"
  // En lugar de arrancar vacío, leemos localStorage DIRECTAMENTE en el estado inicial.
  // Así no hay "parpadeo" de datos vacíos.
  const [history, setHistory] = useState<LogEntry[]>(() => {
    // Si estamos en el servidor (Astro build), regresamos vacío
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem("pomodoro_history");
      if (!saved) return [];

      const allHistory: LogEntry[] = JSON.parse(saved);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 días atrás

      // Filtramos solo entradas de los últimos 30 días
      const recentHistory = allHistory.filter(
        (entry) => new Date(entry.endTime) >= thirtyDaysAgo,
      );

      // Si había datos viejos, actualizamos localStorage
      if (recentHistory.length !== allHistory.length) {
        localStorage.setItem("pomodoro_history", JSON.stringify(recentHistory));
      }

      const today = now.toLocaleDateString();

      // Filtramos solo los de hoy para el estado
      return recentHistory.filter(
        (entry) => new Date(entry.endTime).toLocaleDateString() === today,
      );
    } catch (error) {
      console.error("Error leyendo historial:", error);
      return [];
    }
  });

  // Función para guardar (se mantiene igual, pero más robusta)
  const addSession = (type: SessionType, minutes: number, startTime: Date) => {
    const now = new Date();
    const newEntry: LogEntry = {
      id: Date.now(),
      type,
      minutes,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
    };

    // Actualizamos estado visual
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);

    // Guardamos en LocalStorage (Persistencia)
    // Leemos todo lo que había antes (incluso de otros días) para no borrarlo
    try {
      const existingRaw = localStorage.getItem("pomodoro_history");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem(
        "pomodoro_history",
        JSON.stringify([...existing, newEntry]),
      );
    } catch (e) {
      console.error("No se pudo guardar en localStorage", e);
    }
  };

  const totalFocusMinutes = history
    .filter((h) => h.type === "focus")
    .reduce((acc, curr) => acc + curr.minutes, 0);

  return {
    history,
    addSession,
    hours: Math.floor(totalFocusMinutes / 60),
    minutes: totalFocusMinutes % 60,
    sessionCount: history.filter((h) => h.type === "focus").length,
  };
}
