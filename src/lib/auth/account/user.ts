import { resend } from "@/lib/email";
import { type BetterAuthOptions } from "better-auth";

export function createUserConfig(ctx?: ExecutionContext) {
	return {
		user: {
			changeEmail: {
				enabled: true,
			},
			additionalFields: {
				// isPrivate: {
				// 	type: "boolean",
				// 	default: false,
				// 	input: true,
				// 	returned: true,
				// 	required: false,
				// },
			},
			deleteUser: {
				enabled: true,
				sendDeleteAccountVerification: async (
					{
						user, // The user object
						url, // The auto-generated URL for deletion
						token, // The verification token  (can be used to generate custom URL)
					},
					request, // The original request object (optional)
				) => {
					const mailTask = resend.emails.send({
						from: "Template <account@mail.template.com>",
						to: user.email,
						subject: "Account Deletion Confirmation",
						html: `Copy this token to complete your account deletion: ${token}`,
					});
					ctx?.waitUntil(mailTask); // Use waitUntil to ensure the email is sent even if the user aborts the request
				},
			},
		} as BetterAuthOptions["user"],
	};
}
