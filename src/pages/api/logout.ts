
import { initializeLucia } from "../../lib/auth";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return new Response(null, {
			status: 401
		});
	}

    const db = context.locals.runtime.env.DB;
    const lucia = initializeLucia(db);

	await lucia.invalidateSession(context.locals.session.id);
    
    // 🔥 Borrar también del Caché KV
    const kv = context.locals.runtime.env.SESSION_CACHE;
    if (kv) {
        await kv.delete(context.locals.session.id);
    }

	const sessionCookie = lucia.createBlankSessionCookie();
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return context.redirect("/");
}
