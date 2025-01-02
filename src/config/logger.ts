import "dotenv/config";
import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logsFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp}|[${level.toUpperCase()}]|${message}|`;
});

const logLevel: string = process.env.LOG_LEVEL ?? "warn";
console.error(logLevel);
const todayDate: string = new Date().toISOString().slice(0, 10);
const logFolder: string = `./logs/${todayDate.replace(/-/g, "")}/${todayDate}`;

const myTransports: (
	| transports.ConsoleTransportInstance
	| transports.FileTransportInstance
)[] = [
	new transports.File({
		filename: `${logFolder}-error.log`,
		level: "error",
	}),
	new transports.File({
		filename: `${logFolder}-warn.log`,
		level: "warn",
	}),
	new transports.File({
		filename: `${logFolder}-info.log`,
		level: "info",
	}),
	new transports.File({
		filename: `${logFolder}-query.log`,
		level: "verbose",
	}),
];

/* istanbul ignore next */
if (logLevel == "warn") {
	myTransports.push(
		new transports.Console({
			level: "warn",
		})
	);
	/* istanbul ignore next */
} else if (logLevel == "info") {
	myTransports.push(
		new transports.Console({
			level: "info",
		})
	);
} else {
	myTransports.push(
		new transports.Console({
			level: "error",
		})
	);
}

export const logger = createLogger({
	format: combine(
		timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
		logsFormat,
		colorize()
	),
	transports: myTransports,
	rejectionHandlers: [
		new transports.File({ filename: `${logFolder}-rejections.log` }),
	],
});
