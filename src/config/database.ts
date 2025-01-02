import { logger } from "./logger";
import { Prisma, PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient({
	log: [
		{
			emit: "event",
			level: "query",
		},
		{
			emit: "event",
			level: "error",
		},
		{
			emit: "event",
			level: "info",
		},
		{
			emit: "event",
			level: "warn",
		},
	],
});
/* istanbul ignore next */
prismaClient.$on("error", (event: Prisma.LogEvent): void => {
	logger.error(event);
});
/* istanbul ignore next */
prismaClient.$on("warn", (e: Prisma.LogEvent): void => {
	logger.warn(e);
});

prismaClient.$on("info", (e: Prisma.LogEvent): void => {
	logger.info(e);
});
prismaClient.$on("query", (e: Prisma.QueryEvent): void => {
	logger.verbose(`Query: ${e.query}`);
	logger.verbose(`Params: ${e.params}`);
	logger.verbose(`Duration: ${e.duration} ms`);
});
