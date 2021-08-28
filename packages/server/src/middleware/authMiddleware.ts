import { NextFunction, Response } from "express";
import asyncHandler from "express-async-handler";
import { Secret, verify } from "jsonwebtoken";
import { Socket } from "socket.io";

import { GeneratedTokenInterface } from "#root/interfaces/jwtTokenInterfaces";
import { CustomRequest } from "#root/interfaces/expressInterfaces";
import { User } from "#root/entities/User";
import { environmentVariables } from "#root/utils/env";
import { refreshTokenCookieConst } from "#root/utils/constants/cookieConstants";
import { ExtendedError } from "socket.io/dist/namespace";

const JWT_SECRET: Secret = environmentVariables.JWT_SECRET || "dev_jwt_secret";
const REFRESH_JWT_SECRET: Secret = environmentVariables.REFRESH_JWT_SECRET || "dev_refresh_jwt_secret";

export const protect = asyncHandler(async (req: CustomRequest<{}>, res, next: NextFunction) => {
	let token: string = "";

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = verify(token, JWT_SECRET) as GeneratedTokenInterface;

			const userFound = await User.findOne({ where: { userId: decoded.userId } });

			if (userFound) {
				req.user = userFound;
			} else {
				throw new Error("No User found");
			}

			return next();
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Not Authorized, token failed");
		}
	}

	if (token.length === 0) {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
});

export const isRefreshCookieValid = asyncHandler(async (req: CustomRequest<{}>, res: Response, next: NextFunction) => {
	if (req.signedCookies && req.signedCookies[refreshTokenCookieConst]) {
		const token = req.signedCookies[refreshTokenCookieConst];
		try {
			const decoded = verify(token, REFRESH_JWT_SECRET) as GeneratedTokenInterface;

			const userFound = await User.findOne({ where: { userId: decoded.userId } });

			if (userFound) {
				req.user = userFound;
			} else {
				new Error("No User found");
			}
		} catch (error) {
			console.error(error);
			res.status(401);
			throw new Error("Refreshing not Authorized, token failed");
		}
		return next();
	} else {
		res.status(401);
		throw new Error("No refreshToken cookie set, request denied");
	}
});

export const socketTokenAuth = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
	if (socket.handshake.auth.token) {
		try {
			const decoded = verify(socket.handshake.auth.token, JWT_SECRET) as GeneratedTokenInterface;
			socket.handshake.auth.userId = decoded.userId;
			next();
		} catch (e) {
			const err = new Error("not authorized") as any;
			err.data = { content: "Please retry later" }; // additional details
			next(err);
		}
	} else {
		const err = new Error("not authorized") as any;
		err.data = { content: "Please retry later" }; // additional details
		next(err);
	}
};
