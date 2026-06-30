import db from "@/lib/db";

export function createD1Config(env?: Cloudflare.Env) {
	// if (!env?.D1_DATABASE) {
	// 	return {};
	// }

	return {
		d1: {
			db: db,
			options: {
				usePlural: true,
				debugLogs: false,
			},
		},
	};
}
