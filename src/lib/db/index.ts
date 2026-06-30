import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema/";

const db = drizzle(env.D1_DATABASE, { schema: { ...schema }, logger: false });

export default db;

export * from "./schema";

export * from "drizzle-orm";
