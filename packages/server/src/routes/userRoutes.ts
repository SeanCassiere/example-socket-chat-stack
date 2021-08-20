import { Router } from "express";
import { expressYupMiddleware } from "express-yup-middleware";

import { protect, isRefreshCookieValid } from "#root/middleware/authMiddleware";
import {
	registerUserValidator,
	selfUpdateUserValidator,
	userLoginValidator,
} from "#root/validators/userRouteValidators";
import {
	getUserProfile,
	registerUser,
	updateUserProfile,
	refreshUserAccessTokenFromCookie,
	logoutUser,
	loginUser,
} from "#root/controllers/users/userControllers";

const userRouter = Router();

userRouter.route("/").post(expressYupMiddleware({ schemaValidator: registerUserValidator }), registerUser);

userRouter.route("/login").post(expressYupMiddleware({ schemaValidator: userLoginValidator }), loginUser);

userRouter.route("/logout").get(logoutUser);

userRouter.route("/refreshToken").get(isRefreshCookieValid, refreshUserAccessTokenFromCookie);

userRouter
	.route("/profile")
	.get(protect, getUserProfile)
	.put(protect, expressYupMiddleware({ schemaValidator: selfUpdateUserValidator }), updateUserProfile);

export { userRouter };
