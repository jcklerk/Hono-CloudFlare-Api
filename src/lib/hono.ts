import { createAuth } from "@/lib/auth";
import db from "@/lib/db";
import type { MiddlewareHandler } from "hono";
import { Hono } from "hono";

// Factory function to create a new Hono app with the correct environment type

type Variables = {
	auth: ReturnType<typeof createAuth>;
	db: typeof db;
};

export type AppEnv = {
	Bindings: Cloudflare.Env;
	Variables: Variables;
};

export const createHonoApp = () => new Hono<AppEnv>();

export type HonoApp = Hono<AppEnv>;

// Named middleware utility function

export function named<T extends MiddlewareHandler>(name: string, fn: T): T {
	Object.defineProperty(fn, "name", {
		value: name,
		configurable: true,
	});
	return fn;
}
