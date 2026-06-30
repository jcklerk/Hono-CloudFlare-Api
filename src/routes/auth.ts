import { createAuth } from "@/lib/auth";
import { createHonoApp, named } from "@/lib/hono";
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
R.use(
	"*",
	named("Auth", async (c, next) => {
		const auth = createAuth(
			c.env,
			(c.req.raw as any).cf || {},
			new URL(c.req.url).origin,
			c.executionCtx as unknown as ExecutionContext,
		);
		c.set("auth", auth);
		await next();
	}),
);

// Handle all auth routes
R.all("/api/auth/*", async (c) => {
	const auth = c.get("auth");
	return auth.handler(c.req.raw);
});

// Simple health check
R.get("/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default R;
