import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

const app = new Hono();

app.get("/api", (c) => {
	return c.text("Hello Hono!");
});

app.onError(async (err, c) => {
	if (err instanceof HTTPException) {
		c.status(err.status);
		return c.json({
			errors: err.message,
		});
	} else if (err instanceof ZodError) {
		c.status(400);
		return c.json({
			errors: err.message,
		});
	} else {
		c.status(500);
		return c.json({
			errors: err.message,
		});
	}
});

export default app;
