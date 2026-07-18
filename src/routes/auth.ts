import { auth } from "@/lib/auth";
import { createHonoApp } from "@/lib/hono";
import { cors } from "hono/cors";

const R = createHonoApp();

// CORS configuration for all routes
R.use(
	"*",
	cors({
		origin: (origin, c) => {
			if (!origin) return null;

			const self = new URL(c.req.url).origin;

			const allowed = [
				self,
				/^https:\/\/.*\.trycloudflare\.com$/,
				"http://localhost:8081",
				"http://localhost:8082",
				"https://appleid.apple.com",
			];

			const ok = allowed.some((rule) =>
				rule instanceof RegExp ? rule.test(origin) : rule === origin,
			);

			return ok ? origin : undefined;
		},
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
		credentials: true,
	}),
);

// Middleware to initialize auth instance for each request
// Middleware to initialize auth instance for each request
R.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

// Handle all auth routes
R.all("/api/auth/*", async (c) => {
	return auth.handler(c.req.raw).catch((err) => {
		console.error(err);
		return c.json({ error: "Authentication failed", message: err }, 401);
	});
});

// Simple health check
R.get("/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default R;
