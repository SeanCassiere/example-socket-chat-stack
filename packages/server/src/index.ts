import "reflect-metadata";
import cors, { CorsOptions } from "cors";
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

import socket from "#root/conn/socket";
import { log } from "#root/utils/logger";

const PORT = process.env.PORT || 4000;

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

app.get("/", (_, res) => res.send("<h2>Hello World</h2>"));

httpServer.listen(PORT, () => {
	log.info(`🚀 Server is listening on port ${PORT} 🚀`);

	socket({ io });
});
