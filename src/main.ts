import { Hono } from "hono";
import { ZodError } from "zod";
import { config } from "dotenv";
import pkg from "../package.json";
import { logger } from "./config/logger";
import { prismaClient } from "./config/database";
import { HTTPException } from "hono/http-exception";
import { serve, type ServerType } from "@hono/node-server";

config();

const port: number = Number(process.env.API_PORT ?? 3030);

const app = new Hono().basePath("/api");

app.get("/", (c) => {
	const msg: string = pkg.description ?? "KAnggara Web APP";
	const stab: string = process.env.APP_STAB ?? "Developer-Preview";
	const version: string = process.env.APP_VERSION ?? pkg.version ?? "0.0.1";

	return c.json(
		{
			message: msg,
			version: version,
			stability: stab,
		},
		404
	);
});

app.notFound((c) => {
	return c.json(
		{
			errors: "Not Found",
		},
		404
	);
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

const server: ServerType = serve({
	port: port,
	fetch: app.fetch,
});

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("unhandledRejection", gracefulShutdown);

async function gracefulShutdown(): Promise<void> {
	logger.info("SIGTERM/SIGINT signal received: closing HTTP server");
	logger.info("Shutting down gracefully...");
	await prismaClient.$disconnect();

	server.close(() => {
		logger.info("HTTP server closed");
		// Close any other connections or resources here
		process.exit(0);
	});

	// Force close the server after 5 seconds
	setTimeout(() => {
		console.error(
			"Could not close connections in time, forcefully shutting down"
		);
		process.exit(1);
	}, 5000);
}

export default server;
