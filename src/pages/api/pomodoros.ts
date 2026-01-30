
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
    // 1. Verificar Autenticación
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // 2. Leer Datos del Body
        const body = await context.request.json();
        const { type, minutes, createdAt } = body;

        // Validaciones básicas
        if (!type || !minutes || !createdAt) {
             return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
        }

        const db = context.locals.runtime.env.DB;

        // 3. Insertar en D1
        await db.prepare(
            "INSERT INTO pomodoro_log (user_id, type, minutes, created_at) VALUES (?, ?, ?, ?)"
        ).bind(user.id, type, minutes, createdAt).run();

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (e) {
        console.error("Error saving pomodoro:", e);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function GET(context: APIContext): Promise<Response> {
    const user = context.locals.user;
    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const db = context.locals.runtime.env.DB;
        // Traemos los últimos 50 pomodoros
        const { results } = await db.prepare(
            "SELECT id, type, minutes, created_at as createdAt FROM pomodoro_log WHERE user_id = ? ORDER BY created_at DESC LIMIT 50"
        ).bind(user.id).all();

        // Mapeamos para devolver formato correcto (createdAt -> endTime/startTime simulado)
        // En base de datos guardamos 'createdAt', que es cuando terminó.
        const logs = results.map((row: any) => ({
            id: row.id,
            type: row.type,
            minutes: row.minutes,
            // Simulamos startTime restando minutos, solo para tener el objeto completo
            startTime: new Date(row.createdAt - (row.minutes * 60000)).toISOString(),
            endTime: new Date(row.createdAt).toISOString()
        }));

        return new Response(JSON.stringify(logs), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Error fetching logs" }), { status: 500 });
    }
}
