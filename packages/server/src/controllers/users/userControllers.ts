import asyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";

import { generateToken } from "#root/utils/generateToken";
import { CustomRequest } from "#root/interfaces/expressInterfaces";
import { hashPasswordForUser } from "#root/utils/hashPasswordForUser";
import { addMinsToCurrentDate } from "#root/utils/addMinsToCurrentDate";
import { refreshTokenCookieConst } from "#root/utils/constants/cookieConstants";
import { environmentVariables } from "#root/utils/env";

import { User } from "#root/entities/User";

export const publicGetAllUsers = asyncHandler(async (_, res, next) => {
	const query = User.createQueryBuilder().select();

	try {
		const usersQuery = await query.getMany();
		const users = usersQuery.map((u) => {
			return { userId: u.userId, firstName: u.firstName, lastName: u.lastName, username: u.username };
		});
		res.json(users);
	} catch (error) {
		res.status(500);
		next("Error with the database search");
	}
});

// @desc Authenticate the login and get tokens
// @route POST /api/users/login
// @access Public
export const loginUser = asyncHandler(async (req: CustomRequest<{ username: string; password: string }>, res, next) => {
	const { username, password } = req.body;

	const user = await User.findOne({ where: { username: username.toLowerCase() } });

	if (!user) {
		return res.status(401).json({ body: { message: "Username or password is invalid", propertyPath: "username" } });
	}

	if (user && (await bcryptjs.compare(password, user.password))) {
		const accessToken = generateToken("ACCESS_TOKEN", { userId: user.userId }, 30);

		const refreshTokenDuration = 60 * 18;
		const cookieExpirationDate = addMinsToCurrentDate(refreshTokenDuration);
		const refreshToken = generateToken("REFRESH_TOKEN", { userId: user.userId }, refreshTokenDuration);

		return res
			.cookie(refreshTokenCookieConst, refreshToken, {
				secure: environmentVariables.NODE_ENV === "production" ? true : false,
				httpOnly: true,
				expires: cookieExpirationDate,
				signed: true,
			})
			.json({
				userId: user.userId,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				token: accessToken,
				refreshToken,
			});
	} else {
		res.status(401);
		return next(new Error("Invalid email or password"));
	}
});

// @desc Refresh the user access token
// @route GET /api/users/refreshAuth
// @access Private
export const refreshUserAccessTokenFromCookie = asyncHandler(async (req: CustomRequest<{}>, res) => {
	const accessToken = generateToken("ACCESS_TOKEN", { userId: req.user!.userId }, 30);
	res.json({ token: accessToken });
});

// @desc Clear refreshToken cookie and logout
// @route GET /api/users/logout
// @access Public
export const logoutUser = asyncHandler(async (_, res) => {
	res.cookie(refreshTokenCookieConst, "expiring now", { expires: new Date(Date.now()) }).json({ success: true });
});

// @desc Register a new user
// @route POST /api/users
// @access Public
export const registerUser = asyncHandler(
	async (
		req: CustomRequest<{ firstName: string; lastName: string; username: string; password: string }>,
		res,
		next
	) => {
		const { firstName, lastName, username, password } = req.body;

		const userExists = await User.findOne({ where: { username: username.toLowerCase() } });

		if (userExists) {
			res.status(400).json({ errors: { body: [{ message: "Username already in use", propertyPath: "username" }] } });
		} else {
			const newPassword = await hashPasswordForUser(password);

			const user = await User.create({
				firstName,
				lastName,
				username: username.toLowerCase(),
				password: newPassword,
			}).save();

			if (user) {
				return res.status(201).json({
					userId: user.userId,
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username,
				});
			} else {
				res.status(400);
				return next(new Error("Invalid user data"));
			}
		}
	}
);

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req: CustomRequest<{}>, res, next) => {
	const user = req.user;
	if (user) {
		return res.json({
			userId: user.userId,
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
		});
	} else {
		res.status(404);
		return next(new Error("User not found"));
	}
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = asyncHandler(
	async (req: CustomRequest<{ firstName?: string; lastName?: string; password?: string }>, res, next) => {
		const user = req.user;
		if (user) {
			user.firstName = req.body.firstName || user.firstName;
			user.lastName = req.body.lastName || user.lastName;
			if (req.body && req.body.password) {
				user.password = await bcryptjs.hash(req.body.password, 12);
			}

			try {
				const updatedUser = await user.save();

				return res.json({
					userId: updatedUser.userId,
					firstName: updatedUser.firstName,
					lastName: updatedUser.lastName,
					username: updatedUser.username,
				});
			} catch (error) {
				res.status(500);
				return next(new Error("User updating error"));
			}
		} else {
			res.status(404);
			return next(new Error("User not found"));
		}
	}
);
