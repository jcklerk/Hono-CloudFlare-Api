import UserController from "@/controllers/UserController";
import { createHonoApp } from "@/lib/hono";

const R = createHonoApp();

R.route("/users", UserController);

export default R;
