import type { Context, Next } from "hono";
import { auth } from "../auth";
import type { AppEnv } from "../hono";
import { guest, type Statement } from "./permissions";

const requirePermission =
	<K extends keyof Statement>(
		permissionKey: K,
		permissionAction: Statement[K][number],
	) =>
	async (c: Context<AppEnv>, next: Next) => {
		const user = c.get("user");
		if (!user) {
			const result = guest.authorize({
				[permissionKey]: [permissionAction],
			});

			if (!result.success) {
				return c.json(
					{
						error: {
							message: `You are not authenticated and You do not have permission to ${permissionAction.toString()} ${permissionKey}`,
							code: 403,
						},
					},
					403,
				);
			}

			return next();
		}
		const hasPerms = await auth.api.userHasPermission({
			body: {
				userId: user.id,
				permissions: {
					[permissionKey]: [permissionAction],
				},
			},
		});
		if (!hasPerms.success) {
			return c.json(
				{
					error: {
						message: `You do not have permission to ${permissionAction.toString()} ${permissionKey}`,
						code: 403,
					},
				},
				403,
			);
		}
		await next();
	};

export default requirePermission;
