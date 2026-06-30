import { resend } from "@/lib/email";
import type { BetterAuthOptions } from "better-auth";

export function createEmailVerificationConfig(ctx?: ExecutionContext) {
	return {
		emailVerification: {
			sendOnSignUp: true, // Automatically sends a verification email at signup
			autoSignInAfterVerification: true, // Automatically signIn the user after verification
			sendVerificationEmail: async ({ user, url }) => {
				const mailTask = resend.emails.send({
					from: "Template <account@mail.template.com>",
					to: user.email,
					subject: "Email Verification",
					html: `Click the link to verify your email: ${url}`,
				});
				ctx?.waitUntil(mailTask);
			},
		} as BetterAuthOptions["emailVerification"],
	};
}
