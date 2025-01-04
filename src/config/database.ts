import { log } from "./logger";
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
	log.error(event);
});
/* istanbul ignore next */
prismaClient.$on("warn", (e: Prisma.LogEvent): void => {
	log.warn(e);
});

prismaClient.$on("info", (e: Prisma.LogEvent): void => {
	log.info(e);
});
prismaClient.$on("query", (e: Prisma.QueryEvent): void => {
	log.verbose(`Query: ${e.query}`);
	log.verbose(`Params: ${e.params}`);
	log.verbose(`Duration: ${e.duration} ms`);
});
