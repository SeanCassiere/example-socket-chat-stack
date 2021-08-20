import "reflect-metadata";
import cors, { CorsOptions } from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import express from "express";
import { Server } from "socket.io";

import { createTypeormConn } from "#root/conn/dbTypeOrm";
import socket from "#root/conn/socket";

import { environmentVariables } from "#root/utils/env";
import swaggerDocument from "#root/swagger.json";
import { log } from "#root/utils/logger";

const PORT = environmentVariables.PORT || 4000;
const COOKIE_SECRET = environmentVariables.COOKIE_SECRET || "cookie_secret";

const corsOptions: CorsOptions = {
	origin: (_, cb) => cb(null, true),
	credentials: true,
};

export async function startServer() {
	try {
		await createTypeormConn();

		// Server setup
		const app = express();
		const httpServer = createServer(app);

		const io = new Server(httpServer, {
			cors: { ...corsOptions },
		});

		// Express setup
		app.use(cors({ ...corsOptions }));
		app.use(cookieParser(COOKIE_SECRET));
		app.use(express.json());

		// Swagger distribution
		app.get("/docs/swagger.json", (_, res) => {
			res.send(swaggerDocument);
		});
		app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

		app.get("/", (_, res) => res.send("<h2>Hello World</h2>"));

		httpServer.listen(PORT, "localhost", () => {
			log.info(`🚀 Server is listening on port ${PORT} 🚀`);

			socket({ io });
		});
	} catch (error) {
		log.error(`DB Connection error\n${error}`);
	}
}
