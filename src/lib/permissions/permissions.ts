import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
	...defaultStatements,
	// controllername: ["index", "show", "store", "update", "destroy"],
} as const;

export const ac = createAccessControl(statement);

export const guest = ac.newRole({
	// controllername: ["index", "show",],
});

export const user = ac.newRole({
	// controllername: ["index", "show", "store", "update"],
});

export const admin = ac.newRole({
	...adminAc.statements,
	// controllername: ["index", "show", "store", "update", "destroy"],
});

export type Statement = typeof statement;
