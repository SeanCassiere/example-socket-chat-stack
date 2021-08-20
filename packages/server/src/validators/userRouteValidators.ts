import { ExpressYupMiddlewareInterface } from "express-yup-middleware";

import { commonValidationOptions } from "./commonValidationOptions";
import { userLoginBodySchema, registerUserBodySchema, selfUserUpdateBodySchema } from "./users/userSchemas";

export const userLoginValidator: ExpressYupMiddlewareInterface = {
	schema: {
		body: {
			yupSchema: userLoginBodySchema,
			...commonValidationOptions,
		},
	},
};
export const registerUserValidator: ExpressYupMiddlewareInterface = {
	schema: {
		body: {
			yupSchema: registerUserBodySchema,
			...commonValidationOptions,
		},
	},
};

export const selfUpdateUserValidator: ExpressYupMiddlewareInterface = {
	schema: {
		body: {
			yupSchema: selfUserUpdateBodySchema,
			...commonValidationOptions,
		},
	},
};
