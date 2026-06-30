import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import type {
	D1Database,
	IncomingRequestCfProperties,
} from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { createEmailAndPasswordAuthConfig } from "./account/emailAndPassword";
import { createEmailVerificationConfig } from "./account/emailVerification";
import { createUserConfig } from "./account/user";
import { createD1Config } from "./cloudflare/d1";
import trustedOrigins from "./trustedOrigins";
// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(
	env?: Cloudflare.Env,
	cf?: IncomingRequestCfProperties,
	baseURL?: string,
	ctx?: ExecutionContext,
) {
	baseURL = baseURL || env?.BETTER_AUTH_URL || "";

	return betterAuth({
		baseURL,
		...withCloudflare(
			{
				// cloudflare-specific features
				autoDetectIpAddress: true,
				geolocationTracking: true,
				cf: cf || {},
				...(createD1Config(env) as any),
			},
			{
				trustedOrigins,

				secret: env?.BETTER_AUTH_SECRET,

				logger: {
					disabled: true,
				},

				advanced: {
					crossSubDomainCookies: {
						enabled: true,
						domain: env?.ROOT_DOMAIN || "example.com", // your domain
					},
				},
				// Settings for better-auth features

				socialProviders: {
					// ...createGoogleAuthConfig(env),
					// ...createAppleAuthConfig(env),
				},
				...createEmailAndPasswordAuthConfig(ctx),
				...createEmailVerificationConfig(ctx),
				...createUserConfig(ctx),

				plugins: [],

				rateLimit: {},
			},
		),
		// Only add database adapter for CLI schema generation
		...(env
			? {}
			: {
					database: drizzleAdapter({} as D1Database, {
						provider: "sqlite",
						usePlural: true,
						debugLogs: true,
					}),
				}),
	});
}

// Export for CLI schema generation
export const auth = createAuth();

// Export for runtime usage
export { createAuth };
