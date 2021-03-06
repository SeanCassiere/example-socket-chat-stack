import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { environmentVariables } from "#root/utils/env";

const notFound = (req: Request, res: Response, next: NextFunction) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	return next(error);
};

const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	return res.status(statusCode).json({
		message: err.message,
		stack: environmentVariables.NODE_ENV === "production" ? null : err.stack,
	});
};

export { notFound, errorHandler };
