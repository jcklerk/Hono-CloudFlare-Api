import db, { eq, users } from "@/lib/db";
import { createHonoApp, type AppEnv } from "@/lib/hono";
import type { Context } from "hono";

const UserController = createHonoApp();

UserController.get("/", async (ctx: Context<AppEnv>) => {
	const auth = ctx.get("auth");
	const session = await auth.api.getSession({
		headers: ctx.req.raw.headers,
	});
	if (!session) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	return ctx.json({ user: session.user });
});

UserController.get("/:id", async (ctx: Context<AppEnv>) => {
	const auth = ctx.get("auth");
	const session = await auth.api.getSession({
		headers: ctx.req.raw.headers,
	});
	if (!session) {
		return ctx.json({ error: "Unauthorized" }, 401);
	}

	const userId = ctx.req.param("id");

	if (!userId) {
		return ctx.json({ error: "User ID is required" }, 400);
	}

	const userProfile = await db
		.select({
			userId: users.id,
			name: users.name,
			image: users.image,
			email: users.email,
		})
		.from(users)
		.where(eq(users.id, userId))
		.limit(1)
		.get();

	if (!userProfile) {
		return ctx.json({ error: "User not found" }, 404);
	}

	return ctx.json({
		error: "",
		userProfile: userProfile,
	});
});

export default UserController;
