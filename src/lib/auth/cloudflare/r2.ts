// import db, { and, eq, not, userFiles } from "@/lib/db";
// import type { R2Config } from "better-auth-cloudflare";
// export function createR2Config(env?: Cloudflare.Env, ctx?: ExecutionContext) {
// 	if (!env?.R2_BUCKET) {
// 		return {};
// 	}

// 	return {
// 		r2: {
// 			bucket: env.R2_BUCKET,

// 			maxFileSize: 10 * 1024 * 1024,

// 			allowedTypes: [".jpg", ".jpeg", ".png", ".gif", ".json"],

// 			additionalFields: {
// 				category: { type: "string", required: false },
// 				isPublic: { type: "boolean", required: false },
// 				description: { type: "string", required: false },
// 			},

// 			hooks: {
// 				upload: {
// 					before: async (file, hookCtx) => {
// 						if (hookCtx.session === null) {
// 							return null;
// 						}
// 					},

// 					after: async (file, hookCtx) => {
// 						if (file.category === "avatar") {
// 							const imageUrl = env.CDN_ROOT + "/" + file.r2Key;

// 							// Update the user's profile image URL in the database
// 							hookCtx.internalAdapter.updateUser(hookCtx.session!.user.id, {
// 								image: imageUrl,
// 								updatedAt: new Date(),
// 							});

// 							// Find existing avatar files for the user and delete them
// 							const userAvatarList = await db
// 								.select()
// 								.from(userFiles)
// 								.where(
// 									and(
// 										eq(userFiles.userId, hookCtx.session!.user.id),
// 										eq(userFiles.category, "avatar"),
// 										not(eq(userFiles.r2Key, file.r2Key)),
// 									),
// 								);
// 							if (userAvatarList.length > 0) {
// 								console.info(
// 									"Deleting old avatar files:",
// 									userAvatarList.map((avatar) => avatar.r2Key),
// 								);
// 								await Promise.all(
// 									userAvatarList.map(async (avatar) => {
// 										try {
// 											await db
// 												.delete(userFiles)
// 												.where(eq(userFiles.id, avatar.id));

// 											await env.R2_BUCKET.delete(avatar.r2Key);

// 											console.info("Deleted old avatar:", avatar.r2Key);
// 										} catch (err) {
// 											console.error("Error deleting old avatar:", err);
// 										}
// 									}),
// 								);
// 							}
// 							console.info(
// 								"Updated user:",
// 								hookCtx.session!.user.id,
// 								"profile image URL to:",
// 								imageUrl,
// 							);
// 						}
// 					},
// 				},

// 				download: {
// 					before: async (file, hookCtx) => {
// 						// if (file.isPublic === false && file.userId !== hookCtx.session?.user.id) {
// 						//     return null;
// 						// }
// 					},
// 				},
// 			},
// 		} as R2Config,
// 	};
// }
