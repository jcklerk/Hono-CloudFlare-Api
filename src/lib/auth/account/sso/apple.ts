// import { importPKCS8, SignJWT } from "jose";

// async function generateAppleClientSecret(
// 	clientId: string,
// 	teamId: string,
// 	keyId: string,
// 	privateKey: string,
// ) {
// 	const key = await importPKCS8(privateKey, "ES256");
// 	const now = Math.floor(Date.now() / 1000);
// 	return new SignJWT({})
// 		.setProtectedHeader({ alg: "ES256", kid: keyId })
// 		.setIssuer(teamId)
// 		.setSubject(clientId)
// 		.setAudience("https://appleid.apple.com")
// 		.setIssuedAt(now)
// 		.setExpirationTime(now + 180 * 24 * 60 * 60)
// 		.sign(key);
// }

// export function createAppleAuthConfig(env?: Cloudflare.Env) {
// 	return {
// 		apple: async () => ({
// 			clientId: env?.APPLE_CLIENT_ID || "",
// 			clientSecret: await generateAppleClientSecret(
// 				env?.APPLE_CLIENT_ID || "",
// 				env?.APPLE_TEAM_ID || "",
// 				env?.APPLE_KEY_ID || "",
// 				env?.APPLE_PRIVATE_KEY || "",
// 			),
// 			appBundleIdentifier: env?.APPLE_APP_BUNDLE_ID || "",
// 		}),
// 	};
// }
