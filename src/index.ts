import { createHonoApp } from "@/lib/hono";
import routeAuth from "@/routes/auth";
import routeV1 from "@/routes/v1";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const app = createHonoApp();

app.use("*", logger());

app.route("", routeAuth);

app.route("/v1", routeV1);

app.use("/", prettyJSON({ force: true }));

app.get("/", (c) => {
	const routes = app.routes.map((route) => {
		console.log(
			`Route: ${route.method} ${route.path} - Handler: ${route.handler.name}`,
		);
		if (!route.handler.name)
			return {
				method: route.method,
				path: route.path,
			};
	});

	return c.json(
		{ message: "Welcome to the API", routes: routes.filter(Boolean) },
		200,
	);
});

export default app;
