import "reflect-metadata";
import cors, { CorsOptions } from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import express from "express";
import { Server } from "socket.io";

import socket from "#root/conn/socket";
import swaggerDocument from "#root/swagger.json";
import { log } from "#root/utils/logger";

const PORT = process.env.PORT || 4000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "cookie_secret";

const corsOptions: CorsOptions = {
	origin: (_, cb) => cb(null, true),
	credentials: true,
};

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

httpServer.listen(PORT, () => {
	log.info(`🚀 Server is listening on port ${PORT} 🚀`);

	socket({ io });
});
