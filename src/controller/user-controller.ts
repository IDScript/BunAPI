import { Hono } from "hono";
import { type RegisterUserRequest } from "../model/user-model";
import { UserService } from "../service/user-service";
import type { ApplicationVariables } from "../model/app-model";
import { log } from "../config/logger";

export const userController = new Hono<{ Variables: ApplicationVariables }>();

userController.post("/users", async (c) => {
	const text = await c.req.text();
	let request: RegisterUserRequest;

	try {
		request = JSON.parse(text) as RegisterUserRequest;
	} catch {
		return c.json({ error: "invalid json" }, 400);
	}

	const response = await UserService.register(request);
	log.info("Registering user", response);

	return c.json({
		data: response,
	});
});
