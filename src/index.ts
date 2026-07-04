import { createHonoApp } from "@/lib/hono";
import routeAuth from "@/routes/auth";
import routeV1 from "@/routes/v1";
import { inspectRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const app = createHonoApp();

app.use("*", logger());

app.route("", routeAuth);

app.route("/v1", routeV1);

app.use("/", prettyJSON({ force: true }));

app.get("/", (c) => {
	const routes = inspectRoutes(app)
		.filter((route) => route.isMiddleware === false)
		.map((route) => ({
			method: route.method,
			path: route.path,
		}));
	return c.json(
		{
			message: "Welcome to the API",
			routes: routes,
		},
		200,
	);
});

export default app;
