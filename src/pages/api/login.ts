import { initializeLucia } from "../../lib/auth";
import { scrypt } from "@noble/hashes/scrypt";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
    const formData = await context.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
        return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    const db = context.locals.runtime.env.DB;
    const lucia = initializeLucia(db);

    // 1. Fetch User
    const existingUser = await db.prepare("SELECT * FROM user WHERE email = ?").bind(email).first<{ id: string, hashed_password: string }>();

    if (!existingUser) {
        // Return Generic Error
        return new Response(JSON.stringify({ error: "Incorrect email or password" }), { status: 400 });
    }

    // 2. Verify Password (using @noble/hashes scrypt - pure JS)
    const [salt, hash] = existingUser.hashed_password.split(':');
    const passwordHash = scrypt(password, hexToBytes(salt), { N: 16384, r: 8, p: 1, dkLen: 32 });
    const validPassword = bytesToHex(passwordHash) === hash;

    if (!validPassword) {
        return new Response(JSON.stringify({ error: "Incorrect email or password" }), { status: 400 });
    }

    // 3. Create Session
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
}

