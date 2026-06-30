import { resend } from "@/lib/email";
import bcrypt from "bcryptjs";
import type { BetterAuthOptions } from "better-auth";

export function createEmailAndPasswordAuthConfig(ctx?: ExecutionContext) {
	return {
		emailAndPassword: {
			enabled: true,
			sendOnSignUp: true,
			requireEmailVerification: true,
			password: {
				hash: async (password: string) => {
					return bcrypt.hash(password, 10);
				},

				verify: async ({
					password,
					hash,
				}: {
					password: string;
					hash: string;
				}) => {
					return bcrypt.compare(password, hash);
				},
			},
			sendResetPassword: async ({ user, url, token }, request) => {
				const mailTask = resend.emails.send({
					from: "Template <account@mail.template.com>",
					to: user.email,
					subject: "Password Reset Request",
					html: `Click the link to reset your password: ${url}`,
				});
				ctx?.waitUntil(mailTask);
			},
			onPasswordReset: async ({ user }, request) => {
				const mailTask = resend.emails.send({
					from: "Template <account@mail.template.com>",
					to: user.email,
					subject: "Password has been Reset",
					html: `Your password has been successfully reset for ${user.email}. If you did not perform this action, please contact our support immediately.`,
				});
				ctx?.waitUntil(mailTask);
			},
		} as BetterAuthOptions["emailAndPassword"],
	};
}
