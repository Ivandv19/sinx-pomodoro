import { defineMiddleware } from "astro:middleware";
import { initializeLucia } from "../../lib/auth";
import { generateId } from "lucia";
import { scrypt } from "@noble/hashes/scrypt";
import { bytesToHex, hexToBytes, randomBytes } from "@noble/hashes/utils";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
    // 1. Parse Data
    const formData = await context.request.formData();
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || email.length < 3 || typeof password !== "string" || password.length < 6) {
        return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 400 });
    }

    const db = context.locals.runtime.env.DB;
    const lucia = initializeLucia(db);

    // 2. Check if user exists (D1)
    const existingUser = await db.prepare("SELECT * FROM user WHERE email = ?").bind(email).first();
    if (existingUser) {
        return new Response(JSON.stringify({ error: "Email already registered" }), { status: 400 });
    }

    try {
        const userId = generateId(15);
        
        // Using @noble/hashes scrypt (pure JS, Cloudflare Workers compatible)
        const salt = randomBytes(16);
        const hash = scrypt(password, salt, { N: 16384, r: 8, p: 1, dkLen: 32 });
        const passwordHash = `${bytesToHex(salt)}:${bytesToHex(hash)}`;

        // 3. Create User
        await db.prepare("INSERT INTO user (id, email, hashed_password, created_at) VALUES (?, ?, ?, ?)")
            .bind(userId, email, passwordHash, Date.now())
            .run();

        // 4. Create Session
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: {
                "Location": "/" // Helper for clients
            }
        });

    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "An unknown error occurred" }), { status: 500 });
    }
}

